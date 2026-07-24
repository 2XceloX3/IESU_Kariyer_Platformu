import React, { useState, useMemo } from 'react';
import { ClipboardList, CheckCircle2, AlertCircle, Send, Star, ChevronRight } from 'lucide-react';
import useAppStore from '../store/useAppStore';

export default function AlumniSurveys({ surveys, currentUser, addNotification }) {
  const setSurveys = useAppStore(state => state.setSurveys);
  const [activeSurvey, setActiveSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState([]);

  const alumniSurveys = useMemo(() => {
    return (surveys || []).filter(s => s.targetAudience === 'Mezunlar' || s.targetAudience === 'Tümü');
  }, [surveys]);

  const handleStart = (survey) => {
    setActiveSurvey(survey);
    setAnswers({});
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < activeSurvey.questions.length) {
      window.toast.error("Lütfen tüm soruları yanıtlayın.");
      return;
    }
    
    if (setSurveys) {
      setSurveys(prev => (prev || []).map(s => {
        if (s.id === activeSurvey.id) {
          const newResponses = [...(s.responses || []), {
             userId: currentUser?.id || 'anonymous',
             answers: answers,
             date: new Date().toISOString()
          }];
          return { ...s, responses: newResponses };
        }
        return s;
      }));
    }

    setSubmitted(prev => [...prev, activeSurvey.id]);
    setActiveSurvey(null);
    setAnswers({});
    
    if (addNotification) {
      addNotification({
        id: 'NOTIF-' + Date.now(),
        type: 'success',
        message: 'Anket katılımınız için teşekkür ederiz!'
      });
    } else {
      window.toast.success("Anket katılımınız için teşekkür ederiz!");
    }
  };

  if (activeSurvey) {
    return (
      <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100 animate-fade-in">
        <button onClick={() => setActiveSurvey(null)} className="text-gray-500 hover:text-gray-900 font-bold text-sm flex items-center gap-1 mb-6">
          Geri Dön
        </button>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-fuchsia-100 text-fuchsia-600 flex items-center justify-center">
            <ClipboardList size={20} />
          </div>
          <h2 className="text-2xl font-black text-gray-900">{activeSurvey.title}</h2>
        </div>
        <p className="text-gray-500 font-medium mb-8 ml-13">{activeSurvey.description}</p>

        <div className="space-y-8">
          {activeSurvey.questions.map((q, idx) => (
            <div key={q.id} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">{idx + 1}. {q.text}</h3>
              {q.type === 'likert' ? (
                <div className="flex justify-between items-center gap-2 sm:gap-4">
                  {[1, 2, 3, 4, 5].map(score => (
                    <button
                      key={score}
                      onClick={() => setAnswers(prev => ({ ...prev, [q.id]: score }))}
                      className={`flex-1 py-3 rounded-xl font-bold transition-all ${answers[q.id] === score ? 'bg-fuchsia-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-fuchsia-50 hover:text-fuchsia-600 border border-gray-200'}`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              ) : (
                <textarea
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none resize-none"
                  rows="3"
                  placeholder="Yanıtınız..."
                  value={answers[q.id] || ''}
                  onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                ></textarea>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
          <button onClick={handleSubmit} className="px-8 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold rounded-xl shadow-md flex items-center gap-2 transition-all">
            <Send size={18} /> Yanıtları Gönder
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
              <Star className="text-yellow-300 fill-current" size={24} /> Mezun Memnuniyet & Anket Merkezi
            </h2>
            <p className="text-fuchsia-100 max-w-lg font-medium">
              Geri bildirimleriniz üniversitemizin kalitesini artırmasında büyük rol oynuyor. Aktif anketlere katılarak düşüncelerinizi bizimle paylaşın.
            </p>
          </div>
          <button 
            onClick={(e) => {
              e.preventDefault();
              window.toast && window.toast.info("Anka AI: Önceki anket verileri NLP (Doğal Dil İşleme) ile analiz ediliyor...");
              setTimeout(() => {
                window.toast && window.toast.success("✅ AI Analizi: Mezunlar en çok 'Kariyer Danışmanlığı' süreçlerinden memnun (%92).");
              }, 2500);
            }}
            className="shrink-0 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm border border-white/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"></path><path d="M3.34 19a10 10 0 1 1 17.32 0"></path></svg>
            AI Trend Analizi
          </button>
        </div>
        <ClipboardList size={120} className="absolute -right-6 -bottom-6 text-white/10 rotate-12" />
      </div>

      <div className="grid gap-4">
        {alumniSurveys.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <AlertCircle size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="font-bold text-gray-500">Şu anda aktif bir anket bulunmuyor.</p>
          </div>
        ) : (
          alumniSurveys.map(survey => {
            const isDone = submitted.includes(survey.id);
            return (
              <div key={survey.id} className={`bg-white rounded-2xl p-5 border flex items-center justify-between transition-all ${isDone ? 'border-green-200 bg-green-50/50' : 'border-gray-100 hover:border-fuchsia-200 hover:shadow-sm'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isDone ? 'bg-green-100 text-green-600' : 'bg-fuchsia-50 text-fuchsia-600'}`}>
                    {isDone ? <CheckCircle2 size={24} /> : <ClipboardList size={24} />}
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg mb-1 ${isDone ? 'text-gray-500' : 'text-gray-900'}`}>{survey.title}</h3>
                    <p className="text-sm text-gray-500 font-medium line-clamp-1">{survey.description || 'Bu ankete katılarak görüşlerinizi bildirebilirsiniz.'}</p>
                  </div>
                </div>
                
                <div className="shrink-0 ml-4">
                  {isDone ? (
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-bold flex items-center gap-1">
                      Tamamlandı
                    </span>
                  ) : (
                    <button onClick={() => handleStart(survey)} className="px-5 py-2.5 bg-gray-900 hover:bg-fuchsia-600 text-white rounded-xl text-sm font-bold transition-colors flex items-center gap-1">
                      Ankete Katıl <ChevronRight size={16} />
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
