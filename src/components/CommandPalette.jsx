import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Briefcase, Calendar, Home, LogOut, Settings, MessageCircle, FileText } from 'lucide-react';

export default function CommandPalette({ isOpen, setIsOpen, setView, currentUser }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const role = currentUser?.role || 'landing';

  const actions = [
    { id: 'home', title: 'Ana Sayfaya Git', icon: <Home size={18} />, action: () => setView(role === 'admin' ? 'admin' : role === 'employer' ? 'company' : role) },
    { id: 'profile', title: 'Profilimi Görüntüle', icon: <User size={18} />, action: () => setView('user_profile') },
    { id: 'jobs', title: 'İş ve Staj İlanları', icon: <Briefcase size={18} />, action: () => setView('jobs') },
    { id: 'events', title: 'Yaklaşan Etkinlikler', icon: <Calendar size={18} />, action: () => setView('etkinlikler') },
    { id: 'messages', title: 'Mesajlar', icon: <MessageCircle size={18} />, action: () => setView('messaging') },
    { id: 'news', title: 'Haberler ve Duyurular', icon: <FileText size={18} />, action: () => setView('haberler') },
    { id: 'settings', title: 'Hesap Ayarları', icon: <Settings size={18} />, action: () => setView('profile_update') },
  ];

  const filteredActions = actions.filter(action => 
    action.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleAction = (actionFn) => {
    actionFn();
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-gray-900/40 backdrop-blur-sm flex items-start justify-center pt-[15vh] p-4 font-sans animate-fade-in">
      <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  
        className="bg-white/90 backdrop-blur-xl w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 border-b border-gray-100">
          <Search size={20} className="text-gray-500 mr-2" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nereye gitmek istersiniz? (örn. İlanlar, Profil...)"
            className="w-full py-4 bg-transparent outline-none text-gray-800 text-lg placeholder-gray-400"
          />
          <button onClick={() => setIsOpen(false)} className="text-[11px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-md">ESC</button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {filteredActions.length > 0 ? (
            filteredActions.map((action, index) => (
              <button
                key={action.id}
                onClick={() => handleAction(action.action)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#0A2342]/5 rounded-xl text-left group transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-white flex items-center justify-center text-gray-500 group-hover:text-[#0A2342] transition-colors shadow-sm">
                  {action.icon}
                </div>
                <span className="font-semibold text-gray-700 group-hover:text-gray-900">{action.title}</span>
              </button>
            ))
          ) : (
            <div className="py-8 text-center text-gray-500">
              <p className="font-medium">Sonuç bulunamadı.</p>
              <p className="text-xs mt-1">Farklı kelimelerle aramayı deneyin.</p>
            </div>
          )}
        </div>
      </div>
      <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  className="absolute inset-0 -z-10" onClick={() => setIsOpen(false)}></div>
    </div>
  );
}
