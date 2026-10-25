import React, { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle2, X, Sparkles } from 'lucide-react';
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

  // Check if survey was already completed by the user
  const isSurveyCompleted = (surveyId) => {
    try {
      const sId = surveyId || 'SRV-101';
      const uId = currentUser?.id || 'guest';
      return (
        localStorage.getItem(`survey_filled_${sId}`) === 'true' ||
        localStorage.getItem(`survey_filled_${sId}_${uId}`) === 'true' ||
        localStorage.getItem('iesu_survey_completed_alumni') === 'true' ||
        sessionStorage.getItem(`survey_filled_${sId}`) === 'true' ||
        sessionStorage.getItem(`survey_filled_${sId}_${uId}`) === 'true' ||
        sessionStorage.getItem('iesu_survey_completed_alumni') === 'true'
      );
    } catch {
      return false;
    }
  };

  // Only open via explicit manual triggers (custom event) - NO automatic popups!
  useEffect(() => {
    const handleManualOpen = () => {
      // Find latest survey from store to reflect admin question changes, fallback to OFFICIAL_ALUMNI_SURVEY
      const storeSurvey = surveys.find(s => s.id === 'SRV-101');
      const surveyToOpen = isAlumni
        ? (storeSurvey && storeSurvey.questions?.length ? storeSurvey : OFFICIAL_ALUMNI_SURVEY)
        : (surveys.find(s => s.status === 'Aktif') || storeSurvey || OFFICIAL_ALUMNI_SURVEY);

      // If already completed, do not reopen; notify politely
      if (isSurveyCompleted(surveyToOpen?.id)) {
        if (window.toast?.info) {
          window.toast.info("Resmî mezun değerlendirme anketini daha önce tamamladınız. Katkınız için teşekkür ederiz!");
        }
        return;
      }

      setActiveSurvey(surveyToOpen);
      setIsOpen(true);
    };

    window.addEventListener('open-survey-popup', handleManualOpen);
    return () => window.removeEventListener('open-survey-popup', handleManualOpen);
  }, [isAlumni, surveys, currentUser]);

  if (!isOpen || !activeSurvey) return null;

  const totalQuestions = activeSurvey.questions?.length || 0;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const handleSelectScore = (questionId, score) => {
    const newAnswers = { ...answers, [questionId]: score };
    setAnswers(newAnswers);

    const answered = Object.keys(newAnswers).length;

    if (answered >= totalQuestions) {
      setTimeout(() => {
        // Build strictly anonymous response object (NO student/user identifying info: KVKK compliance)
        const anonymousResponse = {
          id: 'RESP_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
          submittedAt: new Date().toISOString(),
          scores: (activeSurvey.questions || []).map(q => newAnswers[q.id] || 0),
          answers: { ...newAnswers }
        };

        if (setSurveys) {
          setSurveys(surveys.map(s => {
            if (s.id === activeSurvey.id) {
              const existingRows = Array.isArray(s.responseRows) ? s.responseRows : [];
              return {
                ...s,
                responses: (s.responses || 0) + 1,
                responseRows: [...existingRows, anonymousResponse]
              };
            }
            return s;
          }));
        }

        const surveyId = activeSurvey.id;
        const userId = currentUser?.id || 'guest';
        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(`survey_filled_${surveyId}`, 'true');
            localStorage.setItem(`survey_filled_${surveyId}_${userId}`, 'true');
            localStorage.setItem('iesu_survey_completed_alumni', 'true');
            localStorage.setItem('iesu_survey_popup_dismissed', 'true');
          }
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem(`survey_filled_${surveyId}`, 'true');
            sessionStorage.setItem(`survey_filled_${surveyId}_${userId}`, 'true');
            sessionStorage.setItem('iesu_survey_completed_alumni', 'true');
            sessionStorage.setItem('iesu_survey_popup_dismissed', 'true');
          }
        } catch (_) {}

        if (window.toast?.success) {
          window.toast.success("✅ Değerlendirme yanıtlarınız anonim olarak kaydedildi. Katkınız için teşekkür ederiz!");
        }
        setIsOpen(false);
      }, 250);
    }
  };

  const handleDismiss = () => {
    const surveyId = activeSurvey?.id || 'SRV-101';
    const userId = currentUser?.id || 'guest';
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`survey_dismissed_${surveyId}_${userId}`, 'true');
        localStorage.setItem(`survey_dismissed_${surveyId}`, 'true');
        localStorage.setItem('iesu_survey_popup_dismissed', 'true');
      }
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(`survey_dismissed_${surveyId}_${userId}`, 'true');
        sessionStorage.setItem('iesu_survey_popup_dismissed', 'true');
      }
    } catch (_) {}
    setIsOpen(false);
  };

  // Theme configuration
  const theme = isAlumni ? {
    accentGlow: 'from-emerald-600 via-teal-500 to-emerald-700',
    iconBox: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badge: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    activeBtn: 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-black',
    hoverBtn: 'hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300',
    cardBorder: 'border-emerald-500/30'
  } : {
    accentGlow: 'from-red-600 via-amber-500 to-[#990000]',
    iconBox: 'bg-red-50 text-[#990000] border-red-100',
    badge: 'text-red-600 bg-red-50 border-red-100',
    activeBtn: 'bg-[#990000] text-white border-[#990000] shadow-sm font-black',
    hoverBtn: 'hover:bg-red-50 hover:text-[#990000] hover:border-red-300',
    cardBorder: 'border-red-500/25'
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] max-w-[420px] w-full font-sans transition-all animate-bounce-in">
      <div className={`bg-white rounded-2xl p-4 shadow-2xl border-2 ${theme.cardBorder} relative overflow-hidden backdrop-blur-xl`}>
        
        {/* Glow Accent Header Line */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${theme.accentGlow}`}></div>

        {/* Header & Controls */}
        <div className="flex items-center justify-between gap-2 mb-3 pt-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`p-1.5 rounded-xl border shrink-0 ${theme.iconBox}`}>
              <ClipboardList size={18} />
            </div>
            <div className="min-w-0">
              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border inline-block ${theme.badge}`}>
                Resmî Değerlendirme Anketi
              </span>
              <h3 className="font-black text-slate-900 text-xs truncate mt-0.5">{activeSurvey.title}</h3>
            </div>
          </div>
          
          <div className="flex items-center gap-1 shrink-0">
            <button 
              onClick={handleDismiss}
              className="text-[10px] font-bold text-slate-400 hover:text-slate-700 px-1.5 py-0.5 rounded hover:bg-slate-100 transition cursor-pointer"
              title="Kapat"
            >
              Bir daha gösterme
            </button>
            <button 
              onClick={handleDismiss}
              className="w-7 h-7 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center font-bold transition shrink-0 cursor-pointer"
              title="Kapat"
              aria-label="Kapat"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3 bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-emerald-500 h-full transition-all duration-300 rounded-full" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-2 px-1">
          <span>İlerleme: {answeredCount} / {totalQuestions} Yanıtlandı</span>
          <span className="text-emerald-700 font-black">%{progressPercent}</span>
        </div>

        {/* Compact Questions List (Kompakt ve ekranı kaplamayan tasarım) */}
        <div className="space-y-2 max-h-[44vh] overflow-y-auto custom-scrollbar pr-1">
          {(activeSurvey.questions || []).map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            return (
              <div 
                key={q.id || idx} 
                className={`p-2.5 rounded-xl border transition-all ${
                  isAnswered 
                    ? 'bg-emerald-50/40 border-emerald-200/80' 
                    : 'bg-slate-50 border-slate-200/70'
                }`}
              >
                <div className="flex items-start gap-1.5 mb-1.5">
                  <span className="text-[11px] font-black text-slate-800 shrink-0">
                    {idx + 1}.
                  </span>
                  <p className="text-[11px] font-bold text-slate-700 leading-snug flex-1">
                    {q.text ? q.text.replace(/^\d+[\.\)]\s*/, '') : ''}
                  </p>
                  {isAnswered && (
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                  )}
                </div>

                {/* 1-5 Compact Likert Buttons */}
                <div className="flex items-center justify-between gap-1">
                  {[1, 2, 3, 4, 5].map((score) => {
                    const isSelected = answers[q.id] === score;
                    return (
                      <button
                        key={score}
                        type="button"
                        onClick={() => handleSelectScore(q.id, score)}
                        className={`flex-1 h-7 rounded-lg text-xs font-black transition-all cursor-pointer border ${
                          isSelected 
                            ? theme.activeBtn 
                            : `bg-white text-slate-600 border-slate-200 ${theme.hoverBtn}`
                        }`}
                      >
                        {score}
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[9px] font-semibold text-slate-400 px-0.5 mt-1">
                  <span>1 - Yetersiz</span>
                  <span>5 - Mükemmel</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Compact Footer */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-medium text-slate-400">
          <span className="flex items-center gap-1 text-emerald-700 font-bold">
            <Sparkles size={12} /> Tıklayınca otomatik kaydedilir
          </span>
          <button 
            type="button" 
            onClick={handleDismiss} 
            className="text-slate-400 hover:text-slate-600 underline cursor-pointer"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
}
