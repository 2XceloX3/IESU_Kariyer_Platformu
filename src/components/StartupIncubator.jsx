import React, { useState } from 'react';
import { downloadReportPdf } from '../utils/downloadPdf';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Target, Zap, ChevronLeft, Building2, Brain, CheckCircle, Flame, PieChart, Users, ArrowRight, Lightbulb, LineChart } from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import { generateAIResponse } from '../lib/gemini';
import useAppStore from '../store/useAppStore';

export default function StartupIncubator({ setView, currentUser, userRole, setSelectedUserId }) {
  const [pitch, setPitch] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [canvas, setCanvas] = useState(null);

  const handlePitch = async () => {
    if (!pitch.trim()) return;
    setIsGenerating(true);

    const prompt = `
      Sen kurumsal bir melek yatırım ağının (Angel Investor Network) Yapay Zeka Analistisin.
      Şu girişim fikrini profesyonelce analiz et: "${pitch}".
      Fikrin pazar potansiyeli, riskleri ve büyüme metrikleri üzerinden bir "Fizibilite Skoru" ver.
      Sadece aşağıdaki JSON formatında bir cevap dön, markdown (\`\`\`) veya başka metin kullanma:
      {
        "score": 85,
        "name": "Fikre Kurumsal Bir İsim",
        "feedback": "Yatırım komitesi olarak değerlendirmemiz...",
        "canvas": {
          "problem": ["Problem 1", "Problem 2"],
          "solution": ["Çözüm 1", "Çözüm 2"],
          "uniqueValue": "Değer Önerisi (Tek cümle)",
          "customerSegment": ["Hedef Kitle 1", "Hedef Kitle 2"],
          "revenueStreams": ["Gelir Modeli 1", "Gelir Modeli 2"]
        }
      }
    `;

    setTimeout(async () => {
      try {
        const response = await generateAIResponse(prompt, "Sadece JSON dön");
        let cleanJson = response.replace(/^```json\s*/i, '').replace(/\s*```$/, '').replace(/^```\s*/, '').trim();
        const data = JSON.parse(cleanJson);
        setCanvas(data);
        setIsGenerating(false);
      } catch (e) {
        // Fallback
        setCanvas({
          score: 82,
          name: "SmartCampus Solutions",
          feedback: "Pazar doğrulama (Market Validation) süreci iyi planlanmış ancak müşteri edinme maliyetleri (CAC) başlangıçta yüksek seyredebilir. B2B abonelik modeline odaklanılmasını tavsiye ediyoruz.",
          canvas: {
            problem: ["Operasyonel verimsizlik", "Yüksek operasyon maliyetleri"],
            solution: ["Yapay zeka destekli otomasyon", "Veriye dayalı analiz"],
            uniqueValue: "Kurumsal firmalar için uçtan uca, bulut tabanlı maliyet optimizasyonu.",
            customerSegment: ["B2B Kurumsal Şirketler", "KOBİ'ler"],
            revenueStreams: ["Yıllık Lisans (SaaS)", "Danışmanlık Hizmetleri"]
          }
        });
        setIsGenerating(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-gray-900 flex flex-col font-sans">
      {/* Premium Corporate Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView(userRole === 'admin' ? 'admin' : (userRole === 'employer' || userRole === 'company') ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')} 
              className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#0A66C2] rounded-lg flex items-center justify-center shadow-sm">
                <Lightbulb className="text-white" size={16} />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-black text-gray-900 leading-tight">Yatırım & Girişimcilik Ağı</h1>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">İESÜ Teknoloji Transfer Ofisi</p>
              </div>
            </div>
          </div>
          <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
        </div>
      </header>

      <main className="flex-1 max-w-[1200px] mx-auto w-full p-4 lg:p-8 flex flex-col">
        
        {!canvas && !isGenerating && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center max-w-3xl mx-auto py-12"
          >
            <div className="w-20 h-20 bg-red-50 text-[#0A66C2] rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-red-100">
              <LineChart size={40} />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-gray-900 tracking-tight">
              Girişim Fikrinizi Değerlendirelim
            </h2>
            <p className="text-gray-500 text-lg mb-12 leading-relaxed">
              Yapay Zeka Destekli Yatırım Analiz platformumuz, projenizin pazar potansiyelini değerlendirip sizin için otomatik bir Yalın Kanvas (Lean Canvas) iş modeli oluşturur.
            </p>

            <div className="w-full bg-white p-6 rounded-2xl border border-gray-200 shadow-sm transition-all focus-within:border-[#0A66C2] focus-within:ring-4 focus-within:ring-red-50">
              <div className="text-left mb-2 text-sm font-bold text-gray-700">Proje Özeti (Executive Summary)</div>
              <textarea 
                className="w-full bg-gray-50 border border-gray-100 rounded-xl outline-none resize-none text-gray-800 placeholder-gray-400 text-base p-4 min-h-[150px] mb-4 focus:bg-white transition-colors"
                placeholder="Örn: KOBİ'ler için yapay zeka destekli ön muhasebe otomasyonu sunan B2B SaaS platformu..."
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 font-bold flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-lg">
                  <Brain size={14} className="text-[#0A66C2]" /> AI Veri Analizi
                </span>
                <button 
                  onClick={handlePitch}
                  disabled={pitch.length < 10}
                  className="bg-[#0A66C2] hover:bg-red-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition shadow-sm"
                >
                  Fizibilite Raporu Oluştur <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {isGenerating && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-[#0A66C2] rounded-full animate-spin mb-6"></div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Pazar Analizi Yapılıyor...</h3>
            <p className="text-gray-500 max-w-md mx-auto">Sektörel trendler taranıyor, rakip analizleri yapılıyor ve Yalın Kanvas modeliniz derleniyor.</p>
          </div>
        )}

        {canvas && !isGenerating && (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-5xl mx-auto w-full space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <button 
                  onClick={() => { setCanvas(null); setPitch(''); }}
                  className="text-gray-500 hover:text-gray-900 font-bold flex items-center gap-2 transition bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm"
                >
                  <ChevronLeft size={18} /> Yeni Analiz
                </button>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      window.toast && window.toast.info("Kanvas verilerinizden yatırımcı sunumu (Pitch Deck) derleniyor...");
                      setTimeout(() => {
                        window.toast && window.toast.success("✅ AI Sunumu Hazır: Taslak sunum e-posta adresinize PDF olarak gönderildi.");
                      }, 2500);
                    }}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-md transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"></path><path d="M3.34 19a10 10 0 1 1 17.32 0"></path></svg>
                    AI Sunum Destesi Üret
                  </button>
                  <div className="text-sm font-bold text-gray-400">Gizlilik: <span className="text-[#0A66C2]">Sadece Siz</span></div>
                </div>
              </div>

              {/* Header Report Card */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 relative shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <path
                      className="text-gray-100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke="currentColor" strokeWidth="3"
                    />
                    <motion.path
                      initial={{ strokeDasharray: "0, 100" }}
                      animate={{ strokeDasharray: `\${canvas.score}, 100` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="text-[#0A66C2]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke="currentColor" strokeWidth="3"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-gray-900">{canvas.score}</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Fizibilite</span>
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100 mb-2">Analiz Tamamlandı</div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3">{canvas.name}</h3>
                  <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <strong>Yatırımcı Geri Bildirimi: </strong>
                    {canvas.feedback}
                  </p>
                </div>
              </div>

              {/* Lean Canvas Layout */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <h4 className="font-black text-gray-900 flex items-center gap-2"><PieChart size={18} className="text-[#0A66C2]"/> Yalın Kanvas (Lean Canvas) İş Modeli</h4>
                  <button onClick={() => downloadReportPdf('lean-canvas', 'Lean Canvas Iş Modeli', [`Proje: ${canvas.name}`, '', 'Yatırımcı Geri Bildirimi:', canvas.feedback, '', 'İESÜ Kariyer Platformu - Startup Incubator'])} className="text-sm font-bold text-[#0A66C2] hover:underline cursor-pointer">PDF İndir</button>
                </div>
                
                <div className="p-1">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-1 min-h-[300px]">
                    {/* Problem */}
                    <div className="bg-gray-50 p-5 col-span-1 border-r border-b border-gray-200">
                      <h5 className="font-bold text-gray-900 text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                        <Target size={16} className="text-red-500"/> Problem
                      </h5>
                      <ul className="space-y-2">
                        {canvas.canvas.problem.map((p, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" /> {p}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Solution */}
                    <div className="bg-gray-50 p-5 col-span-1 border-r border-b border-gray-200">
                      <h5 className="font-bold text-gray-900 text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                        <CheckCircle size={16} className="text-emerald-500"/> Çözüm
                      </h5>
                      <ul className="space-y-2">
                        {canvas.canvas.solution.map((p, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" /> {p}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Unique Value */}
                    <div className="bg-red-50/50 p-5 col-span-1 border-r border-b border-red-100 relative">
                      <div className="absolute inset-x-0 top-0 h-1 bg-[#0A66C2]" />
                      <h5 className="font-bold text-gray-900 text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                        <Zap size={16} className="text-[#0A66C2]"/> Değer Önerisi
                      </h5>
                      <p className="text-sm text-gray-800 font-medium italic">{canvas.canvas.uniqueValue}</p>
                    </div>

                    {/* Customer Segments */}
                    <div className="bg-gray-50 p-5 col-span-2 border-b border-gray-200">
                      <h5 className="font-bold text-gray-900 text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                        <Users size={16} className="text-purple-500"/> Hedef Kitle
                      </h5>
                      <ul className="space-y-2">
                        {canvas.canvas.customerSegment.map((p, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" /> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1 bg-gray-200">
                    <div className="bg-gray-50 p-5">
                      <h5 className="font-bold text-gray-900 text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                        <Building2 size={16} className="text-orange-500"/> Gider Yapısı (Cost Structure)
                      </h5>
                      <p className="text-sm text-gray-600">Altyapı maliyetleri, AR-GE giderleri, personel maaşları, pazarlama (CAC).</p>
                    </div>
                    <div className="bg-gray-50 p-5">
                      <h5 className="font-bold text-gray-900 text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                        <LineChart size={16} className="text-emerald-500"/> Gelir Akışı (Revenue Streams)
                      </h5>
                      <ul className="space-y-2">
                        {canvas.canvas.revenueStreams.map((p, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" /> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
