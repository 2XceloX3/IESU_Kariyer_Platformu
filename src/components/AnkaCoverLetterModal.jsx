import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, X, Send, Sparkles, CheckCircle, Briefcase } from 'lucide-react';
import { generateAIResponse } from '../lib/gemini';
import useAppStore from '../store/useAppStore';

export default function AnkaCoverLetterModal({ job, currentUser, onClose, onConfirm }) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const generateLetter = async () => {
      try {
        const cvDataStr = localStorage.getItem(`iesu_cv_draft_${currentUser?.id || 'guest'}`) || localStorage.getItem(`igu_cv_draft_${currentUser?.id || 'guest'}`);
        let academicContext = '';
        if (cvDataStr) {
          const cv = JSON.parse(cvDataStr);
          academicContext = `AGNO: ${cv.gpa || 'Belirtilmedi'}, Tez: ${cv.thesis || 'Belirtilmedi'}, Projeler: ${cv.academicProjects || 'Belirtilmedi'}`;
        }

        const prompt = `
          Sen Esenyurt Üniversitesi kariyer danışmanı Anka'sın.
          Aşağıdaki ilana başvuran "${currentUser?.name}" adlı öğrenci için çok kısa (max 3 cümle), etkileyici ve doğrudan İK yöneticisine hitap eden bir ön yazı (cover letter) yaz.
          
          İlan: ${job.title} - ${job.company} (${job.type})
          Adayın Bölümü: ${currentUser?.department || 'Öğrenci'}
          Adayın Ek Akademik Bilgileri: ${academicContext}
          
          Lütfen robotik bir dil kullanma, içten ve profesyonel ol. "Saygılarımla" diyerek bitir.
        `;

        // Simulate AI delay for UX
        setTimeout(async () => {
          try {
            const response = await generateAIResponse(prompt, "Sadece ön yazıyı dön.");
            if (isMounted) {
              setCoverLetter(response);
              setIsGenerating(false);
            }
          } catch (e) {
            if (isMounted) {
              setCoverLetter(`Sayın İlgili,\\n\\n${job.company} bünyesinde açılan ${job.title} pozisyonu ile yakından ilgileniyorum. ${currentUser?.department || ''} alanındaki eğitimim ve motivasyonumla şirketinize değer katacağıma inanıyorum. Özgeçmişimi ekte değerlendirmenize sunarım.\\n\\nSaygılarımla,\\n${currentUser?.name}`);
              setIsGenerating(false);
            }
          }
        }, 1500);

      } catch (e) {
        if (isMounted) {
          setError(true);
          setIsGenerating(false);
        }
      }
    };
    generateLetter();
    return () => { isMounted = false; };
  }, [job, currentUser]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 bg-[#990000]/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
    >
      <motion.div 
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl border border-white/20"
      >
        <div className="bg-gradient-to-r from-red-600 to-[#990000] p-6 text-white flex justify-between items-start relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-xl font-black flex items-center gap-2 mb-1">
              <Sparkles size={20} className="text-amber-300" /> Anka Ön Yazı Asistanı
            </h2>
            <p className="text-indigo-200 text-sm font-medium">
              <span className="font-bold text-white">{job.company}</span> - {job.title} başvurusu için.
            </p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition relative z-10">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-8">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-50" />
                <div className="relative bg-white rounded-full p-4 border-4 border-indigo-50 shadow-sm flex items-center justify-center h-full">
                  <Wand2 size={32} className="text-red-600 animate-pulse" />
                </div>
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">Ön Yazınız Üretiliyor...</h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">Anka, CV verilerinizi ve akademik geçmişinizi ilan gereksinimleriyle eşleştiriyor.</p>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 mb-6 relative">
                <div className="absolute -top-3 -right-3 bg-indigo-100 text-indigo-700 p-2 rounded-xl shadow-sm">
                  <Wand2 size={16} />
                </div>
                <textarea 
                  className="w-full bg-transparent border-none resize-none focus:ring-0 text-gray-700 leading-relaxed min-h-[150px] p-0"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3 bg-amber-50 text-amber-700 p-4 rounded-xl text-sm font-bold border border-amber-100 mb-8">
                <CheckCircle size={18} className="shrink-0" />
                <p>Anka'nın ürettiği taslağı dilediğiniz gibi düzenleyebilir, ardından başvurunuzu tamamlayabilirsiniz.</p>
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition">
                  İptal
                </button>
                <button 
                  onClick={() => onConfirm(coverLetter)}
                  className="px-6 py-2.5 rounded-xl bg-[#990000] text-white font-bold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-900/20 transition flex items-center gap-2"
                >
                  <Send size={18} /> Başvuruyu Tamamla
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
