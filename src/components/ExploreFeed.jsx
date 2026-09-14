import React, { useState, useMemo } from 'react';
import { Search, Compass, Heart, MessageCircle, UserPlus, UserCheck, Eye, Sparkles, Building2, GraduationCap, Award, BookOpen, X } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import PostCard from './PostCard';
import TrendingHashtags from './TrendingHashtags';

export default function ExploreFeed({ posts: propPosts, setView, setSelectedUserId, currentUser }) {
  const storePosts = useAppStore(state => state.posts);
  const posts = (propPosts && propPosts.length) ? propPosts : storePosts;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [followedUsers, setFollowedUsers] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);

  const handleToggleFollow = (userId, userName) => {
    setFollowedUsers(prev => {
      const isFollowing = !!prev[userId];
      const updated = { ...prev, [userId]: !isFollowing };
      if (!isFollowing) {
        if (window.toast && window.toast.success) window.toast.success(`${userName} takip ediliyor!`);
      } else {
        if (window.toast && window.toast.info) window.toast.info(`${userName} takipten çıkarıldı.`);
      }
      return updated;
    });
  };

  const handleViewProfile = (userId) => {
    if (setSelectedUserId && setView) {
      setSelectedUserId(userId);
      const isSelf = userId === currentUser?.id || userId === 'self';
      setView(isSelf ? 'user_profile' : 'public_profile');
    }
  };

  // Filter posts dynamically based on search and category
  const filteredPosts = useMemo(() => {
    return (posts || []).filter(post => {
      const authorRoleStr = typeof post.authorRole === 'string' ? post.authorRole : (typeof post.author === 'object' ? post.author?.role : '');

      const authorNameStr = typeof post.authorName === 'string' ? post.authorName : (typeof post.author === 'string' ? post.author : (typeof post.author === 'object' ? post.author?.name : ''));
      const contentStr = typeof post.content === 'string' ? post.content : '';
      const titleStr = typeof post.title === 'string' ? post.title : '';

      const matchesSearch = searchQuery === '' || 
        contentStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        authorNameStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        authorRoleStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        titleStr.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeCategory === 'students') return authorRoleStr === 'student' || authorRoleStr === 'Öğrenci';
      if (activeCategory === 'alumni') return authorRoleStr === 'alumni' || authorRoleStr === 'Mezun';
      if (activeCategory === 'academic') return authorRoleStr === 'academic' || authorRoleStr === 'Akademisyen';
      if (activeCategory === 'companies') return authorRoleStr === 'company' || authorRoleStr === 'employer' || authorRoleStr === 'İşveren' || authorRoleStr === 'Kurumsal' || authorRoleStr === 'Firma';
      return true;
    });
  }, [posts, searchQuery, activeCategory]);

  return (
    <div className="w-full bg-white rounded-2xl p-4 sm:p-6 shadow-[var(--shadow-soft)] border border-[var(--border-soft)] animate-fade-in min-h-[75vh]">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-900 via-purple-900 to-slate-900 rounded-xl flex items-center justify-center text-white shadow-md">
            <Compass size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Keşfet & Sosyal Ağ</h2>
            <p className="text-xs text-gray-500 font-medium">Öğrenci, mezun ve akademisyenlerin paylaşımları</p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="w-full mb-6">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-900 transition-colors" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Öğrenci, mezun, akademisyen veya konu ara..." 
            className="bg-slate-50 pl-11 pr-4 py-3 rounded-xl text-sm font-medium w-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white border border-gray-200 transition-all shadow-inner placeholder:text-gray-400" 
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-4 pb-1">
        {[
          { id: 'all', label: 'Tümü', icon: <Sparkles size={14}/> },
          { id: 'students', label: 'Öğrenciler', icon: <GraduationCap size={14}/> },
          { id: 'alumni', label: 'Mezunlar', icon: <Award size={14}/> },
          { id: 'academic', label: 'Akademisyenler', icon: <BookOpen size={14}/> },
          { id: 'companies', label: 'Firmalar & İşverenler', icon: <Building2 size={14}/> },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
              activeCategory === cat.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-slate-50 text-gray-600 hover:bg-gray-100 border-gray-200'
            }`}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Trending Hashtags Section */}
      <div className="mb-6">
        <TrendingHashtags posts={posts} onTagClick={(tag) => setSearchQuery(tag)} limit={8} />
      </div>

      {/* Live Content Masonry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPosts.map((item, index) => {
          const authorId = item.authorId || item.userId || (typeof item.author === 'object' ? item.author?.id : null) || `user_${index}`;
          const isFollowing = !!followedUsers[authorId];
          const authorName = (typeof item.authorName === 'string' && item.authorName) || (typeof item.author === 'string' && item.author) || (typeof item.author === 'object' && item.author?.name) || 'Esenyurt Üyesi';
          const authorDepartment = (typeof item.authorDepartment === 'string' && item.authorDepartment) || (typeof item.department === 'string' && item.department) || (typeof item.author === 'object' && item.author?.title) || (typeof item.author === 'object' && item.author?.role) || 'Öğrenci / Üye';
          const authorAvatar = (typeof item.authorAvatar === 'string' && item.authorAvatar) || (typeof item.avatar === 'string' && item.avatar) || (typeof item.author === 'object' && item.author?.avatar) || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=0A2342&color=fff`;

          return (
            <div 
              key={item.id || index} 
              className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Post Author Info Header */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div 
                    onClick={() => handleViewProfile(authorId)}
                    className="flex items-center gap-3 cursor-pointer group-hover:opacity-90 transition min-w-0"
                  >
                    <div className="w-11 h-11 rounded-full border border-slate-200 overflow-hidden shrink-0 shadow-sm">
                      <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-gray-900 truncate hover:text-slate-700 transition">
                        {authorName}
                      </h4>
                      <p className="text-[11px] text-gray-500 truncate font-medium">
                        {authorDepartment}
                      </p>
                    </div>
                  </div>

                  {/* Follow Button */}
                  <button
                    onClick={() => handleToggleFollow(authorId, authorName)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                      isFollowing
                        ? 'bg-slate-100 text-slate-700 border border-slate-200'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-700 hover:text-white border border-emerald-200'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck size={14} /> Takip Ediliyor
                      </>
                    ) : (
                      <>
                        <UserPlus size={14} /> Takip Et
                      </>
                    )}
                  </button>
                </div>

                {/* Content Text & Media (Clicking anywhere opens post detail modal) */}
                <div onClick={() => setSelectedPost(item)} className="cursor-pointer group-hover:opacity-95 transition-opacity">
                  <p className="text-xs sm:text-sm text-gray-700 font-normal leading-relaxed mb-3 line-clamp-4">
                    {typeof item.content === 'string' ? item.content : (typeof item.description === 'string' ? item.description : '')}
                  </p>

                  {(item.imageUrl || item.image) && (
                    <div className="w-full h-48 rounded-xl overflow-hidden mb-3 bg-slate-100 border border-slate-100">
                      <img src={item.imageUrl || item.image} alt="Gönderi Medyası" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                </div>
              </div>

              {/* Post Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-4">
                  <span 
                    onClick={() => setSelectedPost(item)}
                    className="flex items-center gap-1 hover:text-rose-600 cursor-pointer font-bold"
                  >
                    <Heart size={15} /> {item.likesCount || item.likes || 12}
                  </span>
                  <span 
                    onClick={() => setSelectedPost(item)}
                    className="flex items-center gap-1 hover:text-blue-600 cursor-pointer font-bold"
                  >
                    <MessageCircle size={15} /> {item.commentsCount || item.comments?.length || 4}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleViewProfile(authorId)}
                    className="flex items-center gap-1 text-slate-700 hover:text-black font-bold text-xs cursor-pointer"
                  >
                    <Eye size={14} /> Profili İncele
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        
        {filteredPosts.length === 0 && (
          <div className="col-span-1 md:col-span-2 py-16 text-center text-gray-500">
            <Compass size={40} className="mx-auto text-gray-300 mb-3 animate-spin" />
            <p className="text-sm font-bold text-gray-700 mb-1">Aramanızla eşleşen paylaşım bulunamadı.</p>
            <p className="text-xs text-gray-400">Filtrelerinizi değiştirmeyi veya farklı anahtar kelimeler aramayı deneyin.</p>
          </div>
        )}
      </div>

      {/* Selected Post Detail Popup Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-gray-100 max-h-[90vh] flex flex-col relative animate-scale-up">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-slate-50 shrink-0">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                Gönderi Detayı & Etkileşim
              </span>
              <button 
                onClick={() => setSelectedPost(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-white transition bg-gray-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
              <PostCard post={selectedPost} currentUser={currentUser} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
