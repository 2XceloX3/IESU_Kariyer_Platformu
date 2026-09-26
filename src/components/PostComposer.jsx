import React, { useState } from 'react';
import { Image as ImageIcon, FileText, Video, Send, X, Plus, Calendar, Smile, BarChart2 } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import DOMPurify from 'dompurify';
import eventBus from '../brain/eventBus';

export default function PostComposer({ currentUser, userRole, posts, setPosts, asClub }) {
  const logAction = useAppStore(state => state.logAction);
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image', 'video', 'pdf'
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Etkinlik oluşturma (PostComposer içi inline form)
  const [eventMode, setEventMode] = useState(false);
  const [evTitle, setEvTitle] = useState('');
  const [evDate, setEvDate] = useState('');
  const [evLocation, setEvLocation] = useState('');
  const [evDesc, setEvDesc] = useState('');

  const publishEvent = () => {
    const title = DOMPurify.sanitize(evTitle.trim());
    if (!title) { window.toast?.info('Etkinlik başlığı gerekli'); return; }
    const newPost = {
      id: 'EVNT-' + Date.now(),
      author: asClub ? {
        id: asClub.id, name: asClub.name, avatar: asClub.logo, title: 'Öğrenci Kulübü', role: 'club'
      } : {
        name: currentUser?.name || 'Kullanıcı',
        avatar: currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'U')}&background=0A2342&color=fff`,
        title: currentUser?.title || currentUser?.department || 'Öğrenci',
        role: userRole || currentUser?.role || undefined
      },
      content: content.trim() || `📅 ${title}`,
            eventPost: true,
      eventTitle: title,
      eventDate: evDate.trim(),
      eventLocation: evLocation.trim(),
      eventDesc: evDesc.trim(),
      image: mediaType === 'image' ? media : null,
      time: 'Az önce',
      likes: 0,
      comments: 0,
      status: 'Beklemede'
    };
    setPosts([newPost, ...(posts || [])]);
    try {
      eventBus.emit('event:announced', { event: newPost });
    } catch (_) {}
    setEventMode(false); setEvTitle(''); setEvDate(''); setEvLocation(''); setEvDesc('');
    setMedia(null); setMediaType(null);
    if (logAction) {
      logAction(currentUser?.name || 'Kullanıcı', `Yeni etkinlik paylaşıldı: ${title}`, 'Etkinlik', 'info');
    }
    if (window.toast && typeof window.toast.success === 'function') {
      window.toast.success("Etkinlik paylaşıldı!");
    }
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMedia(url);
    setMediaType(type);
    setIsFocused(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanContent = DOMPurify.sanitize(content.trim()).slice(0, 3000);
    if (!cleanContent && !media) return;
    setIsSubmitting(true);

    const newPost = {
      id: 'POST-' + Date.now(),
      author: asClub ? {
        id: asClub.id,
        name: asClub.name,
        avatar: asClub.logo,
        title: 'Öğrenci Kulübü',
        role: 'club'
      } : {
        name: currentUser?.name || 'Kullanıcı',
        avatar: currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'U')}&background=0A2342&color=fff`,
        title: currentUser?.title || currentUser?.department || 'Öğrenci',
        role: userRole || currentUser?.role || undefined
      },
      content: cleanContent,
      image: mediaType === 'image' ? media : null,
      video: mediaType === 'video' ? media : null,
      pdf: mediaType === 'pdf' ? media : null,
      time: 'Az önce',
      likes: 0,
      comments: 0,
      status: (userRole === 'admin' || currentUser?.role === 'admin') ? 'Yayında' : 'Beklemede'
    };

    setPosts([newPost, ...(posts || [])]);
    try {
      eventBus.emit('post:created', { post: newPost });
    } catch (_) {}
    setContent('');
    setMedia(null);
    setMediaType(null);
    setIsFocused(false);
    
    if (logAction) {
      logAction(currentUser?.name || 'Kullanıcı', 'Yeni gönderi paylaşıldı', 'Akış', 'info');
    }

    if (window.toast && typeof window.toast.success === 'function') {
      window.toast.success("Gönderiniz paylaşıldı!");
    }
    
    setTimeout(() => {
      setIsSubmitting(false);
    }, 400);
  };

  const authorAvatar = asClub ? (asClub.logo || '/iesu-logo.svg') : (userRole === 'admin' || currentUser?.role === 'admin') ? "/iesu-logo.svg" : (currentUser?.avatar || '/iesu-logo.svg');

  return (
    <div className={`transition-all duration-300 bg-white sm:rounded-[12px] ${isFocused ? 'shadow-md border border-gray-300 scale-[1.01]' : 'shadow-sm border border-gray-200'} mb-4 overflow-hidden`}>
      <form onSubmit={handleSubmit} className="w-full flex flex-col pt-3 pb-2 px-4 bg-white">
        
        {/* TOP AREA: AVATAR & INPUT */}
        <div className="flex gap-3 items-start">
          <img 
            src={authorAvatar} 
            onError={(e) => { e.target.onerror = null; e.target.src = '/iesu-logo.svg'; }}
            alt="Profile" 
            className="w-12 h-12 rounded-full object-cover shrink-0 border border-gray-200" 
          />
          <div className="flex-1 min-w-0">
            {/* LINKEDIN STYLE INPUT */}
            <div className={`transition-all duration-200 ${isFocused ? 'bg-transparent' : 'bg-white rounded-full border border-gray-300 hover:bg-gray-50'}`}>
              <textarea 
                value={content}
                maxLength={2000}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setIsFocused(true)}
                disabled={isSubmitting}
                aria-label="Gönderi içeriği"
                placeholder={isFocused ? "Ne hakkında konuşmak istiyorsunuz?" : "Gönderi başlat..."}
                className={`w-full bg-transparent border-none outline-none text-[15px] sm:text-[16px] text-gray-800 placeholder-gray-500 font-medium resize-none transition-all disabled:opacity-50
                  ${isFocused ? 'min-h-[120px] pt-2 px-1 focus:ring-0' : 'min-h-[48px] pt-3 px-4 cursor-text'}`}
              />
            </div>
            
            {media && (
              <div className="relative mt-4 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 group shadow-sm">
                <button 
                  type="button"
                  onClick={() => { setMedia(null); setMediaType(null); }}
                  className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black transition-all z-10"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
                
                {mediaType === 'image' && <img src={media} alt="Upload Preview" className="w-full max-h-[300px] object-contain bg-black" />}
                {mediaType === 'video' && <video src={media} controls className="w-full max-h-[300px] bg-black" />}
                {mediaType === 'pdf' && (
                  <div className="flex flex-col items-center justify-center p-8 text-gray-500 bg-gray-50">
                    <FileText size={32} className="text-gray-400 mb-2" />
                    <p className="font-bold text-gray-800">PDF Eklendi</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM TOOLBAR (LINKEDIN STYLE) */}
        {eventMode && (
          <div className="mt-3 rounded-xl border border-orange-200 bg-orange-50/60 p-3 space-y-2">
            <p className="text-[12px] font-extrabold text-orange-700 tracking-wide">📅 Etkinlik Oluştur</p>
            <input value={evTitle} onChange={(e) => setEvTitle(e.target.value)} placeholder="Etkinlik başlığı *" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[14px] outline-none focus:border-orange-400" />
            <div className="flex flex-col sm:flex-row gap-2">
              <input value={evDate} onChange={(e) => setEvDate(e.target.value)} placeholder="Tarih (örn. 15 Mayıs 2026)" className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-[14px] outline-none focus:border-orange-400" />
              <input value={evLocation} onChange={(e) => setEvLocation(e.target.value)} placeholder="Yer" className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-[14px] outline-none focus:border-orange-400" />
            </div>
            <textarea value={evDesc} onChange={(e) => setEvDesc(e.target.value)} placeholder="Açıklama (opsiyonel)" rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[14px] outline-none focus:border-orange-400 resize-none" />
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setEventMode(false)} className="px-4 py-1.5 rounded-full text-[13px] font-semibold text-gray-500 hover:bg-gray-100 transition">İptal</button>
              <button type="button" onClick={publishEvent} className="px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-[13px] font-semibold transition">Yayınla</button>
            </div>
          </div>
        )}
        <div className={`flex flex-col sm:flex-row items-center justify-between mt-3 transition-all duration-300`}>
          <div className="flex items-center justify-between w-full sm:w-auto px-1">
            <label className="flex items-center gap-2 px-3 py-3 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer transition-colors font-semibold text-[14px]">
              <ImageIcon size={20} className="text-red-500" /> <span className="hidden sm:inline">Medya</span>
              <input type="file" accept="image/*,video/*" className="sr-only" onChange={(e) => handleFileUpload(e, e.target.files[0]?.type?.includes('video') ? 'video' : 'image')} disabled={isSubmitting} />
            </label>
            <button type="button" onClick={() => setEventMode((v) => !v)} className="flex items-center gap-2 px-3 py-3 text-gray-500 hover:bg-gray-100 rounded-md transition-colors font-semibold text-[14px]">
                          <Calendar size={20} className={eventMode ? 'text-red-600' : 'text-orange-500'} /> <span className="hidden sm:inline">Etkinlik</span>
                        </button>
          </div>
          
          <div className={`flex gap-2 shrink-0 transition-opacity duration-200 ${isFocused ? 'opacity-100 mt-3 sm:mt-0 w-full sm:w-auto justify-end' : 'opacity-0 hidden'}`}>
            <button 
              type="button" 
              onClick={() => setIsFocused(false)} 
              className="px-4 py-1.5 rounded-full font-semibold text-[14px] text-gray-500 hover:bg-gray-100 transition"
            >
              İptal
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting || (!content.trim() && !media)} 
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-semibold text-[14px] transition-all
                ${(content.trim() || media) && !isSubmitting ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
              `}
            >
              {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Gönder'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
