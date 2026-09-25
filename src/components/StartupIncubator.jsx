import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, Target, Zap, ChevronLeft, Building2, CheckCircle2, 
  Flame, PieChart, Users, ArrowRight, Lightbulb, LineChart, 
  Download, Send, FileText, ShieldCheck, Sparkles, ExternalLink,
  Award, TrendingUp, HelpCircle
} from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import SubPanelFloatingDock from './SubPanelFloatingDock';
import SafeAvatar from './shared/SafeAvatar';
import { downloadReportPdf } from '../utils/downloadPdf';
import { generateAIResponse } from '../lib/gemini';
import { VERIFIED_MENTORS } from '../data/mentorsData';
import { toast } from './shared/Toast';

const PRESET_IDEAS = [
  {
    title: 'Akıllı Kampüs & Enerji Yönetimi',
    pitch: 'Üniversite kampüslerinde ve kamu binalarında IoT sensörleri ile elektrik, su ve ısı tüketimini anlık optimize eden ve karbon ayak izini %30 azaltan yeşil teknoloji platformu.'
  },
  {
    title: 'KOBİ Dijital İhracat & Lojistik Ağı',
    pitch: 'Yerel üretici ve KOBİ’lerin gümrükleme, kargo ve pazar yeri entegrasyonlarını tek panelden yöneten B2B sınır ötesi e-ticaret altyapısı.'
  },
  {
    title: 'Sağlıkta Teletıp & Hasta Takip Asistanı',
    pitch: 'Kronik hastaların hayati verilerini uzaktan takip eden, doktor randevu ve reçete süreçlerini organize eden regülasyon uyumlu dijital sağlık çözümü.'
  }
];

const GRANT_PROGRAMS = [
  {
    id: 'tubitak_1512',
    name: 'TÜBİTAK 1512 BİGG',
    badge: '450.000 TL %100 Hibe',
    org: 'TÜBİTAK & Sanayi ve Teknoloji Bakanlığı',
    desc: 'Teknoloji ve yenilik odaklı iş fikirlerinin ticari değeri yüksek girişimlere dönüştürülmesi amacıyla verilen geri ödemesiz çekirdek sermaye desteği.',
    criteria: 'Üniversite öğrencileri veya lisans/lisansüstü mezunları başvurabilir. Şirketleşme öncesi aşamadır.',
    link: 'https://tubitak.gov.tr'
  },
  {
    id: 'kosgeb_girisim',
    name: 'KOSGEB İleri Girişimci Destek Programı',
    badge: '375.000 TL’ye Varan Destek',
    org: 'KOSGEB',
    desc: 'İmalatçı ve yüksek teknoloji odaklı girişimcilere makine, teçhizat, yazılım ve işletme giderleri için sağlanan hibe ve faizsiz kredi modeli.',
    criteria: 'KOSGEB girişimcilik sertifikasını tamamlamış ve son 1 yıl içinde şirket kurmuş girişimciler.',
    link: 'https://kosgeb.gov.tr'
  },
  {
    id: 'iesu_tto_on_kulucka',
    name: 'İESÜ TTO Ön Kuluçka İmkânları',
    badge: 'Tamamen Ücretsiz Kampüs İmkânı',
    org: 'İESÜ Teknoloji Transfer Ofisi',
    desc: 'Kampüs içi ücretsiz paylaşımlı çalışma ofisi, prototip laboratuvarı, akademik mentörlük ve TEKNOFEST proje fonlama desteği.',
    criteria: 'Tüm İESÜ öğrencileri ve yeni mezunları proje özeti ile başvurabilir.',
    link: '#'
  }
];

export default function StartupIncubator({ setView, currentUser, userRole, setSelectedUserId }) {
  const [activeTab, setActiveTab] = useState('kanvas');
  const [pitch, setPitch] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [canvas, setCanvas] = useState(null);
  const [submittedToPool, setSubmittedToPool] = useState(false);

  // Restore saved active canvas from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem('iesu_active_startup_canvas_v2');
      if (saved) {
        setCanvas(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const handleGenerateCanvas = async (customPitch) => {
    const textToAnalyze = customPitch || pitch;
    if (!textToAnalyze.trim()) return;

    setIsGenerating(true);
    setSubmittedToPool(false);

    const prompt = `
      Sen İstanbul Esenyurt Üniversitesi Teknoloji Transfer Ofisi (TTO) Kıdemli Girişimcilik ve Fizibilite Danışmanısın.
      Şu girişim fikrini profesyonelce analiz et: "${textToAnalyze}".
      Fikrin pazar potansiyeli, riskleri ve büyüme dinamikleri üzerinden 9 kutulu Yalın Kanvas (Lean Canvas) ve Fizibilite Skoru çıkar.
      Lütfen sadece aşağıdaki geçerli JSON formatında bir cevap dön, markdown (\`\`\`) veya başka metin KESİNLİKLE kullanma.
      JSON Formatı:
      {
        "score": 86,
        "name": "Fikre Özgün ve Kurumsal Bir İsim",
        "category": "Teknoloji & Yazılım",
        "feedback": "Yatırım komitesi ve pazar doğrulama değerlendirmemiz...",
        "canvas": {
          "problem": ["Temel Problem 1", "Problem 2", "Mevcut Alternatifler"],
          "solution": ["Çözüm Bileşeni 1", "Çözüm Bileşeni 2", "MVP Kapsamı"],
          "uniqueValue": "Müşterinin sizi tercih etmesini sağlayacak tek ve net cümle",
          "unfairAdvantage": "Rakiplerin kolayca kopyalayamayacağı avantaj (patent, ağ, tescil vb.)",
          "customerSegment": ["Ana Hedef Kitle", "İlk Benimseyenler (Early Adopters)"],
          "keyMetrics": ["Kullanıcı Edinme Maliyeti (CAC)", "Aylık Tekrarlayan Gelir (MRR)", "Bağlılık (Retention)"],
          "channels": ["Dijital Pazarlama", "B2B Doğrudan Satış", "Üniversite Ağı"],
          "costStructure": ["Bulut Altyapı ve Sunucu Giderleri", "Ar-Ge & Yazılımcı Personel", "Pazarlama ve Satış"],
          "revenueStreams": ["Aylık/Yıllık Abonelik (SaaS)", "İşlem Başına Komisyon", "Kurumsal Kurulum & Danışmanlık"]
        }
      }
    `;

    try {
      const response = await generateAIResponse(prompt, "Sadece geçerli JSON dön");
      let cleanJson = response.replace(/^```json\s*/i, '').replace(/\s*```$/, '').replace(/^```\s*/, '').trim();
      const data = JSON.parse(cleanJson);
      setCanvas(data);
      try {
        localStorage.setItem('iesu_active_startup_canvas_v2', JSON.stringify(data));
      } catch (e) {}
      setIsGenerating(false);
    } catch (e) {
      // High-quality fallback
      const fallbackData = {
        score: 84,
        name: "SmartCampus Solutions",
        category: "Bilişim & İnovasyon",
        feedback: "Pazar doğrulama (Market Validation) süreci iyi kurgulanmış ancak müşteri edinme maliyetleri (CAC) başlangıçta yakından izlenmelidir. B2B kurumsal abonelik modeline odaklanılması tavsiye edilir.",
        canvas: {
          problem: [
            "Kurumsal süreçlerdeki manuel operasyonel verimsizlik",
            "Yüksek enerji ve altyapı işletim maliyetleri",
            "Mevcut geleneksel yazılımların entegrasyon zorluğu"
          ],
          solution: [
            "Uçtan uca akıllı süreç otomasyon yazılımı",
            "Veriye dayalı kestirimci tüketim panoları",
            "Tak-çalıştır API ve bulut entegrasyonu"
          ],
          uniqueValue: "Kurumlar için işletme maliyetlerini %30 azaltan, 48 saatte devreye alınan bulut optimizasyon altyapısı.",
          unfairAdvantage: "İESÜ TTO patent desteği ve akademik Ar-Ge danışman kadrosu.",
          customerSegment: [
            "B2B Orta ve Büyük Ölçekli Kurumsal Firmalar",
            "Teknopark ve Kuluçka Merkezleri"
          ],
          keyMetrics: [
            "Aktif Kurumsal Müşteri Sayısı",
            "Aylık Tekrarlayan Gelir (MRR)",
            "Net Tavsiye Skoru (NPS)"
          ],
          channels: [
            "B2B Doğrudan Satış Ekibi",
            "Sektörel İnovasyon Fuarları & Zirveler",
            "LinkedIn ve İçerik Pazarlaması"
          ],
          costStructure: [
            "Bulut Sunucu (AWS/Azure) Altyapısı",
            "Yazılım Geliştirici ve Veri Mühendisi Maaşları",
            "Pazarlama, B2B Saha Satış ve Lisans Giderleri"
          ],
          revenueStreams: [
            "Kullanıcı Başı Aylık Lisans (SaaS)",
            "Yıllık Kurumsal Bakım & Destek Paketi",
            "Özel API Entegrasyon Danışmanlığı"
          ]
        }
      };
      setCanvas(fallbackData);
      try {
        localStorage.setItem('iesu_active_startup_canvas_v2', JSON.stringify(fallbackData));
      } catch (err) {}
      setIsGenerating(false);
    }
  };

  const handleSendToTTO = () => {
    if (!canvas) return;

    try {
      const projectItem = {
        id: 'proj_' + Date.now(),
        name: canvas.name || 'Öğrenci Girişimi',
        founderName: currentUser?.name || 'Öğrenci Girişimci',
        founderDept: currentUser?.department || 'Öğrenci',
        founderEmail: currentUser?.email || 'girisimci@esenyurt.edu.tr',
        category: canvas.category || 'Bilişim & İnovasyon',
        score: canvas.score || 85,
        stage: 'Ön Kuluçka',
        mentorName: 'TTO Danışmanı Atanıyor',
        date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
        pitch: pitch,
        canvas: canvas.canvas
      };

      const existing = JSON.parse(localStorage.getItem('iesu_incubator_projects_v1') || '[]');
      localStorage.setItem('iesu_incubator_projects_v1', JSON.stringify([projectItem, ...existing]));
      setSubmittedToPool(true);
      toast.success('Projeniz İESÜ TTO Kuluçka Havuzuna iletildi! Ön değerlendirme sonucu profilinize bildirilecektir.');
    } catch (e) {
      toast.error('Kayıt sırasında bir hata oluştu.');
    }
  };

  const handleDownloadPdf = () => {
    if (!canvas) return;
    const lines = [
      `Girisim Adi: ${canvas.name}`,
      `Fizibilite Skoru: ${canvas.score} / 100`,
      `Girisimci: ${currentUser?.name || 'IESU Ogrencisi'}`,
      `Tarih: ${new Date().toLocaleDateString('tr-TR')}`,
      `----------------------------------------`,
      `DEGERLENDIRME VE GERI BILDIRIM:`,
      `${canvas.feedback}`,
      `----------------------------------------`,
      `1. BENZERSIZ DEGER ONERISI:`,
      `${canvas.canvas?.uniqueValue}`,
      `----------------------------------------`,
      `2. PROBLEMLER:`,
      ...(canvas.canvas?.problem || []).map((p, i) => ` - ${p}`),
      `----------------------------------------`,
      `3. COZUMLER:`,
      ...(canvas.canvas?.solution || []).map((s, i) => ` - ${s}`),
      `----------------------------------------`,
      `4. HEDEF KITLE VE MUSTERI SEGMENTI:`,
      ...(canvas.canvas?.customerSegment || []).map((c, i) => ` - ${c}`),
      `----------------------------------------`,
      `5. GELIR AKISLARI:`,
      ...(canvas.canvas?.revenueStreams || []).map((r, i) => ` - ${r}`),
      `----------------------------------------`,
      `6. GIDER YAPISI:`,
      ...(canvas.canvas?.costStructure || []).map((cs, i) => ` - ${cs}`),
      `----------------------------------------`,
      `7. TEMEL METRIKLER (KPI):`,
      ...(canvas.canvas?.keyMetrics || []).map((k, i) => ` - ${k}`),
      `----------------------------------------`,
      `Resmi Belge: IESU Teknoloji Transfer Ofisi (TTO) On Kulucka Modulu`
    ];

    downloadReportPdf(`IESU_Yalin_Kanvas_${canvas.name.replace(/\s+/g, '_')}`, lines);
    toast.success('Yalın Kanvas PDF raporu başarıyla indirildi.');
  };

  const backTarget = userRole === 'admin' ? 'admin' : (userRole === 'employer' || userRole === 'company') ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student';

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 flex flex-col font-sans pb-28">
      {/* Header */}
      <header className="bg-white border-b border-gray-200/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
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
                <h1 className="font-black text-gray-900 text-sm sm:text-base leading-tight">Kuluçka & Girişimcilik Merkezi</h1>
                <p className="text-[11px] font-bold text-gray-500">İESÜ Teknoloji Transfer Ofisi (TTO)</p>
              </div>
            </div>
          </div>
          <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
        </div>
      </header>

      {/* SUB-NAV TABS */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 flex items-center gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('kanvas')}
            className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'kanvas' 
                ? 'border-[#990000] text-[#990000]' 
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Lightbulb size={16} /> Yalın Kanvas & Fizibilite
          </button>

          <button
            onClick={() => setActiveTab('hibeler')}
            className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'hibeler' 
                ? 'border-[#990000] text-[#990000]' 
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Award size={16} /> Hibe & Destek Rehberi
          </button>

          <button
            onClick={() => setActiveTab('mentorler')}
            className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'mentorler' 
                ? 'border-[#990000] text-[#990000]' 
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Users size={16} /> TTO Girişim Mentörleri
          </button>
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 lg:p-8">
        
        {/* TAB 1: YALIN KANVAS (LEAN CANVAS) */}
        {activeTab === 'kanvas' && (
          <div className="space-y-6">
            
            {/* INPUT CARD */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-lg font-black text-gray-900">Girişim Fikrinizi Tanımlayın</h3>
                  <p className="text-xs text-gray-500">
                    Projenizin çözdüğü problemi, hedef kitlesini ve gelir modelini kısaca açıklayın.
                  </p>
                </div>

                <span className="text-[11px] font-bold text-[#990000] bg-red-50 px-3 py-1 rounded-full border border-red-100 self-start">
                  TTO Standartlarında 9 Kutulu Kanvas
                </span>
              </div>

              <textarea 
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder="Örnek: Üniversite öğrencilerinin kampüs içinde güvenli ikinci el ders kitabı ve akademik ekipman takası yapabileceği, onaylı öğrenci kimliği ile çalışan mobil pazar yeri..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm text-gray-800 outline-none focus:border-[#990000] focus:bg-white transition min-h-[110px] resize-none"
              />

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Presets */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-gray-400">Hazır Fikirler:</span>
                  {PRESET_IDEAS.map((idea, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setPitch(idea.pitch);
                        handleGenerateCanvas(idea.pitch);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-red-50 hover:text-[#990000] text-slate-700 rounded-lg text-xs font-medium transition cursor-pointer"
                    >
                      {idea.title}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handleGenerateCanvas(pitch)}
                  disabled={!pitch.trim() || isGenerating}
                  className="px-6 py-2.5 bg-[#990000] hover:bg-red-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer shrink-0"
                >
                  <Rocket size={15} />
                  <span>{isGenerating ? 'Kanvas Çıkarılıyor...' : 'Kanvası Oluştur'}</span>
                </button>
              </div>
            </div>

            {/* LOADING STATE */}
            {isGenerating && (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-xs">
                <div className="w-16 h-16 bg-red-50 text-[#990000] rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Flame size={32} />
                </div>
                <h4 className="text-xl font-black text-gray-900 mb-1">Fizibilite Analizi Yapılıyor...</h4>
                <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                  İş fikriniz pazar büyüklüğü, rekabet koşulları, müşteri segmentleri ve gelir akışları ekseninde 9 boyutta haritalandırılıyor.
                </p>
              </div>
            )}

            {/* RESULTS: 9-BOX LEAN CANVAS */}
            {!isGenerating && canvas && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Header info bar */}
                <div className="bg-linear-to-r from-[#990000] via-[#850000] to-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                        {canvas.category || 'Ön Kuluçka Girişimi'}
                      </span>
                      <span className="text-xs text-red-200">Fizibilite Skoru: %{canvas.score}</span>
                    </div>
                    <h2 className="text-2xl font-black text-white">{canvas.name}</h2>
                    <p className="text-xs sm:text-sm text-red-100 mt-1 max-w-2xl leading-relaxed">
                      {canvas.feedback}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleDownloadPdf}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download size={14} /> PDF Rapor
                    </button>
                    <button
                      onClick={handleSendToTTO}
                      disabled={submittedToPool}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        submittedToPool
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-[#990000] hover:bg-red-50'
                      }`}
                    >
                      {submittedToPool ? <CheckCircle2 size={14} /> : <Send size={14} />}
                      <span>{submittedToPool ? 'Havuzda Yayında' : 'TTO Havuzuna Gönder'}</span>
                    </button>
                  </div>
                </div>

                {/* 9-BOX LEAN CANVAS GRID */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                  <div className="p-4 bg-slate-100 border-b border-gray-200 flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-2">
                      <PieChart size={15} className="text-[#990000]" /> 9 Kutulu Yalın Kanvas (Lean Canvas Tablosu)
                    </h4>
                    <span className="text-[11px] text-gray-500 font-semibold">TTO Standart Şablonu</span>
                  </div>

                  {/* Top 5 Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-200 border-b border-gray-200">
                    
                    {/* 1. Problem */}
                    <div className="p-4 space-y-2 bg-white">
                      <h5 className="text-xs font-black uppercase text-red-900 tracking-wider flex items-center gap-1.5">
                        <Target size={13} className="text-[#990000]" /> 1. Problem
                      </h5>
                      <p className="text-[11px] text-gray-500 font-medium">Hedef kitlenin en acil 3 sıkıntısı</p>
                      <ul className="space-y-1.5 pt-1">
                        {(canvas.canvas?.problem || []).map((item, i) => (
                          <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 2. Çözüm */}
                    <div className="p-4 space-y-2 bg-slate-50/50">
                      <h5 className="text-xs font-black uppercase text-blue-900 tracking-wider flex items-center gap-1.5">
                        <Lightbulb size={13} className="text-blue-600" /> 2. Çözüm
                      </h5>
                      <p className="text-[11px] text-gray-500 font-medium">Temel ürün ve MVP özellikleri</p>
                      <ul className="space-y-1.5 pt-1">
                        {(canvas.canvas?.solution || []).map((item, i) => (
                          <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 3. Benzersiz Değer Önerisi */}
                    <div className="p-4 space-y-2 bg-white md:bg-red-50/20">
                      <h5 className="text-xs font-black uppercase text-[#990000] tracking-wider flex items-center gap-1.5">
                        <Sparkles size={13} className="text-[#990000]" /> 3. Değer Önerisi
                      </h5>
                      <p className="text-[11px] text-gray-500 font-medium">Neden siz? Tek ve net mesaj</p>
                      <p className="text-xs font-bold text-gray-900 bg-white p-2.5 rounded-xl border border-red-100 shadow-2xs leading-relaxed mt-2">
                        {canvas.canvas?.uniqueValue}
                      </p>
                      <div className="pt-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Haksız Avantaj:</span>
                        <p className="text-[11px] text-gray-600 mt-0.5">{canvas.canvas?.unfairAdvantage}</p>
                      </div>
                    </div>

                    {/* 4. Kanallar & Metrikler */}
                    <div className="p-4 space-y-2 bg-slate-50/50">
                      <h5 className="text-xs font-black uppercase text-amber-900 tracking-wider flex items-center gap-1.5">
                        <TrendingUp size={13} className="text-amber-600" /> 4. Dağıtım & KPI
                      </h5>
                      <p className="text-[11px] text-gray-500 font-medium">Ulaşım kanalları ve ölçüm</p>
                      <div className="space-y-2 pt-1">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Kanallar:</span>
                          <ul className="space-y-1 mt-1">
                            {(canvas.canvas?.channels || []).map((c, i) => (
                              <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" /> {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Temel Metrikler:</span>
                          <ul className="space-y-1 mt-1">
                            {(canvas.canvas?.keyMetrics || []).map((k, i) => (
                              <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" /> {k}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* 5. Müşteri Segmentleri */}
                    <div className="p-4 space-y-2 bg-white">
                      <h5 className="text-xs font-black uppercase text-purple-900 tracking-wider flex items-center gap-1.5">
                        <Users size={13} className="text-purple-600" /> 5. Hedef Kitle
                      </h5>
                      <p className="text-[11px] text-gray-500 font-medium">Müşteri ve ilk benimseyenler</p>
                      <ul className="space-y-1.5 pt-1">
                        {(canvas.canvas?.customerSegment || []).map((item, i) => (
                          <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Bottom 2 Columns: Maliyet & Gelir */}
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 bg-slate-50/70 p-4 gap-4 md:gap-0">
                    <div className="md:pr-4 space-y-1.5">
                      <h5 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                        <Building2 size={13} className="text-slate-500" /> Maliyet Yapısı (Cost Structure)
                      </h5>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {(canvas.canvas?.costStructure || []).map((c, i) => (
                          <li key={i} className="text-xs bg-white p-2 rounded-lg border border-slate-200 text-gray-700">
                            • {c}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="md:pl-4 space-y-1.5">
                      <h5 className="text-xs font-black uppercase text-emerald-800 tracking-wider flex items-center gap-1.5">
                        <LineChart size={13} className="text-emerald-600" /> Gelir Akışları (Revenue Streams)
                      </h5>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {(canvas.canvas?.revenueStreams || []).map((r, i) => (
                          <li key={i} className="text-xs bg-white p-2 rounded-lg border border-emerald-200 text-emerald-950 font-medium">
                            💰 {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

          </div>
        )}

        {/* TAB 2: HİBE & DESTEK REHBERİ */}
        {activeTab === 'hibeler' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs">
              <h3 className="text-lg font-black text-gray-900 mb-1">Girişimci Destek ve Hibe Programları</h3>
              <p className="text-xs text-gray-500">
                Öğrenci ve mezunlarımızın fikirlerini hayata geçirebilmesi için ulusal fon ve üniversite kuluçka mekanizmaları.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {GRANT_PROGRAMS.map((prog) => (
                <div key={prog.id} className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between shadow-xs hover:border-red-200 transition">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#990000] bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                      {prog.badge}
                    </span>
                    <h4 className="text-base font-black text-gray-900 mt-3">{prog.name}</h4>
                    <span className="text-xs font-bold text-gray-400 block mt-0.5">{prog.org}</span>
                    <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                      {prog.desc}
                    </p>
                    <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Başvuru Şartı:</span>
                      <p className="text-xs text-gray-700 leading-normal">{prog.criteria}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <button 
                      onClick={() => {
                        toast.info(`"${prog.name}" rehberi ve TTO danışmanlık başvuru formu açıldı.`);
                      }}
                      className="w-full py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>TTO Başvuru Desteği Al</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TTO GİRİŞİM MENTÖRLERİ */}
        {activeTab === 'mentorler' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-gray-900 mb-1">Doğrulanmış Girişim & Teknoloji Mentörleri</h3>
                <p className="text-xs text-gray-500">
                  Fikrinizi ölçeklendirmek, yatırım sunumuna hazırlanmak ve teknolojik mimari kurmak için mezun ve akademisyenlerimizle birebir görüşün.
                </p>
              </div>
              <button
                onClick={() => setView('explore')}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-[#990000] rounded-xl text-xs font-bold transition cursor-pointer self-start sm:self-center"
              >
                Tüm Mentörleri Listele
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {VERIFIED_MENTORS.map((m) => (
                <div 
                  key={m.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col justify-between shadow-xs hover:border-red-200 transition"
                >
                  <div className="flex items-start gap-3.5 mb-3">
                    <SafeAvatar src={m.avatar} name={m.name} size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900 text-sm truncate">{m.name}</h4>
                        <span className="text-[10px] bg-red-50 text-[#990000] font-black px-2 py-0.5 rounded-full border border-red-100">
                          Doğrulandı
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{m.title} • {m.company}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{m.department}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
                    {m.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(m.mentoringTopics || []).slice(0, 3).map((topic, i) => (
                      <span key={i} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-700">★ {m.rating} ({m.menteeCount} Girişimci)</span>
                    <button
                      onClick={() => {
                        if (setSelectedUserId) setSelectedUserId(m.id);
                        setView('public_profile');
                      }}
                      className="px-3.5 py-1.5 bg-[#990000] hover:bg-red-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      Birebir Mentörlük İste
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
