import React, { useState } from 'react';
import { Image as ImageIcon, FileText, Video, Send, X, Plus } from 'lucide-react';

export default function PostComposer({ currentUser, userRole, posts, setPosts }) {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image', 'video', 'pdf'
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Simulate file upload with local object URL
    const url = URL.createObjectURL(file);
    setMedia(url);
    setMediaType(type);
    setIsExpanded(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() && !media) return;

    const newPost = {
      id: 'POST-' + Date.now(),
      author: {
        name: currentUser?.name || 'Kullanıcı',
        avatar: currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'U')}&background=132A49&color=fff`,
        title: currentUser?.title || currentUser?.department || 'Öğrenci',
        role: userRole || currentUser?.role || (window.localStorage.getItem('iesu_user_role_v1') === '"admin"' ? 'admin' : undefined)
      },
      content: content.trim(),
      image: mediaType === 'image' ? media : null,
      video: mediaType === 'video' ? media : null,
      pdf: mediaType === 'pdf' ? media : null,
      time: 'Az önce',
      likes: 0,
      comments: 0
    };

    setPosts([newPost, ...(posts || [])]);
    setContent('');
    setMedia(null);
    setMediaType(null);
    setIsExpanded(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 transition-all overflow-hidden">
      <div className="flex gap-3">
        {(userRole === 'admin' || currentUser?.role === 'admin' || window.localStorage.getItem('iesu_user_role_v1') === '"admin"') ? (
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 border border-gray-200 shadow-sm p-1">
            <img src="/iesu-logo.svg" alt="Admin Logo" className="w-full h-full object-contain" />
          </div>
        ) : (
          <img 
            src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'U')}&background=132A49&color=fff`} 
            alt="User" 
            className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-white shadow-sm" 
          />
        )}
        <div className="flex-1 min-w-0">
          <textarea 
            value={content}
            onChange={(e) => { setContent(e.target.value); if (!isExpanded) setIsExpanded(true); }}
            onFocus={() => setIsExpanded(true)}
            placeholder="Ağınızdaki kişilerle yeni bir başarı, proje veya soru paylaşın..." 
            className={`w-full bg-transparent outline-none text-[15px] text-gray-800 placeholder-gray-400 font-medium resize-none transition-all ${isExpanded ? 'min-h-[80px]' : 'h-12 pt-3'}`}
          />
          
          {media && (
            <div className="relative mt-3 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              <button 
                type="button"
                onClick={() => { setMedia(null); setMediaType(null); }}
                className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition z-10"
              >
                <X size={16} />
              </button>
              
              {mediaType === 'image' && <img src={media} alt="Upload Preview" className="w-full max-h-80 object-cover" />}
              {mediaType === 'video' && <video src={media} controls className="w-full max-h-80 bg-black" />}
              {mediaType === 'pdf' && (
                <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                  <FileText size={48} className="text-red-500 mb-2" />
                  <p className="font-bold">PDF Dökümanı Eklendi</p>
                  <p className="text-xs">Gönderi paylaşıldığında indirilebilir olacak.</p>
                </div>
              )}
            </div>
          )}

          {isExpanded && (
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
              <div className="flex gap-1">
                <label className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl cursor-pointer transition">
                  <ImageIcon size={20} />
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} />
                </label>
                <label className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl cursor-pointer transition">
                  <Video size={20} />
                  <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, 'video')} />
                </label>
                <label className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl cursor-pointer transition">
                  <FileText size={20} />
                  <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileUpload(e, 'pdf')} />
                </label>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  type="button" 
                  onClick={() => { setIsExpanded(false); setContent(''); setMedia(null); setMediaType(null); }}
                  className="px-4 py-2 text-gray-500 font-bold text-[13px] hover:bg-gray-100 rounded-xl transition"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  disabled={!content.trim() && !media}
                  className="bg-iesu-red text-white px-6 py-2 rounded-xl font-bold text-[13px] flex items-center gap-2 hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-iesu-red transition"
                >
                  <Send size={16} /> Paylaş
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
