import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ArrowRight, ChevronLeft, Target, Award, Sparkles, Zap, Rocket, Star, CheckCircle2, FileText, User, Building, Compass } from 'lucide-react';
import TopProfileMenu from './TopProfileMenu';

const FORM_QUESTIONS = [
  {
    id: 1,
    category: "Problem Çözme & Analiz",
    question: " Bir karmaşık problemle karşılaştığınızda ilk yaklaşımınız nedir?",
    options: [
      { text: "Verileri ve geçmiş istatistikleri detaylıca analiz eder, mantıksal bir yol haritası çizerim.", traits: { logic: 10, creative: 2 } },
      { text: "Yaratıcı, yenilikçi ve alışılagelmişin dışında yollar denerim.", traits: { creative: 10, logic: 2 } },
      { text: "Takım arkadaşlarımla konuşur, beyin fırtınası yaparak ortak akılla ilerlerim.", traits: { social: 10, logic: 4 } },
      { text: "Sahaya iner, pratik çözümü hızlıca uygular ve deneme-yanılmayla ilerlerim.", traits: { practical: 10, logic: 6 } }
    ]
  },
  {
    id: 2,
    category: "Çalışma Ortamı Tercihi",
    question: " Size en çok ilham veren ve veriminizi artıran çalışma ortamı hangisidir?",
    options: [
      { text: "Sıfırdan özgürce bir şeyler üretme imkanı sunan yenilikçi tasarım ve Ar-Ge alanı.", traits: { creative: 8, practical: 2 } },
      { text: "Kuralları, iş süreçleri ve sistematik yapısı net belirlenmiş düzenli kurumsal ortam.", traits: { logic: 8, practical: 6 } },
      { text: "İletişimin, yardımlaşmanın ve sosyalleşmenin yüksek olduğu dinamik ekip ortamı.", traits: { social: 10, logic: 2 } },
      { text: "Hızlı sonuç alınan, tempolu, yüksek enerjili ve rekabetçi yapı.", traits: { practical: 8, creative: 4 } }
    ]
  },
  {
    id: 3,
    category: "Öğrenme & Gelişim Tarzı",
    question: " Yeni bir uzmanlık alanını veya teknolojiyi öğrenirken hangisini tercih edersiniz?",
    options: [
      { text: "Teknik dokümantasyon, kılavuzlar ve akademik yayınları detaylıca okumak.", traits: { logic: 9, practical: 3 } },
      { text: "Örnek tasarımları ve dünyadaki başarılı ilham verici projeleri incelemek.", traits: { creative: 9, social: 3 } },
      { text: "Mentorluk, atölye çalışmaları ve grup etkinliklerine katılarak pratik yapmak.", traits: { social: 9, practical: 4 } },
      { text: "Doğrudan canlı projenin içerisine girip uygulama yaparak öğrenmek.", traits: { practical: 10, logic: 2 } }
    ]
  },
  {
    id: 4,
    category: "Liderlik & Ekip Çalışması",
    question: " Bir projeyi yönetmeniz veya ekibe liderlik etmeniz istendiğinde odak noktanız ne olur?",
    options: [
      { text: "Zaman çizelgesi, risk analizi ve bütçe planlamasının hatasız yürümesi.", traits: { logic: 9, practical: 5 } },
      { text: "Ekibin yüksek motivasyonu, uyumu ve enerjik iletişimi.", traits: { social: 10, creative: 4 } },
      { text: "Fark yaratan inovatif fikirler üretmek ve konsepti geliştirmek.", traits: { creative: 10, logic: 3 } },
      { text: "Hedeflenen çıktıların süresi içerisinde eksiksiz ve eksiksiz teslim edilmesi.", traits: { practical: 10, social: 2 } }
    ]
  },
  {
    id: 5,
    category: "Karar Alma Mekanizması",
    question: " Geleceğe yönelik kritik kararlar alırken neye daha çok güvenirsiniz?",
    options: [
      { text: "Sayısal verilere, performans metriklerine ve somut raporlara.", traits: { logic: 10, practical: 3 } },
      { text: "Sezgilerime, vizyoner bakış açıma ve geleceği öngörme hissiyatıma.", traits: { creative: 10, social: 2 } },
      { text: "Çevremdeki tecrübeli insanların görüşlerine ve ortak karara.", traits: { social: 10, logic: 3 } },
      { text: "Geçmiş saha tecrübelerime ve pratik uygulanabilirliğe.", traits: { practical: 10, logic: 4 } }
    ]
  },
  {
    id: 6,
    category: "Stres & Kriz Yönetimi",
    question: " Beklenmedik bir kriz durumu oluştuğunda ilk tepkiniz ne olur?",
    options: [
      { text: "Sakin kalır, krizin kök nedenini mantıksal olarak analiz ederim.", traits: { logic: 9, practical: 4 } },
      { text: "Farklı bir açıdan bakarak kriz durumunu bir fırsata dönüştürürüm.", traits: { creative: 9, social: 3 } },
      { text: "Ekibi teskin eder, iletişimi ve görev dağılımını hızlıca sağlarım.", traits: { social: 9, logic: 4 } },
      { text: "Derhal müdahale eder, geçici çözümü anında sahada uygularım.", traits: { practical: 10, logic: 2 } }
    ]
  }
];

export default function CareerTest({ setView, currentUser, userRole, setSelectedUserId }) {
  const [answers, setAnswers] = useState({});
  const [targetSector, setTargetSector] = useState('yazilim');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSelectOption = (questionId, traits, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { traits, optionIndex }
    }));
  };

  const calculateScores = () => {
    const scores = { logic: 0, creative: 0, social: 0, practical: 0 };
    Object.values(answers).forEach(ans => {
      if (ans.traits) {
        scores.logic += ans.traits.logic || 0;
        scores.creative += ans.traits.creative || 0;
        scores.social += ans.traits.social || 0;
        scores.practical += ans.traits.practical || 0;
      }
    });
    return scores;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (Object.keys(answers).length < FORM_QUESTIONS.length) {
      if (window.toast && window.toast.error) {
        window.toast.error("Lütfen formdaki tüm soruları yanıtlayınız.");
      }
      return;
    }

    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  const scores = calculateScores();

  const getPersona = () => {
    const maxTrait = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b, 'logic');
    if (maxTrait === 'logic') return { title: 'Sistem Mimarı & Analist', icon: <Brain className="text-[#990000]" size={48} />, desc: 'Analitik zekasıyla karmaşık sorunları çözen, veri odaklı stratejist.', color: 'from-red-600 to-red-800', paths: ['Yazılım & Sistem Mühendisliği', 'Veri Bilimi & Yapay Zeka', 'Finansal Analiz & Danışmanlık'] };
    if (maxTrait === 'creative') return { title: 'Vizyoner Tasarımcı & İnovatör', icon: <Sparkles className="text-purple-600" size={48} />, desc: 'Sınırları zorlayan, yenilikçi ve sanatsal düşünen yaratıcı güç.', color: 'from-purple-600 to-indigo-800', paths: ['UI/UX & Dijital Ürün Tasarımı', 'Pazarlama & İletişim Stratejisi', 'Oyun & Medya Tasarımı'] };
    if (maxTrait === 'social') return { title: 'Lider & İletişim Yöneticisi', icon: <Target className="text-emerald-600" size={48} />, desc: 'İnsanları bir araya getiren, güçlü iletişime sahip organizatör.', color: 'from-emerald-600 to-teal-800', paths: ['İnsan Kaynakları & Yetenek Yönetimi', 'Proje & Ürün Yöneticiliği', 'Satış & Kurumsal İş Geliştirme'] };
    return { title: 'Uygulama & Operasyon Uzmanı', icon: <Rocket className="text-amber-600" size={48} />, desc: 'Fikirleri anında sahaya döken, sonuç odaklı dinamik uygulayıcı.', color: 'from-amber-600 to-orange-800', paths: ['Operasyon & Tedarik Zinciri', 'Girişimcilik & Startup Yönetimi', 'Saha & Üretim Mühendisliği'] };
  };

  const isFormComplete = Object.keys(answers).length === FORM_QUESTIONS.length;
  const completedCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView(userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')} 
            className="p-2 rounded-xl bg-slate-100 text-gray-600 hover:bg-slate-200 transition"
            title="Geri Dön"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <FileText className="text-[#990000]" size={22} />
            <h1 className="font-extrabold text-gray-900 text-base sm:text-lg">Kariyer & Yetkinlik Değerlendirme Formu</h1>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-8">
        
        {/* LOADING SCREEN */}
        {isAnalyzing && (
          <div className="bg-white rounded-3xl p-12 shadow-xl text-center border border-slate-200 my-12 animate-fade-in">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-60" />
              <div className="relative bg-[#990000] text-white rounded-full p-5 shadow-lg flex items-center justify-center h-full">
                <Zap size={36} className="animate-pulse" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Formunuz Analiz Ediliyor...</h3>
            <p className="text-sm text-gray-500 font-medium">Bilişsel tercihleriniz ve yetkinlik profiliniz haritalandırılıyor.</p>
          </div>
        )}

        {/* RESULTS VIEW */}
        {isSubmitted && !isAnalyzing && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 border border-slate-200/80 relative overflow-hidden"
          >
            <div className="text-center mb-8 border-b border-slate-100 pb-6">
              <span className="inline-block px-4 py-1.5 bg-red-50 text-[#990000] border border-red-100 rounded-full text-xs font-black uppercase tracking-wider mb-4">
                ✅ Kariyer Analiz Raporunuz Hazır
              </span>
              <div className="flex justify-center mb-4">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br ${getPersona().color} text-white shadow-xl`}>
                  {React.cloneElement(getPersona().icon, { className: 'text-white' })}
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
                Profiliniz: <span className="text-[#990000]">{getPersona().title}</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto font-medium">
                {getPersona().desc}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="font-extrabold text-gray-900 mb-4 text-base flex items-center gap-2">
                <Compass className="text-[#990000]" size={18} /> Önerilen Kariyer & Uzmanlık Yolları
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {getPersona().paths.map((path, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
                    <Star className="text-amber-500 fill-amber-400 shrink-0" size={18} />
                    <span className="font-bold text-gray-800 text-xs sm:text-sm">{path}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
              <button 
                onClick={() => { setIsSubmitted(false); setAnswers({}); }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-gray-700 py-3.5 rounded-xl font-bold text-sm transition"
              >
                Formu Yeniden Doldur
              </button>
              <button 
                onClick={() => setView('jobs')}
                className="w-full bg-[#990000] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-red-800 transition shadow-md"
              >
                Uygun Staj & İş İlanlarını İncele
              </button>
            </div>
          </motion.div>
        )}

        {/* MAIN SINGLE-PAGE FORM */}
        {!isSubmitted && !isAnalyzing && (
          <form onSubmit={handleSubmitForm} className="space-y-6">
            
            {/* Form Banner Header */}
            <div className="bg-gradient-to-r from-[#8F0808] to-[#990000] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <Brain size={22} className="text-white" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-red-200">İnteraktif Form</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                Kariyer & Beceriler Bilgi Formu
              </h2>
              <p className="text-xs sm:text-sm text-red-100 font-normal leading-relaxed max-w-2xl">
                Aşağıdaki formda yer alan yetkinlik ve çalışma tarzı sorularını doldurarak kişiselleştirilmiş kariyer haritanızı ve sektör uyum raporunuzu anında oluşturabilirsiniz.
              </p>

              {/* Progress Indicator */}
              <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between text-xs font-bold text-red-100">
                <span>Tamamlanan: {completedCount} / {FORM_QUESTIONS.length} Soru</span>
                <div className="w-36 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-300 rounded-full" 
                    style={{ width: `${(completedCount / FORM_QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 1: PERSONAL & PREFERENCE INFO */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80">
              <h3 className="font-extrabold text-gray-900 text-base mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                <User className="text-[#990000]" size={18} /> Bölüm 1: Genel Bilgiler & Hedef Sektör
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Ad Soyad</label>
                  <input 
                    type="text" 
                    readOnly 
                    value={currentUser?.name || 'Öğrenci Kullanıcı'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-gray-700" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Bölüm / Program</label>
                  <input 
                    type="text" 
                    readOnly 
                    value={currentUser?.department || 'Yazılım Mühendisliği'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-gray-700" 
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Hedeflediğiniz Ana Sektör</label>
                  <select 
                    value={targetSector} 
                    onChange={(e) => setTargetSector(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-800 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
                  >
                    <option value="yazilim">Yazılım, Bilişim & Yapay Zeka</option>
                    <option value="tasarim">Tasarım, UI/UX & Dijital Medya</option>
                    <option value="muhendislik">Mühendislik & Mimarlık</option>
                    <option value="isletme">İşletme, Finans & Pazarlama</option>
                    <option value="saglik">Sağlık & Sosyal Hizmetler</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 2: SPREAD QUESTIONS FORM CARDS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                  <Brain className="text-[#990000]" size={18} /> Bölüm 2: Yetkinlik & Yaklaşım Değerlendirmesi
                </h3>
                <span className="text-xs text-gray-500 font-medium">Tüm seçenekler zorunludur</span>
              </div>

              {FORM_QUESTIONS.map((q, qIdx) => {
                const selected = answers[q.id];

                return (
                  <div 
                    key={q.id} 
                    className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all ${
                      selected ? 'border-red-200 shadow-sm' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold text-[#990000] bg-red-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                        {q.category}
                      </span>
                      {selected && (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 size={14} /> Yanıtlandı
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm sm:text-base text-gray-900 mb-4 leading-snug">
                      {q.id}. {q.question}
                    </h4>

                    <div className="space-y-2.5">
                      {q.options.map((opt, optIdx) => {
                        const isSelectedOption = selected?.optionIndex === optIdx;

                        return (
                          <div 
                            key={optIdx}
                            onClick={() => handleSelectOption(q.id, opt.traits, optIdx)}
                            className={`p-3.5 rounded-xl cursor-pointer transition-all border flex items-start gap-3 ${
                              isSelectedOption 
                                ? 'bg-red-50/60 border-[#990000] text-gray-900 shadow-sm' 
                                : 'bg-slate-50/60 border-slate-200 hover:border-red-200 hover:bg-white text-gray-700'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition ${
                              isSelectedOption ? 'border-[#990000] bg-[#990000] text-white' : 'border-slate-300 bg-white'
                            }`}>
                              {isSelectedOption && <div className="w-2 h-2 rounded-full bg-white" />}
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

            {/* SUBMIT BUTTON FOOTER */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
              <div>
                <p className="text-xs font-bold text-gray-900">Form Tamamlama Durumu:</p>
                <p className="text-xs text-gray-500 font-medium">
                  {isFormComplete ? '✅ Tüm sorular yanıtlandı. Raporunuzu oluşturabilirsiniz.' : `Eksik kalan ${FORM_QUESTIONS.length - completedCount} soruyu yanıtlayınız.`}
                </p>
              </div>

              <button
                type="submit"
                disabled={!isFormComplete}
                className={`px-8 py-3.5 rounded-xl font-bold text-sm transition flex items-center gap-2 shrink-0 ${
                  isFormComplete 
                    ? 'bg-[#990000] hover:bg-red-800 text-white shadow-md cursor-pointer' 
                    : 'bg-slate-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>Analizi Tamamla & Rapor Al</span>
                <ArrowRight size={16} />
              </button>
            </div>

          </form>
        )}

      </main>
    </div>
  );
}
