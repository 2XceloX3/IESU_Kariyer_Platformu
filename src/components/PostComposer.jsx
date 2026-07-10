import React, { useState } from 'react';
import { Image as ImageIcon, FileText, Video, Send, X, Plus } from 'lucide-react';

export default function PostComposer({ currentUser, userRole, posts, setPosts }) {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image', 'video', 'pdf'

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Simulate file upload with local object URL
    const url = URL.createObjectURL(file);
    setMedia(url);
    setMediaType(type);
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
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      <div className="flex gap-4 items-start">
        {(userRole === 'admin' || currentUser?.role === 'admin' || window.localStorage.getItem('iesu_user_role_v1') === '"admin"') ? (
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0 border border-gray-200 shadow-sm p-1">
            <img src="/iesu-logo.svg" alt="Admin Logo" className="w-full h-full object-contain" />
          </div>
        ) : (
          <img 
            src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'U')}&background=132A49&color=fff`} 
            alt="User" 
            className="w-14 h-14 rounded-full object-cover shrink-0 border-2 border-white shadow-sm" 
          />
        )}
        <div className="flex-1 min-w-0">
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ağınızdaki kişilerle yeni bir başarı, proje veya soru paylaşın..." 
            className="w-full bg-gray-50 border border-gray-100 p-4 rounded-3xl outline-none text-[16px] text-gray-800 placeholder-gray-400 font-medium resize-none transition-all min-h-[160px] focus:bg-white focus:ring-2 focus:ring-iesu-red/20 shadow-inner"
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

          {/* ALWAYS EXPANDED TOOLBAR */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 pt-6 border-t border-gray-100 gap-4">
            <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
              <label className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-blue-50/50 text-blue-600 hover:bg-blue-100 rounded-2xl cursor-pointer transition font-semibold text-sm border border-blue-100">
                <ImageIcon size={20} /> <span className="hidden sm:inline">Fotoğraf</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} />
              </label>
              <label className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50/50 text-emerald-600 hover:bg-emerald-100 rounded-2xl cursor-pointer transition font-semibold text-sm border border-emerald-100">
                <Video size={20} /> <span className="hidden sm:inline">Video</span>
                <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, 'video')} />
              </label>
              <label className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-orange-50/50 text-orange-600 hover:bg-orange-100 rounded-2xl cursor-pointer transition font-semibold text-sm border border-orange-100">
                <FileText size={20} /> <span className="hidden sm:inline">Belge</span>
                <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileUpload(e, 'pdf')} />
              </label>
            </div>
            <div className="flex items-center justify-end gap-3 w-full sm:w-auto mt-2 sm:mt-0">
              <button 
                type="button" 
                onClick={() => { setContent(''); setMedia(null); setMediaType(null); }}
                className="px-5 py-3 text-gray-500 font-bold text-[14px] hover:bg-gray-100 rounded-2xl transition"
              >
                Temizle
              </button>
              <button 
                type="submit"
                disabled={!content.trim() && !media}
                className="bg-gradient-to-tr from-iesu-red to-iesu-coral text-white px-8 py-3 rounded-2xl font-bold text-[15px] flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition shadow-lg shadow-red-500/20"
              >
                <Send size={18} /> Paylaş
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
