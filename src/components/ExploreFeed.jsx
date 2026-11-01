import React, { useState, useMemo } from 'react';
import useAppStore from '../store/useAppStore';
import {
  Search,
  Heart,
  MessageCircle,
  Play,
  Layers,
  Sparkles,
  Flame,
  TrendingUp,
  Briefcase,
  GraduationCap,
  Award,
  X,
  Compass,
  Bookmark,
  Share2,
  Send,
  MoreHorizontal,
  ArrowLeft,
  Users,
  Calendar,
  MapPin,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import Logo from './Logo';
import SubPanelFloatingDock from './SubPanelFloatingDock';
import SafeAvatar from './shared/SafeAvatar';
import { initialClubs } from '../data/mockClubsData';
import { canViewClubContent, getClubMembershipState } from '../utils/clubSocialNetwork';

export default function ExploreFeed({
  posts: propPosts,
  setView: propSetView,
  setSelectedUserId: propSetSelectedUserId,
  currentUser: propCurrentUser,
  userRole: propUserRole,
  hideDock = false,
  onBack = null,
}) {
  const storePosts = useAppStore((s) => s.posts);
  const storeSetView = useAppStore((s) => s.setView);
  const storeSetSelectedUserId = useAppStore((s) => s.setSelectedUserId);
  const storeSetSelectedClubId = useAppStore((s) => s.setSelectedClubId);
  const storeCurrentUser = useAppStore((s) => s.currentUser);
  const storeUserRole = useAppStore((s) => s.userRole);
  const storeClubs = useAppStore((s) => s.clubs);
  const storeFollowedClubIds = useAppStore((s) => s.followedClubIds);
  const followedClubIds = Array.isArray(storeFollowedClubIds) ? storeFollowedClubIds : [];
  const toggleFollowClub = useAppStore((s) => s.toggleFollowClub);

  const posts = propPosts !== undefined ? propPosts : storePosts;
  const setView = propSetView || storeSetView;
  const setSelectedUserId = propSetSelectedUserId || storeSetSelectedUserId;
  const currentUser = propCurrentUser || storeCurrentUser;
  const userRole = propUserRole || storeUserRole;

  const clubList = useMemo(() => {
    return Array.isArray(storeClubs) && storeClubs.length > 0 ? storeClubs : initialClubs;
  }, [storeClubs]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [likedPostIds, setLikedPostIds] = useState([]);

  const categories = [
    { id: 'all', label: 'Tümü', icon: <Sparkles size={14} /> },
    { id: 'clubs', label: 'Kulüpler & Etkinlikler', icon: <Users size={14} /> },
    { id: 'career', label: 'Kariyer & Staj', icon: <Briefcase size={14} /> },
    { id: 'projects', label: 'Öğrenci Projeleri', icon: <Flame size={14} /> },
    { id: 'alumni', label: 'Mezun Başarıları', icon: <Award size={14} /> },
    { id: 'campus', label: 'Kampüs Yaşamı', icon: <GraduationCap size={14} /> },
  ];

  // Keşfet vitrininde öne çıkan kulüpler ve yaklaşan onaylı kulüp etkinlikleri
  const featuredClubItems = useMemo(() => {
    const items = [];
    clubList.slice(0, 6).forEach((club, idx) => {
      const mState = getClubMembershipState(club, currentUser, followedClubIds);
      const upcomingEvt = (club.events || []).find(
        (e) =>
          canViewClubContent(e, club, currentUser, { surface: 'discover' }) &&
          String(e.status || '').toLowerCase() !== 'tamamlandı'
      );

      items.push({
        id: `disc-club-${club.id}`,
        club,
        membershipState: mState,
        upcomingEvent: upcomingEvt || null,
        spotlightTag: upcomingEvt
          ? 'Yaklaşan Etkinlik'
          : idx === 0
          ? 'Öne Çıkan Kulüp'
          : 'Aktif Kulüp',
      });
    });
    return items;
  }, [clubList, currentUser, followedClubIds]);

  // Keşfet medya ızgarası için hem herkese açık kulüp gönderilerini hem de portal gönderilerini birleştir
  const explorePosts = useMemo(() => {
    const clubMediaPosts = [];
    clubList.forEach((club) => {
      (club.posts || []).forEach((cp) => {
        if (!canViewClubContent(cp, club, currentUser, { surface: 'discover' })) return;
        const coverImg = cp.image || (Array.isArray(cp.images) ? cp.images[0] : null) || club.coverImage;
        if (!coverImg) return;
        clubMediaPosts.push({
          id: cp.id || `exp-clb-${club.id}`,
          clubId: club.id,
          clubName: club.name,
          author: {
            name: club.name,
            avatar: club.logo,
            department: `${club.category || 'Öğrenci Kulübü'} • Kampüs Topluluğu`,
          },
          content: cp.caption || cp.content || '',
          image: coverImg,
          likes: Number(cp.likes || 42),
          comments: Array.isArray(cp.comments) ? cp.comments.length : Number(cp.comments || 4),
          commentsList: Array.isArray(cp.comments)
            ? cp.comments.map((c) => ({ author: c.name || c.user, text: c.text }))
            : [],
          exploreCategory: 'clubs',
          spotlightLabel: 'Öne Çıkan Paylaşım',
          isVideo: Boolean(cp.video || cp.mediaType === 'video'),
          isCarousel: Array.isArray(cp.images) && cp.images.length > 1,
        });
      });
    });

    const visualStandardPosts = (posts || [])
      .filter((p) => p && typeof p === 'object' && p.status !== 'draft' && p.status !== 'cancelled')
      .map((p, index) => {
        const text = (p.content || '').toLowerCase();
        let cat = 'campus';
        if (p.clubId || p.isClubPost) cat = 'clubs';
        else if (text.includes('staj') || text.includes('iş') || text.includes('ilan') || p.jobData) cat = 'career';
        else if (text.includes('proje') || text.includes('teknofest') || text.includes('yapay zeka')) cat = 'projects';
        else if (text.includes('mezun') || text.includes('terfi')) cat = 'alumni';

        return {
          ...p,
          exploreCategory: cat,
          isFeatured: index % 7 === 0,
          isVideo: Boolean(p.video),
          isCarousel: Array.isArray(p.slides) && p.slides.length > 1,
        };
      });

    return [... visualStandardPosts, ...clubMediaPosts];
  }, [posts, clubList, currentUser]);

  const filteredPosts = useMemo(() => {
    return explorePosts.filter((p) => {
      const matchesCat = selectedCategory === 'all' || p.exploreCategory === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const authorName = typeof p.author === 'string' ? p.author : p.author?.name || p.clubName || '';
      const matchesSearch =
        !q ||
        (p.content || '').toLowerCase().includes(q) ||
        authorName.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [explorePosts, selectedCategory, searchQuery]);

  const filteredClubSpotlight = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return featuredClubItems.filter(({ club, upcomingEvent }) => {
      if (!q) return true;
      return (
        club.name.toLowerCase().includes(q) ||
        (club.category || '').toLowerCase().includes(q) ||
        (upcomingEvent?.title || '').toLowerCase().includes(q)
      );
    });
  }, [featuredClubItems, searchQuery]);

  const handleOpenClub = (clubId) => {
    if (clubId) {
      storeSetSelectedClubId?.(String(clubId));
    }
    if (setView) {
      setView('club_portal');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLikeModalPost = (postId) => {
    if (likedPostIds.includes(postId)) {
      setLikedPostIds(likedPostIds.filter((id) => id !== postId));
    } else {
      setLikedPostIds([...likedPostIds, postId]);
    }
  };

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedPost) return;
    const updatedComment = {
      id: Date.now(),
      author: currentUser?.name || 'İESÜ Öğrencisi',
      text: commentText,
      time: 'Şimdi',
    };
    selectedPost.commentsList = [...(selectedPost.commentsList || []), updatedComment];
    selectedPost.comments = (selectedPost.comments || 0) + 1;
    setCommentText('');
  };

  return (
    <div className="w-full pb-20 animate-fade-in">
      {/* Top Search & Discovery Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (onBack) {
                  onBack();
                  return;
                }
                const target =
                  userRole === 'admin'
                    ? 'admin'
                    : userRole === 'company'
                    ? 'company'
                    : userRole === 'alumni'
                    ? 'alumni'
                    : userRole === 'academic'
                    ? 'academic'
                    : 'student';
                if (setView) setView(target);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-[#990000] border border-gray-200/80 transition cursor-pointer font-bold text-xs shadow-2xs shrink-0"
              title="Geri Dön"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Geri</span>
            </button>
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.currentTarget.click();
                }
              }}
              onClick={() => {
                if (onBack) {
                  onBack();
                  return;
                }
                if (setView) setView(userRole === 'alumni' ? 'alumni' : 'student');
              }}
              className="cursor-pointer shrink-0"
              title="Ana Sayfa"
            >
              <Logo className="h-9 w-auto hover:scale-105 transition-transform" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <span>Keşfet & Sosyal Ağ</span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 bg-red-50 text-[#990000] rounded-full border border-red-100">
                  Kampüs & Kulüp Vitrini
                </span>
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Üniversite kulüplerini, yaklaşan kampüs etkinliklerini, öğrenci projelerini ve kariyer fırsatlarını keşfet
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kulüp, etkinlik veya konu ara..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-800 focus:outline-none focus:bg-white focus:border-[#990000] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-[#990000] to-red-700 text-white shadow-md shadow-red-900/15'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* KAMPÜSTE ÖNE ÇIKAN KULÜPLER & YAKLAŞAN ETKİNLİKLER (Selected Category: All or Clubs) */}
      {(selectedCategory === 'all' || selectedCategory === 'clubs') && filteredClubSpotlight.length > 0 && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-[#990000] flex items-center justify-center border border-red-100">
                <Users size={18} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  Kampüste Öne Çıkan Kulüpler & Etkinlikler
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  İlgi alanına uygun öğrenci topluluklarını takip et, üye ol veya yaklaşan etkinliklere katıl
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleOpenClub(null)}
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-[#990000] rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <span>Tüm Kulüpleri Gör ({clubList.length})</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClubSpotlight.slice(0, selectedCategory === 'clubs' ? 6 : 3).map(({ id, club, membershipState, upcomingEvent, spotlightTag }) => (
              <div
                key={id}
                className="rounded-2xl border border-slate-200/90 bg-slate-50/40 hover:bg-white hover:border-red-200 hover:shadow-md transition-all p-4 flex flex-col justify-between"
              >
                <div>
                  {/* Üst Etiket ve Üyelik Rozeti */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-50 text-[#990000] border border-red-100">
                      {spotlightTag}
                    </span>
                    {membershipState.isMember ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 size={11} /> Üyesisin
                      </span>
                    ) : membershipState.isPending ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        Başvurun İnceleniyor
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500">
                        {club.memberCount || club.members?.length || 45} Üye
                      </span>
                    )}
                  </div>

                  {/* Kulüp Başlığı & Kategori */}
                  <div
                    onClick={() => handleOpenClub(club.id)}
                    className="flex items-start gap-3 cursor-pointer group mb-3"
                  >
                    <SafeAvatar
                      src={club.logo}
                      name={club.name}
                      size={48}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-[#990000] transition line-clamp-1">
                        {club.name}
                      </h4>
                      <span className="text-[11px] font-semibold text-slate-500 block truncate">
                        {club.category || 'Öğrenci Kulübü'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                    {club.description}
                  </p>

                  {/* Yaklaşan Etkinlik Kutusu */}
                  {upcomingEvent && (
                    <div
                      onClick={() => handleOpenClub(club.id)}
                      className="mb-3 p-2.5 rounded-xl bg-white border border-slate-200/80 hover:border-red-200 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-[#990000] uppercase tracking-wider mb-0.5">
                        <Calendar size={11} />
                        <span>{upcomingEvent.date} • {upcomingEvent.time || '14:00'}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 truncate">{upcomingEvent.title}</p>
                      <p className="text-[10px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                        <MapPin size={10} /> {upcomingEvent.location || 'Merkez Kampüs'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Eylem Butonları: Takip Et & Kulübü Keşfet / Etkinliği İncele */}
                <div className="pt-3 border-t border-slate-200/70 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleFollowClub?.(String(club.id))}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      membershipState.isFollowing
                        ? 'bg-slate-200/80 text-slate-800 hover:bg-slate-300'
                        : 'bg-white border border-slate-200 text-slate-700 hover:border-[#990000] hover:text-[#990000]'
                    }`}
                  >
                    {membershipState.followLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenClub(club.id)}
                    className="flex-1 py-2 px-3 bg-[#990000] hover:bg-red-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <span>{upcomingEvent ? 'Etkinliği İncele' : 'Kulübü Keşfet'}</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instagram-Style Mosaic Media Grid */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
          <Compass size={40} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-base font-black text-gray-800 mb-1">Bu Kategoride Görsel Bulunamadı</h3>
          <p className="text-xs text-gray-500">Farklı bir kategori seçebilir veya arama kelimesini değiştirebilirsiniz.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 auto-rows-[180px] sm:auto-rows-[230px]">
          {filteredPosts.map((post, idx) => {
            const isLargeTile = idx % 8 === 0;
            const spanClass = isLargeTile ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1';

            return (
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.currentTarget.click();
                  }
                }}
                key={post.id || idx}
                onClick={() => setSelectedPost(post)}
                className={`group relative rounded-2xl overflow-hidden bg-slate-900 cursor-pointer border border-gray-100 shadow-xs ${spanClass}`}
              >
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.author?.name || 'Keşfet Görseli'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-[#990000] p-4 flex flex-col justify-between text-white">
                    <div className="flex items-center gap-2">
                      <SafeAvatar
                        src={post.author?.avatar}
                        name={typeof post.author === 'string' ? post.author : post.author?.name || 'İESÜ'}
                        size={28}
                        className="w-7 h-7 rounded-full border border-white/20"
                      />
                      <span className="text-xs font-bold truncate">
                        {typeof post.author === 'string' ? post.author : post.author?.name}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-white/95 line-clamp-4 leading-relaxed">
                      {post.content}
                    </p>
                  </div>
                )}

                {/* Top-Left Club / Spotlight Badge */}
                {post.clubName && (
                  <div className="absolute top-2.5 left-2.5 bg-black/65 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 border border-white/15 max-w-[80%] truncate">
                    <Users size={11} className="text-amber-300 shrink-0" />
                    <span className="truncate">{post.clubName}</span>
                  </div>
                )}

                {/* Top-Right Media Type Indicator */}
                <div className="absolute top-3 right-3 text-white drop-shadow-md">
                  {post.isVideo ? (
                    <Play size={18} className="fill-white" />
                  ) : post.isCarousel ? (
                    <Layers size={18} />
                  ) : null}
                </div>

                {/* Hover Overlay with Likes & Comments */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
                  <div className="flex items-center gap-4 text-white font-black text-xs sm:text-sm mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Heart size={16} className="fill-white" />
                      {(post.likes || 0) + (likedPostIds.includes(post.id) ? 1 : 0)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageCircle size={16} className="fill-white" />
                      {post.comments || 0}
                    </span>
                  </div>
                  {post.image && (
                    <p className="text-[11px] text-white/90 font-medium line-clamp-2 leading-snug">
                      <strong className="font-black mr-1">
                        {typeof post.author === 'string' ? post.author : post.author?.name}
                      </strong>
                      {post.content}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Post Detail Modal */}
      {selectedPost && (
        <div
          onClick={() => setSelectedPost(null)}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[88vh] overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 border border-gray-100"
          >
            {/* Left Media Box */}
            <div className="md:col-span-7 bg-black flex items-center justify-center max-h-[45vh] md:max-h-[88vh] overflow-hidden relative">
              <img
                src={selectedPost.image}
                alt="Post"
                className="w-full h-full object-contain max-h-[45vh] md:max-h-[88vh]"
              />
            </div>

            {/* Right Info & Comments Box */}
            <div className="md:col-span-5 flex flex-col h-full max-h-[43vh] md:max-h-[88vh] bg-white">
              {/* Author Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div
                  onClick={() => {
                    if (selectedPost.clubId) {
                      setSelectedPost(null);
                      handleOpenClub(selectedPost.clubId);
                      return;
                    }
                    if (setSelectedUserId && setView) {
                      setSelectedPost(null);
                      setSelectedUserId(selectedPost.author?.name);
                      setView('user_profile');
                    }
                  }}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <SafeAvatar
                    src={selectedPost.author?.avatar}
                    name={selectedPost.author?.name}
                    size="md"
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <h4 className="text-xs font-black text-gray-900 group-hover:text-[#990000] transition-colors">
                      {typeof selectedPost.author === 'string' ? selectedPost.author : selectedPost.author?.name}
                    </h4>
                    <span className="text-[10px] text-gray-400 font-semibold block">
                      {selectedPost.author?.department || 'İESÜ Kampüs Ağı'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedPost.clubId && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPost(null);
                        handleOpenClub(selectedPost.clubId);
                      }}
                      className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-[#990000] rounded-lg text-[10px] font-bold transition cursor-pointer"
                    >
                      Kulübü Aç
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Caption & Comments Scroll */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <SafeAvatar
                    src={selectedPost.author?.avatar}
                    name={selectedPost.author?.name}
                    size="sm"
                    className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="leading-relaxed text-gray-700">
                    <strong className="font-black text-gray-900 mr-1.5">
                      {typeof selectedPost.author === 'string' ? selectedPost.author : selectedPost.author?.name}
                    </strong>
                    {selectedPost.content}
                  </div>
                </div>

                {/* Existing Comments */}
                <div className="pt-3 border-t border-gray-50 space-y-3">
                  {(selectedPost.commentsList || []).map((c, i) => (
                    <div key={c.id || i} className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-red-50 text-[#990000] font-black text-[10px] flex items-center justify-center shrink-0">
                        {(c.author || 'Ö')[0]}
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 mr-1.5">{c.author}</span>
                        <span className="text-gray-600">{c.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Bar & Input */}
              <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLikeModalPost(selectedPost.id)}
                      className={`flex items-center gap-1.5 text-xs font-black transition cursor-pointer ${
                        likedPostIds.includes(selectedPost.id)
                          ? 'text-red-600'
                          : 'text-gray-700 hover:text-red-600'
                      }`}
                    >
                      <Heart
                        size={20}
                        className={likedPostIds.includes(selectedPost.id) ? 'fill-red-600 text-red-600' : ''}
                      />
                      <span>{(selectedPost.likes || 0) + (likedPostIds.includes(selectedPost.id) ? 1 : 0)} Beğeni</span>
                    </button>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                      <MessageCircle size={19} />
                      <span>{selectedPost.comments || 0} Yorum</span>
                    </span>
                  </div>
                  <Bookmark size={19} className="text-gray-500 hover:text-gray-900 cursor-pointer" />
                </div>

                <form onSubmit={handleSendComment} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Yorum ekle..."
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#990000]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-[#990000] text-white rounded-xl text-xs font-bold hover:bg-red-800 transition cursor-pointer"
                  >
                    Paylaş
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {!hideDock && (
        <SubPanelFloatingDock
          currentUser={currentUser}
          setView={setView}
          setSelectedUserId={setSelectedUserId}
          userRole={userRole}
        />
      )}
    </div>
  );
}
