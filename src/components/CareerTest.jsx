import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, ArrowRight, ChevronLeft, Target, Award, Sparkles, 
  Zap, Rocket, Star, CheckCircle2, Compass, Users, BookOpen,
  Briefcase, RotateCcw, ExternalLink
} from 'lucide-react';
import TopProfileMenu from './TopProfileMenu';
import Logo from './Logo';
import SubPanelFloatingDock from './SubPanelFloatingDock';
import SafeAvatar from './shared/SafeAvatar';
import { VERIFIED_MENTORS } from '../data/mentorsData';

const FORM_QUESTIONS = [
  {
    id: 1,
    category: "Problem Çözme & Analiz",
    question: "Karmaşık bir teknik veya operasyonel problemle karşılaştığınızda ilk yaklaşımınız nedir?",
    options: [
      { text: "Verileri ve geçmiş istatistikleri detaylıca inceler, mantıksal bir kök-neden analiz şeması çıkarırım.", traits: { logic: 10, practical: 4 } },
      { text: "Alışılagelmişin dışında, yenilikçi ve sıra dışı alternatif modeller düşünürüm.", traits: { creative: 10, social: 3 } },
      { text: "Ekip arkadaşlarımla hızlıca bir araya gelip beyin fırtınası yapar, ortak akılla ilerlerim.", traits: { social: 10, logic: 3 } },
      { text: "Hızlıca sahaya iner, en pratik çözümü doğrudan uygulayarak deneme-yanılma ile sonuç alırım.", traits: { practical: 10, logic: 4 } }
    ]
  },
  {
    id: 2,
    category: "Çalışma Ortamı Tercihi",
    question: "Size en yüksek motivasyonu ve odaklanmayı sağlayan çalışma ekosistemi nasıldır?",
    options: [
      { text: "Süreçleri, kuralları ve performans kriterleri net olarak tanımlanmış düzenli kurumsal yapı.", traits: { logic: 9, practical: 5 } },
      { text: "Özgürce fikir üretebileceğim, yaratıcı deneyler yapabileceğim dinamik inovasyon alanı.", traits: { creative: 10, practical: 3 } },
      { text: "İletişimin, ortak hedeflerin ve dayanışmanın yüksek olduğu sıcak bir takım ortamı.", traits: { social: 10, creative: 4 } },
      { text: "Hızlı tempolu, sonuç odaklı, anlık kararların alındığı rekabetçi saha ortamı.", traits: { practical: 10, logic: 3 } }
    ]
  },
  {
    id: 3,
    category: "Öğrenme & Gelişim Tarzı",
    question: "Yeni bir uzmanlık alanını veya sektörel aracı öğrenirken hangi yöntem sizin için daha verimlidir?",
    options: [
      { text: "Teknik dokümanları, akademik makaleleri ve mimari kılavuzları derinlemesine okumak.", traits: { logic: 10, practical: 2 } },
      { text: "Örnek tasarım ve konseptleri inceleyip kendi özgün yaklaşımımı tasarlamak.", traits: { creative: 10, social: 2 } },
      { text: "Mentorluk almak, grup atölyelerine ve interaktif panellere katılmak.", traits: { social: 10, practical: 4 } },
      { text: "Canlı bir projede doğrudan kod yazarak veya uygulayarak tecrübe edinmek.", traits: { practical: 10, logic: 4 } }
    ]
  },
  {
    id: 4,
    category: "Liderlik & Rol Dağılımı",
    question: "Bir üniversite projesinde veya kurumsal takımda görev aldığınızda hangi rolde daha başarılısınız?",
    options: [
      { text: "Stratejik planlamayı, risk analizini ve bütçe/zaman çizelgesini yöneten koordinatör.", traits: { logic: 10, practical: 4 } },
      { text: "Projenin vizyonunu, tasarım dilini ve yaratıcı yönünü belirleyen konsept lideri.", traits: { creative: 10, logic: 2 } },
      { text: "Ekip üyelerinin motivasyonunu artıran, sunum ve dış paydaş ilişkilerini yürüten sözcü.", traits: { social: 10, creative: 4 } },
      { text: "İşlerin fiilen tamamlanmasını, teslimatların aksamamasını sağlayan operasyon lideri.", traits: { practical: 10, social: 3 } }
    ]
  },
  {
    id: 5,
    category: "Karar Alma Mekanizması",
    question: "Kritik bir kariyer veya proje kararı alırken en çok neye dayanırsınız?",
    options: [
      { text: "Sayısal verilere, karşılaştırmalı tablolara ve somut başarı olasılıklarına.", traits: { logic: 10, practical: 3 } },
      { text: "Geleceğin trendlerine dair sezgilerime ve yaratıcı potansiyelin gücüne.", traits: { creative: 10, social: 3 } },
      { text: "Görüşlerine güvendiğim uzmanların, hocalarımın ve mentörlerimin tavsiyelerine.", traits: { social: 10, logic: 4 } },
      { text: "Sahadaki mevcut uygulanabilirliğe ve anında getireceği pratik faydaya.", traits: { practical: 10, logic: 4 } }
    ]
  },
  {
    id: 6,
    category: "Kriz & Değişim Yönetimi",
    question: "Beklenmeyen bir aksilik veya kriz durumunda ilk tepkiniz ne olur?",
    options: [
      { text: "Soğukkanlı kalarak problemin kaynaklarını adım adım listeler ve B planını devreye alırım.", traits: { logic: 10, practical: 5 } },
      { text: "Durumu farklı bir perspektife çevirerek krizden yeni ve yaratıcı bir fırsat çıkarırım.", traits: { creative: 10, social: 3 } },
      { text: "Ekibin moralini yüksek tutar, iletişimi kesintisiz sağlayarak paniği önlerim.", traits: { social: 10, logic: 3 } },
      { text: "Vakit kaybetmeden acil müdahalede bulunur ve geçici çözümü derhal uygularım.", traits: { practical: 10, logic: 3 } }
    ]
  },
  {
    id: 7,
    category: "Kariyer Motivasyonu",
    question: "5 yıl sonraki kariyerinizde sizi en çok hangisi gururlandırır?",
    options: [
      { text: "Milyonların kullandığı karmaşık, hatasız ve güvenilir bir sistemin baş mimarı olmak.", traits: { logic: 10, creative: 4 } },
      { text: "Sektörde çığır açan, ödüllü ve ilham verici bir ürün veya marka yaratmış olmak.", traits: { creative: 10, practical: 3 } },
      { text: "Geniş bir profesyonel ağa sahip, yüzlerce kişiye dokunan bir yönetici olmak.", traits: { social: 10, creative: 3 } },
      { text: "Büyük bir operasyonu uçtan uca başarıyla yöneten, yüksek kârlılık sağlayan lider olmak.", traits: { practical: 10, logic: 4 } }
    ]
  },
  {
    id: 8,
    category: "Sunum & İletişim Tarzı",
    question: "Hazırladığınız bir çalışmayı üst yönetime veya jüriye sunarken odak noktanız nedir?",
    options: [
      { text: "Kanıtlanmış rakamlar, metodoloji detayı ve ölçülebilir başarı metrikleri.", traits: { logic: 10, practical: 3 } },
      { text: "Etkileyici görsel dil, hikayeleştirme ve izleyicide bırakılacak vizyoner etki.", traits: { creative: 10, social: 4 } },
      { text: "İzleyiciyle kurulan samimi göz teması, soru-cevap etkileşimi ve empati.", traits: { social: 10, logic: 2 } },
      { text: "Hemen hayata geçirilebilecek aksiyon planı, maliyet ve somut teslim tarihleri.", traits: { practical: 10, logic: 4 } }
    ]
  }
];

export default function CareerTest({ setView, currentUser, userRole, setSelectedUserId }) {
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Restore saved results from local storage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('iesu_career_test_result_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.answers && Object.keys(parsed.answers).length === FORM_QUESTIONS.length) {
          setAnswers(parsed.answers);
          setIsSubmitted(true);
        }
      }
    } catch (e) {}
  }, []);

  const handleSelectOption = (questionId, traits, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { traits, optionIndex }
    }));
  };

  const calculateScores = () => {
    const raw = { logic: 0, creative: 0, social: 0, practical: 0 };
    Object.values(answers).forEach(ans => {
      if (ans.traits) {
        raw.logic += ans.traits.logic || 0;
        raw.creative += ans.traits.creative || 0;
        raw.social += ans.traits.social || 0;
        raw.practical += ans.traits.practical || 0;
      }
    });

    const total = (raw.logic + raw.creative + raw.social + raw.practical) || 1;
    return {
      raw,
      percent: {
        logic: Math.round((raw.logic / total) * 100),
        creative: Math.round((raw.creative / total) * 100),
        social: Math.round((raw.social / total) * 100),
        practical: Math.round((raw.practical / total) * 100),
      }
    };
  };

  const { raw: rawScores, percent: percentScores } = calculateScores();

  const getPersona = () => {
    const maxTrait = Object.keys(rawScores).reduce((a, b) => rawScores[a] > rawScores[b] ? a : b, 'logic');
    
    if (maxTrait === 'logic') {
      return {
        trait: 'logic',
        title: 'Sistem Mimarı & Analitik Stratejist',
        badge: 'Yüksek Analitik Yatkınlık',
        desc: 'Karmaşık yapıları matematiksel bir titizlikle çözümleyen, veri odaklı ve mantıksal planlama gücü yüksek lider karakter.',
        paths: [
          'Yazılım & Sistem Mimarisi',
          'Veri Bilimi ve İleri Analitik',
          'Finansal Modelleme & Risk Yönetimi',
          'Siber Güvenlik & Kriptografi'
        ],
        recommendedClubs: ['Yazılım Kulübü', 'Veri ve İnovasyon Kulübü', 'Mühendislik Topluluğu'],
        matchedMentors: VERIFIED_MENTORS.slice(0, 2)
      };
    }
    
    if (maxTrait === 'creative') {
      return {
        trait: 'creative',
        title: 'Vizyoner Tasarımcı & İnovatör',
        badge: 'Yüksek Yaratıcı & Tasarım Yatkınlığı',
        desc: 'Kalıpların dışına çıkan, estetik duygusu ve yenilikçi öngörüsüyle geleceğin ürün ve deneyimlerini inşa eden yaratıcı güç.',
        paths: [
          'UI/UX ve Dijital Ürün Tasarımı',
          'Marka Stratejisi & Büyüme Pazarlaması',
          'Oyun ve Etkileşimli Medya Tasarımı',
          'Girişimcilik & Konsept Geliştirme'
        ],
        recommendedClubs: ['Girişimcilik Kulübü', 'Tasarım ve Sanat Kulübü', 'Medya ve İletişim Kulübü'],
        matchedMentors: [VERIFIED_MENTORS[0], VERIFIED_MENTORS[2] || VERIFIED_MENTORS[1]]
      };
    }

    if (maxTrait === 'social') {
      return {
        trait: 'social',
        title: 'Lider & İnsan Odaklı Yönetici',
        badge: 'Yüksek İletişim & Sosyal Zeka',
        desc: 'İnsanları ortak vizyonda bir araya getiren, güçlü iletişim ve empati yeteneğiyle ekipleri başarıya taşıyan organizatör.',
        paths: [
          'İnsan Kaynakları & Yetenek Yönetimi',
          'Proje ve Çevik (Agile) Süreç Yöneticiliği',
          'Kurumsal İletişim ve Halkla İlişkiler',
          'Stratejik İş Geliştirme & Satış'
        ],
        recommendedClubs: ['Kariyer ve Gelişim Kulübü', 'Liderlik ve Yönetim Kulübü', 'Kızılay ve Sosyal Dayanışma Kulübü'],
        matchedMentors: [VERIFIED_MENTORS[2] || VERIFIED_MENTORS[0], VERIFIED_MENTORS[1]]
      };
    }

    return {
      trait: 'practical',
      title: 'Uygulama & Operasyonel Lider',
      badge: 'Yüksek Saha & Uygulama Yetkinliği',
      desc: 'Fikirleri anında sahada çalışan çözümlere dönüştüren, çevik, sonuç odaklı ve kriz anlarında soğukkanlı hareket eden uygulayıcı.',
      paths: [
        'Üretim & Tedarik Zinciri Mühendisliği',
        'Operasyon ve Süreç İyileştirme (Yalın/Kaizen)',
        'Saha & Tesis Yönetimi',
        'Startup & Kuluçka Operasyonları'
      ],
      recommendedClubs: ['Endüstri ve Verimlilik Kulübü', 'Girişimcilik Kulübü', 'Havacılık ve Uzay Kulübü'],
      matchedMentors: [VERIFIED_MENTORS[1], VERIFIED_MENTORS[0]]
    };
  };

  const isFormComplete = Object.keys(answers).length === FORM_QUESTIONS.length;
  const completedCount = Object.keys(answers).length;

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!isFormComplete) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsSubmitted(true);
      try {
        localStorage.setItem('iesu_career_test_result_v2', JSON.stringify({
          answers,
          submittedAt: new Date().toISOString()
        }));
      } catch (e) {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  const handleReset = () => {
    setAnswers({});
    setIsSubmitted(false);
    try {
      localStorage.removeItem('iesu_career_test_result_v2');
    } catch (e) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const persona = getPersona();
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
              <h1 className="font-black text-gray-900 text-sm sm:text-base leading-tight">Kariyer & Yetkinlik Testi</h1>
              <p className="text-[11px] font-bold text-gray-500">Bilişsel & Sektörel Yatkınlık Değerlendirmesi</p>
            </div>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-8">
        
        {/* LOADING ANIMATION */}
        {isAnalyzing && (
          <div className="bg-white rounded-3xl p-12 shadow-md text-center border border-slate-200 my-12">
            <div className="w-16 h-16 bg-red-50 text-[#990000] rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Zap size={32} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Formunuz Değerlendiriliyor...</h3>
            <p className="text-sm text-gray-500 font-medium max-w-md mx-auto">
              Bilişsel tercihleriniz, çalışma tarzınız ve motivasyon faktörleriniz analiz edilerek İESÜ kariyer haritanız çıkarılıyor.
            </p>
          </div>
        )}

        {/* RESULTS SCREEN */}
        {isSubmitted && !isAnalyzing && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Top Persona Card */}
            <div className="bg-linear-to-r from-[#990000] via-[#850000] to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
              <div className="inline-block px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
                {persona.badge}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black mb-3">
                Kariyer Kimliğiniz: <span className="text-amber-300">{persona.title}</span>
              </h2>
              <p className="text-sm sm:text-base text-red-100 max-w-2xl leading-relaxed">
                {persona.desc}
              </p>

              {/* Trait Percent Bars */}
              <div className="mt-8 pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <span className="text-[11px] font-bold text-red-200 block">Mantık & Analitik</span>
                  <span className="text-xl font-black text-white">%{percentScores.logic}</span>
                  <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-white h-full rounded-full" style={{ width: `${percentScores.logic}%` }} />
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <span className="text-[11px] font-bold text-red-200 block">Yaratıcılık & İnovasyon</span>
                  <span className="text-xl font-black text-white">%{percentScores.creative}</span>
                  <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-white h-full rounded-full" style={{ width: `${percentScores.creative}%` }} />
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <span className="text-[11px] font-bold text-red-200 block">Sosyal & İletişim</span>
                  <span className="text-xl font-black text-white">%{percentScores.social}</span>
                  <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-white h-full rounded-full" style={{ width: `${percentScores.social}%` }} />
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <span className="text-[11px] font-bold text-red-200 block">Pratik & Saha</span>
                  <span className="text-xl font-black text-white">%{percentScores.practical}</span>
                  <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-white h-full rounded-full" style={{ width: `${percentScores.practical}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Career Paths */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs">
              <h3 className="font-extrabold text-gray-900 mb-4 text-base flex items-center gap-2">
                <Compass className="text-[#990000]" size={18} /> Profilinize En Uygun Kariyer Yolları
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {persona.paths.map((path, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-100 text-[#990000] flex items-center justify-center shrink-0">
                      <Star size={16} />
                    </div>
                    <span className="font-bold text-gray-900 text-xs sm:text-sm">{path}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Clubs */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                  <Users className="text-[#990000]" size={18} /> Gelişiminizi Destekleyecek İESÜ Kulüpleri
                </h3>
                <button 
                  onClick={() => setView('club_portal')}
                  className="text-xs font-bold text-[#990000] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Tümünü Gör <ArrowRight size={13} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {persona.recommendedClubs.map((club, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Önerilen Kulüp</span>
                      <h4 className="font-bold text-gray-900 text-sm mt-0.5">{club}</h4>
                    </div>
                    <button 
                      onClick={() => setView('club_portal')}
                      className="mt-3 px-3 py-1.5 bg-white border border-slate-200 hover:border-red-300 hover:text-[#990000] rounded-lg text-xs font-bold text-slate-700 transition cursor-pointer text-center"
                    >
                      Kulübe Katıl
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Matched Mentors */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs">
              <h3 className="font-extrabold text-gray-900 mb-4 text-base flex items-center gap-2">
                <Award className="text-[#990000]" size={18} /> Eşleşen Doğrulanmış İESÜ Mentörleri
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {persona.matchedMentors.map((mentor) => (
                  <div 
                    key={mentor.id}
                    onClick={() => {
                      if (setSelectedUserId) setSelectedUserId(mentor.id);
                      setView('public_profile');
                    }}
                    className="p-4 rounded-xl border border-slate-200 hover:border-red-200 hover:shadow-xs transition bg-slate-50/50 flex items-center gap-3.5 cursor-pointer"
                  >
                    <SafeAvatar src={mentor.avatar} name={mentor.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm truncate">{mentor.name}</h4>
                      <p className="text-xs text-gray-600 truncate">{mentor.title} • {mentor.company}</p>
                      <span className="text-[11px] text-[#990000] font-semibold flex items-center gap-1 mt-0.5">
                        Mentör Profilini İncele <ExternalLink size={11} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                onClick={handleReset}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw size={15} /> Formu Yeniden Doldur
              </button>
              <button 
                onClick={() => setView('career_roadmap')}
                className="flex-1 bg-[#990000] hover:bg-red-800 text-white py-3.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                Kariyer Haritama Git <ArrowRight size={15} />
              </button>
            </div>
          </motion.div>
        )}

        {/* QUESTION FORM */}
        {!isSubmitted && !isAnalyzing && (
          <form onSubmit={handleSubmitForm} className="space-y-6">
            
            {/* Banner */}
            <div className="bg-linear-to-r from-[#8F0808] to-[#990000] rounded-3xl p-6 sm:p-8 text-white shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Brain size={18} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-red-200">
                  Resmî Değerlendirme Anketi
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black mb-1">
                Kariyer & Yetkinlik Profili Formu
              </h2>
              <p className="text-xs sm:text-sm text-red-100 leading-relaxed max-w-2xl">
                Soruları çalışma alışkanlıklarınızı ve iç motivasyonunuzu yansıtacak şekilde yanıtlayarak size en uygun sektörleri, öğrenci kulüplerini ve mezun mentörleri belirleyin.
              </p>

              {/* Progress counter */}
              <div className="mt-5 pt-4 border-t border-white/20 flex items-center justify-between text-xs font-bold text-red-100">
                <span>Tamamlanan: {completedCount} / {FORM_QUESTIONS.length} Soru</span>
                <div className="w-36 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-300 rounded-full" 
                    style={{ width: `${(completedCount / FORM_QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-5">
              {FORM_QUESTIONS.map((q, idx) => {
                const currentAnswer = answers[q.id];

                return (
                  <div 
                    key={q.id}
                    className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all shadow-xs ${
                      currentAnswer ? 'border-red-200 bg-red-50/10' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#990000] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                        {q.category}
                      </span>
                      <span className="text-xs font-bold text-slate-400">Soru {idx + 1} / {FORM_QUESTIONS.length}</span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-4 leading-snug">
                      {q.question}
                    </h3>

                    <div className="space-y-2.5">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = currentAnswer?.optionIndex === optIdx;

                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleSelectOption(q.id, opt.traits, optIdx)}
                            className={`p-3.5 rounded-xl cursor-pointer transition-all border flex items-start gap-3 ${
                              isSelected 
                                ? 'bg-red-50/80 border-[#990000] text-gray-900 shadow-xs' 
                                : 'bg-slate-50/60 border-slate-200/80 hover:border-red-200 hover:bg-white text-gray-700'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition ${
                              isSelected ? 'border-[#990000] bg-[#990000]' : 'border-slate-300 bg-white'
                            }`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <span className="text-xs sm:text-sm font-medium leading-relaxed">
                              {opt.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Form Submit Bar */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div>
                <p className="text-xs font-bold text-gray-900">Form Durumu:</p>
                <p className="text-xs text-gray-500 font-medium">
                  {isFormComplete 
                    ? '✅ Tüm sorular yanıtlandı. Raporunuzu oluşturabilirsiniz.' 
                    : `Lütfen kalan ${FORM_QUESTIONS.length - completedCount} soruyu da tamamlayınız.`}
                </p>
              </div>

              <button
                type="submit"
                disabled={!isFormComplete}
                className={`px-7 py-3 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 shrink-0 ${
                  isFormComplete 
                    ? 'bg-[#990000] hover:bg-red-800 text-white shadow-md cursor-pointer' 
                    : 'bg-slate-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>Analizi Tamamla & Rapor Al</span>
                <ArrowRight size={15} />
              </button>
            </div>

          </form>
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
