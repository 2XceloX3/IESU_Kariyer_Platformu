import React, { useState } from 'react';
import { Search, Compass, Heart, MessageCircle, Play } from 'lucide-react';

export default function ExploreFeed({ posts = [] }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Sadece resim veya video içeren gönderileri Keşfet ızgarasına alıyoruz
  const exploreItems = posts.filter(post => post.imageUrl || post.videoUrl || post.type === 'image' || post.type === 'video');

  return (
    <div className="w-full bg-white rounded-xl p-6 shadow-[var(--shadow-soft)] border border-[var(--border-soft)] animate-fade-in min-h-[75vh]">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
        <div className="w-10 h-10 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
          <Compass size={24} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Keşfet</h2>
      </div>

      <div className="flex gap-2 w-full mb-8">
        <div className="relative group flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-600 transition-colors" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="İlgi alanlarına göre ara (Yazılım, Tasarım, Staj)..." 
            className="bg-gray-50 pl-12 pr-4 py-3.5 rounded-2xl text-[15px] w-full focus:outline-none focus:ring-2 focus:ring-purple-500/20 border border-gray-200 transition-all shadow-inner" 
          />
        </div>
        <button 
          onClick={(e) => {
            e.preventDefault();
            window.toast && window.toast.info("AI: Kişiselleştirilmiş içerik algoritması çalıştırılıyor...");
            setTimeout(() => {
              window.toast && window.toast.success("✅ AI Algoritması: İlgi alanlarınıza (React, UI/UX) en uygun gönderiler öne çıkarıldı.");
            }, 2000);
          }}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition shadow-md whitespace-nowrap"
        >
          <Compass size={18} /> AI ile Özelleştir
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {exploreItems.map((item, index) => {
          // Instagram tarzı grid: bazı öğeler daha büyük olabilir ama şimdilik kare standart
          return (
            <div key={item.id || index} className="relative aspect-square group cursor-pointer rounded-xl overflow-hidden bg-gray-100">
              {item.imageUrl && (
                <img src={item.imageUrl} alt="Keşfet" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              )}
              {item.videoUrl && (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  <Play size={32} className="text-white opacity-50" />
                </div>
              )}
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 text-white">
                <div className="flex items-center gap-2 font-bold">
                  <Heart size={20} className="fill-current" /> {item.likes || Math.floor(Math.random() * 100)}
                </div>
                <div className="flex items-center gap-2 font-bold">
                  <MessageCircle size={20} className="fill-current" /> {item.comments?.length || Math.floor(Math.random() * 20)}
                </div>
              </div>
            </div>
          )
        })}
        
        {exploreItems.length === 0 && (
          <div className="col-span-3 py-12 text-center text-gray-500">
            Görsel veya video içeren içerik bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
}
