import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Brain, Loader2, Image as ImageIcon, Wand2, Upload, Download } from 'lucide-react';
import TopProfileMenu from './TopProfileMenu';
import SubPanelFloatingDock from './SubPanelFloatingDock';
import { generateAIResponse, generateOrEditCareerImage } from '../lib/gemini';

export default function AnkaChat({ setView, currentUser, userRole, setSelectedUserId }) {
  const [activeMode, setActiveMode] = useState('chat'); // 'chat' | 'image_studio'
  const [selectedModel, setSelectedModel] = useState('gemini-3.8-flash'); // 'gemini-3.8-flash' | 'gemini-3.1-flash-lite'
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Merhaba ${currentUser?.name || 'Esenyurtlu'}! Ben Anka, İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Koordinatörlüğü yapay zekâ danışmanınım. Mavi Yaka (MYO) ve Beyaz Yaka (Fakülte) kariyer planlaman, YÖK akreditasyon süreçleri, üniversite-sanayi işbirliği ilanları veya mülakat provası için bana danışabilir ya da Görsel Stüdyosu ile etkinlik/kulüp afişleri üretebilirsin.`,
      isBot: true
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Image Studio State
  const [imagePrompt, setImagePrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedMimeType, setUploadedMimeType] = useState('image/png');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [generatedImageResult, setGeneratedImageResult] = useState(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), text: userMsg, isBot: false }]);
    setIsTyping(true);

    const contextMessages = messages.map(m => `${m.isBot ? 'Anka' : 'Kullanıcı'}: ${m.text}`).join('\n');
    const prompt = `
      Sen İstanbul Esenyurt Üniversitesi (İESÜ) Kariyer Geliştirme Koordinatörlüğü Danışmanı "Anka"sın.
      Hem Mavi Yaka (Meslek Yüksekokulu / Teknik Saha / Sanayi) hem de Beyaz Yaka (Fakülte / Kurumsal / Ar-Ge) kariyer patikalarında, YÖK kalite süreçlerinde ve üniversite-sanayi işbirliklerinde uzman bir mentorsun.
      Kullanıcının adı: ${currentUser?.name || 'Öğrenci'}.
      
      Sohbet Geçmişi:
      ${contextMessages}
      Kullanıcı: ${userMsg}
      
      Sadece Anka olarak cevap ver, markdown kullanabilirsin. Kısa, samimi ve net ol (Maksimum 3-4 paragraf).
    `;

    try {
      const response = await generateAIResponse(prompt, null, { model: selectedModel });
      setMessages(prev => [...prev, { id: Date.now(), text: response, isBot: true }]);
    } catch {
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now(), text: "Kariyer danışma ağına şu an ulaşılamıyor, ancak kariyerin için çok güçlü bir profilin olduğunu biliyorum. Birazdan tekrar deneyebiliriz!", isBot: true }]);
      }, 1000);
    } finally {
      setIsTyping(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedMimeType(file.type || 'image/png');
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(String(reader.result || ''));
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsGeneratingImage(true);
    try {
      const res = await generateOrEditCareerImage({
        prompt: imagePrompt,
        base64Image: uploadedImage,
        mimeType: uploadedMimeType,
        aspectRatio,
      });
      setGeneratedImageResult(res);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <header className="h-16 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/60 text-[#990000] dark:text-red-400 border border-red-100 dark:border-red-900/50 flex items-center justify-center shadow-xs">
            <Bot size={22} />
          </div>
          <div>
            <h1 className="font-black text-sm sm:text-base tracking-tight text-slate-900 dark:text-white leading-none">Anka Kariyer & Görsel Stüdyosu</h1>
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Kariyer Geliştirme Koordinatörlüğü • Gemini AI</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setActiveMode('chat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'chat'
                  ? 'bg-[#990000] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Brain size={13} />
              <span>Kariyer Sohbeti</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('image_studio')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'image_studio'
                  ? 'bg-[#990000] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Wand2 size={13} />
              <span>Görsel Üret & Düzenle</span>
            </button>
          </div>

          <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto p-4 flex flex-col h-[calc(100vh-4rem)] pb-24">
        {/* Mobile Mode Switcher & Model Selector Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex sm:hidden items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setActiveMode('chat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                activeMode === 'chat' ? 'bg-[#990000] text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Kariyer Sohbeti
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('image_studio')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                activeMode === 'image_studio' ? 'bg-[#990000] text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Görsel Stüdyo
            </button>
          </div>

          {activeMode === 'chat' && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Aktif Model:</span>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="text-xs font-extrabold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-100 outline-none"
              >
                <option value="gemini-3.8-flash">Gemini 3.8 Flash (Kapsamlı Analiz)</option>
                <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Ultra Hızlı)</option>
              </select>
            </div>
          )}
        </div>

        {activeMode === 'chat' ? (
          <>
            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs p-4 md:p-6 mb-4 flex flex-col gap-5 custom-scrollbar scroll-smooth"
            >
              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-start gap-3.5 max-w-[85%] ${msg.isBot ? 'self-start' : 'self-end flex-row-reverse'}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${msg.isBot ? 'bg-gradient-to-br from-red-700 via-[#990000] to-rose-800 text-white' : 'bg-slate-800 text-white'}`}>
                    {msg.isBot ? <Brain size={18} /> : <User size={18} />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.isBot ? 'bg-slate-50 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-xs shadow-xs' : 'bg-gradient-to-r from-red-700 via-[#990000] to-rose-700 text-white rounded-tr-xs shadow-md shadow-red-950/10'}`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start gap-3.5 max-w-[85%] self-start">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs bg-gradient-to-br from-red-700 via-[#990000] to-rose-800 text-white">
                    <Brain size={18} />
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-xs shadow-xs flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-[#990000] dark:text-red-400" />
                    <span className="text-xs font-bold animate-pulse">Anka yanıt hazırlıyor...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="bg-white dark:bg-[#111827] p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2 focus-within:border-[#990000] focus-within:ring-2 focus-within:ring-red-100 dark:focus-within:ring-red-950/40 transition-all">
              <input 
                type="text" 
                className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 px-4 py-3 placeholder-slate-500 dark:placeholder-slate-400 text-sm font-medium"
                placeholder="Kariyerin, stajların, sanayi işbirlikleri veya mülakat hazırlığın hakkında Anka'ya danış..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isTyping}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-3 bg-gradient-to-r from-red-700 via-[#990000] to-rose-700 hover:opacity-95 disabled:opacity-40 text-white rounded-xl transition shadow-md shadow-red-950/10 flex items-center justify-center cursor-pointer shrink-0"
                title="Gönder"
              >
                <Send size={18} />
              </button>
            </div>
          </>
        ) : (
          /* Gemini Visual Generation & Editing Studio */
          <div className="flex-1 overflow-y-auto rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 shadow-xs p-5 md:p-6 flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <ImageIcon size={18} className="text-[#990000] dark:text-red-400" />
                  <span>KGM Kurumsal Görsel Üretim & Düzenleme Stüdyosu</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Kulüp etkinlikleri, sempozyumlar, sanayi zirveleri ve kariyer paylaşımları için görsel oluşturun veya mevcut bir görseli düzenleyin.
                </p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/50 text-[#990000] dark:text-red-300 border border-red-200/60 dark:border-red-900/50 shrink-0">
                gemini-3.8-flash • KGM Stüdyo
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-3">
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
                  Görsel Açıklaması veya Düzenleme Komutu
                </label>
                <textarea
                  rows={3}
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="Örn: İstanbul Esenyurt Üniversitesi Mühendislik ve Sanayi İşbirliği Sempozyumu için modern, lacivert ve bordo tonlarda kurumsal afiş..."
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-3.5 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:border-[#990000]"
                />
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">En-Boy Oranı:</span>
                    {['16:9', '1:1', '4:3'].map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setAspectRatio(ratio)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border transition cursor-pointer ${
                          aspectRatio === ratio
                            ? 'bg-[#990000] text-white border-[#990000]'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage || !imagePrompt.trim()}
                    className="ml-auto px-5 py-2.5 rounded-xl bg-[#990000] hover:bg-red-800 disabled:opacity-50 text-white font-extrabold text-xs flex items-center gap-2 shadow-sm cursor-pointer transition"
                  >
                    {isGeneratingImage ? <Loader2 size={15} className="animate-spin" /> : <Wand2 size={15} />}
                    <span>{uploadedImage ? 'Görseli Düzenle' : 'Görsel Oluştur'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
                  Referans / Düzenlenecek Görsel (İsteğe Bağlı)
                </label>
                <label className="flex flex-col items-center justify-center h-32 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-[#990000] bg-slate-50/60 dark:bg-slate-800/40 cursor-pointer transition p-3 text-center">
                  {uploadedImage ? (
                    <img src={uploadedImage} alt="Yüklenen" className="max-h-24 object-contain rounded-lg" />
                  ) : (
                    <>
                      <Upload size={20} className="text-slate-400 mb-1.5" />
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Görsel Yükle</span>
                      <span className="text-[10px] text-slate-400">PNG / JPG</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                {uploadedImage && (
                  <button
                    type="button"
                    onClick={() => setUploadedImage(null)}
                    className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline"
                  >
                    Referans görseli kaldır
                  </button>
                )}
              </div>
            </div>

            {generatedImageResult && (
              <div className="mt-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
                    Üretilen Görsel ({generatedImageResult.model})
                  </span>
                  <a
                    href={generatedImageResult.imageUrl}
                    download="iesu-kgm-gorsel.png"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold hover:opacity-90 transition"
                  >
                    <Download size={13} />
                    <span>İndir</span>
                  </a>
                </div>
                <div className="rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center max-h-80">
                  <img
                    src={generatedImageResult.imageUrl}
                    alt="Üretilen KGM Görseli"
                    className="max-h-80 w-auto object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        )}
        
        <p className="text-center text-[11px] font-bold text-slate-600 dark:text-slate-400 mt-3 flex items-center justify-center gap-1.5">
          <Sparkles size={13} className="text-[#990000] dark:text-red-400" /> İESÜ Kariyer Geliştirme Koordinatörlüğü Akıllı Asistanı
        </p>
      </main>

      {/* Floating Bottom Dock */}
      {setView && (
        <SubPanelFloatingDock 
          currentUser={currentUser} 
          setView={setView} 
          setSelectedUserId={setSelectedUserId}
          userRole={userRole || 'student'}
          activeTab="anka"
        />
      )}
    </div>
  );
}
