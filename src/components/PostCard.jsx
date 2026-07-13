import React, { useState, useEffect } from 'react';
import { MoreHorizontal, Heart, MessageCircle, Bookmark, Send, Briefcase, FileText, Download, ShieldCheck, X, Edit2, Trash2, Crown, Award, ClipboardList, CheckCircle2, Copy } from 'lucide-react';
import { FaWhatsapp, FaDiscord } from 'react-icons/fa';

export default function PostCard({ post, currentUser, setPosts, setMessages }) {
  const [liked, setLiked] = useState(post?.likes > 0);
  const [bookmarked, setBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  
  // Share Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareTarget, setShareTarget] = useState('');
  const [shareText, setShareText] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  
  // Edit/Menu State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post?.content || '');
  
  // Survey State
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [surveyAnswers, setSurveyAnswers] = useState({});
  const [surveyCompleted, setSurveyCompleted] = useState(false);

  const handleSurveySubmit = () => {
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
  };

  const renderBadges = (badgeData) => {
    let badges = [];
    if (typeof badgeData === 'string' && badgeData.trim() !== '') badges = [badgeData];
    else if (Array.isArray(badgeData)) badges = badgeData;
    
    if (badges.length === 0) return null;
    return (
      <div className="flex items-center gap-1 ml-1.5">
        {badges.map((badge, idx) => {
          const k = `badge-${badge}-${idx}`;
          if (badge === 'verified' || badge === 'Doğrulanmış') return <ShieldCheck key={k} size={14} className="text-blue-500" title="Doğrulanmış" />;
          if (badge === 'top_voice' || badge === 'Top Voice') return <Crown key={k} size={14} className="text-amber-500" title="Top Voice" />;
          if (badge === 'president' || badge === 'Kulüp Başkanı') return <Crown key={k} size={14} className="text-purple-600" title="Kulüp Başkanı" />;
          if (badge === 'rep' || badge === 'Sınıf Temsilcisi') return <Award key={k} size={14} className="text-emerald-500" title="Sınıf Temsilcisi" />;
          return <span key={k} className="bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-200 uppercase">{badge}</span>;
        })}
      </div>
    );
  };

  const handleLikeToggle = () => {
    setLiked(!liked);
    if (setPosts) {
      setPosts(prev => (prev || []).map(p => 
        p.id === post.id ? { ...p, likes: (p.likes || 0) + (liked ? -1 : 1) } : p
      ));
    }
  };

  useEffect(() => {
    if (isShareModalOpen && availableUsers.length === 0) {
      // Fallback: Read from local storage if not passed via props (to ensure it works immediately)
      try {
        const students = JSON.parse(localStorage.getItem('iesu_students_v3')) || [];
        const alumni = JSON.parse(localStorage.getItem('iesu_alumni_v3')) || [];
        setAvailableUsers([...students, ...alumni].filter(u => u.source !== 'demo_seed'));
      } catch (e) { console.error(e); }
    }
  }, [isShareModalOpen]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([...comments, { id: Date.now(), text: newComment, author: currentUser?.name || 'Siz', time: 'Şimdi' }]);
    setNewComment('');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://iesu-kariyer-platformu.vercel.app/post/${post.id}`);
    window.toast.success("Bağlantı kopyalandı!");
  };

  const handleWhatsappShare = () => {
    const text = `Bu ilana göz at: ${post.title || 'Kariyer İlanı'} \nhttps://iesu-kariyer-platformu.vercel.app/post/${post.id}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleDiscordShare = () => {
    navigator.clipboard.writeText(`https://iesu-kariyer-platformu.vercel.app/post/${post.id}`);
    window.toast.info("Link kopyalandı. Discord'a yapıştırabilirsiniz!");
  };

  const handleShare = () => {
    if (!shareTarget) return window.toast.error("Lütfen paylaşılacak kişiyi seçin.");
    
    const newMsg = {
      id: Date.now(),
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
        const msgs = JSON.parse(localStorage.getItem('iesu_messages_v2')) || [];
        localStorage.setItem('iesu_messages_v2', JSON.stringify([...msgs, newMsg]));
      } catch(e) {}
    }
    
    setIsShareModalOpen(false);
    setShareText('');
    setShareTarget('');
    window.toast.success("Gönderi başarıyla paylaşıldı!");
  };

  const handleSaveEdit = () => {
    if (setPosts) {
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, content: editContent } : p));
    }
    setIsEditing(false);
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    if (window.confirm("Bu gönderiyi silmek istediğinize emin misiniz?")) {
      if (setPosts) {
        setPosts(prev => prev.filter(p => p.id !== post.id));
      }
    }
  };

  const canEdit = currentUser?.role === 'admin' || currentUser?.name === post.author?.name;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-[var(--border-soft)] shadow-[var(--shadow-soft)] overflow-hidden transition-all hover:shadow-lg">
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer group">
          {post?.author?.role === 'admin' ? (
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-200 shrink-0 p-1">
              <img src="/iesu-logo.svg" alt="Logo" className="w-full h-full object-contain" />
            </div>
          ) : (
            <img src={post?.author?.avatar || `https://ui-avatars.com/api/?name=U&background=132A49&color=fff`} alt="Author" className="w-11 h-11 rounded-full object-cover shadow-sm border border-gray-100 shrink-0" />
          )}
          <div className="flex flex-col">
            <h4 className="font-bold text-[14px] text-gray-900 leading-tight group-hover:text-iesu-red transition-colors flex items-center flex-wrap">
              {typeof post.author === 'string' ? post.author : (post.author?.name || 'Kullanıcı')}
              {post.author?.role === 'admin' && <ShieldCheck size={14} className="text-blue-500 ml-1.5" title="Yönetici" />}
              {post.author?.role === 'company' && <ShieldCheck size={14} className="text-amber-500 ml-1.5" title="Onaylı Firma" />}
              {post.author?.role === 'club' && <ShieldCheck size={14} className="text-emerald-500 ml-1.5" title="Onaylı Kulüp" />}
              {renderBadges(post.author?.badge || post.author?.badges)}
            </h4>
            <p className="text-[12px] text-gray-500 font-medium">{post.author?.title || post.author?.department}</p>
            <p className="text-[10px] text-gray-400 font-medium">{post.time}</p>
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-50 transition">
            <MoreHorizontal size={20} />
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-10 animate-fade-in">
              {currentUser?.id === post.author?.id ? (
                <>
                  <button onClick={() => setIsEditing(true)} className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <Edit2 size={14} /> Düzenle
                  </button>
                  <button onClick={handleDelete} className="w-full text-left px-4 py-2 text-[13px] font-bold text-red-600 hover:bg-red-50 flex items-center gap-2">
                    <Trash2 size={14} /> Sil
                  </button>
                </>
              ) : (
                <button onClick={() => { setIsMenuOpen(false); window.toast.success('Şikayetiniz Kariyer Geliştirme Ofisine iletilmiştir. Teşekkür ederiz.'); }} className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
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
              <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg">İptal</button>
              <button onClick={handleSaveEdit} className="px-3 py-1.5 text-xs font-bold bg-red-600 text-white rounded-lg hover:bg-red-700">Kaydet</button>
            </div>
          </div>
        ) : (
          <p className="text-[15px] text-gray-800 font-medium leading-snug whitespace-pre-wrap break-words">{post.content}</p>
        )}
      </div>

      {/* Media Attachments */}
      {post.image && (
        <div className="w-full aspect-video bg-gray-100 relative group cursor-pointer overflow-hidden border-y border-gray-50">
          <img src={post.image} alt="Post Cover" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {post.isJob && (
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-1.5">
              <Briefcase size={14} /> İLAN
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
          <button onClick={() => window.toast.info('Dosya indirme işlemi başlatılıyor...')} className="w-8 h-8 rounded-full bg-white text-gray-500 flex items-center justify-center shadow-sm hover:text-red-600 transition">
            <Download size={16} />
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="p-2 flex items-center justify-between border-t border-gray-50 bg-gray-50/30">
        <div className="flex gap-1">
          <button 
            onClick={handleLikeToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-[14px] ${liked ? 'text-white bg-gradient-to-r from-[var(--brand-pomegranate)] to-[var(--brand-red-dark)] shadow-md hover:shadow-lg' : 'text-gray-600 hover:bg-[var(--brand-soft-red)] hover:text-[var(--brand-pomegranate)]'}`}
          >
            <Heart size={20} className={liked ? 'fill-current' : ''} /> 
            <span className="hidden sm:inline">{post?.likes || 0}</span>
          </button>
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 px-4 py-2 hover:bg-[var(--surface-soft)] rounded-xl text-gray-600 transition-colors font-bold text-[14px]">
            <MessageCircle size={20} className="text-gray-400" /> <span className="hidden sm:inline">{0 + comments.length}</span>
          </button>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={() => setBookmarked(!bookmarked)}
            className={`p-2 rounded-xl transition-colors ${bookmarked ? 'text-amber-500 bg-amber-50' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
          >
            <Bookmark size={22} className={bookmarked ? 'fill-current' : ''} />
          </button>
          <button onClick={() => setIsShareModalOpen(true)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors">
            <Send size={22} />
          </button>
        </div>
      </div>
      
      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-black text-gray-900 flex items-center gap-2"><Send size={18} className="text-iesu-red" /> Gönderiyi Paylaş</h3>
              <button onClick={() => setIsShareModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              {/* Social Buttons */}
              <div className="grid grid-cols-3 gap-3 mb-2">
                <button onClick={handleWhatsappShare} className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                  <FaWhatsapp size={24} />
                  <span className="text-[10px] font-bold">WhatsApp</span>
                </button>
                <button onClick={handleDiscordShare} className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-[#5865F2]/10 text-[#5865F2] hover:bg-[#5865F2]/20 transition-colors">
                  <FaDiscord size={24} />
                  <span className="text-[10px] font-bold">Discord</span>
                </button>
                <button onClick={handleCopyLink} className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors">
                  <Copy size={24} />
                  <span className="text-[10px] font-bold">Linki Kopyala</span>
                </button>
              </div>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-100"></div>
                <span className="flex-shrink-0 mx-4 text-xs font-medium text-gray-400">veya platform içi</span>
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
                  {post.image ? <img src={post.image} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200 flex items-center justify-center"><FileText size={16} className="text-gray-400" /></div>}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">{post.author?.name}</p>
                  <p className="text-[10px] font-medium text-gray-500 line-clamp-1 break-words">{post.content}</p>
                </div>
              </div>

              <button onClick={handleShare} disabled={!shareTarget} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50">
                Mesaj Olarak Gönder
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Fast Action for Jobs */}
      {post.isJob && (
        <div className="px-4 pb-4">
          <button onClick={() => window.toast.success('Başvurunuz başarıyla kaydedildi. Firma temsilcisine iletilecektir.')} className="w-full bg-gradient-to-r from-[var(--brand-pomegranate)] to-[var(--brand-red-dark)] hover:shadow-lg text-white font-bold py-3.5 rounded-2xl transition-all flex justify-center items-center gap-2 active:scale-[0.98]">
            <Briefcase size={18} /> Hemen Başvur
          </button>
        </div>
      )}

      {/* Fast Action for Surveys */}
      {post.type === 'anket' && (
        <div className="px-4 pb-4">
          <button onClick={() => setIsSurveyModalOpen(true)} className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-lg text-white font-bold py-3.5 rounded-2xl transition-all flex justify-center items-center gap-2 active:scale-[0.98]">
            <ClipboardList size={18} /> Ankete Katıl
          </button>
        </div>
      )}

      {/* Survey Modal */}
      {isSurveyModalOpen && post.surveyData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-blue-50/50">
              <h3 className="font-black text-blue-900 flex items-center gap-2"><ClipboardList size={20} className="text-blue-600" /> {post.surveyData.title}</h3>
              <button onClick={() => setIsSurveyModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-white transition bg-gray-50"><X size={20} /></button>
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
                        <span className="text-blue-600 shrink-0">{idx + 1}.</span> {q.text}
                      </label>
                      
                      {q.type === 'likert' ? (
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider w-16 text-center">Kesinlikle<br/>Katılmıyorum</span>
                            <div className="flex-1 flex justify-between px-2">
                              {[1, 2, 3, 4, 5].map(score => (
                                <button
                                  key={score}
                                  onClick={() => setSurveyAnswers({...surveyAnswers, [q.id]: score})}
                                  className={`w-10 h-10 rounded-full font-bold transition-all ${
                                    surveyAnswers[q.id] === score 
                                    ? 'bg-blue-600 text-white shadow-md scale-110' 
                                    : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
                                  }`}
                                >
                                  {score}
                                </button>
                              ))}
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider w-16 text-center">Kesinlikle<br/>Katılıyorum</span>
                          </div>
                        </div>
                      ) : (
                        <textarea 
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                      onClick={handleSurveySubmit}
                      disabled={Object.keys(surveyAnswers).length === 0}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-[0.98]"
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
                {comment.author === 'Kariyer Geliştirme Ofisi' || comment.author === 'Kariyer Merkezi' ? (
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-gray-200 p-0.5 shadow-sm">
                    <img src="/iesu-logo.svg" alt="Admin" className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author)}&background=132A49&color=fff`} alt={comment.author} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="bg-white px-4 py-2.5 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex-1">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-[13px] text-gray-900">{comment.author}</span>
                    <span className="text-[11px] text-gray-400 font-medium">{comment.time}</span>
                  </div>
                  <p className="text-[14px] text-gray-700 leading-snug">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 relative">
            {(currentUser?.role === 'admin' || window.localStorage.getItem('iesu_user_role_v1') === '"admin"') ? (
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-gray-200 p-0.5 shadow-sm">
                <img src="/iesu-logo.svg" alt="Admin" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Siz')}&background=red&color=fff`} alt="Siz" className="w-full h-full object-cover" />
              </div>
            )}
            <input 
              type="text" 
              placeholder="Bir yorum yaz..."  
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition pr-10"
            />
            <button 
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="absolute right-1 w-8 h-8 flex items-center justify-center bg-iesu-red text-white rounded-full disabled:opacity-50 disabled:bg-gray-300 transition-colors"
            >
              <Send size={14} className="ml-0.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
