import React, { useState } from 'react';
import { 
  Briefcase, GraduationCap, ArrowRight, ShieldCheck, 
  BookOpen, Globe2, Sparkles, Building2, Zap, Award, Eye, 
  CheckCircle2, Search, Target, Users, X, FileText, ChevronRight, Phone, Mail, MapPin, ExternalLink, Calendar, HelpCircle
} from 'lucide-react';
import MainHeader from './MainHeader';
import SubPanelFooter from './SubPanelFooter';
import useAppStore from '../store/useAppStore';

export default function ServicesPage({ setView, currentUser, userRole, setSelectedUserId }) {
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [selectedServicePreview, setSelectedServicePreview] = useState(null);

  // Resmî esenyurt.edu.tr Hizmet Kataloğu
  const OFFICIAL_SERVICES = [
    {
      id: 'bireysel_danismanlik',
      title: "Bireysel Kariyer Danışmanlığı",
      category: "Rehberlik & Koçluk",
      badge: "🎯 Birebir Görüşme",
      desc: "Öğrencilerimizin üniversiteye başladıkları ilk günden itibaren güçlü yönlerini ve kariyer hedeflerini belirlemelerine yardımcı olan 1-on-1 uzman rehberliği.",
      gradient: "from-[#990000] to-red-950",
      icon: <Briefcase className="text-[#990000]" size={26} />,
      view: "mentor_booking",
      previewData: {
        subtitle: "Öğrenciye Özel Kariyer Yol Haritası",
        stats: [
          { label: "Danışmanlık Ücreti", val: "Ücretsiz" },
          { label: "Görüşme Süresi", val: "45 Dakika" },
          { label: "Memnuniyet Oranı", val: "%98.5" }
        ],
        features: [
          "Yetkinlik ve Kişilik Envanteri İncelemesi",
          "Kişiye Özel Sektörel Yetkinlik Analizi",
          "Bireysel Kariyer Planı & Lisansüstü Hedef Belirleme",
          "Özgeçmiş (CV) ve Ön Yazı İnceleme Desteği"
        ]
      }
    },
    {
      id: 'online_mulakat',
      title: "Çevrimiçi Mülakat Simülasyonu",
      category: "İş Dünyasına Hazırlık",
      badge: "🎥 Canlı Simülasyon",
      desc: "Gerçek iş hayatı mülakat süreçlerine yönelik dijital prova imkanı. İnsan kaynakları soru kalıpları ile beden dili ve stres yönetimi geribildirimi.",
      gradient: "from-blue-700 to-indigo-900",
      icon: <Users className="text-blue-600" size={26} />,
      view: "interview_sim",
      previewData: {
        subtitle: "Gerçek Mülakat Deneyimi ve Beden Dili Analizi",
        stats: [
          { label: "Simülasyon Modu", val: "Online" },
          { label: "Soru Bankası", val: "500+ Soru" },
          { label: "Geri Bildirim", val: "Anında" }
        ],
        features: [
          "Sektöre Özel İnsan Kaynakları Soru Setleri",
          "Kamera ve Ses Kaydı Üzerinden Performans Değerlendirmesi",
          "Yetkinlik Bazlı Mülakat Teknikleri (STAR Metodu)",
          "Beden Dili, Diksiyon ve Özgüven Geliştirme İpuçları"
        ]
      }
    },
    {
      id: 'cv_hazirlama',
      title: "Etkili Özgeçmiş (CV) & Ön Yazı Eğitimi",
      category: "İş Dünyasına Hazırlık",
      badge: "📄 ATS Formatı",
      desc: "Uluslararası standartlarda, Aday Takip Sistemleri (ATS) uyumlu profesyonel CV hazırlama ve etkili niyet mektubu kaleme alma rehberliği.",
      gradient: "from-purple-700 to-violet-950",
      icon: <FileText className="text-purple-600" size={26} />,
      view: "cvbuilder",
      previewData: {
        subtitle: "Profesyonel ve Uluslararası Standartta CV",
        stats: [
          { label: "ATS Uyum Formatı", val: "%100 Uyum" },
          { label: "Desteği Veren", val: "Uzman Kadro" },
          { label: "Şablon Sayısı", val: "Çoklu Şablon" }
        ],
        features: [
          "Europass ve Kurumsal Şirket Uyumlu Şablonlar",
          "Anahtar Kelime (Keywords) ve Yetkinlik Vurgulama",
          "Portfolyo ve Sertifika Ekleme Standartları",
          "İngilizce Özgeçmiş ve Cover Letter Hazırlama Desteği"
        ]
      }
    },
    {
      id: 'staj_destegi',
      title: "İş ve Staj Olanağı Desteği",
      category: "İstihdam & Protokoller",
      badge: "💼 Yetenek Kapısı",
      desc: "Cumhurbaşkanlığı İnsan Kaynakları Ofisi (Yetenek Kapısı) ve İŞKUR/Eleman.net protokolleri ile öğrencilerimize liyakatli staj ve iş imkanları.",
      gradient: "from-emerald-700 to-teal-950",
      icon: <ShieldCheck className="text-emerald-600" size={26} />,
      view: "jobs",
      previewData: {
        subtitle: "Resmî Staj ve İş İlanı Portalı",
        stats: [
          { label: "Protokollü Kurum", val: "1.200+" },
          { label: "CBİKO Entegrasyonu", val: "Aktif" },
          { label: "Staj Türü", val: "Zorunlu / Gönüllü" }
        ],
        features: [
          "Cumhurbaşkanlığı Ulusal Staj Programı Koordinasyonu",
          "Kurumsal Şirket Staj Protokolleri ve Kontenjanları",
          "Zorunlu ve Gönüllü Staj Evrak Prosedür Takibi",
          "Part-Time ve Tam Zamanlı İş İlanları Erişimi"
        ]
      }
    },
    {
      id: 'kariyer_gunleri',
      title: "Kariyer Fuarları ve Zirveleri",
      category: "Etkinlik & Ağ Kurma",
      badge: "🎟️ Şirket Buluşmaları",
      desc: "Sektör liderleri, insan kaynakları direktörleri ve mezunlarımızı öğrencilerimizle buluşturan geleneksel kariyer fuarları ve networking zirveleri.",
      gradient: "from-[#990000] to-red-900",
      icon: <Award className="text-red-600" size={26} />,
      view: "events_list",
      previewData: {
        subtitle: "Sektör Liderleriyle Doğrudan Temas",
        stats: [
          { label: "Yıllık Zirve", val: "Geleneksel" },
          { label: "Katılımcı Firma", val: "100+ Holding" },
          { label: "Katılım Sertifikası", val: "Dijital" }
        ],
        features: [
          "Geleneksel İstanbul Esenyurt Üniversitesi Kariyer Günleri",
          "Sektör Temsilcileriyle Yüz Yüze Görüşme ve CV Bırakma",
          "CEO ve İK Direktörleri Deneyim Paylaşım Panelleri",
          "İş Dünyası Networking ve İrtibat Kurma Fırsatı"
        ]
      }
    },
    {
      id: 'mesleki_seminerler',
      title: "Sertifikalı Gelişim Seminerleri",
      category: "Rehberlik & Koçluk",
      badge: "🎓 Akredite Eğitim",
      desc: "Sürekli Eğitim Merkezi (SEM) ve uzman eğitmenler iş birliğiyle öğrencilerimizin mesleki ve kişisel becerilerini artıran sertifikalı seminerler.",
      gradient: "from-amber-600 to-orange-900",
      icon: <BookOpen className="text-amber-600" size={26} />,
      view: "sem",
      previewData: {
        subtitle: "Becerilerinizi Belgeleyen Sertifika Programları",
        stats: [
          { label: "Sertifika Türü", val: "Resmî Onaylı" },
          { label: "Eğitim Modu", val: "Online / Yüz Yüze" },
          { label: "Kapsam", val: "Soft & Hard Skills" }
        ],
        features: [
          "Liderlik, İletişim ve Takım Çalışması Atölyeleri",
          "Dijital Dönüşüm ve Yazılım/Bilişim Seminerleri",
          "Resmî Sertifika ile Özgeçmiş Güçlendirme",
          "Sektörel Trendler ve Geleceğin Meslekleri Sunumları"
        ]
      }
    }
  ];

  const CATEGORIES = ['Tümü', 'Rehberlik & Koçluk', 'İş Dünyasına Hazırlık', 'İstihdam & Protokoller', 'Etkinlik & Ağ Kurma'];

  const filteredServices = OFFICIAL_SERVICES.filter(s => 
    activeCategory === 'Tümü' || s.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <MainHeader setView={setView} />

      <main className="flex-1 w-full max-w-[1250px] mx-auto p-4 lg:p-8 flex flex-col gap-8">
        
        {/* Resmî Kurumsal Hero Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-[#800000] to-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl border border-red-900 relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-950/70 px-4 py-1.5 rounded-full border border-amber-500/40 inline-block mb-3">
              İSTANBUL ESENYURT ÜNİVERSİTESİ
            </span>
            <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tight leading-tight">
              Kariyer Geliştirme Ofisi Koordinatörlüğü Hizmetleri
            </h2>
            <p className="text-slate-200 text-sm leading-relaxed font-medium">
              Öğrencilerimizin ve mezunlarımızın kişisel farkındalığı yüksek, gelişmeleri yakından takip eden, kurumsal ve toplumsal gelişime katma değer yaratan bireyler olmaları yönünde resmî destek sunuyoruz.
            </p>
          </div>
        </div>

        {/* Kategori Filtresi */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat 
                  ? 'bg-gradient-to-r from-[#990000] to-[#800000] text-white shadow-lg shadow-red-900/30 scale-105' 
                  : 'bg-white text-slate-600 hover:bg-red-50 hover:text-[#990000] border border-slate-200 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Resmî Hizmet Kartları Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((srv) => (
            <div 
              key={srv.id}
              className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:border-red-300 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3.5 bg-red-50 rounded-2xl border border-red-100 group-hover:scale-110 transition-transform">
                    {srv.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#990000] bg-red-50 px-3 py-1 rounded-full border border-red-100">
                    {srv.badge}
                  </span>
                </div>

                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                  {srv.category}
                </span>
                <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-[#990000] transition-colors">
                  {srv.title}
                </h3>
                <p className="text-xs font-medium text-slate-600 leading-relaxed mb-6">
                  {srv.desc}
                </p>
              </div>

              {/* Aksiyon Butonları */}
              <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setSelectedServicePreview(srv)}
                  className="w-full py-2.5 bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-[#990000] font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 border border-slate-200 cursor-pointer"
                >
                  <Eye size={15} /> Detaylı İncele
                </button>
                <button
                  onClick={() => setView && setView(srv.view)}
                  className={`w-full py-3 bg-gradient-to-r ${srv.gradient} hover:opacity-95 text-white font-black rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md cursor-pointer`}
                >
                  Hizmete Git <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* SSS & İletişim Bilgileri */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#990000] bg-red-50 px-3 py-1 rounded-full border border-red-100 inline-block mb-2">
              Kariyer Danışmanlığı Randevusu
            </span>
            <h3 className="text-xl font-black text-slate-900 mb-1">
              Birebir Danışmanlık ve Destek Almak İster misiniz?
            </h3>
            <p className="text-xs font-medium text-slate-500">
              İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Koordinatörlüğü olarak hafta içi her gün hizmetinizdeyiz.
            </p>
          </div>

          <button
            onClick={() => setView && setView('contact_us')}
            className="bg-[#990000] hover:bg-red-800 text-white font-black px-7 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition shadow-lg shrink-0 flex items-center gap-2 cursor-pointer"
          >
            İletişime Geç <ArrowRight size={16} />
          </button>
        </div>

      </main>

      {/* Detay Popup Modal */}
      {selectedServicePreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-xl rounded-3xl p-6 md:p-8 shadow-2xl text-slate-800 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedServicePreview(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-red-50 text-[#990000] rounded-2xl border border-red-100">
                {selectedServicePreview.icon}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#990000]">
                  {selectedServicePreview.category}
                </span>
                <h3 className="text-xl font-black text-slate-900 leading-tight">
                  {selectedServicePreview.title}
                </h3>
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-500 mt-2 mb-6">
              {selectedServicePreview.previewData.subtitle}
            </p>

            {/* İstatistik Özetleri */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {selectedServicePreview.previewData.stats.map((st, i) => (
                <div key={i} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                  <span className="block text-sm font-black text-[#990000]">{st.val}</span>
                  <span className="text-[10px] font-bold text-slate-500">{st.label}</span>
                </div>
              ))}
            </div>

            {/* Hizmet Maddeleri */}
            <div className="space-y-2.5 mb-8">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Hizmet Kapsamı & Özellikleri</h4>
              {selectedServicePreview.previewData.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-3 text-xs font-medium text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Aksiyon Butonu */}
            <button
              onClick={() => {
                const targetView = selectedServicePreview.view;
                setSelectedServicePreview(null);
                setView && setView(targetView);
              }}
              className="w-full py-3.5 bg-[#990000] hover:bg-red-800 text-white font-black rounded-2xl text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-xl cursor-pointer"
            >
              Hemen Kullan & Başvur <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      <SubPanelFooter setView={setView} />
    </div>
  );
}
