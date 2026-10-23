import React, { useState } from 'react';
import { 
  BookOpen, Plus, Download, Send, Trash2, Sparkles 
} from 'lucide-react';
import { 
  calculateLogbookProgress, 
  validateLogbookEntry,
  advanceInternshipStatus,
  parseDateSafe,
  isWorkDay 
} from '../../services/internshipWorkflow';
import { downloadReportPdf } from '../../utils/downloadPdf';

export default function DigitalInternshipNotebook({ 
  internship, 
  onUpdateInternship,
  currentUser,
  isAdvisorOrAdmin = false 
}) {
  const getNextLogbookDate = (currentEntries, intern) => {
    if (Array.isArray(currentEntries) && currentEntries.length > 0) {
      const last = currentEntries[currentEntries.length - 1];
      if (last?.date) {
        const d = parseDateSafe(last.date);
        if (d) {
          d.setDate(d.getDate() + 1);
          while (!isWorkDay(d, Boolean(intern?.includeSaturdays))) {
            d.setDate(d.getDate() + 1);
          }
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${y}-${m}-${day}`;
        }
      }
    }
    return intern?.startDate || new Date().toISOString().slice(0, 10);
  };

  const [entries, setEntries] = useState(() => internship?.notebookEntries || [
    {
      day: 1,
      date: internship?.startDate || '2026-07-01',
      unit: 'Yazılım Geliştirme & Ar-Ge Birimi',
      activity: 'Şirket oryantasyon eğitimi tamamlandı. Git versiyon kontrol sistemi mimarisi ve ekip içi kod standartları incelendi.',
      skills: ['Git', 'Oryantasyon', 'Yazılım Mimarisi']
    },
    {
      day: 2,
      date: '2026-07-02',
      unit: 'Yazılım Geliştirme & Ar-Ge Birimi',
      activity: 'React ve Tailwind tabanlı kullanıcı arayüzü bileşenleri incelendi, mevcut proje dizini ve durum yönetimi (Zustand) analiz edildi.',
      skills: ['React', 'Tailwind CSS', 'Zustand']
    }
  ]);

  const [newEntry, setNewEntry] = useState(() => ({
    day: (internship?.notebookEntries || entries).length + 1,
    date: getNextLogbookDate(internship?.notebookEntries || entries, internship),
    unit: 'Yazılım Birimi',
    activity: '',
    skills: ''
  }));

  const [isAdding, setIsAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const targetDays = internship?.workDays || 20;
  const progress = calculateLogbookProgress(entries, targetDays);

  const handleAddEntry = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const skillsArray = typeof newEntry.skills === 'string'
      ? newEntry.skills.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const entryToAdd = {
      day: Number(newEntry.day) || entries.length + 1,
      date: newEntry.date,
      unit: newEntry.unit,
      activity: newEntry.activity ? newEntry.activity.trim() : '',
      skills: skillsArray
    };

    const validation = validateLogbookEntry(entryToAdd, internship, entries);
    if (!validation.isValid) {
      setErrorMsg(validation.errors.join(' '));
      return;
    }

    const updatedEntries = [...entries, entryToAdd].sort((a, b) => a.day - b.day);
    setEntries(updatedEntries);

    if (onUpdateInternship && internship) {
      onUpdateInternship({
        ...internship,
        notebookEntries: updatedEntries,
        updatedAt: new Date().toISOString()
      });
    }

    setNewEntry({
      day: updatedEntries.length + 1,
      date: getNextLogbookDate(updatedEntries, internship),
      unit: 'Yazılım Birimi',
      activity: '',
      skills: ''
    });
    setIsAdding(false);
    window.toast?.success?.(`✅ ${entryToAdd.day}. Günlük staj kaydı deftere eklendi.`);
  };

  const handleDeleteEntry = (dayNum) => {
    const updated = entries.filter(e => e.day !== dayNum);
    setEntries(updated);
    if (onUpdateInternship && internship) {
      onUpdateInternship({
        ...internship,
        notebookEntries: updated,
        updatedAt: new Date().toISOString()
      });
    }
    window.toast?.info?.('Kayıt silindi.');
  };

  const handleSubmitToCommission = () => {
    if (!internship) return;
    try {
      const advanced = advanceInternshipStatus(internship, 'SUBMIT_NOTEBOOK', {
        entries
      });
      if (onUpdateInternship) {
        onUpdateInternship(advanced);
      }
      window.toast?.success?.('🎉 Staj Defteriniz değerlendirme için Staj Komisyonu ve İşverene teslim edildi!');
    } catch (e) {
      window.toast?.error?.(e.message || 'Defter teslim edilemedi.');
    }
  };

  const handleDownloadNotebookPdf = () => {
    const lines = [
      'İSTANBUL ESENYURT ÜNİVERSİTESİ',
      'KARİYER GELİŞTİRME KOORDİNATÖRLÜĞÜ',
      'RESMÎ DİJİTAL STAJ DEFTERİ VE UYGULAMA RAPORU',
      '------------------------------------------------------------',
      `Öğrenci Adı Soyadı: ${internship?.studentName || currentUser?.name || 'Öğrenci'}`,
      `Öğrenci Numarası: ${internship?.studentNo || '20220101001'}`,
      `Fakülte / Bölüm: ${internship?.faculty || ''} / ${internship?.department || ''}`,
      `Staj Yapılan Kurum: ${internship?.companyName || ''}`,
      `Staj Tarihleri: ${internship?.startDate || ''} - ${internship?.endDate || ''} (${internship?.workDays || 20} İş Günü)`,
      `İşveren Yetkilisi: ${internship?.companyAuthorizedPerson || ''} (${internship?.companyAuthorizedEmail || ''})`,
      '------------------------------------------------------------',
      'GÜNLÜK ÇALIŞMA VE KAZANIM GİRİŞLERİ:',
      ...entries.map(e => (
        `[GÜN ${e.day}] (${e.date}) - Birim: ${e.unit}\n` +
        `Yapılan İş: ${e.activity}\n` +
        `Kazanılan Yetkinlikler: ${(e.skills || []).join(', ')}\n`
      )),
      '------------------------------------------------------------',
      'İŞYERİ STAJYER DEĞERLENDİRMESİ:',
      `İşyeri Notu: ${internship?.employerScore ? `${internship.employerScore} / 100` : 'Henüz Notlandırılmadı'}`,
      `İşyeri Yetkili Görüşü: ${internship?.employerFeedback || 'Öğrenci staj süresini başarıyla tamamlamıştır.'}`,
      'İşyeri Kaşe & İmza: [ONAYLANDI]',
      '------------------------------------------------------------',
      'BÖLÜM STAJ KOMİSYONU FİNAL NOTLANDIRMASI:',
      `Komisyon Notu: ${internship?.commissionScore ? `${internship.commissionScore} / 100` : 'İnceleniyor'}`,
      `Final Notu: ${internship?.finalGrade ? `${internship.finalGrade} (${internship.finalGrade === 'S' ? 'Başarılı / Satisfactory' : 'Başarısız'})` : 'Beklemede'}`,
      `Tutanak No: ${internship?.commissionDecisionTutanakNo || 'TUT-2026-001'}`
    ];

    downloadReportPdf('dijital-staj-defteri', `${(internship?.studentName || 'Ogrenci').replace(/\s+/g, '_')}_Staj_Defteri`, lines);
    window.toast?.success?.('📄 Resmî Staj Defteri PDF olarak indirildi.');
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-900 via-rose-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-red-900">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center shrink-0 shadow-inner">
              <BookOpen size={28} className="text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/30">
                  Resmî Belge
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30">
                  E-Defter Modülü
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Dijital Staj Defteri ve Final Notlandırma
              </h2>
              <p className="text-xs text-rose-100/80 mt-1 max-w-xl">
                {internship?.companyName ? `${internship.companyName} bünyesinde gerçekleştirilen` : 'Gerçekleştirilen'} stajınız için günlük çalışmalarınızı kaydedin, yetkinliklerinizi belgeleyin.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={handleDownloadNotebookPdf}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-black transition flex items-center gap-2 cursor-pointer"
            >
              <Download size={15} />
              <span>Resmî Defter PDF İndir</span>
            </button>
            <button
              onClick={handleSubmitToCommission}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition flex items-center gap-2 shadow-lg shadow-emerald-700/25 cursor-pointer"
            >
              <Send size={15} />
              <span>Komisyona Teslim Et</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Card & Bento Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Defter Tamamlanma</span>
            <span className="text-sm font-black text-emerald-700">%{progress.percentage}</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 pt-1">
            <span>Doldurulan Gün:</span>
            <span className="font-black text-slate-900">{progress.completedDays} / {targetDays} Gün</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">İşveren Değerlendirmesi</span>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black text-sm">
              {internship?.employerScore || 92}
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">
                {internship?.employerScore ? 'İşyeri Notu Onaylandı' : 'Değerlendirme Bekleniyor'}
              </h4>
              <p className="text-[10px] text-slate-500">Ağırlık: %40 (Yetkili Onayı: Kaşeli)</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Komisyon Final Kararı</span>
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
              internship?.finalGrade === 'S' ? 'bg-purple-50 text-purple-700' : 'bg-slate-100 text-slate-600'
            }`}>
              {internship?.finalGrade || 'S / U'}
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">
                {internship?.finalGrade === 'S' ? 'BAŞARILI (Geçti)' :
                 internship?.finalGrade === 'U' ? 'BAŞARISIZ' :
                 'Komisyon Değerlendirmesinde'}
              </h4>
              <p className="text-[10px] text-slate-500">OBS Entegrasyonu: {internship?.obsExportReady ? '✓ Aktarıma Hazır' : 'Beklemede'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Kazanılan Yetkinlikler Barı */}
      {progress.skillsLearned.length > 0 && (
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
            <Sparkles size={14} className="text-amber-500" /> Kazanılan Yetkinlikler:
          </span>
          {progress.skillsLearned.map((skill, idx) => (
            <span key={idx} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-bold shadow-sm">
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Günlük Girişleri Listesi */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900">Staj Günlük Kayıtları</h3>
            <p className="text-xs text-slate-500">Her iş günü için yapılan teknik faaliyetleri ve kazanımları raporlayınız.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-2 rounded-xl bg-[#990000] hover:bg-red-800 text-white text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-red-900/20 cursor-pointer"
          >
            <Plus size={15} />
            <span>{isAdding ? 'Kapat' : 'Yeni Gün Ekle'}</span>
          </button>
        </div>

        {/* Yeni Kayıt Ekleme Formu */}
        {isAdding && (
          <form onSubmit={handleAddEntry} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-fade-in">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              {newEntry.day}. Günlük Staj Kaydı
            </h4>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gün Sırası *</label>
                <input 
                  type="number"
                  value={newEntry.day}
                  onChange={e => setNewEntry(p => ({ ...p, day: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tarih *</label>
                <input 
                  type="date"
                  value={newEntry.date}
                  onChange={e => setNewEntry(p => ({ ...p, date: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Departman / Birim *</label>
                <input 
                  type="text"
                  value={newEntry.unit}
                  onChange={e => setNewEntry(p => ({ ...p, unit: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Yapılan Teknik Çalışma ve Kazanım Özeti (En az 20 karakter) *
              </label>
              <textarea 
                rows={3}
                value={newEntry.activity}
                onChange={e => setNewEntry(p => ({ ...p, activity: e.target.value }))}
                placeholder="Örn: Bugün veritabanı performans optimizasyonu üzerinde çalışıldı. İndeksleme ve sorgu planları analiz edildi..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#990000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kullanılan Teknolojiler / Araçlar (Virgülle ayırınız)
              </label>
              <input 
                type="text"
                value={newEntry.skills}
                onChange={e => setNewEntry(p => ({ ...p, skills: e.target.value }))}
                placeholder="PostgreSQL, Docker, Drizzle ORM, Vitest"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md cursor-pointer"
              >
                Kaydet
              </button>
            </div>
          </form>
        )}

        {/* Existing Entries Timeline */}
        <div className="space-y-4">
          {entries.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-8">Henüz staj günlüğü kaydı girilmedi.</p>
          ) : (
            entries.map(entry => (
              <div key={entry.day} className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-red-200 hover:shadow-md transition space-y-2 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-xl bg-red-50 text-[#990000] font-black text-xs border border-red-100">
                      Gün #{entry.day}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{entry.date}</span>
                    <span className="text-xs font-black text-slate-800">• {entry.unit}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteEntry(entry.day)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                    title="Kaydı Sil"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {entry.activity}
                </p>
                {Array.isArray(entry.skills) && entry.skills.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap pt-1">
                    {entry.skills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
