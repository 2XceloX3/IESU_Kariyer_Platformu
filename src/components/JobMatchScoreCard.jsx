import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, TrendingUp, BookOpen, ShieldCheck } from 'lucide-react';

/**
 * Handshake-Style AI Job Matchmaker Score Calculator & Visual Bar
 */
export function calculateJobMatchScore(studentProfile, jobRequirements) {
  if (!studentProfile || !jobRequirements) return { score: 75, matchLevel: 'İyi Uyum', missingSkills: [], matchingSkills: [] };

  const studentSkills = (studentProfile.skills || []).map(s => String(s).toLowerCase());
  const requiredSkills = (jobRequirements.skills || ['react', 'javascript', 'git', 'tailwind', 'teamwork']).map(s => String(s).toLowerCase());

  const matchingSkills = requiredSkills.filter(req => studentSkills.some(st => st.includes(req) || req.includes(st)));
  const missingSkills = requiredSkills.filter(req => !matchingSkills.includes(req));

  const baseScore = Math.round((matchingSkills.length / Math.max(requiredSkills.length, 1)) * 60) + 35;
  const score = Math.min(Math.max(baseScore, 50), 98);

  let matchLevel = 'Büyük Uyum';
  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (score < 70) {
    matchLevel = 'Geliştirilebilir Uyum';
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (score < 85) {
    matchLevel = 'Yüksek Uyum';
    badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
  }

  return {
    score,
    matchLevel,
    badgeColor,
    matchingSkills,
    missingSkills
  };
}

export default function JobMatchScoreCard({ studentProfile, job }) {
  const matchResult = calculateJobMatchScore(studentProfile, job);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white shadow-xl border border-indigo-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/20 rounded-xl text-amber-300 border border-indigo-400/30">
            <Sparkles size={18} />
          </div>
          <div>
            <h4 className="font-black text-sm text-white leading-tight">İlan Uyum & Yetkinlik Analizi</h4>
            <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Kariyer Merkezi Eşleştirme Motoru</p>
          </div>
        </div>
        <span className={`text-xs font-black px-3 py-1 rounded-full border ${matchResult.badgeColor}`}>
          %{matchResult.score} {matchResult.matchLevel}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
        <div 
          className="bg-gradient-to-r from-[#990000] via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-1000 shadow-lg"
          style={{ width: `${matchResult.score}%` }}
        ></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Eşleşen Yetenekler */}
        <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/50">
          <p className="text-[10px] font-black uppercase text-emerald-400 flex items-center gap-1 mb-1">
            <CheckCircle2 size={12} /> Eşleşen Yetkinlikler
          </p>
          <p className="text-xs text-emerald-200 font-bold">
            {matchResult.matchingSkills.length > 0 ? matchResult.matchingSkills.join(', ') : 'Temel Yetkinlikler Uyuşuyor'}
          </p>
        </div>

        {/* Tamamlanması Gerekenler */}
        <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-800/50">
          <p className="text-[10px] font-black uppercase text-amber-400 flex items-center gap-1 mb-1">
            <TrendingUp size={12} /> Geliştirilebilir Alanlar
          </p>
          <p className="text-xs text-amber-200 font-bold">
            {matchResult.missingSkills.length > 0 ? matchResult.missingSkills.join(', ') : 'Önemli eksik bulunamadı'}
          </p>
        </div>
      </div>
    </div>
  );
}
