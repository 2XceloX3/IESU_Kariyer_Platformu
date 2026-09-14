import React, { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle2, X, Star, Clock, Send, Sparkles } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const OFFICIAL_ALUMNI_SURVEY = {
  id: 'SRV-101',
  title: 'İESÜ Mezun Kariyer ve Memnuniyet Değerlendirme Anketi',
  description: 'İESÜ Kalite Yönetim Akreditasyonu ve Kariyer Geliştirme Merkezi (KGM) resmi değerlendirme anketi. 10 soruluk değerlendirmeyi tamamlayarak mezun ekosistemine katkı sağlayın.',
  status: 'Aktif',
  type: 'Genel Anket',
  targetAudience: 'Mezunlar',
  questions: [
    { id: 'q1', text: '1. İESÜ akademik eğitiminin mesleki kariyerinize ve yetkinliğinize katkısını değerlendirin.', type: 'likert' },
    { id: 'q2', text: '2. Üniversitemizde aldığınız staj ve uygulamalı deneyimlerin kariyerinize olan faydasını değerlendirin.', type: 'likert' },
    { id: 'q3', text: '3. İESÜ Kariyer Geliştirme Merkezi (KGM) danışmanlık ve rehberlik hizmetlerinden memnuniyetiniz.', type: 'likert' },
    { id: 'q4', text: '4. Bölümünüzdeki teknik altyapı, yazılım ve laboratuvar olanaklarının yeterliliği.', type: 'likert' },
    { id: 'q5', text: '5. İESÜ akademisyen kadrosunun erişilebilirliği ve sunduğu mentörlük kalitesi.', type: 'likert' },
    { id: 'q6', text: '6. Üniversitemizde kazanılan yabancı dil ve iletişim becerilerinin sektördeki yeterliliği.', type: 'likert' },
    { id: 'q7', text: '7. İESÜ Mezun Ağı ve mezunlar arası dayanışma platformunun etkililiği.', type: 'likert' },
    { id: 'q8', text: '8. Aktif İESÜ öğrencilerine mentörlük verme veya iş/staj fırsatı sağlama isteğiniz.', type: 'likert' },
    { id: 'q9', text: '9. İESÜ diplomasının iş dünyasında ve sektörünüzde sağladığı prestij seviyesi.', type: 'likert' },
    { id: 'q10', text: '10. İESÜ Kariyer Geliştirme Merkezi ve üniversitemizden genel memnuniyet seviyeniz.', type: 'likert' }
  ]
};

export default function SurveyPopupModal({ currentUser, userRole, currentView, activePortalBranch }) {
  const surveys = useAppStore(state => state.surveys) || [];
  const setSurveys = useAppStore(state => state.setSurveys);
  
  const [activeSurvey, setActiveSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  // Active branch & role resolution
  const effectiveBranch = activePortalBranch || (currentView === 'alumni' ? 'alumni' : (currentView === 'student' ? 'student' : (currentView === 'company' ? 'company' : (currentView === 'academic' ? 'academic' : null))));
  const isAlumni = effectiveBranch === 'alumni' || userRole === 'alumni' || currentUser?.role === 'alumni' || currentView === 'alumni';
  const currentRole = isAlumni ? 'alumni' : (effectiveBranch || userRole || currentUser?.role);

  // Listen for explicit manual opening triggers
  useEffect(() => {
    const handleManualOpen = () => {
      const surveyToOpen = isAlumni
        ? OFFICIAL_ALUMNI_SURVEY
        : (surveys.find(s => s.status === 'Aktif') || OFFICIAL_ALUMNI_SURVEY);
      setActiveSurvey(surveyToOpen);
      setIsOpen(true);
    };

    window.addEventListener('open-survey-popup', handleManualOpen);
    return () => window.removeEventListener('open-survey-popup', handleManualOpen);
  }, [isAlumni, surveys]);

  // Automatic evaluation popup trigger upon entering relevant panels
  useEffect(() => {
    // Giriş yapılmamış kullanıcılara anket gösterilmez
    if (!currentUser && !userRole && !currentView) return;
    if (userRole === 'guest' || (!currentUser?.id && !userRole && !currentView)) return;

    const now = new Date();

    let eligibleSurvey = surveys.find(s => {
      if (s.status !== 'Aktif') return false;

      if (s.durationDays && s.createdAt) {
        const createdDate = new Date(s.createdAt);
        const expiryDate = new Date(createdDate.getTime() + (parseInt(s.durationDays, 10) * 24 * 60 * 60 * 1000));
        if (now > expiryDate) return false;
      }

      const audiences = Array.isArray(s.targetAudiences) && s.targetAudiences.length > 0
        ? s.targetAudiences
        : (s.targetAudience ? s.targetAudience.split(',').map(item => item.trim()) : ['Tümü']);

      if (audiences.includes('Tümü')) return true;
      if (audiences.includes('Öğrenciler') && currentRole === 'student') return true;
      if (audiences.includes('Mezunlar') && (currentRole === 'alumni' || currentRole === 'mezun' || isAlumni)) return true;
      if (audiences.includes('Firmalar') && (currentRole === 'company' || currentRole === 'employer')) return true;
      if (audiences.includes('Akademik') && currentRole === 'academic') return true;

      return false;
    });

    // If in Alumni view/branch, ensure official Alumni Evaluation Survey is selected
    if (isAlumni) {
      if (!eligibleSurvey || eligibleSurvey.id === 'SRV-101' || !eligibleSurvey.questions || eligibleSurvey.questions.length < 5) {
        eligibleSurvey = OFFICIAL_ALUMNI_SURVEY;
      }
    }

    if (eligibleSurvey) {
      // 10 Likert Değerlendirme Sorusu güvencesi
      if (eligibleSurvey.id === 'SRV-101' || (eligibleSurvey.questions && eligibleSurvey.questions[0]?.text?.includes('istihdam durumunuz'))) {
        eligibleSurvey = OFFICIAL_ALUMNI_SURVEY;
      }

      const filledKey = `survey_filled_${eligibleSurvey.id}_${currentUser?.id || 'guest'}`;
      const dismissedKey = `survey_dismissed_${eligibleSurvey.id}_${currentUser?.id || 'guest'}`;

      if (!sessionStorage.getItem(filledKey) && !sessionStorage.getItem(dismissedKey)) {
        setActiveSurvey(eligibleSurvey);
        // Smooth entrance delay
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [surveys, currentUser, userRole, currentView, activePortalBranch, isAlumni, currentRole]);

  if (!isOpen || !activeSurvey) return null;

  const handleSelectScore = (questionId, score) => {
    const newAnswers = { ...answers, [questionId]: score };
    setAnswers(newAnswers);

    const totalQuestions = activeSurvey.questions?.length || 0;
    const answeredCount = Object.keys(newAnswers).length;

    if (answeredCount >= totalQuestions) {
      setTimeout(() => {
        if (setSurveys) {
          setSurveys(surveys.map(s => s.id === activeSurvey.id ? {
            ...s,
            responses: (s.responses || 0) + 1
          } : s));
        }

        const filledKey = `survey_filled_${activeSurvey.id}_${currentUser?.id || 'guest'}`;
        sessionStorage.setItem(filledKey, 'true');

        if (window.toast) window.toast.success("✅ Değerlendirme yanıtlarınız otomatik olarak kaydedildi. Teşekkür ederiz!");
        setIsOpen(false);
      }, 300);
    }
  };

  const handleDismiss = () => {
    const dismissedKey = `survey_dismissed_${activeSurvey.id}_${currentUser?.id || 'guest'}`;
    sessionStorage.setItem(dismissedKey, 'true');
    setIsOpen(false);
  };

  // Branch Adaptive Theme
  const theme = isAlumni ? {
    accentGlow: 'from-emerald-600 via-teal-500 to-emerald-700',
    iconBox: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badge: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    activeBtn: 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-105',
    hoverBtn: 'hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300',
    cardBorder: 'border-emerald-500/25',
    brandName: 'İESÜ Mezun İlişkileri Koordinatörlüğü'
  } : {
    accentGlow: 'from-red-600 via-amber-500 to-[#990000]',
    iconBox: 'bg-red-50 text-[#990000] border-red-100',
    badge: 'text-red-600 bg-red-50 border-red-100',
    activeBtn: 'bg-[#990000] text-white border-[#990000] shadow-md scale-105',
    hoverBtn: 'hover:bg-red-50 hover:text-[#990000] hover:border-red-300',
    cardBorder: 'border-red-500/20',
    brandName: 'İESÜ Kariyer Geliştirme Merkezi (KGM)'
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] max-w-md w-full animate-bounce-in font-sans">
      <div className={`bg-white rounded-3xl p-6 shadow-2xl border-2 ${theme.cardBorder} relative overflow-hidden backdrop-blur-xl`}>
        
        {/* Glow Accent Header */}
        <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${theme.accentGlow}`}></div>

        {/* Header & X Button */}
        <div className="flex items-start justify-between gap-3 mb-4 pt-1">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl border shrink-0 ${theme.iconBox}`}>
              <ClipboardList size={22} />
            </div>
            <div>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${theme.badge}`}>
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
                {idx + 1}. {q.text ? q.text.replace(/^\d+[\.\)]\s*/, '') : ''}
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
                          ? theme.activeBtn 
                          : `bg-white text-slate-700 border-slate-200 ${theme.hoverBtn}`
                      }`}
                    >
                      {score}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 px-1">
                <span>1 - Yetersiz</span>
                <span>5 - Mükemmel</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
          <span className="flex items-center gap-1 text-emerald-600"><Sparkles size={13} /> Seçtiğiniz anda otomatik kaydedilir</span>
          <span>{theme.brandName}</span>
        </div>

      </div>
    </div>
  );
}
