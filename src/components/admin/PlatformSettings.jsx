import React from 'react';
import { Check, X, Shield, Settings, Database, Server, Smartphone, Globe, Cloud, Layout, Bell, BookOpen, Users, Briefcase, CalendarHeart, Trophy, Award } from 'lucide-react';

const Toggle = ({ label, description, enabled, onChange, icon: Icon }) => (
  <div className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:border-red-100 transition-all group">
    <div className="flex items-start gap-4">
      <div className={`p-3 rounded-xl mt-1 transition-colors ${enabled ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
        <Icon size={20} />
      </div>
      <div>
        <h4 className="font-bold text-gray-900 mb-1">{label}</h4>
        <p className="text-sm text-gray-500 leading-relaxed max-w-md">{description}</p>
      </div>
    </div>
    <button 
      onClick={onChange}
      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex-shrink-0 ml-4 ${enabled ? 'bg-red-600' : 'bg-gray-200'}`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-8' : 'translate-x-1'}`} />
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
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-[#990000] to-red-900 p-8 rounded-xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Settings size={120} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-black mb-3">Platform Ayarları</h2>
          <p className="text-red-100 text-lg leading-relaxed">
            Sistemin temel modüllerini (açılır kapanır özellikleri) buradan yönetebilir, dilediğiniz özellikleri öğrencilere ve mezunlara açıp kapatabilirsiniz.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* MODÜL YÖNETİMİ */}
        <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-6">
            <Layout className="text-red-600" size={24} />
            <h3 className="text-xl font-bold text-gray-900">Modül Yönetimi</h3>
          </div>
          <div className="space-y-4">
            <Toggle 
              label="Anket ve Geribildirim Sistemi"
              description="Öğrenciler ve mezunlar için anket doldurma altyapısını aktif eder."
              icon={BookOpen}
              enabled={featureSurveys}
              onChange={() => setFeatureSurveys(!featureSurveys)}
            />
            <Toggle 
              label="Kariyer Check-Up Modülü"
              description="Kullanıcıların profil doluluk oranlarına göre kariyer önerileri almasını sağlar."
              icon={Briefcase}
              enabled={featureCareerCheckup}
              onChange={() => setFeatureCareerCheckup(!featureCareerCheckup)}
            />
            <Toggle 
              label="Mezun Kart Sistemi"
              description="Mezunların dijital/fiziksel kart başvurusu yapabilmesini ve ayrıcalıkları görmesini sağlar."
              icon={Shield}
              enabled={featureAlumniCard}
              onChange={() => setFeatureAlumniCard(!featureAlumniCard)}
            />
            <Toggle 
              label="Kurumsal İstatistikler Bandı (Ana Sayfa)"
              description="Ana sayfadaki Mezun Sayısı, Laboratuvar Sayısı, Akredite Program vb. istatistik bandının görünürlüğünü açıp kapatır."
              icon={Globe}
              enabled={showInstitutionalStats}
              onChange={() => setShowInstitutionalStats(!showInstitutionalStats)}
            />

            <Toggle 
              label="Mezun Derneği Üyelik & Ekip Başvuru Dönemi"
              description="Mezun Derneği üyelik ve yönetim ekibi başvurularını aktif/pasif eder. Kapalı olduğunda başvuru formu erişime kapanır."
              icon={Users}
              enabled={featureAlumniAssocToggle !== false}
              onChange={() => setFeatureAlumniAssocToggle && setFeatureAlumniAssocToggle(!featureAlumniAssocToggle)}
            />

            <Toggle 
              label="Mezun Derneği Akış & Portal Görünürlüğü"
              description="Öğrenci ve mezun ana yayın akışında Mezunlar Derneği duyuru, üyelik ve yönetim paneli sekmesinin görünmesini sağlar."
              icon={Award}
              enabled={featureAlumniAssocToggle !== false}
              onChange={() => setFeatureAlumniAssocToggle && setFeatureAlumniAssocToggle(!featureAlumniAssocToggle)}
            />

            {/* Live Stats Editor Panel */}
            {showInstitutionalStats && (
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 mt-3">
                <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider">İstatistik Kartlarını Düzenle (Canlı Güncelleme)</h5>
                <div className="space-y-3">
                  {(institutionalStatsData || []).map((stat, idx) => (
                    <div key={stat.id} className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Metin Başlığı</label>
                        <input
                          type="text"
                          value={stat.title}
                          onChange={(e) => {
                            const updated = [...institutionalStatsData];
                            updated[idx].title = e.target.value;
                            setInstitutionalStatsData(updated);
                          }}
                          className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Sayısal / İstatistik Değeri</label>
                        <input
                          type="text"
                          value={stat.val}
                          onChange={(e) => {
                            const updated = [...institutionalStatsData];
                            updated[idx].val = e.target.value;
                            setInstitutionalStatsData(updated);
                          }}
                          className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-[#990000]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SİSTEM BİLGİLERİ (Sadece Görsel) */}
        <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-fit">
          <div className="flex items-center gap-3 mb-6">
            <Server className="text-gray-900" size={24} />
            <h3 className="text-xl font-bold text-gray-900">Sistem Durumu</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3">
                <Cloud className="text-emerald-500" size={20} />
                <span className="font-bold text-gray-700">Veritabanı Bağlantısı</span>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md"><Check size={14} /> Aktif</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3">
                <Globe className="text-emerald-500" size={20} />
                <span className="font-bold text-gray-700">Canlı Sunucu (Web)</span>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md"><Check size={14} /> Stabil</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3">
                <Database className="text-red-500" size={20} />
                <span className="font-bold text-gray-700">Önbellek (Redis/Cache)</span>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-md">Temizlendi</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlatformSettings;