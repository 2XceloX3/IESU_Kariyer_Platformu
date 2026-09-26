import React, { useState, useEffect, useCallback, memo } from 'react';
import { MoreHorizontal, Heart, MessageCircle, Bookmark, Send, Briefcase, FileText, Download, ShieldCheck, X, Edit2, Trash2, Crown, Award, ClipboardList, CheckCircle2, Copy, Share2, Building2, MapPin, Calendar, Sparkles } from 'lucide-react';
import { FaWhatsapp, FaDiscord } from 'react-icons/fa';
import useAppStore from '../store/useAppStore';
import SafeAvatar from './shared/SafeAvatar';
import DOMPurify from 'dompurify';


const PostCard = memo(function PostCard({ post, currentUser, setPosts, setMessages, setSelectedUserId, setView }) {
  const sendMessage = useAppStore(state => state.sendMessage);
  const activeFrame = useAppStore(state => state.activeFrame);
  const storeSetSelectedUserId = useAppStore(state => state.setSelectedUserId);
  const storeSetView = useAppStore(state => state.setView);
  const activeSetSelectedUserId = setSelectedUserId || storeSetSelectedUserId;
  const activeSetView = setView || storeSetView;

  const handleProfileClick = (e) => {
    e.stopPropagation();
    const targetUserId = post?.authorId || post?.author?.id || post?.userId || post?.authorName || (typeof post?.author === 'string' ? post.author : post?.author?.name);
    if (targetUserId && activeSetSelectedUserId && activeSetView) {
      activeSetSelectedUserId(targetUserId);
      const isSelf = targetUserId === 'self' || (currentUser && (
        targetUserId === currentUser.id ||
        targetUserId === currentUser.uid ||
        targetUserId === currentUser.studentNo ||
        (currentUser.name && String(targetUserId).trim().toLowerCase() === currentUser.name.trim().toLowerCase())
      ));
      activeSetView(isSelf ? 'user_profile' : 'public_profile');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ─── İŞ & STAJ BAŞVURU SİSTEMİ ───
  const applications = useAppStore(state => state.applications) || [];
  const setApplications = useAppStore(state => state.setApplications);
  const addApplication = useAppStore(state => state.addApplication);
  const addNotification = useAppStore(state => state.addNotification);
  const activePortalBranch = useAppStore(state => state.activePortalBranch);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyPhone, setApplyPhone] = useState(currentUser?.phone || '');
  const [applyCvType, setApplyCvType] = useState('KGM Akredite İESÜ Dijital CV');
  const [applyCoverLetter, setApplyCoverLetter] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const effectiveApplicantId = currentUser?.id || (activePortalBranch === 'alumni' ? 'ALU-001' : 'STU-001');
  const targetJobId = post?.jobData?.id || post?.id;
  const rawTitle = post?.jobData?.title || (post?.content ? post.content.split('\n')[0].replace('💼 YENİ İLAN:', '').trim() : 'Ulusal Staj Programı İlanı');
  const cleanJobTitle = rawTitle.length > 75 ? rawTitle.slice(0, 75) + '...' : rawTitle;
  const companyName = post?.jobData?.company || post?.author?.name || 'İESÜ Kariyer Geliştirme Koordinatörlüğü';
  const jobLocation = post?.jobData?.location || 'İstanbul / Türkiye Geneli';
  const jobType = post?.jobData?.type || 'STAJ';

  const hasApplied = applications.some(a => 
    (a.jobId === targetJobId || (cleanJobTitle && a.jobTitle === cleanJobTitle)) &&
    (a.applicantId === effectiveApplicantId || (currentUser?.email && a.applicantEmail === currentUser.email))
  );

  const handleOpenApplyModal = (e) => {
    e?.stopPropagation?.();
    if (hasApplied) {
      window.toast?.info?.("Bu ilana zaten başvuruda bulundunuz. Başvurunuz Yönetici Paneli Başvuru Havuzunda incelenmektedir.");
      return;
    }
    setIsApplyModalOpen(true);
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (hasApplied) {
      window.toast?.info?.("Bu ilana zaten başvuruda bulundunuz.");
      setIsApplyModalOpen(false);
      return;
    }

    setIsApplying(true);
    const applicantName = currentUser?.name || (activePortalBranch === 'alumni' ? 'Caner Yıldız (Mezun)' : 'Mert Demir');
    const applicantDept = currentUser?.department || 'Bilgisayar Mühendisliği';
    const applicantEmail = currentUser?.email || (activePortalBranch === 'alumni' ? 'mezun@esenyurt.edu.tr' : 'ogrenci@esenyurt.edu.tr');
    const applicantPhone = applyPhone || currentUser?.phone || '0555 123 4567';

    const newApp = {
      id: 'APP-' + Date.now(),
      jobId: targetJobId,
      jobTitle: cleanJobTitle,
      company: companyName,
      applicantId: effectiveApplicantId,
      applicantName: applicantName,
      applicantEmail: applicantEmail,
      applicantPhone: applicantPhone,
      applicantDept: applicantDept,
      coverLetter: applyCoverLetter || `${cleanJobTitle} programına başvuruda bulunmaktayım.`,
      cvType: applyCvType,
      status: 'Beklemede',
      companyContacted: false,
      date: new Date().toLocaleDateString('tr-TR'),
      timestamp: new Date().toISOString()
    };

    if (addApplication) {
      addApplication(newApp);
    } else if (setApplications) {
      setApplications(prev => [newApp, ...(prev || [])]);
    } else {
      useAppStore.getState().setApplications?.([newApp, ...(useAppStore.getState().applications || [])]);
    }

    if (addNotification) {
      addNotification({
        id: 'N-' + Date.now(),
        userId: effectiveApplicantId,
        text: `${cleanJobTitle} için başvurunuz Yönetici Paneli Başvuru Havuzuna iletildi.`,
        read: false,
        time: 'Az önce',
        type: 'application'
      });
    }

    try {
      const LOCAL_STORAGE_KEY = 'iesu_candidate_pool_v1';
      const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
      let poolData = existing ? JSON.parse(existing) : null;
      if (poolData && Array.isArray(poolData.candidates)) {
        const candidateRecord = {
          id: newApp.id,
          name: newApp.applicantName,
          department: newApp.applicantDept,
          gpa: currentUser?.gpa || '3.50',
          company: newApp.company,
          date: newApp.date,
          stage: 'Başvuru',
          matchScore: 95,
          experience: (newApp.coverLetter || '').slice(0, 45) + '...',
          lang: 'İngilizce (B2)',
          phone: newApp.applicantPhone,
          email: newApp.applicantEmail
        };
        poolData.candidates.unshift(candidateRecord);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(poolData));
      }
    } catch (err) {
      console.warn('Candidate pool sync warning:', err);
    }

    setIsApplying(false);
    setIsApplyModalOpen(false);
    setApplyCoverLetter('');
    window.toast?.success?.("Başvurunuz başarıyla kaydedildi! Yönetici Paneli Başvuru Havuzuna iletildi.");
  };

  const [liked, setLiked] = useState(post?.likes > 0);
  const [showHeart, setShowHeart] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(Array.isArray(post?.commentsList) ? post.commentsList : []);
  const [newComment, setNewComment] = useState('');
  
  // Share Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareTarget, setShareTarget] = useState('');
  const [shareText, setShareText] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  
  // Repost Modal State
  const [isRepostModalOpen, setIsRepostModalOpen] = useState(false);
  const [repostComment, setRepostComment] = useState('');
  
  // Edit/Menu State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post?.content || '');
  
  // Survey State
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [surveyAnswers, setSurveyAnswers] = useState({});
  const [surveyCompleted, setSurveyCompleted] = useState(false);

  const handleSurveySubmit = useCallback(() => {
    if (setPosts) {
      setPosts(prev => (prev || []).map(p => {
        if (p.id === post.id) {
          const newResponses = [...(p.surveyResponses || []), {
            userId: currentUser?.id || 'anonymous',
            answers: surveyAnswers,
            date: new Date().toISOString()
          }];
          return { ...p, surveyResponses: newResponses };
        }
        return p;
      }));
    }
    setSurveyCompleted(true);
    setTimeout(() => {
      setIsSurveyModalOpen(false);
    }, 2000);
  }, [post?.id, currentUser?.id, surveyAnswers, setPosts]);

  const renderBadges = useCallback((badgeData) => {
    let badges = [];
    if (typeof badgeData === 'string' && badgeData.trim() !== '') badges = [badgeData];
    else if (Array.isArray(badgeData)) badges = badgeData;
    
    if (badges.length === 0) return null;
    return (
      <div className="flex items-center gap-1 ml-1.5">
        {badges.map((badge, idx) => {
          const k = `badge-${badge}-${idx}`;
          if (badge === 'verified' || badge === 'Doğrulanmış') return <ShieldCheck key={k} size={14} className="text-red-500" title="Doğrulanmış" />;
          if (badge === 'top_voice' || badge === 'Top Voice') return <Crown key={k} size={14} className="text-amber-500" title="Top Voice" />;
          if (badge === 'president' || badge === 'Kulüp Başkanı') return <Crown key={k} size={14} className="text-purple-600" title="Kulüp Başkanı" />;
          if (badge === 'rep' || badge === 'Sınıf Temsilcisi') return <Award key={k} size={14} className="text-emerald-500" title="Sınıf Temsilcisi" />;
          return <span key={k} className="bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-200 uppercase">{badge}</span>;
        })}
      </div>
    );
  }, []);

  const handleDoubleTap = useCallback(() => {
    if (!liked) handleLikeToggle();
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1000);
  }, [liked]);

  const handleLikeToggle = useCallback(() => {
    setLiked(!liked);
    if (setPosts) {
      setPosts(prev => (prev || []).map(p => 
        p.id === post.id ? { ...p, likes: (p.likes || 0) + (liked ? -1 : 1) } : p
      ));
    }
  }, [liked, post?.id, setPosts]);

  useEffect(() => {
    if (isShareModalOpen && availableUsers.length === 0) {
      try {
        const students = JSON.parse(localStorage.getItem('iesu_students_v3') || localStorage.getItem('igu_students_v3') || '[]');
        const alumni = JSON.parse(localStorage.getItem('iesu_alumni_v3') || localStorage.getItem('igu_alumni_v3') || '[]');
        setAvailableUsers([...students, ...alumni].filter(u => u.source !== 'demo_seed'));
      } catch (e) { console.error(e); }
    }
  }, [isShareModalOpen, availableUsers.length]);

  const handleAddComment = useCallback(() => {
    const trimmed = newComment.trim();
    if (!trimmed) return;
    const sanitizedText = DOMPurify.sanitize(trimmed).slice(0, 500);
    const commentObj = {
      id: 'cmt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      text: sanitizedText,
      author: currentUser?.name || 'Siz',
      authorId: currentUser?.id,
      time: 'Şimdi',
      createdAt: new Date().toISOString()
    };
    const updatedComments = [...comments, commentObj];
    setComments(updatedComments);
    setNewComment('');
    if (setPosts) {
      setPosts(prev => (prev || []).map(p => 
        p.id === post.id 
          ? { ...p, comments: (p.comments || 0) + 1, commentsList: updatedComments } 
          : p
      ));
    }
  }, [newComment, comments, currentUser?.name, currentUser?.id, post?.id, setPosts]);

  const handleDeleteComment = useCallback((commentId) => {
    const updatedComments = comments.filter(c => c.id !== commentId);
    setComments(updatedComments);
    if (setPosts) {
      setPosts(prev => (prev || []).map(p => 
        p.id === post.id 
          ? { ...p, comments: Math.max(0, (p.comments || 1) - 1), commentsList: updatedComments } 
          : p
      ));
    }
  }, [comments, post?.id, setPosts]);

  const handleCopyLink = useCallback(() => {
    const shareUrl = typeof window !== 'undefined' && window.location?.origin 
      ? `${window.location.origin}/post/${post.id}` 
      : `https://kariyer.esenyurt.edu.tr/post/${post.id}`;
    navigator.clipboard.writeText(shareUrl);
    if (window.toast && typeof window.toast.success === 'function') {
      window.toast.success("Bağlantı kopyalandı!");
    }
  }, [post?.id]);

  const handleWhatsappShare = useCallback(() => {
    const shareUrl = typeof window !== 'undefined' && window.location?.origin 
      ? `${window.location.origin}/post/${post.id}` 
      : `https://kariyer.esenyurt.edu.tr/post/${post.id}`;
    const text = `Bu ilana göz at: ${post.title || 'Kariyer İlanı'} \n${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  }, [post?.id, post?.title]);

  const handleDiscordShare = useCallback(() => {
    const shareUrl = typeof window !== 'undefined' && window.location?.origin 
      ? `${window.location.origin}/post/${post.id}` 
      : `https://kariyer.esenyurt.edu.tr/post/${post.id}`;
    navigator.clipboard.writeText(shareUrl);
    if (window.toast && typeof window.toast.info === 'function') {
      window.toast.info("Link kopyalandı. Discord'a yapıştırabilirsiniz!");
    }
  }, [post?.id]);

  const handleShare = useCallback(() => {
    if (!shareTarget) {
      if (window.toast && typeof window.toast.error === 'function') {
        window.toast.error("Lütfen paylaşılacak kişiyi seçin.");
      }
      return;
    }
    
    const newMsg = {
      id: 'msg_' + Date.now(),
      senderId: currentUser?.id || 'unknown',
      receiverId: shareTarget,
      text: `[GÖNDERİ PAYLAŞIMI]\n${shareText ? shareText + '\n\n' : ''}Gönderi: ${(post.content || '').substring(0, 100)}...`,
      timestamp: new Date().toISOString(),
      read: false
    };

    if (setMessages) {
      setMessages(prev => [...(prev || []), newMsg]);
    } else {
      try {
        const msgs = JSON.parse(localStorage.getItem('iesu_messages_v2') || localStorage.getItem('igu_messages_v2') || '[]');
        localStorage.setItem('iesu_messages_v2', JSON.stringify([...msgs, newMsg]));
      } catch(e) {}
    }
    
    setIsShareModalOpen(false);
    setShareText('');
    setShareTarget('');
    if (window.toast && typeof window.toast.success === 'function') {
      window.toast.success("Gönderi başarıyla paylaşıldı!");
    }
  }, [shareTarget, shareText, post?.content, currentUser?.id, setMessages]);

  const handleSaveEdit = useCallback(() => {
    if (setPosts) {
      const sanitizedContent = DOMPurify.sanitize(editContent);
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, content: sanitizedContent } : p));
    }
    setIsEditing(false);
    setIsMenuOpen(false);
  }, [post?.id, editContent, setPosts]);

  const handleDelete = useCallback(() => {
    if (window.confirm("Bu gönderiyi silmek istediğinize emin misiniz?")) {
      if (setPosts) {
        setPosts(prev => prev.filter(p => p.id !== post.id));
      }
    }
  }, [post?.id, setPosts]);

  const canEdit = currentUser?.role === 'admin' || currentUser?.name === post.author?.name;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-[var(--border-soft)] shadow-[var(--shadow-soft)] overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-lg">
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <div onClick={handleProfileClick} className="flex items-center gap-3 cursor-pointer group hover:opacity-90 transition-opacity">
          <SafeAvatar
            src={post?.author?.avatar}
            name={typeof post.author === 'string' ? post.author : post?.author?.name}
            isAdmin={post?.author?.role === 'admin'}
            size="lg"
            className="shadow-sm border border-gray-100"
          />
          <div className="flex flex-col">
            <h4 className="font-bold text-[14px] text-gray-900 leading-tight group-hover:text-[#990000] transition-colors flex items-center flex-wrap">
              {typeof post.author === 'string' ? post.author : (post.author?.name || 'Kullanıcı')}
              {post.author?.role === 'admin' && <ShieldCheck size={14} className="text-red-500 ml-1.5" title="Yönetici" />}
              {post.author?.role === 'company' && <ShieldCheck size={14} className="text-amber-500 ml-1.5" title="Onaylı Firma" />}
              {post.author?.role === 'club' && <ShieldCheck size={14} className="text-emerald-500 ml-1.5" title="Onaylı Kulüp" />}
              {renderBadges(post.author?.badge || post.author?.badges)}
            </h4>
            <p className="text-[12px] text-gray-500 font-medium">{post.author?.title || post.author?.department}</p>
            <p className="text-[10px] text-gray-500 font-medium">{post.time}</p>
          </div>
        </div>
        <div className="relative">
          <button aria-label="Menüyü Aç" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-500 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-50 transition active:scale-95">
            <MoreHorizontal size={20} />
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-10 animate-fade-in">
              {canEdit ? (
                <>
                  <button aria-label="Düzenle" onClick={() => setIsEditing(true)} className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 active:scale-95">
                    <Edit2 size={14} /> Düzenle
                  </button>
                  <button aria-label="Sil" onClick={handleDelete} className="w-full text-left px-4 py-2 text-[13px] font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 active:scale-95">
                    <Trash2 size={14} /> Sil
                  </button>
                </>
              ) : (
                <button aria-label="Şikayet Et" onClick={() => { setIsMenuOpen(false); window.toast.success('Şikayetiniz Kariyer Geliştirme Merkezine iletilmiştir. Teşekkür ederiz.'); }} className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 active:scale-95">
                  <ShieldCheck size={14} /> Şikayet Et
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        {isEditing ? (
          <div className="space-y-2">
            <textarea 
              value={editContent} 
              onChange={e => setEditContent(e.target.value)} 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <button aria-label="İptal" onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg active:scale-95">İptal</button>
              <button aria-label="Kaydet" onClick={handleSaveEdit} className="px-3 py-1.5 text-xs font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 active:scale-95">Kaydet</button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-[15px] text-gray-800 font-medium leading-snug whitespace-pre-wrap break-words">{post.content}</p>
            {!post.image && post.isGeneralEvent && (
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 border border-purple-200/80 text-purple-900 text-xs font-bold shadow-xs">
                <Calendar size={13} className="text-purple-600" /> 🏛️ Kampüs & Rektörlük Genel Etkinliği
              </div>
            )}
            {!post.image && post.isCareerOpportunity && (
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold shadow-xs">
                <Sparkles size={13} className="text-amber-600" /> 🌟 Özel Kariyer Fırsatı & Staj Programı
              </div>
            )}
          </div>
        )}
      </div>

      {/* Media Attachments */}
      {post.image && (
        <div className="w-full max-h-[420px] bg-gray-100 relative group cursor-pointer overflow-hidden border-y border-gray-50 select-none flex items-center justify-center" onDoubleClick={handleDoubleTap}>
          <img 
            src={post.image} 
            alt="Post Cover" 
            loading="lazy" 
            className="w-full max-h-[420px] object-cover group-hover:scale-105 transition-transform duration-500" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80';
            }}
          />
          {showHeart && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <Heart size={80} className="text-white fill-current animate-[ping_1s_ease-out_forwards] opacity-0" />
              <Heart size={80} className="text-white fill-current absolute animate-[scale-up_0.3s_ease-out_forwards] drop-shadow-2xl" />
            </div>
          )}
          {post.isJob && (
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-1.5">
              <Briefcase size={14} /> İLAN
            </div>
          )}
          {post.isGeneralEvent && (
            <div className="absolute top-4 left-4 bg-purple-950/80 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-1.5 border border-purple-400/40 shadow-md">
              <Calendar size={14} className="text-purple-300" /> 🏛️ GENEL ETKİNLİK
            </div>
          )}
          {post.isCareerOpportunity && (
            <div className="absolute top-4 left-4 bg-amber-950/80 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-1.5 border border-amber-400/40 shadow-md">
              <Sparkles size={14} className="text-amber-300" /> 🌟 KARİYER FIRSATI
            </div>
          )}
        </div>
      )}

      {post.video && (
        <div className="w-full bg-black relative border-y border-gray-50">
          <video src={post.video} controls className="w-full max-h-96" />
        </div>
      )}

      {post.pdf && (
        <div className="mx-4 mb-4 mt-2 p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between hover:bg-red-50 transition group cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <FileText size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-bold text-gray-900">Eklenti Dosyası</p>
              <p className="text-xs text-gray-500 font-medium">PDF Belgesi</p>
            </div>
          </div>
          <button aria-label="İndir" onClick={() => window.toast.info('Dosya indirme işlemi başlatılıyor...')} className="w-8 h-8 rounded-full bg-white text-gray-500 flex items-center justify-center shadow-sm hover:text-red-600 transition active:scale-95">
            <Download size={16} />
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="p-2 flex items-center justify-between border-t border-gray-50 bg-gray-50/30">
        <div className="flex gap-1">
          <button 
            aria-label="Beğen"
            onClick={handleLikeToggle}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all font-bold text-[13px] sm:text-[14px] active:scale-95 ${liked ? 'text-red-600 bg-red-50' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
          >
            <Heart size={20} className={`${liked ? 'fill-current scale-110' : ''} transition-transform`} /> 
            <span className="hidden sm:inline">Beğen</span>
            <span className="text-xs font-semibold ml-1 px-1.5 py-0.5 bg-gray-100/50 rounded-md text-gray-500">{post?.likes || 0}</span>
          </button>
          <button 
            aria-label="Yorumları Aç"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-all font-bold text-[13px] sm:text-[14px] active:scale-95">
            <MessageCircle size={20} /> 
            <span className="hidden sm:inline">Yorum Yap</span>
            <span className="text-xs font-semibold ml-1 px-1.5 py-0.5 bg-gray-100/50 rounded-md text-gray-500">{0 + comments.length}</span>
          </button>
        </div>
        <div className="flex gap-1">
          <button 
            aria-label="Kaydet"
            onClick={() => setBookmarked(!bookmarked)}
            className={`p-2 rounded-xl transition-colors active:scale-95 ${bookmarked ? 'text-amber-500 bg-amber-50' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-600'}`}
          >
            <Bookmark size={22} className={bookmarked ? 'fill-current' : ''} />
          </button>
          <button aria-label="Paylaş" onClick={() => setIsShareModalOpen(true)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 hover:text-gray-600 transition-colors active:scale-95">
            <Send size={22} />
          </button>
        </div>
      </div>
      
      
      {/* Repost Modal */}
      {isRepostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-black text-gray-900 flex items-center gap-2"><Share2 size={18} className="text-[#990000]" /> Yorumla Paylaş</h3>
              <button aria-label="Kapat" onClick={() => setIsRepostModalOpen(false)} className="text-gray-500 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition active:scale-95"><X size={20} /></button>
            </div>
            
            <div className="p-5">
              <textarea 
                value={repostComment}
                onChange={e => setRepostComment(e.target.value)}
                placeholder="Bu gönderi hakkında ne düşünüyorsunuz?"
                className="w-full h-24 resize-none bg-transparent text-sm focus:outline-none mb-4"
                autoFocus
              />
              
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex gap-3 opacity-80 pointer-events-none">
                {post.image ? (
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                    <img src={post.image} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                    <img src={post.author?.logo || post.author?.avatar || 'https://ui-avatars.com/api/?name=U&background=0A2342&color=fff'} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-gray-900">{post.author?.name}</p>
                  <p className="text-[10px] text-gray-500 line-clamp-1">{post.content}</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50/50">
              <button onClick={() => setIsRepostModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-200 transition active:scale-95">İptal</button>
              <button 
                onClick={() => {
                  if (setPosts) {
                    const newPost = {
                      id: Date.now(),
                      author: currentUser || { name: 'Kullanıcı', avatar: 'https://ui-avatars.com/api/?name=K&background=0A2342&color=fff' },
                      content: repostComment,
                      time: 'Şimdi',
                      likes: 0,
                      repostedFrom: post,
                      type: 'post'
                    };
                    setPosts(prev => [newPost, ...prev]);
                  }
                  window.toast.success('Gönderi başarıyla profilinizde paylaşıldı!');
                  setIsRepostModalOpen(false);
                  setRepostComment('');
                }}
                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-[#990000] text-white hover:bg-indigo-900 transition shadow-md active:scale-95"
              >
                Paylaş
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 shrink-0">
              <h3 className="font-black text-gray-900 flex items-center gap-2"><Send size={18} className="text-[#990000]" /> Gönderiyi Paylaş</h3>
              <button aria-label="Kapat" onClick={() => setIsShareModalOpen(false)} className="text-gray-500 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition active:scale-95"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto custom-scrollbar flex-1">
              {/* Social Buttons */}
              <div className="grid grid-cols-3 gap-3 mb-2">
                <button aria-label="WhatsApp" onClick={handleWhatsappShare} className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors active:scale-95">
                  <FaWhatsapp size={24} />
                  <span className="text-[10px] font-bold">WhatsApp</span>
                </button>
                <button aria-label="Discord" onClick={handleDiscordShare} className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-[#5865F2]/10 text-[#5865F2] hover:bg-[#5865F2]/20 transition-colors active:scale-95">
                  <FaDiscord size={24} />
                  <span className="text-[10px] font-bold">Discord</span>
                </button>
                <button aria-label="Kopyala" onClick={handleCopyLink} className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors active:scale-95">
                  <Copy size={24} />
                  <span className="text-[10px] font-bold">Linki Kopyala</span>
                </button>
              </div>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-100"></div>
                <span className="flex-shrink-0 mx-4 text-xs font-medium text-gray-500">veya platform içi</span>
                <div className="flex-grow border-t border-gray-100"></div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Kime Göndermek İstiyorsunuz?</label>
                <select value={shareTarget} onChange={e=>setShareTarget(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
                  <option value="">Kişi Seçin...</option>
                  {availableUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.department || u.companyName || u.title})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Mesajınız (İsteğe Bağlı)</label>
                <textarea 
                  value={shareText} onChange={e=>setShareText(e.target.value)}
                  placeholder="Bu gönderi ilgini çekebilir..."
                  rows={2}
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-red-500/20 resize-none"
                />
              </div>
              
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex gap-3 opacity-70">
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                  {post.image ? <img src={post.image} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200 flex items-center justify-center"><FileText size={16} className="text-gray-500" /></div>}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">{post.author?.name}</p>
                  <p className="text-[10px] font-medium text-gray-500 line-clamp-1 break-words">{post.content}</p>
                </div>
              </div>

              <button aria-label="Paylaş" onClick={handleShare} disabled={!shareTarget} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 active:scale-95 cursor-pointer">
                Mesaj Olarak Gönder
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Fast Action for Jobs */}
      {post.isJob && (
        <div className="px-4 pb-4">
          <button 
            aria-label="Başvur" 
            onClick={handleOpenApplyModal} 
            className={`w-full py-3.5 rounded-2xl transition-all flex justify-center items-center gap-2 cursor-pointer ${
              hasApplied 
                ? 'bg-emerald-600 text-white font-black shadow-md' 
                : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:shadow-lg text-white font-bold active:scale-95'
            }`}
          >
            {hasApplied ? (
              <>
                <CheckCircle2 size={18} className="text-emerald-300" /> Başvuruldu (Havuzda İnceleniyor)
              </>
            ) : (
              <>
                <Briefcase size={18} /> Hemen Başvur
              </>
            )}
          </button>
        </div>
      )}

      {/* Fast Action for General Events */}
      {post.isGeneralEvent && (
        <div className="px-4 pb-4">
          <button 
            type="button"
            aria-label="Etkinliğe Katıl & Detaylar" 
            onClick={() => {
              if (post.eventData?.registrationLink) {
                window.open(post.eventData.registrationLink, '_blank');
              } else {
                if (window.toast?.success) {
                  window.toast.success(`"${post.eventData?.title || 'Etkinlik'}" için katılım kaydınız başarıyla oluşturuldu!`);
                }
              }
            }} 
            className="w-full py-3.5 rounded-2xl transition-all flex justify-center items-center gap-2 cursor-pointer bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 hover:shadow-lg text-white font-bold active:scale-95 shadow-md shadow-purple-900/10"
          >
            <Calendar size={18} /> Etkinliğe Katıl & Detaylar
          </button>
        </div>
      )}

      {/* Fast Action for Career Opportunities */}
      {post.isCareerOpportunity && (
        <div className="px-4 pb-4">
          <button 
            type="button"
            aria-label="Fırsatı İncele & Başvur" 
            onClick={() => {
              if (post.opportunityData?.applicationUrl) {
                window.open(post.opportunityData.applicationUrl, '_blank');
              } else {
                handleOpenApplyModal();
              }
            }} 
            className="w-full py-3.5 rounded-2xl transition-all flex justify-center items-center gap-2 cursor-pointer bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:shadow-lg text-white font-bold active:scale-95 shadow-md shadow-amber-900/10"
          >
            <Sparkles size={18} /> Fırsatı İncele & Başvur
          </button>
        </div>
      )}

      {/* ─── KGM İŞ & STAJ BAŞVURU FORMU MODALI (Z-[9999] OVERLAY) ─── */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] relative">
            
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 text-indigo-300 flex items-center justify-center font-black">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">İş & Staj Başvuru Formu</h3>
                  <p className="text-[11px] text-indigo-200 font-medium">KGM & Yönetici Paneli Başvuru Havuzu</p>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Body Form */}
            <form onSubmit={handleApplySubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-slate-700 bg-white custom-scrollbar">
              {/* Job Info Banner */}
              <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Başvurulan İlan / Program</p>
                  <h4 className="font-black text-slate-900 text-sm truncate">{cleanJobTitle}</h4>
                  <p className="text-[11px] text-slate-500 font-semibold truncate">{companyName} • {jobLocation}</p>
                </div>
                <span className="bg-indigo-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
                  {jobType}
                </span>
              </div>

              {/* Applicant Info Banner */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Aday Kimlik Bilgileri</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Aday Adı:</span>
                    <p className="font-bold text-slate-900">{currentUser?.name || (activePortalBranch === 'alumni' ? 'Caner Yıldız (Mezun)' : 'Mert Demir')}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Bölüm:</span>
                    <p className="font-bold text-slate-900">{currentUser?.department || 'Bilgisayar Mühendisliği'}</p>
                  </div>
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">İletişim Telefon Numarası *</label>
                <input 
                  type="tel" 
                  required
                  value={applyPhone}
                  onChange={e => setApplyPhone(e.target.value)}
                  placeholder="05xx xxx xx xx"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600"
                />
              </div>

              {/* CV Selection */}
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">Eklenecek Özgeçmiş / CV *</label>
                <select 
                  value={applyCvType}
                  onChange={e => setApplyCvType(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600"
                >
                  <option value="KGM Akredite İESÜ Dijital CV">KGM Akredite İESÜ Dijital Özgeçmiş (Profilinizdeki Otomatik CV)</option>
                  <option value="İESÜ Kariyer Havuzundaki Yüklenmiş PDF CV">İESÜ Kariyer Havuzundaki Yüklenmiş PDF CV</option>
                  <option value="Özel Harici Özgeçmiş Belgesi">Özel Harici Özgeçmiş Belgesi</option>
                </select>
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">Ön Yazı / Başvuru Notunuz *</label>
                <textarea 
                  rows={3}
                  required
                  value={applyCoverLetter}
                  onChange={e => setApplyCoverLetter(e.target.value)}
                  placeholder="Bu ilana neden başvuruyorsunuz? Yetkinlikleriniz ve staj/iş hedefleriniz hakkında kısa bir açıklama yazınız..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
                />
              </div>

              {/* Notice */}
              <div className="p-3 bg-amber-50 border border-amber-200/70 rounded-xl flex items-start gap-2 text-[11px] text-amber-900 font-medium">
                <CheckCircle2 size={16} className="text-amber-700 shrink-0 mt-0.5" />
                <span>Bu form onaylandığında doğrudan <b>Yönetici Paneli Başvuru Havuzuna</b> aktarılacaktır.</span>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsApplyModalOpen(false)} 
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Vazgeç
                </button>
                <button 
                  type="submit" 
                  disabled={isApplying}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-slate-900 hover:from-indigo-700 hover:to-slate-950 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer"
                >
                  {isApplying ? 'Kaydediliyor...' : 'Başvuruyu Tamamla & İlet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fast Action for Surveys */}
      {post.type === 'anket' && (
        <div className="px-4 pb-4">
          <button aria-label="Ankete Katıl" onClick={() => setIsSurveyModalOpen(true)} className="w-full bg-gradient-to-r from-red-600 to-indigo-700 hover:shadow-lg text-white font-bold py-3.5 rounded-2xl transition-all flex justify-center items-center gap-2 active:scale-95">
            <ClipboardList size={18} /> Ankete Katıl
          </button>
        </div>
      )}

      {/* Survey Modal */}
      {isSurveyModalOpen && post.surveyData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-red-50/50">
              <h3 className="font-black text-red-900 flex items-center gap-2"><ClipboardList size={20} className="text-red-600" /> {post.surveyData.title}</h3>
              <button aria-label="Kapat" onClick={() => setIsSurveyModalOpen(false)} className="text-gray-500 hover:text-gray-600 p-1.5 rounded-lg hover:bg-white transition bg-gray-50 active:scale-95"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              {surveyCompleted ? (
                <div className="py-12 flex flex-col items-center text-center animate-fade-in">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Teşekkürler!</h3>
                  <p className="text-gray-500 font-medium">Anket yanıtlarınız başarıyla kaydedildi. Katkılarınız için teşekkür ederiz.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {post.surveyData.description && (
                    <div className="p-4 bg-gray-50 rounded-2xl text-sm text-gray-700 border border-gray-100">
                      {post.surveyData.description}
                    </div>
                  )}
                  
                  {post.surveyData.questions?.map((q, idx) => (
                    <div key={q.id || idx} className="space-y-4">
                      <label className="text-sm font-bold text-gray-900 flex items-start gap-2">
                        <span className="text-red-600 shrink-0">{idx + 1}.</span> {q.text}
                      </label>
                      
                      {q.type === 'likert' ? (
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider w-16 text-center">Kesinlikle<br/>Katılmıyorum</span>
                            <div className="flex-1 flex justify-between px-2">
                              {[1, 2, 3, 4, 5].map(score => (
                                <button
                                  key={score}
                                  aria-label={`Puan ${score}`}
                                  onClick={() => setSurveyAnswers({...surveyAnswers, [q.id]: score})}
                                  className={`w-10 h-10 rounded-full font-bold transition-all active:scale-95 ${
                                    surveyAnswers[q.id] === score 
                                    ? 'bg-red-600 text-white shadow-md scale-110' 
                                    : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200'
                                  }`}
                                >
                                  {score}
                                </button>
                              ))}
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider w-16 text-center">Kesinlikle<br/>Katılıyorum</span>
                          </div>
                        </div>
                      ) : (
                        <textarea 
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                          rows={3}
                          placeholder="Yanıtınızı buraya yazın..."
                          value={surveyAnswers[q.id] || ''}
                          onChange={(e) => setSurveyAnswers({...surveyAnswers, [q.id]: e.target.value})}
                        />
                      )}
                    </div>
                  ))}
                  
                  <div className="pt-6 border-t border-gray-100">
                    <button 
                      aria-label="Gönder"
                      onClick={handleSurveySubmit}
                      disabled={Object.keys(surveyAnswers).length === 0}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-95"
                    >
                      Anketi Tamamla ve Gönder
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50/50 pt-4">
          <div className="space-y-3 mb-4">
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <SafeAvatar
                  src={comment.avatar}
                  name={comment.author}
                  isAdmin={comment.author === 'Kariyer Geliştirme Merkezi'}
                  size="sm"
                />
                <div className="bg-white px-4 py-2.5 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex-1 relative group">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-[13px] text-gray-900">{comment.author}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-500 font-medium">{comment.time}</span>
                      {(currentUser?.role === 'admin' || currentUser?.name === comment.author || (comment.authorId && currentUser?.id === comment.authorId)) && (
                        <button 
                          onClick={() => handleDeleteComment(comment.id)}
                          title="Yorumu Sil"
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-opacity p-0.5"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-[14px] text-gray-700 leading-snug">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 relative">
            <SafeAvatar
              src={currentUser?.avatar}
              name={currentUser?.name}
              isAdmin={currentUser?.role === 'admin'}
              size="sm"
            />
            <input 
              type="text" 
              placeholder="Bir yorum yaz..."  
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition pr-10"
            />
            <button aria-label="Yorum Gönder" 
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="absolute right-1 w-8 h-8 flex items-center justify-center bg-[#990000] text-white rounded-full disabled:opacity-50 disabled:bg-gray-300 transition-colors active:scale-95"
            >
              <Send size={14} className="ml-0.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default PostCard;



