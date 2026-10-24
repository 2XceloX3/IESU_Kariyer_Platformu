import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Video, Clock, MapPin, CheckCircle2, CalendarClock, MessageSquare,
  Sparkles, PhoneCall, PhoneOff, FileText, Send, X, Briefcase
} from 'lucide-react';
import SafeAvatar from '../shared/SafeAvatar';
import useAppStore from '../../store/useAppStore';
import {
  joinFairQueue,
  leaveFairQueue,
  getStudentActiveTicket,
  startSpeedInterview,
  completeSpeedInterview
} from '../../services/virtualFairWorkflow';

export default function GlobalVirtualFairBooth({
  booth,
  onClose,
  currentUser,
  onApplyJob
}) {
  const storeCurrentUser = useAppStore(state => state.currentUser);
  const effectiveCurrentUser = useMemo(() => {
    return currentUser || storeCurrentUser || {
      id: 'student_active',
      name: 'Öğrenci',
      department: 'Mühendislik Fakültesi'
    };
  }, [currentUser, storeCurrentUser]);

  const effectiveStudentId = effectiveCurrentUser.id || effectiveCurrentUser.uid || 'student_active';

  const [activeTicket, setActiveTicket] = useState(() =>
    getStudentActiveTicket(effectiveCurrentUser.id || effectiveCurrentUser.uid)
  );

  const [isInInterview, setIsInInterview] = useState(false);
  const [interviewSecondsLeft, setInterviewSecondsLeft] = useState(600); // 10 minutes
  const [evaluationCompleted, setEvaluationCompleted] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'recruiter', text: `Merhaba! ${booth?.name || 'Şirketimize'} hoş geldiniz. Sorularınızı yanıtlamaktan memnuniyet duyarım.` }
  ]);
  const [newMessageText, setNewMessageText] = useState('');
  const [actionNotice, setActionNotice] = useState('');

  // Synchronize active ticket and resume interview countdown accurately if already in interview
  useEffect(() => {
    const tkt = getStudentActiveTicket(effectiveStudentId);
    setActiveTicket(tkt);
    if (tkt && tkt.status === 'in_interview') {
      setIsInInterview(true);
      if (tkt.interviewStartedAt) {
        const elapsed = Math.floor((Date.now() - new Date(tkt.interviewStartedAt).getTime()) / 1000);
        const remaining = Math.max(0, 600 - elapsed);
        setInterviewSecondsLeft(remaining);
      }
    }
  }, [effectiveStudentId]);

  const handleFinishInterview = useCallback(() => {
    if (!activeTicket) return;
    const res = completeSpeedInterview(activeTicket.ticketId, {
      technicalRating: 5,
      culturalFitRating: 5,
      communicationRating: 5,
      verdict: 'next_round',
      recruiterNotes: 'Öğrencinin teorik ve pratik hazırlığı oldukça güçlü. 2. tur teknik mülakatına davet edildi.'
    });

    if (res.success) {
      setEvaluationCompleted(res.evaluation);
      setIsInInterview(false);
      setActiveTicket(null);
    }
  }, [activeTicket]);

  // Persistent interview timer countdown
  useEffect(() => {
    if (!isInInterview) return;
    const timer = setInterval(() => {
      setInterviewSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [isInInterview, handleFinishInterview]);

  const handleJoinQueue = () => {
    const res = joinFairQueue(booth?.id || booth, effectiveCurrentUser);
    if (res.success) {
      setActiveTicket(res.ticket);
      setActionNotice(`"${res.ticket.ticketNumber}" numaralı canlı sıra biletiniz oluşturuldu.`);
    } else {
      setActionNotice(res.error || 'Sıraya girilemedi.');
    }
  };

  const handleLeaveQueue = () => {
    if (!activeTicket) return;
    leaveFairQueue(activeTicket.ticketId);
    setActiveTicket(null);
    setIsInInterview(false);
    setActionNotice('Sıra biletiniz iptal edildi.');
  };

  const handleEnterInterview = () => {
    if (!activeTicket) return;
    startSpeedInterview(activeTicket.ticketId);
    setIsInInterview(true);
    setInterviewSecondsLeft(600);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;
    setChatMessages(prev => [
      ...prev,
      { sender: 'student', text: newMessageText.trim() },
      { sender: 'recruiter', text: 'Özgeçmişinizi ve notlarınızı inceledim, yetkinlikleriniz çok uyumlu görünüyor!' }
    ]);
    setNewMessageText('');
  };

  if (!booth) return null;

  const minutes = Math.floor(interviewSecondsLeft / 60);
  const seconds = interviewSecondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Booth Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white text-gray-900 flex items-center justify-center font-black text-xl shadow-md border border-white/20">
              {booth.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">{booth.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Canlı İK Standı
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-2">
                <span>{booth.sector}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin size={12} /> {booth.location || 'İstanbul'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
            title="Kapat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Notice Bar */}
        {actionNotice && (
          <div className="bg-red-50 px-4 py-2 text-xs font-bold text-red-900 border-b border-red-200 flex items-center justify-between">
            <span>ℹ️ {actionNotice}</span>
            <button onClick={() => setActionNotice('')} className="text-red-700 hover:text-red-900">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-gray-800">
          {/* Active Speed Interview Mode */}
          {isInInterview ? (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-700 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-600/30 border border-red-400 flex items-center justify-center animate-pulse">
                    <Video size={20} className="text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">
                      10 Dakikalık Canlı Hızlı Mülakat Odası
                    </h3>
                    <p className="text-xs text-slate-300">
                      İK Temsilcisi: {booth.boothRecruiter?.name || 'İK Yetkilisi'} ({booth.boothRecruiter?.title || 'Yetkili'})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 font-mono text-sm font-bold text-amber-300">
                    <Clock size={16} />
                    <span>{formattedTime}</span>
                  </div>
                  <button
                    onClick={handleFinishInterview}
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <PhoneOff size={14} /> Görüşmeyi Sonlandır
                  </button>
                </div>
              </div>

              {/* Video Grid Simulation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recruiter Stream */}
                <div className="bg-slate-950 rounded-2xl h-64 sm:h-72 border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center text-white">
                  <SafeAvatar
                    name={booth.boothRecruiter?.name || 'Recruiter'}
                    role="recruiter"
                    size="xl"
                    className="border-4 border-slate-700 mb-3"
                  />
                  <span className="text-sm font-bold">{booth.boothRecruiter?.name || 'İK Yetkilisi'}</span>
                  <span className="text-xs text-slate-400">{booth.name} İnsan Kaynakları</span>
                  <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    HD CANLI SES & VİDEO (WebRTC)
                  </div>
                </div>

                {/* Student Stream & Live Chat */}
                <div className="flex flex-col h-64 sm:h-72 bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="p-3 bg-slate-50 border-b border-gray-200 flex items-center justify-between text-xs font-bold text-gray-700">
                    <span className="flex items-center gap-1.5"><MessageSquare size={14} /> Canlı Mülakat Sohbeti</span>
                    <span className="text-[10px] text-emerald-700 font-normal">Sohbet Şifrelenmiştir</span>
                  </div>

                  <div className="p-3 overflow-y-auto flex-1 space-y-2 text-xs">
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex flex-col ${msg.sender === 'student' ? 'items-end' : 'items-start'}`}
                      >
                        <span className="text-[9px] text-gray-400 mb-0.5">
                          {msg.sender === 'student' ? 'Siz' : booth.boothRecruiter?.name || 'İK'}
                        </span>
                        <div
                          className={`p-2.5 rounded-xl max-w-[85%] text-xs ${
                            msg.sender === 'student'
                              ? 'bg-red-800 text-white rounded-br-none'
                              : 'bg-gray-100 text-gray-800 rounded-bl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="p-2 border-t border-gray-200 flex gap-1.5">
                    <input
                      type="text"
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      placeholder="İK yetkilisine mesaj veya soru iletin..."
                      className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      <Send size={14} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : evaluationCompleted ? (
            /* Interview Result & Scorecard */
            <div className="bg-emerald-50 rounded-2xl p-6 border-2 border-emerald-300 text-center space-y-4 animate-fade-in">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-emerald-950">
                  Hızlı Mülakatınız Başarıyla Tamamlandı!
                </h3>
                <p className="text-xs text-emerald-800 mt-1">
                  {booth.name} İK yetkilisi mülakat değerlendirmenizi sisteme kaydetti.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-200 max-w-md mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-gray-500">Aday:</span>
                  <span className="text-gray-900">{evaluationCompleted.studentName}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-gray-500">Şirket / Stand:</span>
                  <span className="text-gray-900">{evaluationCompleted.boothName}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-gray-500">İK Değerlendirme Kararı:</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {evaluationCompleted.verdict === 'next_round' ? '🎉 2. Tur Mülakat Daveti' : 'Staj Aday Havuzu'}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-100 text-gray-700 italic">
                  "{evaluationCompleted.recruiterNotes}"
                </div>
              </div>

              <button
                onClick={() => setEvaluationCompleted(null)}
                className="px-6 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition cursor-pointer"
              >
                Stand Görünümüne Geri Dön
              </button>
            </div>
          ) : (
            /* Stand Lobby & Live Queue Desk */
            <div className="space-y-6">
              {/* Live Queue Banner */}
              <div className="bg-gradient-to-r from-red-50 via-white to-slate-50 p-5 rounded-2xl border-2 border-red-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-red-900 text-white flex items-center justify-center shrink-0">
                    <CalendarClock size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-gray-900">
                      Canlı 10 Dk Hızlı Mülakat Kuyruğu (Speed Interview)
                    </h3>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Stand İK Temsilcisi: <span className="font-bold">{booth.boothRecruiter?.name}</span> ({booth.boothRecruiter?.title})
                    </p>
                  </div>
                </div>

                <div>
                  {activeTicket ? (
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-gray-500 block">Sıra Numaranız</span>
                        <span className="text-base font-black text-red-900">{activeTicket.ticketNumber}</span>
                      </div>
                      {activeTicket.status === 'ready' || activeTicket.queuePosition <= 1 ? (
                        <button
                          onClick={handleEnterInterview}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-2 animate-bounce cursor-pointer"
                        >
                          <PhoneCall size={16} /> Sıranız Geldi: Odaya Gir
                        </button>
                      ) : (
                        <div className="px-3 py-2 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold text-center">
                          Önünüzde {activeTicket.queuePosition - 1} kişi var (~{activeTicket.estimatedWaitMinutes} dk)
                        </div>
                      )}
                      <button
                        onClick={handleLeaveQueue}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold cursor-pointer"
                        title="Sıradan Ayrıl"
                      >
                        İptal
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleJoinQueue}
                      className="px-6 py-2.5 bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-2 transition cursor-pointer"
                    >
                      <Sparkles size={16} /> Mülakat Sırası Al (#{booth.queueLength + 1} Sırada, ~{booth.queueLength * booth.estimatedWaitPerPersonMinutes} dk)
                    </button>
                  )}
                </div>
              </div>

              {/* Company Info & Description */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-gray-700 leading-relaxed">
                <span className="font-bold text-gray-900 block mb-1">🏢 Şirket Profili & İESÜ İş Birlikleri:</span>
                {booth.description}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {(booth.tags || []).map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-[11px] font-bold text-gray-600">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Open Positions List */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase size={16} className="text-red-700" />
                  Stand Açık Pozisyonları & İlanlar ({booth.openPositions?.length || 0})
                </h4>

                <div className="space-y-2">
                  {(booth.openPositions || []).map((pos) => (
                    <div
                      key={pos.id}
                      className="bg-white p-3.5 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-xs transition"
                    >
                      <div>
                        <h5 className="text-xs font-bold text-gray-900">{pos.title}</h5>
                        <span className="text-[11px] text-gray-500">{pos.type}</span>
                      </div>
                      <button
                        onClick={() => {
                          if (onApplyJob) {
                            onApplyJob(pos);
                          } else {
                            setActionNotice(`"${pos.title}" pozisyonu için başvurunuz ve CV'niz İK yetkilisine iletildi.`);
                          }
                        }}
                        className="px-4 py-1.5 bg-red-50 hover:bg-red-100 text-red-900 border border-red-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
                      >
                        <FileText size={13} /> 1-Tıkla Başvur
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar (No duplicates per AGENTS.md) */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-gray-500 hidden sm:block">
            İstanbul Esenyurt Üniversitesi (İESÜ) B2B Sanal Fuar Sistemi
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
