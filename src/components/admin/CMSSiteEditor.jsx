import React, { useState, useEffect } from 'react';
import useAppStore from '../../store/useAppStore';
import { Card, Badge, BtnPrimary, BtnRed, BtnGreen } from './AdminShared';
import { 
  Palette, Layout, Globe, Save, RotateCcw, Eye, Sparkles, 
  CheckCircle, AlertCircle, Type, Megaphone, Link as LinkIcon, 
  Layers, Shield, ExternalLink, Sliders, Check, Smartphone, Monitor
} from 'lucide-react';

export default function CMSSiteEditor() {
  const siteConfig = useAppStore(state => state.siteConfig) || {
    heroBannerTitle: 'Kariyerini Şekillendir',
    heroBannerSub: 'İESÜ Kariyer Platformu ile fırsatları keşfet, ağını genişlet ve geleceğini inşa et.',
    ctaButtonText: 'Hemen Başla',
    ctaButtonLink: 'jobs',
    primaryColor: '#990000',
    logoSubText: 'IESU KARİYER',
    footerMotto: 'Geleceğe açılan kapı.',
    announcementBanner: { visible: false, text: '2026 Bahar Kariyer Fuarı kayıtları başladı!', color: 'red', link: '' },
    featureToggles: {
      aiWingman: true,
      careerRadar: true,
      virtualFair: true,
      liveRooms: true,
      alumniCard: true,
      sspSystem: true,
      surveys: true,
    }
  };

  const setSiteConfig = useAppStore(state => state.setSiteConfig);
  const institutionalStatsData = useAppStore(state => state.institutionalStatsData) || [];
  const setInstitutionalStatsData = useAppStore(state => state.setInstitutionalStatsData);
  const showInstitutionalStats = useAppStore(state => state.showInstitutionalStats);
  const setShowInstitutionalStats = useAppStore(state => state.setShowInstitutionalStats);

  const [activeTab, setActiveTab] = useState('hero');
  const [formData, setFormData] = useState({
    heroBannerTitle: siteConfig.heroBannerTitle || 'Kariyerini Şekillendir',
    heroBannerSub: siteConfig.heroBannerSub || 'İESÜ Kariyer Platformu ile fırsatları keşfet, ağını genişlet ve geleceğini inşa et.',
    ctaButtonText: siteConfig.ctaButtonText || 'Hemen Başla',
    ctaButtonLink: siteConfig.ctaButtonLink || 'jobs',
    logoSubText: siteConfig.logoSubText || 'IESU KARİYER',
    footerMotto: siteConfig.footerMotto || 'Geleceğe açılan kapı.',
    announcementBanner: {
      visible: siteConfig.announcementBanner?.visible || false,
      text: siteConfig.announcementBanner?.text || '2026 Bahar Kariyer Zirvesi Kayıtları Açıldı!',
      color: siteConfig.announcementBanner?.color || 'red',
      link: siteConfig.announcementBanner?.link || ''
    },
    featureToggles: {
      aiWingman: siteConfig.featureToggles?.aiWingman ?? true,
      careerRadar: siteConfig.featureToggles?.careerRadar ?? true,
      virtualFair: siteConfig.featureToggles?.virtualFair ?? true,
      liveRooms: siteConfig.featureToggles?.liveRooms ?? true,
      alumniCard: siteConfig.featureToggles?.alumniCard ?? true,
      sspSystem: siteConfig.featureToggles?.sspSystem ?? true,
      surveys: siteConfig.featureToggles?.surveys ?? true,
    }
  });

  const [stats, setStats] = useState(
    institutionalStatsData.length > 0 
      ? institutionalStatsData 
      : [
          { id: 1, title: 'Topluma Kazandırılan Mezun', val: '65.000+', icon: 'GraduationCap' },
          { id: 2, title: 'Uluslararası Akredite Program', val: '65+', icon: 'ShieldCheck' },
          { id: 3, title: 'Ar-Ge & Uygulama Laboratuvarı', val: '110+', icon: 'FlaskConical' },
          { id: 4, title: 'Farklı Ülkeden Uluslararası Öğrenci', val: '130+', icon: 'Users' }
        ]
  );
  
  const [localShowStats, setLocalShowStats] = useState(showInstitutionalStats ?? false);

  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(''), 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleSave = () => {
    if (setSiteConfig) {
      setSiteConfig({
        ...formData,
        maintenanceMode: siteConfig.maintenanceMode || false
      });
    }
    if (setInstitutionalStatsData) {
      setInstitutionalStatsData(stats);
    }
    if (setShowInstitutionalStats) {
      setShowInstitutionalStats(localShowStats);
    }
    
    const store = useAppStore.getState();
    if (store.setFeatureCareerFair) store.setFeatureCareerFair(formData.featureToggles.virtualFair);
    if (store.setFeatureAlumniCard) store.setFeatureAlumniCard(formData.featureToggles.alumniCard);
    if (store.setFeatureSurveys) store.setFeatureSurveys(formData.featureToggles.surveys);
    if (store.setFeatureSSPLeaderboard) store.setFeatureSSPLeaderboard(formData.featureToggles.sspSystem);
    if (store.setKgbEnabled) store.setKgbEnabled(formData.featureToggles.sspSystem);
    if (store.setSspEnabled) store.setSspEnabled(formData.featureToggles.sspSystem);

    setToastMessage('Tüm site düzenlemeleri başarıyla yayınlandı ve canlıya aktarıldı!');
  };

  const handleReset = () => {
    if (window.confirm('Tüm site ayarlarını orijinal fabrika ayarlarına döndürmek istediğinize emin misiniz?')) {
      const defaultData = {
        heroBannerTitle: 'Kariyerini Şekillendir',
        heroBannerSub: 'İESÜ Kariyer Platformu ile fırsatları keşfet, ağını genişlet ve geleceğini inşa et.',
        ctaButtonText: 'Hemen Başla',
        ctaButtonLink: 'jobs',
        logoSubText: 'IESU KARİYER',
        footerMotto: 'Geleceğe açılan kapı.',
        announcementBanner: { visible: false, text: '', color: 'red', link: '' },
        featureToggles: {
          aiWingman: true,
          careerRadar: true,
          virtualFair: true,
          liveRooms: true,
          alumniCard: true,
          sspSystem: true,
          surveys: true,
        }
      };
      setFormData(defaultData);
      if (setSiteConfig) setSiteConfig(defaultData);
      
      const store = useAppStore.getState();
      if (store.setFeatureCareerFair) store.setFeatureCareerFair(true);
      if (store.setFeatureAlumniCard) store.setFeatureAlumniCard(true);
      if (store.setFeatureSurveys) store.setFeatureSurveys(true);
      if (store.setFeatureSSPLeaderboard) store.setFeatureSSPLeaderboard(true);
      
      setToastMessage('Ayarlar orijinal varsayılana sıfırlandı.');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  return (
    <div className="animate-fade-in space-y-6 pb-24">
      {toastMessage && (
        <div className="fixed top-5 right-5 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 animate-bounce">
          <CheckCircle size={20} />
          <span className="font-bold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#990000] via-red-900 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-red-200 text-xs font-bold mb-3">
            <Sparkles size={14} /> Süper Admin Site Düzenleyici (CMS Pro)
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Modern Görsel Site Düzenleyici</h1>
          <p className="text-red-100/80 text-sm mt-1 max-w-xl">
            Sitenin ana sayfa metinlerini, kurumsal renk paletini, duyuru şeritlerini ve aktif modüllerini kod yazmadan anında yönetin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition backdrop-blur-sm"
          >
            <RotateCcw size={15} /> Sıfırla
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#990000] hover:bg-red-50 font-black text-xs shadow-md transition transform active:scale-95"
          >
            <Save size={16} /> Değişiklikleri Yayınla
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {[
          { id: 'hero', label: 'Ana Sayfa & Hero', icon: Layout },
          { id: 'announcement', label: 'Duyuru Şeridi', icon: Megaphone },
          { id: 'brand', label: 'Footer & Marka', icon: Shield },
          { id: 'features', label: 'Modül & Özellik Toggle', icon: Sliders },
          { id: 'stats', label: 'Sayaçlar & İstatistikler', icon: Layers },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-[#990000] text-white shadow-sm scale-100'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Hero & Ana Sayfa */}
      {activeTab === 'hero' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-7 p-6 space-y-4">
            <h3 className="text-base font-black text-gray-900 flex items-center gap-2 border-b pb-3">
              <Type size={18} className="text-[#990000]" /> Hero Banner İçerik Alanı
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Ana Manşet Başlığı</label>
              <input
                type="text"
                value={formData.heroBannerTitle}
                onChange={e => setFormData({ ...formData, heroBannerTitle: e.target.value })}
                className="w-full text-sm font-bold p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#990000] outline-none"
                placeholder="Örn: Kariyerini Şekillendir"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Alt Açıklama & Slogan</label>
              <textarea
                rows={3}
                value={formData.heroBannerSub}
                onChange={e => setFormData({ ...formData, heroBannerSub: e.target.value })}
                className="w-full text-xs font-medium p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#990000] outline-none"
                placeholder="Örn: İESÜ Kariyer Platformu ile fırsatları keşfet..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">CTA Buton Metni</label>
                <input
                  type="text"
                  value={formData.ctaButtonText}
                  onChange={e => setFormData({ ...formData, ctaButtonText: e.target.value })}
                  className="w-full text-xs font-bold p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#990000] outline-none"
                  placeholder="Örn: Hemen Başla"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Hedef Yönlendirme (Rota)</label>
                <select
                  value={formData.ctaButtonLink}
                  onChange={e => setFormData({ ...formData, ctaButtonLink: e.target.value })}
                  className="w-full text-xs font-bold p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-[#990000] outline-none"
                >
                  <option value="jobs">İş & Staj İlanları (jobs)</option>
                  <option value="events">Etkinlikler (events)</option>
                  <option value="register">Kayıt Ol (register)</option>
                  <option value="explore">Keşfet (explore)</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Live Preview Card */}
          <Card className="lg:col-span-5 p-6 bg-slate-50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black text-gray-500 uppercase flex items-center gap-1.5">
                  <Eye size={14} /> Canlı Görsel Önizleme
                </span>
              </div>

              {/* Simulation Sandbox */}
              <div className="mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all w-full">
                {formData.announcementBanner.visible && (
                  <div className={`text-white text-[10px] font-bold text-center py-1.5 px-2 transition-colors ${
                    formData.announcementBanner.color === 'amber' ? 'bg-amber-600' :
                    formData.announcementBanner.color === 'green' ? 'bg-emerald-600' :
                    formData.announcementBanner.color === 'blue' ? 'bg-blue-600' :
                    'bg-[#990000]'
                  }`}>
                    {formData.announcementBanner.text || 'Duyuru'}
                  </div>
                )}
                <div className="p-5 bg-gradient-to-b from-gray-50 to-white text-center">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-black mx-auto mb-3 text-xs bg-[#990000] text-white"
                  >
                    İESÜ
                  </div>
                  <h4 className="text-base font-black text-gray-900 leading-tight mb-2">{formData.heroBannerTitle}</h4>
                  <p className="text-[11px] text-gray-600 line-clamp-2 mb-4">{formData.heroBannerSub}</p>
                  <button 
                    className="text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm inline-block bg-[#990000]"
                  >
                    {formData.ctaButtonText} →
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 text-center mt-4">
              * "Değişiklikleri Yayınla" butonuna bastığınızda bu metinler sitenin ana sayfasında otomatik güncellenir.
            </p>
          </Card>
        </div>
      )}

      {/* Tab 3: Brand */}
      {activeTab === 'brand' && (
        <Card className="p-6 space-y-6">
          <h3 className="text-base font-black text-gray-900 flex items-center gap-2 border-b pb-3">
            <Shield size={18} className="text-[#990000]" /> Footer & Marka Ayarları
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Logo Yanı / Alt Unvan Metni</label>
              <input
                type="text"
                value={formData.logoSubText}
                onChange={e => setFormData({ ...formData, logoSubText: e.target.value })}
                className="w-full text-xs font-bold p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#990000] outline-none"
                placeholder="Örn: IESU KARİYER"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Footer Mottosu & Slogan</label>
              <input
                type="text"
                value={formData.footerMotto}
                onChange={e => setFormData({ ...formData, footerMotto: e.target.value })}
                className="w-full text-xs font-bold p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#990000] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Kurumsal İletişim E-Postası</label>
              <input
                type="email"
                defaultValue="kariyer@esenyurt.edu.tr"
                className="w-full text-xs font-bold p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#990000] outline-none"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Tab 3: Announcement Bar */}
      {activeTab === 'announcement' && (
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-black text-gray-900 flex items-center gap-2 border-b pb-3">
            <Megaphone size={18} className="text-[#990000]" /> Sayfa Üstü Acil Duyuru Şeridi (Ticker)
          </h3>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <h4 className="text-sm font-bold text-gray-900">Duyuru Şeridini Aktif Et</h4>
              <p className="text-xs text-gray-500">Açıldığında tüm sayfalarda en üst kısımda göz alıcı kırmızı bant olarak gösterilir.</p>
            </div>
            <button
              onClick={() => setFormData({
                ...formData,
                announcementBanner: { ...formData.announcementBanner, visible: !formData.announcementBanner.visible }
              })}
              className={`w-14 h-8 rounded-full transition-colors flex items-center px-1 ${
                formData.announcementBanner.visible ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                formData.announcementBanner.visible ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Duyuru Metni</label>
            <input
              type="text"
              value={formData.announcementBanner.text}
              onChange={e => setFormData({
                ...formData,
                announcementBanner: { ...formData.announcementBanner, text: e.target.value }
              })}
              placeholder="Örn: 2026 Mezuniyet Töreni Kayıtları Başlamıştır!"
              className="w-full text-xs font-bold p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#990000] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Duyuru Şeridi Rengi</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'red', name: 'İESÜ Bordo / Kırmızı', bg: 'bg-[#990000]', border: 'border-red-800' },
                { id: 'amber', name: 'Uyarı / Amber', bg: 'bg-amber-600', border: 'border-amber-700' },
                { id: 'green', name: 'Başarı / Yeşil', bg: 'bg-emerald-600', border: 'border-emerald-700' },
                { id: 'blue', name: 'Bilgilendirme / Mavi', bg: 'bg-blue-600', border: 'border-blue-700' },
              ].map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    announcementBanner: { ...formData.announcementBanner, color: c.id }
                  })}
                  className={`p-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-between transition-all ${c.bg} ${
                    (formData.announcementBanner.color || 'red') === c.id ? 'ring-2 ring-offset-2 ring-slate-800 shadow-md scale-102' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <span>{c.name}</span>
                  {(formData.announcementBanner.color || 'red') === c.id && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tıklama Linki (Opsiyonel)</label>
            <input
              type="text"
              value={formData.announcementBanner.link}
              onChange={e => setFormData({
                ...formData,
                announcementBanner: { ...formData.announcementBanner, link: e.target.value }
              })}
              placeholder="Örn: /events veya https://..."
              className="w-full text-xs font-medium p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#990000] outline-none"
            />
          </div>
        </Card>
      )}

      {/* Tab 4: Feature Toggles */}
      {activeTab === 'features' && (
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-black text-gray-900 flex items-center gap-2 border-b pb-3">
            <Sliders size={18} className="text-[#990000]" /> Canlı Modül & Özellik Anahtarları (Feature Flags)
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Platformdaki kritik özellikleri tek tıkla devreye alın veya bakım/gizlilik amacıyla gizleyin.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'aiWingman', label: 'AI Kariyer Danışmanı (Wingman)', desc: 'Öğrencilere anlık CV ve kariyer tavsiyesi veren yapay zeka motoru' },
              { key: 'careerRadar', label: 'Kariyer Radarı & Eşleşme', desc: 'İlan ve yetenek analizi algoritmik eşleşme paneli' },
              { key: 'virtualFair', label: 'Sanal Kariyer Fuarı (Metaverse)', desc: '3D sanal stantlar ve dijital fuar deneyimi' },
              { key: 'liveRooms', label: 'Canlı Mülakat & Yayın Odaları', desc: 'WebRTC tabanlı doğrudan işveren-öğrenci görüşme odaları' },
              { key: 'alumniCard', label: 'Dijital Mezun Kartı & Cüzdan', desc: 'Mezunlara özel ayrıcalıklı indirim ve kimlik kartı' },
              { key: 'sspSystem', label: 'KGB (Kariyer Gelişim Belgesi & Yetkinlik)', desc: 'Öğrenci ve mezun kariyer gelişim akreditasyon sistemi' },
              { key: 'surveys', label: 'Kurumsal Anket & Araştırma', desc: 'YÖK ve akreditasyon uyumlu mezun takip anketleri' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100/60 transition">
                <div className="pr-4">
                  <h4 className="text-xs font-bold text-gray-900">{item.label}</h4>
                  <p className="text-[11px] text-gray-500 leading-tight mt-0.5">{item.desc}</p>
                </div>
                <button
                  onClick={() => setFormData({
                    ...formData,
                    featureToggles: {
                      ...formData.featureToggles,
                      [item.key]: !formData.featureToggles[item.key]
                    }
                  })}
                  className={`w-12 h-6 rounded-full transition-colors flex items-center px-0.5 shrink-0 ${
                    formData.featureToggles[item.key] ? 'bg-emerald-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    formData.featureToggles[item.key] ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 5: Stats */}
      {activeTab === 'stats' && (
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-black text-gray-900 flex items-center gap-2 border-b pb-3">
            <Layers size={18} className="text-[#990000]" /> Ana Sayfa Sayaçları & Başarı Göstergeleri
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Üniversite ve platform başarı metriklerini güncelleyin.
          </p>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 mb-4">
            <div>
              <h4 className="text-sm font-bold text-gray-900">İstatistik Şeridini Göster</h4>
              <p className="text-xs text-gray-500">Ana sayfadaki kurumsal istatistikler ve başarı rakamları bölümünü açar/kapatır.</p>
            </div>
            <button
              onClick={() => setLocalShowStats(!localShowStats)}
              className={`w-14 h-8 rounded-full transition-colors flex items-center px-1 ${
                localShowStats ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                localShowStats ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.map((stat, idx) => (
              <div key={stat.id || idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-gray-500 uppercase">Sayaç #{idx + 1}</span>
                  <Badge status="Yayında" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase">Başlık</label>
                  <input
                    type="text"
                    value={stat.title}
                    onChange={e => {
                      const updated = [...stats];
                      updated[idx].title = e.target.value;
                      setStats(updated);
                    }}
                    className="w-full text-xs font-bold p-2 border border-gray-200 rounded-lg bg-white outline-none focus:ring-1 focus:ring-[#990000]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase">Değer / Rakam</label>
                  <input
                    type="text"
                    value={stat.val}
                    onChange={e => {
                      const updated = [...stats];
                      updated[idx].val = e.target.value;
                      setStats(updated);
                    }}
                    className="w-full text-xs font-black text-[#990000] p-2 border border-gray-200 rounded-lg bg-white outline-none focus:ring-1 focus:ring-[#990000]"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
