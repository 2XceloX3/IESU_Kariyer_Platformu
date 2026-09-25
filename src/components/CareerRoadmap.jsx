import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Sparkles, ChevronLeft, ArrowRight, Zap, CheckCircle2, 
  CircleDashed, Rocket, Code, Award, Users, CalendarClock,
  Compass, CheckSquare, Square, RefreshCw, BookOpen, Briefcase
} from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import SubPanelFloatingDock from './SubPanelFloatingDock';
import { generateAIResponse } from '../lib/gemini';

const PRESET_SECTORS = [
  { id: 'swe', name: 'Yazılım & Bilişim', role: 'Full Stack Web & Mobil Geliştirici', icon: <Code size={16} /> },
  { id: 'data', name: 'Veri & Analitik', role: 'Veri Bilimi ve İş Zekası Uzmanı', icon: <Target size={16} /> },
  { id: 'fin', name: 'Finans & Bankacılık', role: 'Kurumsal Finans & Yatırım Danışmanı', icon: <Briefcase size={16} /> },
  { id: 'mkt', name: 'Pazarlama & Tasarım', role: 'Dijital Büyüme & UI/UX Ürün Yöneticisi', icon: <Sparkles size={16} /> },
  { id: 'eng', name: 'Mühendislik & Üretim', role: 'Endüstri & Operasyonel Mükemmellik Mühendisi', icon: <Rocket size={16} /> },
];

const DEFAULT_ROADMAPS = {
  swe: {
    title: 'Full Stack Web & Mobil Geliştirici Yol Haritası',
    phases: [
      { 
        id: 1, 
        title: 'Temeller ve Kodlama Altyapısı', 
        timeframe: '0 - 6 Ay', 
        desc: 'Programlama temelleri, algoritma mantığı, Git versiyon kontrolü ve modern web standartları.',
        tasks: [
          'HTML5, Modern CSS, Responsive Design ve Tailwind temellerini öğren',
          'JavaScript (ES6+) ve TypeScript temel syntax pratiklerini bitir',
          'GitHub profili aç, temel komutları öğren ve ilk 3 açık kaynak depoyu yayınla',
          'Üniversite Yazılım Kulübü teknik etkinliklerine ve hackathonlara katıl'
        ] 
      },
      { 
        id: 2, 
        title: 'Mimari ve İleri Frameworkler', 
        timeframe: '6 - 12 Ay', 
        desc: 'React / Next.js, Node.js REST API geliştirme, veritabanı modelleme ve güvenli kimlik doğrulama.',
        tasks: [
          'React ile component lifecycle, state yönetimi ve custom hook mimarisi kur',
          'Node.js & Express veya Python FastApi ile tam teşekküllü bir CRUD API yaz',
          'PostgreSQL veya MongoDB ile ilişkisel / doküman tabanlı veri tabanı tasarla',
          'İESÜ mezun ağından kıdemli bir yazılımcı mentor ile ilk görüşmeyi gerçekleştir'
        ] 
      },
      { 
        id: 3, 
        title: 'Saha Deneyimi & Staj', 
        timeframe: '1 - 2 Yıl', 
        desc: 'Kurumsal staj programlarına dahil olma, CI/CD pipeline, Docker ve takım içi Agile/Scrum süreçleri.',
        tasks: [
          'Platform üzerinden teknoloji firmalarına yaz dönemi staj başvurularını yap',
          'Docker ile containerize edilmiş bir mikroservis projesini buluta (AWS/Vercel) deploy et',
          'Birim ve entegrasyon testleri (Vitest/Jest) yazarak kod kapsamını %80 üzerine çıkar',
          'Sektörel simülasyon mülakatı yaparak teknik soru repertuarını geliştir'
        ] 
      },
      { 
        id: 4, 
        title: 'Zirve, Uzmanlaşma & Kariyer Başlangıcı', 
        timeframe: '2+ Yıl', 
        desc: 'Junior / Mid-level pozisyonlara resmi iş başvuruları, profesyonel portfolyo sunumu ve müzakere.',
        tasks: [
          'Teknik projelerini içeren canlı demo linkli kişisel portfolyo web siteni yayına al',
          'Sektördeki İK liderleri ve Engineering Manager\'lar ile profesyonel ağ kur',
          'Sistem tasarımı (System Design) mülakatlarına yönelik pratikleri tamamla',
          'Kariyer Geliştirme Merkezi koordinasyonunda resmi iş tekliflerini değerlendir'
        ] 
      },
    ]
  },
  data: {
    title: 'Veri Bilimi ve İş Zekası Uzmanı Yol Haritası',
    phases: [
      {
        id: 1,
        title: 'Matematiksel Temeller & Python',
        timeframe: '0 - 6 Ay',
        desc: 'İstatistik, olasılık kuramı, doğrusal cebir ve Python ile veri manipülasyonu.',
        tasks: [
          'Python, NumPy, Pandas ve Matplotlib kütüphanelerini pratik veri setleriyle öğren',
          'İleri seviye SQL sorguları yazma (JOIN, Window Functions, Group By) becerisi kazan',
          'Kaggle platformunda temel seviye yarışmalara katılarak ilk notebooklarını yayınla',
          'Bölüm danışman hocasıyla akademik veri analitiği çalışmalarında yer al'
        ]
      },
      {
        id: 2,
        title: 'Makine Öğrenmesi & Veri Görselleştirme',
        timeframe: '6 - 12 Ay',
        desc: 'Scikit-learn, denetimli/denetimsiz öğrenme, Power BI ve Tableau iş zekası panoları.',
        tasks: [
          'Regresyon, sınıflandırma ve kümeleme algoritmalarını gerçek dünya verisinde uygula',
          'Power BI veya Tableau ile kurumsal KPI gösterge paneli (dashboard) tasarla',
          'Model performans metriklerini (RMSE, F1-Score, AUC-ROC) karşılaştırmalı analiz et',
          'Doğrulanmış İESÜ mentör rehberinden veri bilimi mentoru ile eşleş'
        ]
      },
      {
        id: 3,
        title: 'Büyük Veri & Pipeline Entegrasyonu',
        timeframe: '1 - 2 Yıl',
        desc: 'Apache Spark, bulut veri ambarları (Snowflake/BigQuery) ve kurumsal staj.',
        tasks: [
          'Büyük veri mimarilerini ve ETL/ELT pipeline akışlarını incele',
          'Finans veya e-ticaret alanında veri analisti staj başvurularını tamamla',
          'A/B testleri kurgulayarak ürün optimizasyon denemeleri yap',
          'İş zekası sertifikasyon sınavlarına (Microsoft Power BI / Google Data Analytics) gir'
        ]
      },
      {
        id: 4,
        title: 'Stratejik Karar Vericilik & Profesyonel Pozisyon',
        timeframe: '2+ Yıl',
        desc: 'Üst yönetime veri sunumu yapabilme kabiliyeti ve kurumsal veri bilimci rolü.',
        tasks: [
          'Veri hikayeleştirme (Data Storytelling) ve yönetici sunum tekniklerini pekiştir',
          'Kişisel veri portfolyonu GitHub ve Medium makaleleri ile belgele',
          'Platform iş ilanlarındaki Senior veri analistleriyle mülakat pratikleri yap',
          'Resmi mezuniyet sonrası tam zamanlı teklif sürecini yönet'
        ]
      }
    ]
  },
  fin: {
    title: 'Kurumsal Finans & Yatırım Danışmanı Yol Haritası',
    phases: [
      {
        id: 1,
        title: 'Mali Tablolar & Finansal Muhasebe',
        timeframe: '0 - 6 Ay',
        desc: 'Bilanço, gelir tablosu analizi, nakit akışı ve finansal modelleme temelleri.',
        tasks: [
          'Mali analiz yöntemleri ve oran (rasyo) analizlerini detaylı öğren',
          'İleri Excel (VLOOKUP, INDEX/MATCH, Pivot Table, Finansal Formüller) uzmanlığı kazan',
          'Borsa İstanbul ve küresel sermaye piyasası dinamiklerini takip et',
          'Finans Kulübü etkinliklerine ve vaka analizi yarışmalarına katıl'
        ]
      },
      {
        id: 2,
        title: 'Sermaye Piyasaları & Lisanslama Hazırlığı',
        timeframe: '6 - 12 Ay',
        desc: 'SPL Lisanslama sınavları, şirket değerleme modelleri (DCF, Çarpan Analizi).',
        tasks: [
          'SPL Düzey 1 ve Düzey 2 sınav hazırlık modüllerini tamamla',
          'İndirgenmiş Nakit Akımları (DCF) yöntemiyle halka açık bir şirketin değerlemesini yap',
          'Makroekonomik göstergelerin (faiz, enflasyon, kur) sektörel etkilerini modelle',
          'Bankacılık ve denetim alanındaki mezun mentörlerle temas kur'
        ]
      },
      {
        id: 3,
        title: 'Denetim, Banka & Fon Stajları',
        timeframe: '1 - 2 Yıl',
        desc: 'Big 4 denetim şirketleri veya aracı kurumlarda staj deneyimi ve risk yönetimi.',
        tasks: [
          'Platform üzerinden bankacılık ve finans sektörü staj ilanlarına başvur',
          'Kredi derecelendirme ve finansal risk senaryoları simülasyonunu çalış',
          'Bloomberg Terminal veya kurumsal finans yazılımları hakkında ön bilgi edin',
          'Sektörel vaka mülakatlarına (case interview) hazırlan'
        ]
      },
      {
        id: 4,
        title: 'Yatırım Bankacılığı & Portföy Yönetimi',
        timeframe: '2+ Yıl',
        desc: 'Birleşme ve devralmalar (M&A), portföy optimizasyonu ve analist pozisyonu.',
        tasks: [
          'Yatırım fizibilite raporu hazırlama kabiliyetini portfolyoya dönüştür',
          'CFA veya SPK lisanslarını portfolyona ekle',
          'Hedef finans kuruluşlarının kurumsal İK birimleriyle temas kur',
          'Kariyer Geliştirme Koordinatörlüğü ile ilk sözleşme sürecini yönet'
        ]
      }
    ]
  },
  mkt: {
    title: 'Dijital Büyüme & UI/UX Ürün Yöneticisi Yol Haritası',
    phases: [
      {
        id: 1,
        title: 'Kullanıcı Deneyimi & Tasarım Temelleri',
        timeframe: '0 - 6 Ay',
        desc: 'Tasarım odaklı düşünme, kullanıcı araştırması ve Figma ile tel çerçeve (wireframe).',
        tasks: [
          'Figma ile UI component, auto-layout ve tasarım sistemi kurmayı öğren',
          'Kullanıcı persona ve yolculuk haritaları (User Journey) çıkarma pratikleri yap',
          'Google Analytics ve dijital pazarlama metriklerinin (CAC, LTV, ROAS) temellerini öğren',
          'Behance ve Dribbble profili oluşturup ilk 2 konsept çalışmanı yükle'
        ]
      },
      {
        id: 2,
        title: 'Büyüme Pazarlaması & Veriye Dayalı Tasarım',
        timeframe: '6 - 12 Ay',
        desc: 'Dönüşüm oranı optimizasyonu (CRO), A/B testi ve performans pazarlama araçları.',
        tasks: [
          'Meta Ads, Google Ads ve SEO teknik denetim temellerini öğren',
          'Kullanılabilirlik testleri (Usability Testing) uygulayarak geri bildirim topla',
          'Mikro etkileşimler ve prototipleme animasyonları geliştir',
          'Üniversite tasarım ve iletişim kulüplerinde proje yöneticiliği üstlen'
        ]
      },
      {
        id: 3,
        title: 'Ajans & E-Ticaret Saha Stajı',
        timeframe: '1 - 2 Yıl',
        desc: 'Canlı kampanyalar yönetme, ürün yol haritası (Product Roadmap) ve büyüme deneyleri.',
        tasks: [
          'Dijital ajans veya teknoloji şirketi ürün stajına kabul al',
          'Çok kanallı (Omnichannel) kampanya stratejisini baştan sona planla',
          'Yazılım ekibiyle ortak Scrum sprint süreçlerine katıl',
          'Öne çıkan vaka analizi çalışmalarını PDF sunum formatında hazırla'
        ]
      },
      {
        id: 4,
        title: 'Kıdemli Ürün & Pazarlama Stratejisi',
        timeframe: '2+ Yıl',
        desc: 'Ürün yaşam döngüsü yönetimi, gelir optimizasyonu ve tam zamanlı istihdam.',
        tasks: [
          'Uçtan uca başarıya ulaşmış bir vaka portfolyosu ile mülakatlara gir',
          'Ürün liderleri ve CMO seviyesi sektör profesyonelleriyle ağ kur',
          'Kariyer Geliştirme Merkezi destekli maaş ve pozisyon tekliflerini değerlendir',
          'Mezuniyet sonrası genç öğrencilere tecrübe aktaracak mentorluk adımlarını planla'
        ]
      }
    ]
  },
  eng: {
    title: 'Endüstri & Operasyonel Mükemmellik Mühendisi Yol Haritası',
    phases: [
      {
        id: 1,
        title: 'Mühendislik Temelleri & Süreç Analizi',
        timeframe: '0 - 6 Ay',
        desc: 'İş etüdü, zaman ölçümü, süreç akış şemaları ve temel mühendislik istatistiği.',
        tasks: [
          'Süreç haritalama ve akış diyagramı (Process Mapping) yazılımlarını öğren',
          'Yalın Üretim felsefesi, 5S ve Kaizen metodolojisi eğitimlerini tamamla',
          'Excel ve Minitab ile temel istatistiksel kalite kontrol araçlarını kavra',
          'TMMOB ve mühendislik kulübü fabrika teknik gezilerine düzenli katıl'
        ]
      },
      {
        id: 2,
        title: 'Yalın Altı Sigma & ERP Sistemleri',
        timeframe: '6 - 12 Ay',
        desc: 'SAP/ERP modülleri, tedarik zinciri modelleme ve Altı Sigma Sarı/Yeşil Kuşak.',
        tasks: [
          'Yalın Altı Sigma DMAIC döngüsünü örnek bir vaka üzerinden projelendir',
          'ERP sistemlerinde (SAP, IFS veya Logo) üretim planlama ve stok mantığını öğren',
          'Tedarik zinciri optimizasyonu ve lojistik maliyet hesaplamalarını çalış',
          'Fabrika yöneticisi İESÜ mezun mentöründen üretim hattı mentorluğu al'
        ]
      },
      {
        id: 3,
        title: 'Fabrika & Saha Üretim Stajı',
        timeframe: '1 - 2 Yıl',
        desc: 'Endüstriyel tesislerde zorunlu/gönüllü staj, darboğaz analizi ve hat dengeleme.',
        tasks: [
          'Otomotiv, beyaz eşya veya FMCG fabrikasında üretim planlama stajı yap',
          'Gerçek bir üretim hattında SMED (hızlı kalıp değişimi) projesi yürüt',
          'OEE (Toplam Ekipman Etkinliği) metriklerini ölç ve raporla',
          'İş sağlığı ve güvenliği kurumsal protokollerini sahada uygula'
        ]
      },
      {
        id: 4,
        title: 'Operasyon Liderliği & Süreç Mühendisliği',
        timeframe: '2+ Yıl',
        desc: 'Sürekli iyileştirme uzmanlığı, proje yönetimi ve endüstri mühendisi kadrosu.',
        tasks: [
          'Bitirme projesini sanayi ortaklı (TÜBİTAK 2209-B) olarak tamamla',
          'PMP temelleri ve Agile operasyon yönetimi yetkinliklerini CV\'ne ekle',
          'Büyük sanayi kuruluşlarının MT (Management Trainee) programlarına başvur',
          'Kariyer Merkezi ile profesyonel iş hayatına resmi adımını at'
        ]
      }
    ]
  }
};

export default function CareerRoadmap({ setView, currentUser, userRole, setSelectedUserId }) {
  const [selectedSectorId, setSelectedSectorId] = useState('swe');
  const [dreamRole, setDreamRole] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState(DEFAULT_ROADMAPS.swe);
  const [completedTasks, setCompletedTasks] = useState({});

  // Local storage synchronization
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('iesu_career_roadmap_completed_tasks_v2');
      if (savedTasks) {
        setCompletedTasks(JSON.parse(savedTasks));
      }
      const savedSector = localStorage.getItem('iesu_career_roadmap_active_sector_v2');
      if (savedSector && DEFAULT_ROADMAPS[savedSector]) {
        setSelectedSectorId(savedSector);
        setRoadmap(DEFAULT_ROADMAPS[savedSector]);
      }
    } catch (e) {}
  }, []);

  const handleSelectSector = (sectorId) => {
    setSelectedSectorId(sectorId);
    setRoadmap(DEFAULT_ROADMAPS[sectorId]);
    setDreamRole('');
    try {
      localStorage.setItem('iesu_career_roadmap_active_sector_v2', sectorId);
    } catch (e) {}
  };

  const toggleTask = (taskKey) => {
    setCompletedTasks(prev => {
      const next = { ...prev, [taskKey]: !prev[taskKey] };
      try {
        localStorage.setItem('iesu_career_roadmap_completed_tasks_v2', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleCustomGenerate = async () => {
    if (!dreamRole.trim()) return;
    setIsGenerating(true);

    const prompt = `
      Sen İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi Danışmanısın.
      Öğrenci "${currentUser?.name || 'Öğrenci'}" şu hedefi belirledi: "${dreamRole}".
      Bu hedefe ulaşması için 4 aşamalı (Faz 1, Faz 2, Faz 3, Faz 4) bir kariyer yol haritası (roadmap) çıkar.
      Lütfen sadece aşağıdaki JSON formatında, geçerli bir JSON objesi döndür, başka hiçbir metin veya markdown KULLANMA.
      JSON Formatı:
      {
        "title": "${dreamRole} Kariyer Yol Haritası",
        "phases": [
          {
            "id": 1,
            "title": "Temeller ve Akademik Hazırlık",
            "timeframe": "0 - 6 Ay",
            "desc": "Kısa açıklama",
            "tasks": ["Görev 1", "Görev 2", "Görev 3", "Görev 4"]
          },
          {
            "id": 2,
            "title": "Yetkinlik Geliştirme & Sertifikasyon",
            "timeframe": "6 - 12 Ay",
            "desc": "Kısa açıklama",
            "tasks": ["Görev 1", "Görev 2", "Görev 3", "Görev 4"]
          },
          {
            "id": 3,
            "title": "Saha Deneyimi & Staj",
            "timeframe": "1 - 2 Yıl",
            "desc": "Kısa açıklama",
            "tasks": ["Görev 1", "Görev 2", "Görev 3", "Görev 4"]
          },
          {
            "id": 4,
            "title": "Zirve, Uzmanlaşma & İşe Giriş",
            "timeframe": "2+ Yıl",
            "desc": "Kısa açıklama",
            "tasks": ["Görev 1", "Görev 2", "Görev 3", "Görev 4"]
          }
        ]
      }
    `;

    try {
      const response = await generateAIResponse(prompt, "Sadece geçerli JSON dön");
      let cleanJson = response.replace(/^```json\s*/i, '').replace(/\s*```$/, '').replace(/^```\s*/, '').trim();
      const data = JSON.parse(cleanJson);
      setRoadmap(data);
      setSelectedSectorId('custom');
      setIsGenerating(false);
    } catch (e) {
      // Fallback
      setRoadmap({
        title: `${dreamRole} Yol Haritası`,
        phases: [
          { id: 1, title: 'Temeller ve İlk Adımlar', timeframe: '0 - 6 Ay', desc: 'Sektörün temellerini öğrenmek ve ilk portfolyoyu oluşturmak.', tasks: ['İlgili temel eğitimleri tamamla', 'Profesyonel platformlarda profil aç', 'İlk küçük projeni yayınla', 'Üniversite kulüplerine dahil ol'] },
          { id: 2, title: 'Gelişim ve Derinleşme', timeframe: '6 - 12 Ay', desc: 'İleri düzey kavramları öğrenmek ve mentor bulmak.', tasks: ['İleri seviye kurslara katıl', 'Mezun ağından bir mentor bul', 'Gönüllü staj başvuruları yap', 'Teknik sertifikasyonları tamamla'] },
          { id: 3, title: 'Saha Deneyimi', timeframe: '1 - 2 Yıl', desc: 'Gerçek dünya projelerinde yer almak ve sektörle tanışmak.', tasks: ['Kariyer Fuarında staj ayarla', 'Freelance / Açık kaynak projelere katkı yap', 'Mülakat simülasyonları ile pratik yap', 'Sektör ağını genişlet'] },
          { id: 4, title: 'Zirve ve Hedef', timeframe: '2+ Yıl', desc: 'Açık pozisyonlara başvuru ve profesyonel kariyerin başlangıcı.', tasks: ['CV ve Portfolyoyu son haline getir', 'Şirketlerin Senior İK çalışanları ile bağlantı kur', 'Hedef rol için resmi başvurulara başla', 'Kariyer merkezinden teklif danışmanlığı al'] },
        ]
      });
      setSelectedSectorId('custom');
      setIsGenerating(false);
    }
  };

  // Metrics
  const totalTasks = (roadmap?.phases || []).reduce((acc, p) => acc + (p.tasks?.length || 0), 0);
  const completedCount = (roadmap?.phases || []).reduce((acc, p, pIdx) => {
    return acc + (p.tasks || []).filter((_, tIdx) => completedTasks[`${roadmap.title}_${pIdx}_${tIdx}`]).length;
  }, 0);
  const percent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const backTarget = userRole === 'admin' ? 'admin' : (userRole === 'employer' || userRole === 'company') ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-28">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200/80 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView(backTarget)} 
            className="w-10 h-10 rounded-full bg-gray-50 hover:bg-red-50 border border-gray-200 flex items-center justify-center text-gray-700 hover:text-[#990000] transition cursor-pointer shadow-xs"
            title="Geri Dön"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-auto text-[#990000]" />
            <div>
              <h1 className="font-black text-gray-900 text-sm sm:text-base leading-tight">Kariyer Haritası</h1>
              <p className="text-[11px] font-bold text-gray-500">Adım Adım Gelişim Rotası & Görev Takibi</p>
            </div>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto p-4 lg:p-8">
        
        {/* TOP HERO & SECTOR SELECTOR */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-xs mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-5 border-b border-gray-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-[#990000] border border-red-100 rounded-full text-xs font-black uppercase tracking-wider mb-2">
                <Compass size={14} /> Sektörel Rehber
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Kariyer Hedefinizi Seçin veya Belirleyin
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Hedef sektörünüze göre hazırlanmış 4 aşamalı resmi müfredat ile görevlerinizi tamamlayın.
              </p>
            </div>

            {/* Custom Input */}
            <div className="w-full md:w-80 flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1.5 focus-within:border-[#990000] focus-within:ring-2 focus-within:ring-red-100 transition-all">
              <input 
                type="text"
                placeholder="Farklı bir hedef yazın..."
                value={dreamRole}
                onChange={(e) => setDreamRole(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCustomGenerate()}
                className="flex-1 bg-transparent px-3 text-xs sm:text-sm text-gray-800 outline-none placeholder-gray-400 font-medium"
              />
              <button 
                onClick={handleCustomGenerate}
                disabled={!dreamRole.trim() || isGenerating}
                className="bg-[#990000] hover:bg-red-800 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
              >
                {isGenerating ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
                <span>Oluştur</span>
              </button>
            </div>
          </div>

          {/* Sector Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {PRESET_SECTORS.map((sec) => {
              const isSelected = selectedSectorId === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => handleSelectSector(sec.id)}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-red-50/70 border-[#990000] text-gray-900 shadow-xs' 
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/70 text-gray-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
                    isSelected ? 'bg-[#990000] text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {sec.icon}
                  </div>
                  <span className="text-xs font-bold leading-tight">{sec.name}</span>
                  <span className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{sec.role}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* PROGRESS CARD */}
        <div className="bg-linear-to-r from-[#990000] via-[#850000] to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-red-200 uppercase tracking-wider">Hedef İlerlemesi</span>
            <h3 className="text-lg sm:text-xl font-black">{roadmap?.title}</h3>
            <p className="text-xs text-red-100">
              Tamamlanan: <span className="font-bold text-white">{completedCount} / {totalTasks} Görev</span> (%{percent})
            </p>
          </div>

          <div className="w-full sm:w-60 flex flex-col gap-2">
            <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden p-0.5">
              <div 
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-red-200 font-semibold">
              <span>Başlangıç</span>
              <span>Hedefe Ulaşma</span>
            </div>
          </div>
        </div>

        {/* LOADING STATE */}
        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-200/80 p-8 shadow-xs">
            <div className="w-16 h-16 bg-red-50 text-[#990000] rounded-2xl flex items-center justify-center mb-4 animate-pulse">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-1">Kariyer Rotanız Hazırlanıyor...</h3>
            <p className="text-sm text-gray-500 max-w-md">
              Sektörel yetkinlik gereksinimleri ve mezun başarı verileri harmanlanarak 4 aşamalı gelişim planınız oluşturuluyor.
            </p>
          </div>
        )}

        {/* ROADMAP TIMELINE */}
        {!isGenerating && roadmap && (
          <div className="space-y-6">
            {roadmap.phases.map((phase, pIdx) => {
              const phaseTasks = phase.tasks || [];
              const phaseCompletedCount = phaseTasks.filter((_, tIdx) => completedTasks[`${roadmap.title}_${pIdx}_${tIdx}`]).length;
              const isPhaseDone = phaseTasks.length > 0 && phaseCompletedCount === phaseTasks.length;

              return (
                <div 
                  key={phase.id}
                  className={`bg-white rounded-2xl border transition-all p-5 sm:p-7 shadow-xs ${
                    isPhaseDone ? 'border-emerald-200 bg-emerald-50/10' : 'border-gray-200/80 hover:border-gray-300'
                  }`}
                >
                  {/* Phase Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${
                        isPhaseDone ? 'bg-emerald-600 text-white' : 'bg-[#990000] text-white shadow-xs'
                      }`}>
                        {isPhaseDone ? <CheckCircle2 size={20} /> : `Faz ${phase.id}`}
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                          {phase.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">{phase.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
                        <CalendarClock size={13} className="text-slate-500" /> {phase.timeframe}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        isPhaseDone ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {phaseCompletedCount} / {phaseTasks.length}
                      </span>
                    </div>
                  </div>

                  {/* Task List (Interactive Checkboxes) */}
                  <div className="space-y-2.5">
                    {phaseTasks.map((task, tIdx) => {
                      const taskKey = `${roadmap.title}_${pIdx}_${tIdx}`;
                      const isChecked = Boolean(completedTasks[taskKey]);

                      return (
                        <div
                          key={tIdx}
                          onClick={() => toggleTask(taskKey)}
                          className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                            isChecked 
                              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' 
                              : 'bg-slate-50/60 border-slate-200/80 hover:bg-white hover:border-gray-300 text-gray-800'
                          }`}
                        >
                          <button 
                            type="button" 
                            className="mt-0.5 shrink-0 text-gray-400 hover:text-[#990000] transition"
                          >
                            {isChecked ? (
                              <CheckSquare size={18} className="text-emerald-600" />
                            ) : (
                              <Square size={18} className="text-gray-400" />
                            )}
                          </button>
                          <span className={`text-xs sm:text-sm font-medium leading-relaxed select-none ${
                            isChecked ? 'line-through text-gray-500' : 'text-gray-800'
                          }`}>
                            {task}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* BOTTOM COMPLETION CALLOUT */}
        <div className="mt-8 text-center p-6 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-red-50 text-[#990000] rounded-xl mb-3 shadow-xs">
            <Award size={24} />
          </div>
          <h4 className="text-base font-bold text-gray-900">Kariyer Danışmanlığı & Doğrulama</h4>
          <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto mt-1 leading-relaxed">
            Tamamladığınız adımlar KGB (Kariyer Gelişim Belgesi) karnenize yansır. Resmi staj ve iş başvurularında bu adımlar portfolyonuzun temelini oluşturur.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button 
              onClick={() => setView('jobs')} 
              className="px-5 py-2.5 bg-[#990000] hover:bg-red-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Staj & İş Fırsatlarını İncele
            </button>
            <button 
              onClick={() => setView('student_kgb')} 
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              KGB Karnemi Görüntüle
            </button>
          </div>
        </div>

      </main>

      {/* FLOATING BOTTOM DOCK */}
      <SubPanelFloatingDock 
        currentUser={currentUser} 
        setView={setView} 
        setSelectedUserId={setSelectedUserId}
        userRole={userRole}
      />
    </div>
  );
}
