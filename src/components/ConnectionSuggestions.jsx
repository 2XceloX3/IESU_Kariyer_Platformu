/**
 * ConnectionSuggestions — "Tanıyor Olabileceklerin" paneli
 * 
 * LinkedIn benzeri bağlantı öneri sistemi.
 * Ortak bölüm, fakülte, ilgi alanlarına göre eşleştirme yapar.
 */
import React, { useMemo } from 'react';
import { Users, UserPlus, X, ChevronRight, RefreshCw } from 'lucide-react';

export default function ConnectionSuggestions({ 
  currentUser, 
  students = [], 
  alumni = [], 
  companies = [],
  academicStaff = [],
  setView,
  setSelectedUserId,
  maxSuggestions = 4
}) {
  const suggestions = useMemo(() => {
    if (!currentUser) return [];

    const allUsers = [
      ...(students || []).map(u => ({ ...u, _type: 'student' })),
      ...(alumni || []).map(u => ({ ...u, _type: 'alumni' })),
      ...(academicStaff || []).map(u => ({ ...u, _type: 'academic' })),
    ];

    // Filter out current user
    const others = allUsers.filter(u => u.id !== currentUser.id && u.email !== currentUser.email);

    // Score based on shared department, name similarity, etc.
    const scored = others.map(u => {
      let score = 0;
      if (u.department && currentUser.department && 
          u.department.toLowerCase().includes(currentUser.department.toLowerCase()) ||
          currentUser.department.toLowerCase().includes(u.department.toLowerCase())) {
        score += 10;
      }
      // Same faculty/field
      if (u.faculty && currentUser.faculty && u.faculty === currentUser.faculty) {
        score += 5;
      }
      // Same graduation year
      if (u.graduationYear && currentUser.graduationYear && u.graduationYear === currentUser.graduationYear) {
        score += 3;
      }
      // Prioritize alumni for students
      if (u._type === 'alumni' && currentUser.role === 'student') {
        score += 2;
      }
      // Prioritize active profiles
      if (u.status === 'Aktif' || u.status === 'active') {
        score += 1;
      }
      return { ...u, score };
    });

    return scored.sort((a, b) => b.score - a.score).slice(0, maxSuggestions);
  }, [currentUser, students, alumni, companies, academicStaff, maxSuggestions]);

  const handleViewProfile = (userId) => {
    if (setSelectedUserId) setSelectedUserId(userId);
    if (setView) setView('user_profile');
  };

  if (suggestions.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <Users size={14} className="text-blue-600" />
          </div>
          <h3 className="text-sm font-black text-slate-800 tracking-tight">Tanıyor Olabileceklerin</h3>
        </div>
        <button 
          onClick={() => window.toast?.info?.('Öneriler yenileniyor...')}
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition cursor-pointer"
          title="Önerileri yenile"
        >
          <RefreshCw size={13} />
        </button>
      </div>

      {/* Suggestions */}
      <div className="divide-y divide-slate-50">
        {suggestions.map((person) => (
          <div key={person.id} className="flex items-center gap-3 px-5 py-3.5 group">
            {/* Avatar */}
            <div 
              className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0 ring-2 ring-slate-50 cursor-pointer hover:ring-[#990000]/30 transition-all"
              onClick={() => handleViewProfile(person.id)}
            >
              <img 
                src={person.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name||'K')}&background=990000&color=fff&size=80`}
                alt={person.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name||'K')}&background=990000&color=fff&size=80`; }}
              />
            </div>

            {/* Info */}
            <div 
              className="flex-1 min-w-0 cursor-pointer"
              onClick={() => handleViewProfile(person.id)}
            >
              <p className="text-sm font-bold text-slate-800 truncate leading-tight group-hover:text-[#990000] transition-colors">
                {person.name}
              </p>
              <p className="text-[11px] font-medium text-slate-500 truncate">
                {person.department || person.title || 'Kariyer Portalı Üyesi'}
              </p>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                {person._type === 'alumni' ? '🎓 Mezun' : person._type === 'academic' ? '👨‍🏫 Akademik' : '📚 Öğrenci'}
                {person.company ? ` • ${person.company}` : ''}
              </p>
            </div>

            {/* Action */}
            <button
              onClick={() => handleViewProfile(person.id)}
              className="p-2 rounded-full border border-slate-200 text-slate-500 hover:border-[#990000] hover:text-[#990000] hover:bg-red-50 transition-all shrink-0 cursor-pointer group/btn"
              title="Profili Görüntüle"
            >
              <UserPlus size={15} className="group-hover/btn:scale-110 transition-transform" />
            </button>
          </div>
        ))}
      </div>

      {/* View All */}
      <button
        onClick={() => setView?.('network')}
        className="w-full py-3 text-[11px] font-black text-[#990000] hover:bg-red-50 transition-colors border-t border-slate-50 flex items-center justify-center gap-1 cursor-pointer"
      >
        Tümünü Gör <ChevronRight size={13} />
      </button>
    </div>
  );
}
