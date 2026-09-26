import React, { useState, useMemo } from 'react';
import { ClipboardList, CheckCircle2, AlertCircle, Send, Star, ChevronRight, Award } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import eventBus from '../brain/eventBus';

export default function StudentSurveys({ surveys, currentUser, addNotification }) {
  const setSurveys = useAppStore(state => state.setSurveys);
  const logAction = useAppStore(state => state.logAction);
  const [activeSurvey, setActiveSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState([]);

  // Students see surveys targeted for students or all students
  const studentSurveys = useMemo(() => {
    const list = (surveys || []).filter(s => 
      s.targetAudience === 'Öğrenciler' || 
      s.targetAudience === 'Tümü' || 
      !s.targetAudience || 
      s.targetAudience?.includes('Öğrenci')
    );
    if (list.length > 0) return list;
    return [
      {
        id: 'SRV-STU-01',
        title: '2026 Öğrenci Kariyer ve Staj Beklentileri Araştırması',
        description: 'İESÜ Kariyer Koordinatörlüğü olarak staj imkanları, sektör buluşmaları ve atölye beklentilerinizi öğrenmek istiyoruz.',
        date: '2026-08-20',
        status: 'Aktif',
        type: 'Kariyer Anketi',
        targetAudience: 'Öğrenciler',
        responses: 86,
        questions: [
          { id: 'q1', text: 'Üniversitemizin sunduğu staj ve kariyer rehberliği hizmetlerinden ne derece memnunsunuz?', type: 'likert' },
          { id: 'q2', text: 'En çok hangi sektörde mentorluk ve kariyer atölyesi talep ediyorsunuz?', type: 'text' }
        ]
      },
      {
        id: 'SRV-102',
        title: 'Kariyer Geliştirme Koordinatörlüğü Hizmetleri Değerlendirmesi',
        description: 'İESÜ Kariyer Geliştirme Koordinatörlüğü\'nin sunduğu hizmetlerden ne kadar faydalandınız?',
        date: '2026-07-10',
        status: 'Aktif',
        type: 'Etkinlik Değerlendirme',
        targetAudience: 'Tümü',
        responses: 112,
        questions: [
          { id: 'q1', text: 'Kariyer merkezimizin ilanlarını ne sıklıkla takip ediyorsunuz?', type: 'likert' }
        ]
      }
    ];
  }, [surveys]);

  const handleStart = (survey) => {
    setActiveSurvey(survey);
    setAnswers({});
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < (activeSurvey?.questions?.length || 1)) {
      window.toast?.error?.("Lütfen tüm soruları yanıtlayın.");
      return;
    }
    
    if (setSurveys) {
      setSurveys(prev => (prev || []).map(s => {
        if (s.id === activeSurvey.id) {
          const newResponses = [...(s.responses || []), {
             userId: currentUser?.id || 'anonymous_student',
             answers: answers,
             date: new Date().toISOString()
          }];
          return { ...s, responses: newResponses };
        }
        return s;
      }));
    }

    try {
      eventBus.emit('audit:logged', {
        action: 'Anket Tamamlandı: ' + activeSurvey.title,
        user: currentUser?.name || 'Öğrenci',
        module: 'Anket',
        timestamp: new Date().toISOString()
      });
    } catch (_) {}

    if (logAction) {
      logAction(currentUser?.name || 'Öğrenci', `Kariyer anketi dolduruldu: ${activeSurvey.title}`, 'Anket', 'info');
    }

    setSubmitted(prev => [...prev, activeSurvey.id]);
    setActiveSurvey(null);
    setAnswers({});
    
    if (addNotification) {
      addNotification({
        id: 'NOTIF-' + Date.now(),
        type: 'success',
        message: 'Kariyer anketine katılımınız için teşekkür ederiz!'
      });
    } else {
      window.toast?.success?.("Kariyer anketine katılımınız için teşekkür ederiz!");
    }
  };

  if (activeSurvey) {
    return (
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 animate-fade-in">
        <button onClick={() => setActiveSurvey(null)} className="text-gray-500 hover:text-gray-900 font-bold text-sm flex items-center gap-1 mb-6 transition">
          ← Geri Dön
        </button>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-[#990000] flex items-center justify-center font-bold">
            <ClipboardList size={20} />
          </div>
          <h2 className="text-xl font-black text-gray-900">{activeSurvey.title}</h2>
        </div>
        <p className="text-gray-500 text-sm font-medium mb-8 ml-13">{activeSurvey.description}</p>

        <div className="space-y-6">
          {(activeSurvey.questions || []).map((q, idx) => (
            <div key={q.id} className="bg-gray-50/70 rounded-2xl p-5 border border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm mb-4">{idx + 1}. {q.text ? q.text.replace(/^\d+[\.\)]\s*/, '') : ''}</h3>
              {q.type === 'likert' ? (
                <div className="flex justify-between items-center gap-2 sm:gap-4">
                  {[1, 2, 3, 4, 5].map(score => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setAnswers(prev => ({ ...prev, [q.id]: score }))}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                        answers[q.id] === score 
                          ? 'bg-[#990000] text-white shadow-md' 
                          : 'bg-white text-gray-600 hover:bg-red-50 hover:text-[#990000] border border-gray-200'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              ) : (
                <textarea
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-red-200 focus:border-[#990000] outline-none text-sm resize-none"
                  rows="3"
                  placeholder="Düşüncelerinizi paylaşın..."
                  value={answers[q.id] || ''}
                  onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
          <button 
            type="button"
            onClick={handleSubmit} 
            className="px-7 py-3 bg-[#990000] hover:bg-red-700 text-white font-bold rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer text-sm"
          >
            <Send size={16} /> Yanıtları Gönder
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#990000] via-red-700 to-rose-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black mb-2 flex items-center gap-2 tracking-tight">
              <Award className="text-amber-300" size={24} /> Öğrenci Kariyer & Gelişim Anketleri
            </h2>
            <p className="text-red-100 max-w-lg text-sm font-medium leading-relaxed">
              Kariyer yolculuğunuzda ihtiyaç duyduğunuz staj, mentorluk ve gelişim alanlarını belirlemek için anketlerimize katılarak sesinizi duyurun.
            </p>
          </div>
          <div className="shrink-0 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-xs font-bold flex items-center gap-2">
            <ClipboardList size={16} /> {studentSurveys.length} Aktif Anket
          </div>
        </div>
        <ClipboardList size={140} className="absolute -right-6 -bottom-6 text-white/5 rotate-12 pointer-events-none" />
      </div>

      <div className="grid gap-4">
        {studentSurveys.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <AlertCircle size={40} className="mx-auto text-gray-400 mb-2" />
            <p className="font-bold text-gray-500 text-sm">Şu anda aktif öğrenci anketi bulunmuyor.</p>
          </div>
        ) : (
          studentSurveys.map(survey => {
            const isDone = submitted.includes(survey.id);
            return (
              <div 
                key={survey.id} 
                className={`bg-white rounded-2xl p-5 border flex items-center justify-between transition-all ${
                  isDone ? 'border-emerald-200 bg-emerald-50/40' : 'border-gray-100 hover:border-red-200 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    isDone ? 'bg-emerald-100 text-emerald-600' : 'bg-red-50 text-[#990000]'
                  }`}>
                    {isDone ? <CheckCircle2 size={22} /> : <ClipboardList size={22} />}
                  </div>
                  <div>
                    <h3 className={`font-bold text-base mb-1 ${isDone ? 'text-gray-500' : 'text-gray-900'}`}>
                      {survey.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium line-clamp-1">
                      {survey.description || 'Görüşleriniz kariyer gelişim merkezimiz için değerlidir.'}
                    </p>
                  </div>
                </div>
                
                <div className="shrink-0 ml-4">
                  {isDone ? (
                    <span className="px-3.5 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-black flex items-center gap-1">
                      <CheckCircle2 size={13} /> Tamamlandı
                    </span>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => handleStart(survey)} 
                      className="px-4 py-2 bg-[#990000] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      Ankete Katıl <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
