import React, { useState, useMemo } from 'react';
import { Building2, CheckCircle2, AlertCircle, Send, Star, ChevronRight, FileSpreadsheet } from 'lucide-react';
import useAppStore from '../store/useAppStore';

export default function CompanySurveys({ surveys, currentUser, addNotification }) {
  const setSurveys = useAppStore(state => state.setSurveys);
  const [activeSurvey, setActiveSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState([]);

  const defaultCompanySurveys = useMemo(() => [
    {
      id: 'CMP-SRV-2026-1',
      title: 'İESÜ Mezun İstihdamı & İşveren Memnuniyet Anketi',
      description: 'Kurumunuzda istihdam edilen İESÜ mezunlarının mesleki yetkinlikleri ve iş başı performans değerlendirmesi.',
      targetAudience: 'Firmalar',
      reward: 'YÖK Akreditasyon Katkı Belgesi',
      deadline: '15 Kasım 2026',
      questions: [
        {
          id: 'q1',
          text: 'İESÜ mezunlarının teorik altyapı ve analitik düşünme yetkinliklerini nasıl değerlendirirsiniz?',
          type: 'rating',
          max: 5
        },
        {
          id: 'q2',
          text: 'Mezunlarımızın takım çalışması ve kurumsal adaptasyon seviyesinden memnun musunuz?',
          type: 'rating',
          max: 5
        },
        {
          id: 'q3',
          text: 'Önümüzdeki dönemde staj veya tam zamanlı pozisyonlar için İESÜ öğrencilerine öncelik vermeyi planlıyor musunuz?',
          type: 'choice',
          options: ['Kesinlikle Evet', 'Muhtemelen Evet', 'Kararsızım', 'Hayır']
        },
        {
          id: 'q4',
          text: 'Müfredatımızın sektörün güncel ihtiyaçlarıyla daha uyumlu olması için önereceğiniz temel yetkinlikler nelerdir?',
          type: 'text'
        }
      ]
    },
    {
      id: 'CMP-SRV-2026-2',
      title: 'Zorunlu Staj (SGK 5510) & Üniversite-Sanayi İşbirliği Değerlendirmesi',
      description: 'Stajyer kabul süreçleri, SGK bildirim entegrasyonu ve üniversite staj komisyonu iletişim memnuniyeti.',
      targetAudience: 'Firmalar',
      reward: 'Kurumsal Paydaş Teşekkür Sertifikası',
      deadline: '30 Aralık 2026',
      questions: [
        {
          id: 'q1',
          text: 'İESÜ Kariyer Merkezi staj ve SGK 5510 evrak onay süreçlerinin hızından memnun musunuz?',
          type: 'rating',
          max: 5
        },
        {
          id: 'q2',
          text: 'Ortak Ar-Ge veya bitirme projesi mentörlüğü kapsamında üniversitemizle işbirliği yapmak ister misiniz?',
          type: 'choice',
          options: ['Evet, hemen görüşmek isteriz', 'Gelecek dönem değerlendirebiliriz', 'Şu an gündemimizde yok']
        }
      ]
    }
  ], []);

  const companySurveys = useMemo(() => {
    const list = (surveys || []).filter(s => 
      s.targetAudience === 'Firmalar' || 
      s.targetAudience === 'İşverenler' || 
      s.targetAudience === 'Sektör' || 
      s.targetAudience === 'Tümü'
    );
    return list.length > 0 ? list : defaultCompanySurveys;
  }, [surveys, defaultCompanySurveys]);

  const handleStart = (survey) => {
    setActiveSurvey(survey);
    setAnswers({});
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < activeSurvey.questions.length) {
      window.toast?.error?.("Lütfen tüm soruları yanıtlayın.") || alert("Lütfen tüm soruları yanıtlayın.");
      return;
    }
    
    if (setSurveys) {
      setSurveys(prev => (prev || []).map(s => {
        if (s.id === activeSurvey.id) {
          const newResponses = [...(s.responses || []), {
             userId: currentUser?.id || 'anonymous_company',
             companyName: currentUser?.name || 'Kurumsal Firma',
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
        message: 'İşveren anketine katılımınız için teşekkür ederiz! Yanıtlarınız müfredat güncellemelerine dahil edilmiştir.'
      });
    } else {
      window.toast?.success?.('İşveren değerlendirmeniz başarıyla kaydedildi.') || alert('İşveren değerlendirmeniz başarıyla kaydedildi.');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm font-sans">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="p-3 bg-gradient-to-br from-slate-900 via-[#0A2342] to-blue-950 rounded-xl text-white shadow-md">
          <Building2 size={24} />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900 leading-tight">İşveren & Sektörel Değerlendirme Anketleri</h2>
          <p className="text-xs text-slate-500 font-medium">YÖK Kalite Güvencesi ve İESÜ Müfredat Geliştirme Süreçlerine Katkınız</p>
        </div>
      </div>

      {activeSurvey ? (
        <div className="animate-fade-in bg-slate-50/70 p-5 rounded-2xl border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded-md mb-1 inline-block">
                Kurumsal Form
              </span>
              <h3 className="text-base font-black text-slate-900">{activeSurvey.title}</h3>
              <p className="text-xs text-slate-600 mt-1">{activeSurvey.description}</p>
            </div>
            <button 
              onClick={() => setActiveSurvey(null)}
              className="text-xs text-slate-400 hover:text-slate-700 font-bold px-3 py-1 bg-white border border-slate-200 rounded-lg transition"
            >
              Vazgeç
            </button>
          </div>

          <div className="space-y-4 my-6">
            {activeSurvey.questions.map((q, idx) => (
              <div key={q.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <p className="text-xs font-bold text-slate-800 mb-3 flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-[#0A2342] text-white rounded-full flex items-center justify-center text-[10px] font-black">
                    {idx + 1}
                  </span>
                  <span>{q.text}</span>
                </p>

                {q.type === 'rating' && (
                  <div className="flex items-center gap-2 pl-7">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setAnswers(prev => ({ ...prev, [q.id]: num }))}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                          answers[q.id] >= num
                            ? 'bg-[#0A2342] text-white shadow-sm scale-105'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                    <span className="text-[10px] text-slate-400 ml-2 font-bold">(1: En Düşük, 5: En Yüksek)</span>
                  </div>
                )}

                {q.type === 'choice' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7">
                    {q.options.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                        className={`text-left text-xs p-2.5 rounded-xl border transition-all ${
                          answers[q.id] === opt
                            ? 'bg-blue-50 border-[#0A2342] text-[#0A2342] font-black'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {q.type === 'text' && (
                  <div className="pl-7">
                    <textarea
                      rows={3}
                      value={answers[q.id] || ''}
                      onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                      placeholder="Görüş ve önerilerinizi buraya yazabilirsiniz..."
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#0A2342] focus:ring-1 focus:ring-[#0A2342] outline-none transition"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-slate-900 via-[#0A2342] to-blue-900 hover:opacity-95 text-white text-xs font-black rounded-xl transition shadow-md shadow-blue-950/20"
            >
              <Send size={14} />
              Değerlendirmeyi Gönder
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {companySurveys.map(survey => {
            const isDone = submitted.includes(survey.id);
            return (
              <div 
                key={survey.id}
                className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-slate-300 transition shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 bg-blue-100 px-2 py-0.5 rounded-md">
                      {survey.targetAudience}
                    </span>
                    {isDone ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={12} /> Tamamlandı
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500">
                        Bitiş: {survey.deadline}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-black text-slate-900 leading-snug mb-1">{survey.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">{survey.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                    <FileSpreadsheet size={13} className="text-[#0A2342]" />
                    {survey.questions?.length || 4} Soru
                  </span>
                  {isDone ? (
                    <span className="text-xs font-bold text-emerald-700">Katılım Sağlandı</span>
                  ) : (
                    <button
                      onClick={() => handleStart(survey)}
                      className="flex items-center gap-1 text-xs font-black text-[#0A2342] hover:text-blue-700 transition"
                    >
                      Doldur <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
