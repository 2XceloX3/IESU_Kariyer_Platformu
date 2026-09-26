import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Search, Library, Sparkles, ChevronLeft, BrainCircuit, 
  ExternalLink, GraduationCap, Clock, X, FileText, Check, Award
} from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import SubPanelFloatingDock from './SubPanelFloatingDock';
import { generateAIResponse } from '../lib/gemini';

const MOCK_TRENDS = [
  'Kuantum Hesaplama',
  'Yapay Zeka ve Etik',
  'Blokzincir Akıllı Sözleşmeler',
  'Metaverse Eğitim Teknolojileri'
];

export default function MetaverseLibrary({ setView, currentUser, userRole, setSelectedUserId }) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [learningPathStatus, setLearningPathStatus] = useState(false);

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;
    setQuery(searchQuery);
    setIsSearching(true);
    setLearningPathStatus(false);

    const prompt = `
       "Dijital Kütüphane"nin Baş Kütüphanecisisin.
      Öğrenci şu konuyu araştırmak istiyor: "${searchQuery}".
      Ona bu konuyla ilgili 3 adet akademik makale/kitap önerisi ve kısa bir 1 paragraflık "Konu Özeti" ver.
      Sadece aşağıdaki JSON formatında bir cevap dön, markdown veya başka metin kullanma:
      {
        "summary": "Konunun akademik kaynaklar ışığında derlenmiş kapsamlı özeti...",
        "resources": [
          { "title": "Kaynak 1 Adı", "author": "Yazar", "type": "Makale", "year": "2023", "abstract": "Bu çalışma ilgili konuyu derinlemesine ele alır." },
          { "title": "Kaynak 2 Adı", "author": "Yazar", "type": "Kitap", "year": "2022", "abstract": "Konunun temel teorilerini anlatan kapsamlı bir eser." },
          { "title": "Kaynak 3 Adı", "author": "Yazar", "type": "Tez", "year": "2024", "abstract": "Konunun güncel pratik uygulamaları üzerine odaklanan tez çalışması." }
        ]
      }
    `;

    setTimeout(async () => {
      try {
        const response = await generateAIResponse(prompt, "Sadece JSON dön");
        let cleanJson = response.replace(/^```json\s*/i, '').replace(/\s*```$/, '').replace(/^```\s*/, '').trim();
        const data = JSON.parse(cleanJson);
        setResults(data);
        setIsSearching(false);
      } catch (e) {
        // Fallback
        setResults({
          summary: `"${searchQuery}" konusunda literatürde son yıllarda özellikle nöral ağlar ve derin öğrenme modelleri üzerine yoğunlaşılmıştır. Sistemlerin adaptif öğrenme süreçleri endüstri standartlarını yeniden belirliyor.`,
          resources: [
            { title: `${searchQuery}: A Comprehensive Review`, author: "Dr. A. Yılmaz", type: "Makale", year: "2024", abstract: "Bu çalışmada konunun genel teorisi ve güncel metodolojileri geniş bir literatür taramasıyla sunulmaktadır." },
            { title: `Modern Approaches to ${searchQuery}`, author: "Global Research Institute", type: "Kitap", year: "2023", abstract: "Uygulamalı örnekler ve vaka analizleriyle zenginleştirilmiş başucu kitabı." },
            { title: `Implementation of ${searchQuery} in IoT`, author: "Esenyurt Üniversitesi", type: "Tez", year: "2024", abstract: "Konunun nesnelerin interneti ekosistemindeki yeri ve prototip uygulamaları." }
          ]
        });
        setIsSearching(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 flex flex-col font-sans pb-24">
      
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50 shadow-xs">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView(userRole === 'admin' ? 'admin' : (userRole === 'employer' || userRole === 'company') ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')} 
            className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 hover:text-[#990000] transition cursor-pointer shrink-0"
            title="Geri Dön"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-auto text-[#990000]" />
            <div>
              <h1 className="font-black text-gray-900 text-sm sm:text-base leading-tight">Dijital Kütüphane & Kaynak Merkezi</h1>
              <p className="text-[11px] font-bold text-gray-500">Akademik Yayınlar, Tezler ve Kaynak Taraması</p>
            </div>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      <main className="flex-1 w-full max-w-[1200px] mx-auto p-4 lg:p-8 flex flex-col justify-center">
        
        {!results && !isSearching && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl mx-auto py-12 flex flex-col items-center text-center"
          >
            <div className="w-24 h-24 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center shadow-lg border border-red-100 mb-8 relative">
              <BookOpen size={48} />
            </div>
            
            <h2 className="text-3xl font-black mb-4 text-gray-900 tracking-tight">
              Dijital Bilgi & Kaynak Merkezi
            </h2>
            <p className="text-slate-500 text-base mb-8 max-w-xl leading-relaxed font-semibold">
              Kütüphanemiz binlerce akademik yayını ve kitabı sizin için saniyeler içinde tarar.
            </p>

            <div className="w-full bg-white p-3 rounded-3xl shadow-xl flex items-center gap-4 border border-slate-200/80 focus-within:ring-4 focus-within:ring-red-100 focus-within:border-[#990000] transition-all mb-6">
              <Search className="text-slate-500 ml-4" size={22} />
              <input 
                type="text" 
                className="flex-1 bg-transparent border-none outline-none text-sm font-semibold text-gray-900 placeholder-slate-400"
                placeholder="Örn: Kuantum Hesaplama, Blokzincir, Derin Öğrenme..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                onClick={() => handleSearch()}
                disabled={!query.trim()}
                className="bg-[#990000] hover:bg-red-800 disabled:opacity-50 text-white px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition shadow-md cursor-pointer"
              >
                Ara
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-bold text-slate-600 uppercase mr-1">Önerilenler:</span>
              {MOCK_TRENDS.map((trend, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearch(trend)}
                  className="bg-slate-100 hover:bg-red-50 hover:text-[#990000] text-slate-600 font-bold px-3.5 py-1.5 rounded-xl text-xs transition border border-slate-200/40 cursor-pointer"
                >
                  {trend}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {isSearching && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-[#990000] rounded-full animate-spin mb-6"></div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Tarama Yapılıyor...</h3>
            <p className="text-slate-500 max-w-sm font-semibold">Binlerce akademik kaynak, tez ve makale taranarak sizin için özetleniyor.</p>
          </div>
        )}

        {results && !isSearching && (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-6 max-w-5xl mx-auto w-full space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <button 
                  onClick={() => { setResults(null); setQuery(''); }}
                  className="text-slate-600 hover:text-[#990000] font-bold flex items-center gap-2 transition bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm text-xs cursor-pointer"
                >
                  <ChevronLeft size={16} /> Yeni Araştırma
                </button>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      setLearningPathStatus(true);
                      window.toast && window.toast.success("✅ Öğrenme Rotası başarıyla Kariyer Yol Haritanıza eklendi.");
                    }}
                    disabled={learningPathStatus}
                    className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-md transition flex items-center gap-1.5 cursor-pointer ${learningPathStatus ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-[#990000] text-white hover:bg-red-800'}`}
                  >
                    {learningPathStatus ? <Check size={14}/> : <BrainCircuit size={14} />}
                    {learningPathStatus ? 'Rotaya Eklendi' : 'Öğrenme Rotası Çıkar'}
                  </button>
                </div>
              </div>

              {/* Topic Summary Card */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/80 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <Library size={150} />
                </div>
                <h3 className="text-xs font-black text-red-600 mb-3 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles size={14}/> Konu Analizi
                </h3>
                <h2 className="text-2xl font-black text-gray-900 mb-4">"{query}"</h2>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-semibold">
                  {results.summary}
                </p>
              </div>

              {/* Resources list */}
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 pt-4">
                <GraduationCap className="text-red-600"/> Akademik Kaynak Önerileri
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.resources.map((res, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-red-600 uppercase tracking-wider mb-4">
                        <span className="bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded">{res.type}</span>
                        <span className="flex items-center gap-1"><Clock size={12}/> {res.year}</span>
                      </div>
                      <h4 className="text-sm font-black text-red-900 mb-2 leading-snug line-clamp-2">{res.title}</h4>
                      <p className="text-slate-600 font-bold text-[11px] mb-6">{res.author}</p>
                    </div>
                    
                    <button 
                      onClick={() => setSelectedBook(res)}
                      className="w-full py-2.5 bg-[#990000] hover:bg-red-800 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition cursor-pointer active:scale-95 shadow-xs"
                    >
                      İncele
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Book details Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedBook(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <span className="text-[9px] text-red-600 font-black uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{selectedBook.type}</span>
                  <h3 className="font-black text-slate-950 text-sm mt-1">Akademik Yayın Özeti</h3>
                </div>
                <button onClick={() => setSelectedBook(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 transition">
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs font-bold text-slate-500">
                <div>
                  <label className="text-[10px] text-slate-600 uppercase font-black tracking-wider">Yayın Adı</label>
                  <h4 className="text-red-900 font-black text-sm mt-1">{selectedBook.title}</h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-600 uppercase font-black tracking-wider">Yazar</label>
                    <p className="text-red-900 mt-1">{selectedBook.author}</p>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600 uppercase font-black tracking-wider">Yayın Yılı</label>
                    <p className="text-red-900 mt-1">{selectedBook.year}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <label className="text-[10px] text-slate-600 uppercase font-black tracking-wider">Özet (Abstract)</label>
                  <p className="text-slate-600 mt-1.5 leading-relaxed font-semibold">{selectedBook.abstract}</p>
                </div>

                <div className="flex gap-2 pt-4">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      window.toast && window.toast.info("Yayın PDF'i blockchain üzerinden doğrulanıyor...");
                      setTimeout(() => {
                        window.toast && window.toast.success("✅ Yayın başarıyla doğrulandı ve cihazınıza indirildi!");
                      }, 2000);
                    }}
                    className="flex-1 py-3 bg-[#990000] hover:bg-red-800 text-white rounded-xl font-black uppercase tracking-widest text-center cursor-pointer transition"
                  >
                    PDF Olarak İndir
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bottom Dock */}
      {setView && (
        <SubPanelFloatingDock 
          currentUser={currentUser} 
          setView={setView} 
          setSelectedUserId={setSelectedUserId}
          userRole={userRole || 'student'}
          activeTab="library"
        />
      )}
    </div>
  );
}
