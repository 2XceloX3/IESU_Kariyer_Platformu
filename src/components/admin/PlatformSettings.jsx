import React from 'react';
import { Check, X, Shield, Settings, Database, Server, Smartphone, Globe, Cloud, Layout, Bell, BookOpen, Users, Briefcase, CalendarHeart, Trophy, Award } from 'lucide-react';

const Toggle = ({ label, description, enabled, onChange, icon: Icon }) => (
  <div className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:border-blue-100 transition-all group">
    <div className="flex items-start gap-4">
      <div className={`p-3 rounded-xl mt-1 transition-colors ${enabled ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
        <Icon size={20} />
      </div>
      <div>
        <h4 className="font-bold text-gray-900 mb-1">{label}</h4>
        <p className="text-sm text-gray-500 leading-relaxed max-w-md">{description}</p>
      </div>
    </div>
    <button 
      onClick={onChange}
      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex-shrink-0 ml-4 ${enabled ? 'bg-blue-600' : 'bg-gray-200'}`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-8' : 'translate-x-1'}`} />
    </button>
  </div>
);

const PlatformSettings = ({ 
  featureSurveys, setFeatureSurveys, 
  featureCareerCheckup, setFeatureCareerCheckup, 
  featureAlumniCard, setFeatureAlumniCard, 
  featureClubsShowcase, setFeatureClubsShowcase, 
  featureClubApplications, setFeatureClubApplications,
  featureCareerFair, setFeatureCareerFair,
  featureSSPLeaderboard, setFeatureSSPLeaderboard,
  sspEnabled, setSspEnabled
}) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-[#0A2342] to-blue-900 p-8 rounded-xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Settings size={120} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-black mb-3">Platform Ayarları</h2>
          <p className="text-blue-100 text-lg leading-relaxed">
            Sistemin temel modüllerini (açılır kapanır özellikleri) buradan yönetebilir, dilediğiniz özellikleri öğrencilere ve mezunlara açıp kapatabilirsiniz.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* MODÜL YÖNETİMİ */}
        <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-6">
            <Layout className="text-blue-600" size={24} />
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
              label="Öğrenci Kulüpleri Vitrini"
              description="Kulüplerin kampüs sayfasında herkese açık şekilde listelenmesini sağlar."
              icon={Users}
              enabled={featureClubsShowcase}
              onChange={() => setFeatureClubsShowcase(!featureClubsShowcase)}
            />
            <Toggle 
              label="Kulüp Başvuru Sistemi"
              description="Öğrencilerin kulüplere online olarak katılım isteği (başvuru) gönderebilmesini açar."
              icon={Bell}
              enabled={featureClubApplications}
              onChange={() => setFeatureClubApplications(!featureClubApplications)}
            />
            <Toggle 
              label="Geleneksel Kariyer Günleri"
              description="Firmalar için başvuru formunu ve etkinlik duyurularını aktif eder."
              icon={CalendarHeart}
              enabled={featureCareerFair}
              onChange={() => setFeatureCareerFair(!featureCareerFair)}
            />
            <Toggle 
              label="SSP Öğrenci Liderlik Tablosu"
              description="Öğrencilerin Birlik Ağı'nda (SSP Liderlik) sırasını ve panellerini görmesini sağlar."
              icon={Trophy}
              enabled={featureSSPLeaderboard}
              onChange={() => setFeatureSSPLeaderboard(!featureSSPLeaderboard)}
            />
            <Toggle 
              label="Sosyal Sorumluluk Puan Sistemi (SSP)"
              description="Öğrenciler için sosyal sorumluluk görevlerini, duyurularını ve puanlama altyapısını sistem genelinde aktif eder."
              icon={Award}
              enabled={sspEnabled}
              onChange={() => setSspEnabled(!sspEnabled)}
            />
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
                <Database className="text-blue-500" size={20} />
                <span className="font-bold text-gray-700">Önbellek (Redis/Cache)</span>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-md">Temizlendi</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlatformSettings;