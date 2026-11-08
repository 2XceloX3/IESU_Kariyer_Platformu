import React, { useState, useMemo, useRef } from 'react';
import useAppStore from '../store/useAppStore';
import {
  Search,
  Heart,
  MessageCircle,
  Play,
  Layers,
  Sparkles,
  Flame,
  Briefcase,
  GraduationCap,
  Award,
  X,
  Compass,
  Bookmark,
  Share2,
  ArrowLeft,
  Users,
  Calendar,
  MapPin,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Quote,
} from 'lucide-react';
import SubPanelFloatingDock from './SubPanelFloatingDock';
import SafeAvatar from './shared/SafeAvatar';
import { initialClubs } from '../data/mockClubsData';
import { canViewClubContent, getClubMembershipState } from '../utils/clubSocialNetwork';

/**
 * Fault-tolerant image component that handles 404s, slow connections, and broken links
 * by automatically rendering an elegant branded gradient card instead of a broken image icon.
 */
function SafeExploreImage({
  src,
  alt = '',
  className = '',
  fallbackCategory = 'campus',
  title = '',
  author = ''
}) {
  const [hasError, setHasError] = useState(!src || typeof src !== 'string' || !src.trim());

  if (hasError || !src) {
    const gradients = {
      clubs: 'from-amber-600 via-rose-700 to-red-950',
      career: 'from-blue-700 via-indigo-800 to-slate-950',
      projects: 'from-emerald-600 via-teal-800 to-slate-950',
      alumni: 'from-purple-700 via-violet-900 to-slate-950',
      campus: 'from-red-800 via-rose-900 to-slate-950',
    };
    const bg = gradients[fallbackCategory] || gradients.campus;

    return (
      <div className={`w-full h-full bg-gradient-to-br ${bg} p-4 flex flex-col justify-between text-white select-none ${className}`}>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/25">
            {fallbackCategory === 'clubs' ? 'Kulüp' : fallbackCategory === 'career' ? 'Kariyer' : fallbackCategory === 'projects' ? 'Proje' : fallbackCategory === 'alumni' ? 'Mezun' : 'Kampüs'}
          </span>
          <span className="text-[10px] font-bold text-white/75">İESÜ Ağı</span>
        </div>
        <div className="my-auto py-2">
          <Quote size={20} className="text-white/40 mb-1" />
          <h4 className="text-xs font-black text-white line-clamp-3 leading-snug">
            {title || 'İstanbul Esenyurt Üniversitesi Kampüs Paylaşımı'}
          </h4>
        </div>
        {author && (
          <p className="text-[10px] font-semibold text-white/80 line-clamp-1 border-t border-white/15 pt-1.5">
            {author}
          </p>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
}

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

  const clubsScrollRef = useRef(null);

  const scrollClubs = (direction) => {
    if (clubsScrollRef.current) {
      const offset = direction === 'left' ? -280 : 280;
      clubsScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const categories = [
    { id: 'all', label: 'Tümü', icon: <Sparkles size={13} /> },
    { id: 'clubs', label: 'Kulüpler & Etkinlikler', icon: <Users size={13} /> },
    { id: 'career', label: 'Kariyer & Staj', icon: <Briefcase size={13} /> },
    { id: 'projects', label: 'Öğrenci Projeleri', icon: <Flame size={13} /> },
    { id: 'alumni', label: 'Mezun Başarıları', icon: <Award size={13} /> },
    { id: 'campus', label: 'Kampüs Yaşamı', icon: <GraduationCap size={13} /> },
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

  // Keşfet medya ızgarası için kulüp paylaşımlarını ve genel akış paylaşımlarını birleştir
  const explorePosts = useMemo(() => {
    const clubMediaPosts = [];
    clubList.forEach((club) => {
      (club.posts || []).forEach((cp) => {
        if (!canViewClubContent(cp, club, currentUser, { surface: 'discover' })) return;
        const coverImg = cp.image || (Array.isArray(cp.images) ? cp.images[0] : null) || club.coverImage;
        clubMediaPosts.push({
          id: cp.id || `exp-clb-${club.id}-${Math.random()}`,
          clubId: club.id,
          clubName: club.name,
          author: {
            name: club.name,
            avatar: club.logo,
            department: `${club.category || 'Öğrenci Kulübü'} • Kampüs Topluluğu`,
          },
          content: cp.caption || cp.content || '',
          image: coverImg || null,
          likes: Number(cp.likes || 42),
          comments: Array.isArray(cp.comments) ? cp.comments.length : Number(cp.comments || 4),
          commentsList: Array.isArray(cp.comments)
            ? cp.comments.map((c) => ({ author: c.name || c.user, text: c.text }))
            : [],
          exploreCategory: 'clubs',
          spotlightLabel: 'Kulüp Paylaşımı',
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
          isFeatured: index % 6 === 0,
          isVideo: Boolean(p.video),
          isCarousel: Array.isArray(p.slides) && p.slides.length > 1,
        };
      });

    return [...visualStandardPosts, ...clubMediaPosts];
  }, [posts, clubList, currentUser]);

  const filteredPosts = useMemo(() => {
    return explorePosts.filter((p) => {
      const matchesCat = selectedCategory === 'all' || p.exploreCategory === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const authorName = typeof p.author === 'string' ? p.author : p.author?.name || p.clubName || '';
      const matchesSearch =
        !q ||
        (p.content || '').toLowerCase().includes(q) ||
        (p.title || '').toLowerCase().includes(q) ||
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
    <div className="w-full pb-36 animate-fade-in space-y-5">
      {/* ════════ TOP SEARCH & DISCOVERY BAR (HARMONIOUS PORTAL DESIGN) ════════ */}
      <div className="bg-white dark:bg-[#131c31] rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col gap-3.5 mb-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-[#990000] border border-slate-200/80 transition cursor-pointer font-bold text-xs shrink-0"
                title="Geri Dön"
              >
                <ArrowLeft size={14} />
                <span>Akışa Dön</span>
              </button>
              
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5">
                    <Compass size={17} className="text-[#990000]" />
                    <span>Keşfet & Sosyal Ağ</span>
                  </h2>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-red-50 text-[#990000] rounded-full border border-red-200">
                    Kampüs Vitrini
                  </span>
                </div>
              </div>
            </div>

            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
              {filteredPosts.length} İçerik
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            Üniversite kulüplerini, yaklaşan etkinlikleri, öğrenci projelerini ve kariyer fırsatlarını keşfet
          </p>

          {/* Unified Global Search Input (Matches placeholder for Vitest and User Search) */}
          <div className="relative w-full">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Öğrenci, mezun, akademisyen veya konu ara..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#990000] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                title="Aramayı Temizle"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {categories.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-[#990000] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ════════ KAMPÜSTE ÖNE ÇIKAN KULÜPLER & YAKLAŞAN ETKİNLİKLER (CAROUSEL TRACK) ════════ */}
      {(selectedCategory === 'all' || selectedCategory === 'clubs') && filteredClubSpotlight.length > 0 && (
        <div className="bg-white dark:bg-[#131c31] rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs relative">
          <div className="flex items-center justify-between gap-3 mb-3.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-[#990000] flex items-center justify-center border border-red-100">
                <Users size={16} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 leading-tight">
                  Kampüste Öne Çıkan Kulüpler & Etkinlikler
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Öğrenci topluluklarını takip et, üye ol veya etkinliklere katıl
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollClubs('left')}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center transition cursor-pointer"
                title="Önceki Kulüp"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                type="button"
                onClick={() => scrollClubs('right')}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center transition cursor-pointer"
                title="Sonraki Kulüp"
              >
                <ChevronRight size={15} />
              </button>
              <button
                type="button"
                onClick={() => handleOpenClub(null)}
                className="ml-1 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-[#990000] rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <span>Tüm Kulüpleri Gör ({clubList.length})</span>
                <ChevronRight size={12} />
              </button>
            </div>
          </div>

          {/* Smooth Snap Carousel: Each card gets a dedicated 280px width, zero squeezing! */}
          <div
            ref={clubsScrollRef}
            className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory scroll-smooth"
          >
            {filteredClubSpotlight.map(({ id, club, membershipState, upcomingEvent, spotlightTag }) => (
              <div
                key={id}
                className="w-[280px] min-w-[275px] max-w-[285px] shrink-0 snap-start rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800/80 hover:border-red-200 hover:shadow-md transition-all p-4 flex flex-col justify-between"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-[#990000] border border-red-100">
                      {spotlightTag}
                    </span>
                    {membershipState.isMember ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 size={11} /> Üyesisin
                      </span>
                    ) : membershipState.isPending ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        Başvurun İnceleniyor
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500">
                        {club.memberCount || club.members?.length || 45} Üye
                      </span>
                    )}
                  </div>

                  {/* Club Avatar & Identity */}
                  <div
                    onClick={() => handleOpenClub(club.id)}
                    className="flex items-start gap-2.5 cursor-pointer group mb-2"
                  >
                    <SafeAvatar
                      src={club.logo}
                      name={club.name}
                      size="lg"
                      rounded="rounded-xl"
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 group-hover:text-[#990000] transition line-clamp-2 leading-tight">
                        {club.name}
                      </h4>
                      <span className="text-[10px] font-semibold text-slate-500 block truncate mt-0.5">
                        {club.category || 'Öğrenci Kulübü'}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 mb-2.5 leading-relaxed">
                    {club.description}
                  </p>

                  {/* Upcoming Event Micro-Card */}
                  {upcomingEvent ? (
                    <div
                      onClick={() => handleOpenClub(club.id)}
                      className="mb-3 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 hover:border-red-200 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-[#990000] uppercase tracking-wider mb-0.5">
                        <Calendar size={11} />
                        <span className="truncate">{upcomingEvent.date} • {upcomingEvent.time || '14:00'}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{upcomingEvent.title}</p>
                      <p className="text-[10px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                        <MapPin size={10} /> {upcomingEvent.location || 'Merkez Kampüs'}
                      </p>
                    </div>
                  ) : (
                    <div className="mb-3 p-2 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 border border-dashed border-slate-200 text-center">
                      <span className="text-[10px] font-medium text-slate-500">Yakında yeni etkinlik planlanıyor</span>
                    </div>
                  )}
                </div>

                {/* Bottom Action Buttons (Never clipped or overflowing) */}
                <div className="pt-2.5 border-t border-slate-200/70 dark:border-slate-800 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleFollowClub?.(String(club.id))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                      membershipState.isFollowing
                        ? 'bg-slate-200/90 text-slate-800 hover:bg-slate-300'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 text-slate-700 hover:border-[#990000] hover:text-[#990000]'
                    }`}
                  >
                    {membershipState.followLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenClub(club.id)}
                    className="flex-1 py-1.5 px-3 bg-[#990000] hover:bg-red-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <span>{upcomingEvent ? 'Etkinliği İncele' : 'Kulübe Git'}</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════ KEŞFET GÖNDERİLERİ & MEDYA AKIŞI (CLEAN 2-COLUMN MASONRY GRID) ════════ */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white dark:bg-[#131c31] rounded-2xl p-10 text-center border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <Compass size={36} className="mx-auto text-slate-300 mb-2.5" />
          <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 mb-1">Bu Kategoride İçerik Bulunamadı</h3>
          <p className="text-xs text-slate-500">Farklı bir kategori seçebilir veya arama kelimesini değiştirebilirsiniz.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredPosts.map((post, idx) => {
            const authorName = typeof post.author === 'string' ? post.author : post.author?.name || post.clubName || 'İESÜ Kampüs';
            const authorAvatar = typeof post.author === 'object' ? post.author?.avatar : null;
            const hasVisual = Boolean(post.image);

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
                className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs cursor-pointer aspect-[4/3] flex flex-col justify-between"
              >
                {/* Media or Branded Gradient */}
                {hasVisual ? (
                  <SafeExploreImage
                    src={post.image}
                    alt={authorName}
                    title={post.title || post.content}
                    author={authorName}
                    fallbackCategory={post.exploreCategory}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-[#800000] p-4 flex flex-col justify-between text-white select-none">
                    <div className="flex items-center gap-2">
                      <SafeAvatar
                        src={authorAvatar}
                        name={authorName}
                        size="sm"
                        rounded="rounded-full"
                        className="w-7 h-7 rounded-full border border-white/20"
                      />
                      <span className="text-xs font-bold truncate">{authorName}</span>
                    </div>
                    <p className="text-xs font-semibold text-white/95 line-clamp-3 leading-relaxed">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-white/70 pt-2 border-t border-white/10">
                      <span>{(post.likes || 0) + (likedPostIds.includes(post.id) ? 1 : 0)} Beğeni</span>
                      <span>{post.comments || 0} Yorum</span>
                    </div>
                  </div>
                )}

                {/* Top Badge: Club / Topic */}
                {post.clubName && hasVisual && (
                  <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 border border-white/15 max-w-[80%] truncate">
                    <Users size={11} className="text-amber-300 shrink-0" />
                    <span className="truncate">{post.clubName}</span>
                  </div>
                )}

                {/* Top-Right Indicator */}
                {hasVisual && (
                  <div className="absolute top-2.5 right-2.5 text-white drop-shadow-md">
                    {post.isVideo ? (
                      <Play size={16} className="fill-white" />
                    ) : post.isCarousel ? (
                      <Layers size={16} />
                    ) : null}
                  </div>
                )}

                {/* Hover Overlay with Stats and Text snippet */}
                {hasVisual && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3.5 text-white">
                    <div className="flex items-center gap-3 font-black text-xs mb-1">
                      <span className="flex items-center gap-1">
                        <Heart size={14} className="fill-white text-white" />
                        {(post.likes || 0) + (likedPostIds.includes(post.id) ? 1 : 0)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle size={14} className="fill-white text-white" />
                        {post.comments || 0}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/95 line-clamp-2 leading-snug">
                      <strong className="font-bold mr-1">{authorName}:</strong>
                      {post.content}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ════════ LIGHTBOX POST DETAIL MODAL ════════ */}
      {selectedPost && (
        <div
          onClick={() => setSelectedPost(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#131c31] rounded-3xl max-w-4xl w-full max-h-[88vh] overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 border border-slate-200 dark:border-slate-800"
          >
            {/* Left Media Box */}
            <div className="md:col-span-7 bg-black flex items-center justify-center max-h-[45vh] md:max-h-[88vh] overflow-hidden relative">
              <SafeExploreImage
                src={selectedPost.image}
                alt="Post Detayı"
                title={selectedPost.title || selectedPost.content}
                author={typeof selectedPost.author === 'string' ? selectedPost.author : selectedPost.author?.name}
                fallbackCategory={selectedPost.exploreCategory}
                className="w-full h-full object-contain max-h-[45vh] md:max-h-[88vh]"
              />
            </div>

            {/* Right Info & Comments Box */}
            <div className="md:col-span-5 flex flex-col h-full max-h-[43vh] md:max-h-[88vh] bg-white dark:bg-[#131c31]">
              {/* Author Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div
                  onClick={() => {
                    if (selectedPost.clubId) {
                      setSelectedPost(null);
                      handleOpenClub(selectedPost.clubId);
                      return;
                    }
                    if (setSelectedUserId && setView) {
                      setSelectedPost(null);
                      setSelectedUserId(selectedPost.author?.name || selectedPost.authorId);
                      setView('user_profile');
                    }
                  }}
                  className="flex items-center gap-2.5 cursor-pointer group min-w-0"
                >
                  <SafeAvatar
                    src={selectedPost.author?.avatar}
                    name={typeof selectedPost.author === 'string' ? selectedPost.author : selectedPost.author?.name}
                    size="md"
                    rounded="rounded-xl"
                    className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 group-hover:text-[#990000] transition-colors truncate">
                      {typeof selectedPost.author === 'string' ? selectedPost.author : selectedPost.author?.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-semibold block truncate">
                      {selectedPost.author?.department || 'İESÜ Kampüs Ağı'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
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
                    type="button"
                    onClick={() => setSelectedPost(null)}
                    className="p-1 rounded-full hover:bg-slate-100 text-slate-500 transition cursor-pointer"
                    title="Kapat"
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>

              {/* Caption & Comments List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                <div className="flex items-start gap-2.5 leading-relaxed text-slate-700 dark:text-slate-300">
                  <strong className="font-black text-slate-900 dark:text-slate-100 shrink-0">
                    {typeof selectedPost.author === 'string' ? selectedPost.author : selectedPost.author?.name}:
                  </strong>
                  <span>{selectedPost.content}</span>
                </div>

                {/* Existing Comments */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                  {(selectedPost.commentsList || []).length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic">Henüz yorum yapılmamış. İlk yorumu sen yap!</p>
                  ) : (
                    (selectedPost.commentsList || []).map((c, i) => (
                      <div key={c.id || i} className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-red-50 text-[#990000] font-black text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                          {(c.author || 'Ö')[0]}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-slate-100 mr-1.5">{c.author}</span>
                          <span className="text-slate-600 dark:text-slate-300">{c.text}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Engagement Bar & Comment Form */}
              <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleLikeModalPost(selectedPost.id)}
                      className={`flex items-center gap-1.5 text-xs font-black transition cursor-pointer ${
                        likedPostIds.includes(selectedPost.id)
                          ? 'text-red-600'
                          : 'text-slate-700 hover:text-red-600'
                      }`}
                    >
                      <Heart
                        size={17}
                        className={likedPostIds.includes(selectedPost.id) ? 'fill-red-600 text-red-600' : ''}
                      />
                      <span>{(selectedPost.likes || 0) + (likedPostIds.includes(selectedPost.id) ? 1 : 0)} Beğeni</span>
                    </button>
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                      <MessageCircle size={16} />
                      <span>{selectedPost.comments || 0} Yorum</span>
                    </span>
                  </div>
                  <Bookmark size={16} className="text-slate-400 hover:text-slate-700 cursor-pointer" />
                </div>

                <form onSubmit={handleSendComment} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Yorum ekle..."
                    className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-[#990000]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#990000] text-white rounded-xl text-xs font-bold hover:bg-red-800 transition cursor-pointer"
                  >
                    Paylaş
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Floating Dock (if not hidden by parent) */}
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
