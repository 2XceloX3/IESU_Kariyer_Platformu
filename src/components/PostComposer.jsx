import React, { useState } from 'react';
import { Image as ImageIcon, FileText, Video, Send, X, Plus, Calendar, Smile, Link as LinkIcon, BarChart2 } from 'lucide-react';

export default function PostComposer({ currentUser, userRole, posts, setPosts, asClub }) {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image', 'video', 'pdf'
  const [isFocused, setIsFocused] = useState(false);

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
      author: asClub ? {
        id: asClub.id,
        name: asClub.name,
        avatar: asClub.logo,
        title: 'Öğrenci Kulübü',
        role: 'club'
      } : {
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
      comments: 0,
      status: 'Beklemede'
    };

    setPosts([newPost, ...(posts || [])]);
    setContent('');
    setMedia(null);
    setMediaType(null);
    setIsFocused(false);
    
    alert("Gönderiniz başarıyla oluşturuldu ve onay havuzuna gönderildi!");
  };

  return (
    <div className={`transition-all duration-300 bg-white rounded-3xl ${isFocused ? 'shadow-2xl ring-4 ring-gray-50 border-transparent scale-[1.01]' : 'shadow-sm border border-gray-100'} p-1`}>
      <form onSubmit={handleSubmit} className="w-full flex flex-col p-5 bg-white rounded-[1.4rem]">
        <div className="flex gap-4 items-start">
          {asClub ? (
            <img 
              src={asClub.logo} 
              alt={asClub.name} 
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shrink-0 border border-gray-200 shadow-sm transition-transform hover:scale-105" 
            />
          ) : (userRole === 'admin' || currentUser?.role === 'admin' || window.localStorage.getItem('iesu_user_role_v1') === '"admin"') ? (
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border-2 border-gray-100 shadow-sm p-1.5 transition-transform hover:scale-105">
              <img src="/iesu-logo.svg" alt="Admin Logo" className="w-full h-full object-contain" />
            </div>
          ) : (
            <img 
              src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'U')}&background=132A49&color=fff`} 
              alt="User" 
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shrink-0 border border-gray-200 shadow-sm transition-transform hover:scale-105" 
            />
          )}
          <div className="flex-1 min-w-0">
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Ağınızdaki kişilerle yeni bir başarı, proje veya soru paylaşın..." 
              className={`w-full bg-transparent border-none outline-none text-[15px] sm:text-[17px] text-gray-800 placeholder-gray-400 font-medium resize-none transition-all ${isFocused ? 'min-h-[140px] pt-2' : 'min-h-[60px] pt-3.5 sm:pt-4'}`}
            />
            
            {media && (
              <div className="relative mt-4 rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 group shadow-sm">
                <button 
                  type="button"
                  onClick={() => { setMedia(null); setMediaType(null); }}
                  className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white p-2 rounded-full hover:bg-black transition-all z-10 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                  title="Kaldır"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
                
                {mediaType === 'image' && <img src={media} alt="Upload Preview" className="w-full max-h-96 object-cover" />}
                {mediaType === 'video' && <video src={media} controls className="w-full max-h-96 bg-black rounded-2xl" />}
                {mediaType === 'pdf' && (
                  <div className="flex flex-col items-center justify-center p-10 text-gray-500 bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mb-3 shadow-sm">
                      <FileText size={32} strokeWidth={2} />
                    </div>
                    <p className="font-bold text-gray-800">PDF Dökümanı Eklendi</p>
                    <p className="text-xs text-gray-500 mt-1">Gönderi onaylandığında indirilebilir olacak.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* TOOLBAR */}
        <div className={`flex flex-col sm:flex-row items-center justify-between mt-4 transition-all duration-300 ${isFocused ? 'pt-4 border-t border-gray-100 opacity-100' : 'h-0 overflow-hidden opacity-0 sm:h-auto sm:opacity-100 sm:pt-0 sm:border-transparent'}`}>
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 w-full sm:w-auto">
            <label className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl cursor-pointer transition font-bold text-[13px] border border-transparent hover:border-blue-100">
              <ImageIcon size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Fotoğraf</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} />
            </label>
            <label className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl cursor-pointer transition font-bold text-[13px] border border-transparent hover:border-emerald-100">
              <Video size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Video</span>
              <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, 'video')} />
            </label>
            <label className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-xl cursor-pointer transition font-bold text-[13px] border border-transparent hover:border-orange-100">
              <FileText size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Döküman</span>
              <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileUpload(e, 'pdf')} />
            </label>
          </div>
          
          <button 
            type="submit" 
            disabled={!content.trim() && !media}
            className="w-full sm:w-auto mt-4 sm:mt-0 bg-iesu-red text-white px-6 py-2.5 rounded-full font-extrabold text-[14px] flex items-center justify-center gap-2 shadow-md hover:shadow-xl hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md disabled:hover:bg-iesu-red"
          >
            Paylaş <Send size={16} strokeWidth={2.5} />
          </button>
        </div>
      </form>
    </div>
  );
}
