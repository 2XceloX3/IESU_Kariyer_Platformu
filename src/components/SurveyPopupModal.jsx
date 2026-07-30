import React, { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle2, X, Star, Clock, Send, Sparkles } from 'lucide-react';
import useAppStore from '../store/useAppStore';

export default function SurveyPopupModal({ currentUser, userRole }) {
  const surveys = useAppStore(state => state.surveys) || [];
  const setSurveys = useAppStore(state => state.setSurveys);
  
  const [activeSurvey, setActiveSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Giriş yapılmamış kullanıcılara anket gösterilmez
    if (!currentUser && !userRole) return;
    if (userRole === 'guest' || (!currentUser?.id && !userRole)) return;

    // 1. Kullanıcı türünü belirle
    const currentRole = userRole || currentUser?.role;

    // 2. Bugünün tarihi ve aktif anketleri filtrele
    const now = new Date();

    const eligibleSurvey = surveys.find(s => {
      // Yayın durdurulmuş veya Kapalı ise gösterme
      if (s.status !== 'Aktif') return false;

      // Gün Sınırı ve Süre Kontrolü (Bitiş Tarihi geçmişse otomatik kapat)
      if (s.durationDays && s.createdAt) {
        const createdDate = new Date(s.createdAt);
        const expiryDate = new Date(createdDate.getTime() + (parseInt(s.durationDays, 10) * 24 * 60 * 60 * 1000));
        if (now > expiryDate) {
          // Anketi otomatik kapat
          return false;
        }
      }

      // Hedef Kitle Kontrolü (Çoklu Seçim Desteği)
      const audiences = Array.isArray(s.targetAudiences) && s.targetAudiences.length > 0
        ? s.targetAudiences
        : (s.targetAudience ? s.targetAudience.split(',').map(item => item.trim()) : ['Tümü']);

      if (audiences.includes('Tümü')) return true;
      if (audiences.includes('Öğrenciler') && currentRole === 'student') return true;
      if (audiences.includes('Mezunlar') && (currentRole === 'alumni' || currentRole === 'mezun')) return true;
      if (audiences.includes('Firmalar') && (currentRole === 'company' || currentRole === 'employer')) return true;
      if (audiences.includes('Akademik') && currentRole === 'academic') return true;

      return false;
    });

    if (eligibleSurvey) {
      // Önceden bu anketi doldurdu mu kontrol et (sessionStorage)
      const filledKey = `survey_filled_${eligibleSurvey.id}_${currentUser?.id || 'guest'}`;
      const dismissedKey = `survey_dismissed_${eligibleSurvey.id}_${currentUser?.id || 'guest'}`;

      if (!sessionStorage.getItem(filledKey) && !sessionStorage.getItem(dismissedKey)) {
        setActiveSurvey(eligibleSurvey);
        setIsOpen(true);
      }
    }
  }, [surveys, currentUser, userRole]);

  if (!isOpen || !activeSurvey) return null;

  const handleSelectScore = (questionId, score) => {
    const newAnswers = { ...answers, [questionId]: score };
    setAnswers(newAnswers);

    // KURAL: Doldurur doldurmaz kendi otomatik gönderip kapansın!
    // Tüm sorular yanıtlandı mı kontrol et
    const totalQuestions = activeSurvey.questions?.length || 0;
    const answeredCount = Object.keys(newAnswers).length;

    if (answeredCount >= totalQuestions) {
      setTimeout(() => {
        // Anketi Kaydet ve Yanıt Sayısını Artır
        if (setSurveys) {
          setSurveys(surveys.map(s => s.id === activeSurvey.id ? {
            ...s,
            responses: (s.responses || 0) + 1
          } : s));
        }

        // Anket dolduruldu bilgisini işaretle
        const filledKey = `survey_filled_${activeSurvey.id}_${currentUser?.id || 'guest'}`;
        sessionStorage.setItem(filledKey, 'true');

        if (window.toast) window.toast.success("✅ Anket yanıtınız otomatik olarak kaydedildi. Teşekkür ederiz!");
        setIsOpen(false);
      }, 300);
    }
  };

  const handleDismiss = () => {
    const dismissedKey = `survey_dismissed_${activeSurvey.id}_${currentUser?.id || 'guest'}`;
    sessionStorage.setItem(dismissedKey, 'true');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] max-w-md w-full animate-bounce-in font-sans">
      <div className="bg-white rounded-3xl p-6 shadow-2xl border-2 border-red-500/20 relative overflow-hidden backdrop-blur-xl">
        
        {/* Glow Accent Header */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-amber-500 to-[#990000]"></div>

        {/* Header & X Button */}
        <div className="flex items-start justify-between gap-3 mb-4 pt-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-50 text-[#990000] rounded-2xl border border-red-100 shrink-0">
              <ClipboardList size={22} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-red-600 tracking-wider bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                Resmî Değerlendirme Anketi
              </span>
              <h3 className="font-black text-slate-900 text-sm leading-snug mt-1">{activeSurvey.title}</h3>
            </div>
          </div>
          
          <button 
            onClick={handleDismiss}
            className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center font-bold transition shrink-0 cursor-pointer"
            title="Kapat"
          >
            <X size={16} />
          </button>
        </div>

        {activeSurvey.description && (
          <p className="text-xs text-slate-500 font-medium mb-4 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
            {activeSurvey.description}
          </p>
        )}

        {/* Questions List */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
          {(activeSurvey.questions || []).map((q, idx) => (
            <div key={q.id || idx} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
              <p className="text-xs font-black text-slate-800 leading-snug">
                {idx + 1}. {q.text}
              </p>

              {/* 1-5 Likert Scale - Direct Click auto-submits */}
              <div className="flex items-center justify-between gap-1 pt-1">
                {[1, 2, 3, 4, 5].map((score) => {
                  const isSelected = answers[q.id] === score;
                  return (
                    <button
                      key={score}
                      type="button"
                      onClick={() => handleSelectScore(q.id, score)}
                      className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                        isSelected 
                          ? 'bg-[#990000] text-white border-[#990000] shadow-md scale-105' 
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-red-50 hover:text-[#990000]'
                      }`}
                    >
                      {score}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 px-1">
                <span>Kesinlikle Katılmıyorum</span>
                <span>Kesinlikle Katılıyorum</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
          <span className="flex items-center gap-1 text-emerald-600"><Sparkles size={13} /> Seçtiğiniz anda otomatik iletilir</span>
          <span>İESÜ KGM</span>
        </div>

      </div>
    </div>
  );
}
