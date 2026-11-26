import React, { useState } from 'react';
import {
  Shield, Settings, Globe, Layout, BookOpen, Users, Briefcase,
  Calendar, Megaphone, Plus, Trash2, Save, CheckCircle2, Lock
} from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const Toggle = ({ label, description, enabled, onChange, icon: Icon }) => (
  <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:border-red-100 transition-all group">
    <div className="flex items-start gap-3.5">
      <div className={`p-2.5 rounded-xl mt-0.5 transition-colors ${enabled ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
        <Icon size={18} />
      </div>
      <div>
        <h4 className="font-bold text-gray-900 text-sm mb-0.5">{label}</h4>
        <p className="text-xs text-gray-500 leading-relaxed max-w-md">{description}</p>
      </div>
    </div>
    <button
      type="button"
      onClick={onChange}
      aria-pressed={Boolean(enabled)}
      className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shrink-0 ml-4 cursor-pointer ${enabled ? 'bg-red-600' : 'bg-gray-200'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-7' : 'translate-x-1'}`} />
    </button>
  </div>
);

const PlatformSettings = ({
  featureSurveys, setFeatureSurveys,
  featureCareerCheckup, setFeatureCareerCheckup,
  featureAlumniCard, setFeatureAlumniCard,
  featureCareerFair, setFeatureCareerFair,
  showInstitutionalStats, setShowInstitutionalStats,
  institutionalStatsData, setInstitutionalStatsData,
  featureAlumniAssocToggle, setFeatureAlumniAssocToggle
}) => {
  const siteConfig = useAppStore(state => state.siteConfig) || {};
  const setSiteConfig = useAppStore(state => state.setSiteConfig);

  const [bannerText, setBannerText] = useState(siteConfig.announcementBanner || '');
  const [footerMotto, setFooterMotto] = useState(
    siteConfig.footerMotto || 'İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Koordinatörlüğü'
  );
  const [newStatTitle, setNewStatTitle] = useState('');
  const [newStatVal, setNewStatVal] = useState('');

  const handleSaveSiteTexts = (e) => {
    e.preventDefault();
    if (setSiteConfig) {
      setSiteConfig({
        ...siteConfig,
        announcementBanner: bannerText.trim(),
        footerMotto: footerMotto.trim()
      });
    }
    window.toast?.success?.('Ana sayfa duyuru bandı ve kurumsal slogan kaydedildi.');
  };

  const handleToggleMaintenance = () => {
    const nextVal = !siteConfig.maintenanceMode;
    if (setSiteConfig) {
      setSiteConfig({ ...siteConfig, maintenanceMode: nextVal });
    }
    window.toast?.info?.(nextVal ? 'Bakım modu açıldı (yalnızca yöneticiler erişebilir).' : 'Bakım modu kapatıldı.');
  };

  const handleAddStat = () => {
    if (!newStatTitle.trim() || !newStatVal.trim()) return;
    const nextList = [
      ...(institutionalStatsData || []),
      { id: `stat_${Date.now()}`, title: newStatTitle.trim(), val: newStatVal.trim() }
    ];
    setInstitutionalStatsData?.(nextList);
    setNewStatTitle('');
    setNewStatVal('');
    window.toast?.success?.('Yeni kurumsal istatistik kartı eklendi.');
  };

  const handleDeleteStat = (id) => {
    setInstitutionalStatsData?.((institutionalStatsData || []).filter(item => item.id !== id));
    window.toast?.info?.('İstatistik kartı kaldırıldı.');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-[#990000] to-red-900 p-6 sm:p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
          <Settings size={110} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-black mb-2">Platform Ayarları</h2>
          <p className="text-red-100 text-sm sm:text-base leading-relaxed">
            Aktif portal modüllerini, ana sayfa duyuru bandını ve kurumsal istatistik kartlarını tek merkezden yönetin.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SOL KOLON: MODÜL YÖNETİMİ */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
            <Layout className="text-red-600" size={20} />
            <h3 className="text-base font-black text-gray-900">Modül Görünürlüğü & Portal Kontrolleri</h3>
          </div>

          <div className="space-y-3">
            <Toggle
              label="Anket ve Geribildirim Sistemi"
              description="Öğrenciler ve mezunlar için anket doldurma ve değerlendirme modülünü açar/kapatır."
              icon={BookOpen}
              enabled={featureSurveys}
              onChange={() => setFeatureSurveys?.(!featureSurveys)}
            />
            <Toggle
              label="Kariyer Check-Up Modülü"
              description="Mezun ve öğrenci kariyer durum değerlendirme formunu aktif eder."
              icon={Briefcase}
              enabled={featureCareerCheckup}
              onChange={() => setFeatureCareerCheckup?.(!featureCareerCheckup)}
            />
            <Toggle
              label="Dijital Mezun Kartı Sistemi"
              description="Mezunların dijital kart başvurusu yapabilmesini ve kartını görüntülemesini sağlar."
              icon={Shield}
              enabled={featureAlumniCard}
              onChange={() => setFeatureAlumniCard?.(!featureAlumniCard)}
            />
            <Toggle
              label="İESÜ Mezunlar Portalı & Komite Başvuruları"
              description="Mezunlar Portalı komite üyeliği, koordinasyon akışı ve başvuru formlarını yönetir."
              icon={Users}
              enabled={featureAlumniAssocToggle !== false}
              onChange={() => setFeatureAlumniAssocToggle?.(!featureAlumniAssocToggle)}
            />
            <Toggle
              label="Kariyer Günleri & Fuar Modülü"
              description="Geleneksel Kariyer Günleri firma stant ve etkinlik başvurularını aktif eder."
              icon={Calendar}
              enabled={featureCareerFair !== false}
              onChange={() => setFeatureCareerFair?.(!featureCareerFair)}
            />
            <Toggle
              label="Kurumsal İstatistikler Bandı (Ana Sayfa)"
              description="Ana sayfadaki mezun, istihdam ve kurumsal iş birliği sayaç bandını gösterir."
              icon={Globe}
              enabled={showInstitutionalStats}
              onChange={() => setShowInstitutionalStats?.(!showInstitutionalStats)}
            />
            <Toggle
              label="Bakım Modu (Geçici Kısıtlama)"
              description="Açıldığında yalnızca Süper Yönetici erişebilir; ziyaretçiler bakım bildirimini görür."
              icon={Lock}
              enabled={Boolean(siteConfig.maintenanceMode)}
              onChange={handleToggleMaintenance}
            />
          </div>
        </div>

        {/* SAĞ KOLON: ANA SAYFA METİNLERİ VE KURUMSAL İSTATİSTİKLER */}
        <div className="space-y-6">
          {/* Ana Sayfa Duyuru Bandı & Alt Bilgi */}
          <form onSubmit={handleSaveSiteTexts} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <Megaphone className="text-red-600" size={20} />
              <h3 className="text-base font-black text-gray-900">Ana Sayfa Duyuru Bandı & Alt Bilgi</h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Üst Duyuru Şeridi (Boş bırakılırsa ana sayfada gizlenir)
              </label>
              <input
                type="text"
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                placeholder="Örn: 2026 Bahar Kariyer Günleri kayıtları başladı!"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Alt Bilgi (Footer) Kurumsal Sloganı
              </label>
              <input
                type="text"
                value={footerMotto}
                onChange={(e) => setFooterMotto(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white transition"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#990000] hover:bg-red-800 text-white text-xs font-black transition shadow-sm cursor-pointer"
              >
                <Save size={14} /> Metinleri Kaydet
              </button>
            </div>
          </form>

          {/* Kurumsal İstatistik Kartları */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="text-emerald-600" size={20} />
                <h3 className="text-base font-black text-gray-900">Ana Sayfa Kurumsal İstatistik Kartları</h3>
              </div>
              <span className="text-[11px] font-bold text-slate-500">
                {(institutionalStatsData || []).length} Kart
              </span>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {(institutionalStatsData || []).map((stat, idx) => (
                <div key={stat.id || idx} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="col-span-6">
                    <input
                      type="text"
                      value={stat.title}
                      onChange={(e) => {
                        const updated = [...(institutionalStatsData || [])];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setInstitutionalStatsData?.(updated);
                      }}
                      aria-label="İstatistik başlığı"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div className="col-span-4">
                    <input
                      type="text"
                      value={stat.val}
                      onChange={(e) => {
                        const updated = [...(institutionalStatsData || [])];
                        updated[idx] = { ...updated[idx], val: e.target.value };
                        setInstitutionalStatsData?.(updated);
                      }}
                      aria-label="İstatistik değeri"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-black text-[#990000]"
                    />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleDeleteStat(stat.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Kartı Sil"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Yeni İstatistik Ekle */}
            <div className="pt-3 border-t border-gray-100 grid grid-cols-12 gap-2">
              <input
                type="text"
                value={newStatTitle}
                onChange={(e) => setNewStatTitle(e.target.value)}
                placeholder="Yeni başlık (Örn: Protokol Firması)"
                className="col-span-6 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
              <input
                type="text"
                value={newStatVal}
                onChange={(e) => setNewStatVal(e.target.value)}
                placeholder="Değer (Örn: 180+)"
                className="col-span-4 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
              <button
                type="button"
                onClick={handleAddStat}
                className="col-span-2 inline-flex items-center justify-center gap-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black transition cursor-pointer"
                title="Yeni İstatistik Ekle"
              >
                <Plus size={14} /> Ekle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformSettings;
