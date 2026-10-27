import React, { useState } from "react";
import {
  Flame,
  Briefcase,
  Award,
  Calendar,
  QrCode,
  CheckCircle2,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Sparkles,
  Plus,
  Bell,
  Search,
  MapPin,
  Clock,
  Users,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Monitor,
  X,
  Send,
  GraduationCap,
  Coffee,
  FileCheck2,
  CreditCard,
  TrendingUp,
  Building2,
} from "lucide-react";

const INITIAL_STORIES = [
  {
    id: "st-1",
    author: "Kariyer Merkezi",
    role: "Resmi Duyuru",
    badge: "Resmi",
    avatarBg: "bg-[#990000]",
    initials: "İESÜ",
    seen: false,
    title: "Zorunlu Staj SGK Evrakları İçin Son 3 Gün!",
    subtitle: "Bölüm komisyonu onayını kampüse gelmeden tek tıkla tamamla.",
    ctaText: "Staj Takip Ekranını Aç",
    ctaTargetTab: "internship",
    stats: "412 öğrenci görüntüledi",
    gradient: "from-[#990000] via-[#7a0000] to-[#1e3a5f]",
  },
  {
    id: "st-2",
    author: "Selin Yılmaz '23",
    role: "Baykar • Yazılım Müh.",
    badge: "Mezun Vlog",
    avatarBg: "bg-[#1e3a5f]",
    initials: "SY",
    seen: false,
    title: "İESÜ'den Mezun Olduktan Sonra Baykar'da 1 Günüm 🚀",
    subtitle: "Mülakatta bana sorulan 3 teknik soru ve stajyerlerden beklenenler.",
    ctaText: "Selin'den 15 Dk Mentorluk Al",
    ctaTargetTab: "mentorship",
    stats: "189 alkış • 24 soru",
    gradient: "from-[#1e3a5f] via-[#0f2542] to-[#990000]",
  },
  {
    id: "st-3",
    author: "Yazılım & AI Kulübü",
    role: "Kampüs Etkinliği",
    badge: "+25 XP Rozet",
    avatarBg: "bg-emerald-700",
    initials: "AI",
    seen: false,
    title: "Bugün 17:00'de B-Blok Amfi'de Prompt & AI Atölyesi!",
    subtitle: "Katılıp etkinlik sonunda QR okutan herkesin CV'sine resmi rozet işleniyor.",
    ctaText: "QR Rozetini Hemen Al (+25 XP)",
    ctaTargetTab: "qr",
    stats: "78 öğrenci katılıyor",
    gradient: "from-emerald-800 via-teal-900 to-slate-900",
  },
  {
    id: "st-4",
    author: "Kampüs Kafe",
    role: "İESÜ Kart Fırsatı",
    badge: "%50 İndirim",
    avatarBg: "bg-amber-600",
    initials: "KK",
    seen: true,
    title: "Vize Haftası Boyunca İESÜ Kart'a 2. Kahve %50 İndirimli ☕",
    subtitle: "Kütüphane katındaki Kampüs Kafe'de dijital öğrenci/mezun kartını göster.",
    ctaText: "İESÜ Dijital Kartımı Göster",
    ctaTargetTab: "wallet",
    stats: "Bugün 94 kez kullanıldı",
    gradient: "from-amber-700 via-orange-800 to-[#990000]",
  },
];

const INITIAL_POSTS = [
  {
    id: "post-1",
    type: "exclusive-job",
    category: "job",
    company: "Borusan Lojistik (İESÜ Protokollü)",
    authorRole: "Hadımköy & Beylikdüzü Yerleşkesi • Sadece İESÜ Kontenjanı",
    avatarInitials: "BL",
    avatarColor: "bg-[#1e3a5f]",
    timeAgo: "25 dk önce",
    matchScore: 96,
    quotaText: "Sadece İESÜ'ye ayrılmış 3 Stajyer Kontenjanı (Şu an 11 başvuru)",
    competitorNote: "Kariyer.net'te 2.400+ aday yerine yalnızca okul arkadaşlarınla yarışıyorsun",
    title: "Uzun Dönem Yazılım & İş Analitiği Stajyeri (Ücretli + Servis)",
    content:
      "İstanbul Esenyurt Üniversitesi ile yapılan sanayi iş birliği protokolü kapsamında haftada 3 gün zorunlu/gönüllü staj yapacak 3. ve 4. sınıf öğrencileri arıyoruz.",
    tags: ["Zorunlu Staja Uygun", "SGK Üniversiteden", "Servis İmkanı", "%96 Bölüm Uyumu"],
    likes: 48,
    liked: false,
    saved: false,
    applied: false,
    comments: [
      {
        id: "c-1",
        user: "Mert Demir (4. Sınıf YBS)",
        text: "Geçen dönem bu kontenjandan girdim, staj sonunda tam zamanlı teklif aldım. Kesinlikle başvurun!",
      },
    ],
  },
  {
    id: "post-2",
    type: "club-event",
    category: "event",
    company: "İESÜ Girişimcilik & İnovasyon Kulübü",
    authorRole: "Kulüp Etkinliği • Rektörlük Konferans Salonu",
    avatarInitials: "Gİ",
    avatarColor: "bg-[#990000]",
    timeAgo: "1 saat önce",
    eventDate: "Yarın • 14:00 - 16:30",
    location: "Esenyurt Kampüs B-Blok Konferans Salonu",
    xpReward: 30,
    attendeeCount: 64,
    joined: false,
    qrClaimed: false,
    title: "Sektör Liderleriyle Canlı CV & Mülakat Simülasyonu",
    content:
      "Etkinlik sonunda ekrandaki QR kodu okutan tüm öğrencilerin 'Mülakat Simülasyonu Başarı Sertifikası' doğrudan İESÜ CV'lerine resmi rozet olarak eklenecektir.",
    tags: ["Resmi CV Rozeti (+30 XP)", "Yoklama QR Kodlu", "Ücretsiz Katılım"],
    likes: 92,
    liked: true,
    saved: false,
    comments: [
      {
        id: "c-2",
        user: "Zeynep Kaya (Endüstri Müh. '24)",
        text: "Bölüm hocalarımız da katılacak mı?",
      },
    ],
  },
  {
    id: "post-3",
    type: "showcase",
    category: "showcase",
    company: "Emre Karaca",
    authorRole: "Bilgisayar Müh. 4. Sınıf • Bitirme Projesi Vitrini",
    avatarInitials: "EK",
    avatarColor: "bg-emerald-700",
    timeAgo: "3 saat önce",
    title: "Kampüs İçi Ders Notu ve Laboratuvar Asistanı Uygulamamız Yayında! 🎉",
    content:
      "Dr. Öğr. Üyesi Ahmet Hocamızın danışmanlığında geliştirdiğimiz yapay zeka destekli laboratuvar asistanı projemiz TÜBİTAK 2209-A desteği kazandı! Mobil arayüz için 1 tasarım arkadaşı arıyoruz.",
    projectHighlight: "TÜBİTAK 2209-A Kabul Aldı • Takıma 1 UI/UX Öğrencisi Aranıyor",
    tags: ["TÜBİTAK 2209-A", "Takım Arkadaşı", "React & Python"],
    likes: 134,
    liked: false,
    saved: true,
    teamRequested: false,
    comments: [],
  },
  {
    id: "post-4",
    type: "poll",
    category: "poll",
    company: "İESÜ Kariyer & Mezun Ofisi",
    authorRole: "Haftalık Kampüs Anketi • 318 Öğrenci Oy Kullandı",
    avatarInitials: "KO",
    avatarColor: "bg-[#1e3a5f]",
    timeAgo: "5 saat önce",
    title: "Bahar Dönemi 'Kampüste Mülakat' günlerinde hangi sektörün staj masası öncelikli kurulsun?",
    content: "En çok oy alan 2 sektörün İK ekipleri önümüzdeki ay Esenyurt kampüsümüzde staj mülakatı yapacak.",
    votedOptionId: null,
    pollOptions: [
      { id: "opt-1", label: "Yazılım, Yapay Zeka & Siber Güvenlik", votes: 142 },
      { id: "opt-2", label: "Havacılık, Lojistik & Dış Ticaret", votes: 96 },
      { id: "opt-3", label: "Sağlık Bilimleri & Hastane Yönetimi", votes: 54 },
      { id: "opt-4", label: "Finans, Denetim & Dijital Pazarlama", votes: 26 },
    ],
    tags: ["Söz Öğrencide", "Kampüs Kararı", "+5 XP Katılım"],
    likes: 67,
    liked: false,
    saved: false,
    comments: [],
  },
];

export default function CampusPulseFeed({ currentUser, setView, onBack }) {
  const [viewportMode, setViewportMode] = useState("mobile"); // "mobile" | "desktop"
  const [activeBottomTab, setActiveBottomTab] = useState("feed"); // "feed" | "jobs" | "qr" | "internship" | "wallet"
  const [activeCategory, setActiveCategory] = useState("all");
  const [stories, setStories] = useState(INITIAL_STORIES);
  const [activeStory, setActiveStory] = useState(null);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [studentXp, setStudentXp] = useState(145);
  const [badges, setBadges] = useState([
    "e-Devlet / OBS Doğrulanmış Öğrenci",
    "Zorunlu Staj Adayı (2026)",
  ]);
  const [internshipStep, setInternshipStep] = useState(2); // 1: Başvuru, 2: Danışman Onayı, 3: SGK Belgesi Hazır
  const [toastMessage, setToastMessage] = useState(null);
  const [openCommentsId, setOpenCommentsId] = useState(null);
  const [commentDraft, setCommentDraft] = useState("");
  const [newPostModalOpen, setNewPostModalOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostBody, setNewPostBody] = useState("");
  const [newPostType, setNewPostType] = useState("showcase");
  const [searchQuery, setSearchQuery] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const handleOpenStory = (story) => {
    setStories((prev) =>
      prev.map((s) => (s.id === story.id ? { ...s, seen: true } : s))
    );
    setActiveStory(story);
  };

  const handleStoryAction = (story) => {
    setActiveStory(null);
    if (story.ctaTargetTab === "qr") {
      setStudentXp((xp) => xp + 25);
      if (!badges.includes("AI & Prompt Atölyesi Sertifikası")) {
        setBadges((prev) => [...prev, "AI & Prompt Atölyesi Sertifikası"]);
      }
      showToast("🎉 +25 XP Kazanıldı! 'AI Atölyesi Rozeti' CV'ne otomatik işlendi.");
      setActiveBottomTab("wallet");
    } else if (story.ctaTargetTab === "internship") {
      setActiveBottomTab("internship");
    } else if (story.ctaTargetTab === "wallet") {
      setActiveBottomTab("wallet");
    } else if (story.ctaTargetTab === "mentorship") {
      showToast("📅 Selin Yılmaz ('23 Baykar) ile 15 dk CV inceleme talebin iletildi!");
    }
  };

  const toggleLike = (postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const nextLiked = !p.liked;
        return {
          ...p,
          liked: nextLiked,
          likes: nextLiked ? p.likes + 1 : p.likes - 1,
        };
      })
    );
  };

  const toggleSave = (postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const nextSaved = !p.saved;
        showToast(nextSaved ? "📌 Kaydedilenlere eklendi." : "Kaydedilenlerden çıkarıldı.");
        return { ...p, saved: nextSaved };
      })
    );
  };

  const handleQuickApply = (postId) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, applied: true } : p))
    );
    setStudentXp((xp) => xp + 15);
    showToast("✅ İESÜ Onaylı CV'n ile başvurun şirkete ve Staj Komisyonuna iletildi! (+15 XP)");
  };

  const handleJoinEvent = (postId, claimQr = false) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        if (claimQr && !p.qrClaimed) {
          setStudentXp((xp) => xp + (p.xpReward || 30));
          setBadges((b) =>
            b.includes("Mülakat Simülasyonu Başarı Sertifikası")
              ? b
              : [...b, "Mülakat Simülasyonu Başarı Sertifikası"]
          );
          showToast(
            `🏅 QR Okutuldu! +${p.xpReward || 30} XP ve Resmi Kulüp Sertifikası CV'ne eklendi!`
          );
          return {
            ...p,
            joined: true,
            qrClaimed: true,
            attendeeCount: p.joined ? p.attendeeCount : p.attendeeCount + 1,
          };
        }
        const nextJoined = !p.joined;
        showToast(
          nextJoined
            ? "🎟️ Etkinliğe kaydoldun! Kampüs takvimine eklendi."
            : "Etkinlik kaydın iptal edildi."
        );
        return {
          ...p,
          joined: nextJoined,
          attendeeCount: nextJoined ? p.attendeeCount + 1 : p.attendeeCount - 1,
        };
      })
    );
  };

  const handleVotePoll = (postId, optionId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId || p.votedOptionId) return p;
        return {
          ...p,
          votedOptionId: optionId,
          pollOptions: p.pollOptions.map((o) =>
            o.id === optionId ? { ...o, votes: o.votes + 1 } : o
          ),
        };
      })
    );
    setStudentXp((xp) => xp + 5);
    showToast("🗳️ Oyun kaydedildi! Kampüs kararına katkın için +5 XP kazandın.");
  };

  const handleTeamRequest = (postId) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, teamRequested: true } : p))
    );
    showToast("🤝 Proje sahibine 'Takıma Katılma' isteğin ve profil kartın gönderildi!");
  };

  const handleAddComment = (postId) => {
    const trimmed = commentDraft.trim();
    if (!trimmed) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: "c-" + Date.now(),
                  user: "Sen (İESÜ Öğrencisi)",
                  text: trimmed,
                },
              ],
            }
          : p
      )
    );
    setCommentDraft("");
    showToast("💬 Yorumun paylaşıldı.");
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostBody.trim()) return;
    const created = {
      id: "post-" + Date.now(),
      type: newPostType,
      category: newPostType === "exclusive-job" ? "job" : "showcase",
      company: "Sen (İESÜ Öğrencisi)",
      authorRole: "Yazılım Bölümü • Kampüs Paylaşımı",
      avatarInitials: "İÖ",
      avatarColor: "bg-[#990000]",
      timeAgo: "Şimdi",
      title: newPostTitle.trim(),
      content: newPostBody.trim(),
      projectHighlight:
        newPostType === "showcase"
          ? "Kampüs Proje Vitrini • Yorum ve Takım Arkadaşına Açık"
          : undefined,
      tags: ["Kampüs Nabzı", "Öğrenci Paylaşımı", "+10 XP"],
      likes: 1,
      liked: true,
      saved: false,
      comments: [],
    };
    setPosts((prev) => [created, ...prev]);
    setNewPostTitle("");
    setNewPostBody("");
    setNewPostModalOpen(false);
    setStudentXp((xp) => xp + 10);
    showToast("✨ Paylaşımın Kampüs Akışına eklendi! (+10 XP)");
  };

  const filteredPosts = posts.filter((p) => {
    const matchesCat =
      activeCategory === "all" ||
      (activeCategory === "job" && p.category === "job") ||
      (activeCategory === "showcase" && p.category === "showcase") ||
      (activeCategory === "event" && p.category === "event") ||
      (activeCategory === "poll" && p.category === "poll");
    const matchesSearch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-900 font-sans py-3 px-2 sm:px-6 flex flex-col items-center">
      {/* Üst Kontrol Çubuğu: Mobil / Masaüstü Önizleme Geçişi */}
      <div className="w-full max-w-5xl bg-slate-800/90 border border-slate-700 text-white rounded-2xl px-4 py-2.5 mb-3 flex flex-wrap items-center justify-between gap-2 shadow-lg">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#990000] text-white">
            1. ADIM
          </span>
          <div>
            <h1 className="text-sm font-bold tracking-tight">
              İESÜ &ldquo;Kampüs Nabzı&rdquo; — Mobil Sosyal + Kariyer Akışı
            </h1>
            <p className="text-xs text-slate-300 hidden sm:block">
              Instagram Hikayeleri + Kariyer.net Korumalı İlanlar + Kulüp QR Rozet Cüzdanı
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-700">
          <button
            type="button"
            onClick={() => setViewportMode("mobile")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewportMode === "mobile"
                ? "bg-[#990000] text-white shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Mobil Görünüm (390px)
          </button>
          <button
            type="button"
            onClick={() => setViewportMode("desktop")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewportMode === "desktop"
                ? "bg-[#990000] text-white shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            Geniş Ekran
          </button>
        </div>
      </div>

      {/* Ana Uygulama Konteyneri (Mobil Çerçeve veya Geniş Ekran) */}
      <div
        className={`w-full transition-all duration-300 bg-[#F8FAFF] overflow-hidden relative flex flex-col ${
          viewportMode === "mobile"
            ? "max-w-[412px] rounded-[36px] border-[6px] border-slate-800 shadow-2xl min-h-[820px]"
            : "max-w-5xl rounded-2xl border border-slate-200 shadow-xl min-h-[780px]"
        }`}
      >
        {/* Anlık Bildirim (Toast) */}
        {toastMessage && (
          <div className="fixed sm:absolute top-16 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-[#1e3a5f] text-white text-xs font-medium px-4 py-3 rounded-2xl shadow-xl border border-white/15 flex items-center justify-between gap-2 animate-bounce">
            <span>{toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-white/70 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ÜST HEADER: Kurumsal Kimlik + XP Rozet Puanı + Hızlı Staj Durumu */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#990000] to-[#1e3a5f] flex items-center justify-center text-white font-extrabold text-xs shadow-sm">
                İESÜ
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-[#1e3a5f] tracking-tight">
                    İESÜ Kampüs & Kariyer
                  </span>
                  <ShieldCheck className="w-4 h-4 text-[#990000]" />
                </div>
                <p className="text-[11px] text-slate-500">
                  Öğrenci & Mezun Süper-Uygulaması
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveBottomTab("wallet")}
                className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 px-2.5 py-1.5 rounded-full text-xs font-bold transition"
                title="Kariyer ve Kulüp Yetkinlik Puanın"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{studentXp} XP</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  showToast("🔔 Danışman hocan zorunlu staj belgeni incelemeye aldı!")
                }
                className="relative p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                aria-label="Bildirimler"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#990000]" />
              </button>
            </div>
          </div>

          {/* Kanca 1 Özeti: Zorunlu Staj & SGK Canlı Durum Çubuğu */}
          <div
            onClick={() => setActiveBottomTab("internship")}
            className="mt-2.5 bg-gradient-to-r from-[#1e3a5f] to-[#990000] text-white rounded-xl px-3 py-2 flex items-center justify-between cursor-pointer hover:opacity-95 transition shadow-sm"
          >
            <div className="flex items-center gap-2 min-w-0">
              <FileCheck2 className="w-4 h-4 shrink-0 text-amber-300" />
              <div className="truncate">
                <span className="text-[11px] font-semibold block truncate">
                  Zorunlu Staj Durumu: Adım {internshipStep}/3 —{" "}
                  {internshipStep === 1
                    ? "Başvuru Yapıldı"
                    : internshipStep === 2
                    ? "Akademik Danışman Onayında"
                    : "SGK Müstehaklık Belgen Hazır!"}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 shrink-0 text-white/80" />
          </div>
        </header>

        {/* İÇERİK GÖVDESİ (Sekmeye Göre Değişir) */}
        <main className="flex-1 overflow-y-auto pb-24">
          {activeBottomTab === "feed" && (
            <div>
              {/* 1. INSTAGRAM TARZI 24 SAATLİK KAMPÜS & MEZUN HİKAYELERİ (STORIES) */}
              <section className="bg-white border-b border-slate-200/80 px-3 py-3">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Canlı Kampüs & Mezun Hikayeleri (24s)
                  </span>
                  <span className="text-[11px] text-[#990000] font-semibold">
                    Dokun & İzle
                  </span>
                </div>

                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                  {/* Kendi Hikayeni Ekle */}
                  <button
                    type="button"
                    onClick={() => setNewPostModalOpen(true)}
                    className="flex flex-col items-center shrink-0 w-16 group"
                  >
                    <div className="relative w-14 h-14 rounded-full bg-slate-100 border-2 border-dashed border-[#990000] flex items-center justify-center text-[#990000] group-hover:bg-red-50 transition">
                      <Plus className="w-6 h-6" />
                      <span className="absolute -bottom-1 right-0 bg-[#990000] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        +10 XP
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-700 mt-1.5 truncate w-full text-center">
                      Sen Paylaş
                    </span>
                  </button>

                  {stories.map((story) => (
                    <button
                      key={story.id}
                      type="button"
                      onClick={() => handleOpenStory(story)}
                      className="flex flex-col items-center shrink-0 w-16 group text-center"
                    >
                      <div
                        className={`p-[2.5px] rounded-full transition-transform group-hover:scale-105 ${
                          story.seen
                            ? "bg-slate-300"
                            : "bg-gradient-to-tr from-[#990000] via-[#D32F2F] to-amber-500"
                        }`}
                      >
                        <div
                          className={`w-13 h-13 w-[52px] h-[52px] rounded-full ${story.avatarBg} border-2 border-white flex flex-col items-center justify-center text-white font-bold text-xs relative`}
                        >
                          <span>{story.initials}</span>
                          <span className="absolute -bottom-1 bg-slate-900/90 text-white text-[8px] px-1.5 py-0.2 rounded-full font-semibold whitespace-nowrap">
                            {story.badge}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-slate-800 mt-1.5 truncate w-full">
                        {story.author}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              {/* 2. ARAMA VE KATEGORİ FİLTRELERİ */}
              <section className="px-3 pt-3 pb-2 sticky top-[105px] z-20 bg-[#F8FAFF]/95 backdrop-blur-sm">
                <div className="relative mb-2">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="İlan, mezun, kulüp etkinliği veya proje ara..."
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#990000] shadow-sm"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {[
                    { id: "all", label: "🔥 Tümü (Kampüs Nabzı)" },
                    { id: "job", label: "🎯 İESÜ Özel İlanlar" },
                    { id: "event", label: "🎟️ Kulüp & QR Rozet" },
                    { id: "showcase", label: "🚀 Proje Vitrini" },
                    { id: "poll", label: "📊 Kampüs Anketi" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveCategory(tab.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                        activeCategory === tab.id
                          ? "bg-[#1e3a5f] text-white shadow-sm"
                          : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </section>

              {/* 3. HİBRİT SOSYAL + KARİYER AKIŞ KARTLARI */}
              <section className="px-3 space-y-3 pt-1">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition hover:shadow-md"
                  >
                    {/* Kart Üst Başlık */}
                    <div className="p-3.5 pb-2 flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-10 h-10 rounded-xl ${post.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm`}
                        >
                          {post.avatarInitials}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-xs font-bold text-slate-900">
                              {post.company}
                            </h3>
                            {post.type === "exclusive-job" && (
                              <span className="bg-red-50 text-[#990000] border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Sadece İESÜ
                              </span>
                            )}
                            {post.type === "club-event" && (
                              <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                +{post.xpReward} XP Rozetli
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {post.authorRole} • {post.timeAgo}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleSave(post.id)}
                        className={`p-1.5 rounded-lg transition ${
                          post.saved
                            ? "text-[#990000] bg-red-50"
                            : "text-slate-400 hover:bg-slate-100"
                        }`}
                        aria-label="Kaydet"
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    {/* Kart Gövdesi */}
                    <div className="px-3.5 py-1.5">
                      <h2 className="text-sm font-bold text-[#1e3a5f] leading-snug mb-1.5">
                        {post.title}
                      </h2>
                      <p className="text-xs text-slate-600 leading-relaxed mb-2.5">
                        {post.content}
                      </p>

                      {/* KART TİPİ 1: SADECE İESÜ PROTOKOL İLAN KUTUSU */}
                      {post.type === "exclusive-job" && (
                        <div className="bg-gradient-to-br from-slate-50 to-red-50/40 border border-red-200/80 rounded-xl p-3 mb-2.5">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-[11px] font-bold text-[#990000] flex items-center gap-1">
                              <Flame className="w-3.5 h-3.5" />
                              {post.quotaText}
                            </span>
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                              %{post.matchScore} Uyum
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mb-2.5">
                            💡 {post.competitorNote}
                          </p>
                          <button
                            type="button"
                            disabled={post.applied}
                            onClick={() => handleQuickApply(post.id)}
                            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition min-h-[42px] ${
                              post.applied
                                ? "bg-emerald-600 text-white cursor-default"
                                : "bg-[#990000] hover:bg-[#800000] text-white shadow-sm"
                            }`}
                          >
                            {post.applied ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                İESÜ Onaylı CV ile Başvuruldu
                              </>
                            ) : (
                              <>
                                <Briefcase className="w-4 h-4" />
                                Tek Tıkla Başvur & Staj Komisyonuna Gönder
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* KART TİPİ 2: KULÜP ETKİNLİĞİ VE QR ROZET KUTUSU */}
                      {post.type === "club-event" && (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-2.5">
                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-700 font-medium mb-2.5">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-[#990000]" />
                              {post.eventDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#1e3a5f]" />
                              {post.location}
                            </span>
                            <span className="flex items-center gap-1 text-emerald-700 font-bold">
                              <Users className="w-3.5 h-3.5" />
                              {post.attendeeCount} arkadaşın katılıyor
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => handleJoinEvent(post.id, false)}
                              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition min-h-[40px] ${
                                post.joined
                                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                                  : "bg-white border-slate-300 text-slate-800 hover:bg-slate-100"
                              }`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              {post.joined ? "Katılıyorsun (Kaydedildi)" : "Etkinliğe Katıl"}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleJoinEvent(post.id, true)}
                              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition min-h-[40px] ${
                                post.qrClaimed
                                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                                  : "bg-[#1e3a5f] hover:bg-slate-800 text-white"
                              }`}
                            >
                              <QrCode className="w-4 h-4" />
                              {post.qrClaimed
                                ? "CV Rozeti Alındı (+30 XP)"
                                : "QR Okut & CV'ye Rozet Ekle"}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* KART TİPİ 3: ÖĞRENCİ / MEZUN PROJE VİTRİNİ */}
                      {post.type === "showcase" && post.projectHighlight && (
                        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 mb-2.5 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900">
                            <Award className="w-4 h-4 text-emerald-700 shrink-0" />
                            <span>{post.projectHighlight}</span>
                          </div>
                          <button
                            type="button"
                            disabled={post.teamRequested}
                            onClick={() => handleTeamRequest(post.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                              post.teamRequested
                                ? "bg-emerald-700 text-white"
                                : "bg-emerald-600 hover:bg-emerald-700 text-white"
                            }`}
                          >
                            {post.teamRequested
                              ? "İstek Gönderildi ✓"
                              : "Takıma Katıl / İletişime Geç"}
                          </button>
                        </div>
                      )}

                      {/* KART TİPİ 4: CANLI KAMPÜS ANKETİ */}
                      {post.type === "poll" && post.pollOptions && (
                        <div className="space-y-2 mb-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                          {(() => {
                            const totalVotes = post.pollOptions.reduce(
                              (acc, o) => acc + o.votes,
                              0
                            );
                            return post.pollOptions.map((option) => {
                              const pct =
                                totalVotes > 0
                                  ? Math.round((option.votes / totalVotes) * 100)
                                  : 0;
                              const isSelected = post.votedOptionId === option.id;
                              return (
                                <button
                                  key={option.id}
                                  type="button"
                                  onClick={() => handleVotePoll(post.id, option.id)}
                                  className={`w-full text-left relative overflow-hidden rounded-xl border p-2.5 transition ${
                                    isSelected
                                      ? "border-[#990000] bg-red-50/40"
                                      : "border-slate-200 bg-white hover:border-slate-300"
                                  }`}
                                >
                                  {post.votedOptionId && (
                                    <div
                                      className="absolute inset-y-0 left-0 bg-[#990000]/10 transition-all duration-500"
                                      style={{ width: `${pct}%` }}
                                    />
                                  )}
                                  <div className="relative flex items-center justify-between text-xs font-semibold">
                                    <span className="text-slate-800">
                                      {isSelected ? "✓ " : ""}
                                      {option.label}
                                    </span>
                                    {post.votedOptionId && (
                                      <span className="text-[#990000] font-bold">
                                        %{pct} ({option.votes})
                                      </span>
                                    )}
                                  </div>
                                </button>
                              );
                            });
                          })()}
                        </div>
                      )}

                      {/* Etiketler */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Kart Alt Etkileşim Barı */}
                    <div className="px-3.5 py-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center gap-1.5 font-semibold transition ${
                            post.liked
                              ? "text-[#990000]"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 ${post.liked ? "fill-current" : ""}`}
                          />
                          <span>{post.likes} Alkış</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setOpenCommentsId(
                              openCommentsId === post.id ? null : post.id
                            )
                          }
                          className="flex items-center gap-1.5 font-semibold text-slate-600 hover:text-slate-900 transition"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments.length} Yorum</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          showToast("🔗 Bağlantı kopyalandı! Kampüs grubunda paylaşabilirsin.")
                        }
                        className="flex items-center gap-1 font-semibold text-slate-500 hover:text-slate-900 transition"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Paylaş</span>
                      </button>
                    </div>

                    {/* Açılır Yorum Alanı */}
                    {openCommentsId === post.id && (
                      <div className="px-3.5 py-3 bg-slate-100/80 border-t border-slate-200 space-y-2">
                        {post.comments.length === 0 ? (
                          <p className="text-[11px] text-slate-500">
                            İlk yorumu sen yaz ve tartışmayı başlat!
                          </p>
                        ) : (
                          post.comments.map((c) => (
                            <div
                              key={c.id}
                              className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs"
                            >
                              <span className="font-bold text-[#1e3a5f] block">
                                {c.user}
                              </span>
                              <span className="text-slate-700">{c.text}</span>
                            </div>
                          ))
                        )}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            value={commentDraft}
                            onChange={(e) => setCommentDraft(e.target.value)}
                            placeholder="Yorumunu veya sorunu yaz..."
                            className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#990000]"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddComment(post.id)}
                            className="bg-[#990000] text-white p-2 rounded-xl hover:bg-[#800000] transition"
                            aria-label="Yorum Gönder"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </section>
            </div>
          )}

          {/* SEKME 2: SADECE İESÜ PROTOKOL İLANLARI VE MENTORLUK */}
          {activeBottomTab === "jobs" && (
            <div className="p-4 space-y-4">
              <div className="bg-gradient-to-r from-[#1e3a5f] to-[#990000] text-white p-4 rounded-2xl shadow">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full">
                  Kariyer.net & LinkedIn&apos;de Olmayan Avantaj
                </span>
                <h2 className="text-base font-bold mt-2">
                  İESÜ Protokollü Şirket Kontenjanları
                </h2>
                <p className="text-xs text-white/85 mt-1">
                  Bu ilanlar yalnızca `@iesu.edu.tr` doğrulanmış öğrencilere açıktır. Başvurular doğrudan Bölüm Staj Komisyonu sistemine düşer.
                </p>
              </div>

              {posts
                .filter((p) => p.type === "exclusive-job")
                .map((job) => (
                  <div
                    key={job.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#990000]">
                        {job.company}
                      </span>
                      <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                        %{job.matchScore} Bölüm Uyumu
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{job.title}</h3>
                    <p className="text-xs text-slate-600">{job.content}</p>
                    <button
                      type="button"
                      disabled={job.applied}
                      onClick={() => handleQuickApply(job.id)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition ${
                        job.applied
                          ? "bg-emerald-600 text-white"
                          : "bg-[#990000] text-white hover:bg-[#800000]"
                      }`}
                    >
                      {job.applied
                        ? "✓ Başvuruldu (Komisyona İletildi)"
                        : "Tek Tıkla Başvur"}
                    </button>
                  </div>
                ))}

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Coffee className="w-4 h-4 text-[#990000]" />
                  <h3 className="text-sm font-bold text-[#1e3a5f]">
                    15 Dakikalık Üst Dönem / Mezun CV İncelemesi
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  LinkedIn&apos;de mesajların cevapsız kalmasın. Kendi bölümünden mezunlarla 15 dakikalık hızlı mülakat provası al:
                </p>
                <div className="space-y-2">
                  {[
                    {
                      name: "Selin Yılmaz ('23 Bilgisayar Müh.)",
                      company: "Baykar • Yazılım Mühendisi",
                      slot: "Bugün 18:30",
                    },
                    {
                      name: "Burak Aydın ('22 Uluslararası Lojistik)",
                      company: "Borusan Lojistik • Operasyon Uzmanı",
                      slot: "Yarın 16:00",
                    },
                  ].map((mentor) => (
                    <div
                      key={mentor.name}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          {mentor.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {mentor.company} • Müsait: {mentor.slot}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          showToast(`📅 ${mentor.name} ile 15 dk randevun oluşturuldu!`)
                        }
                        className="bg-[#1e3a5f] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-slate-800 transition"
                      >
                        Randevu Al
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SEKME 3: ZORUNLU STAJ VE SGK KAĞITSIZ TAKİP EKRANI */}
          {activeBottomTab === "internship" && (
            <div className="p-4 space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#990000] bg-red-50 px-2.5 py-1 rounded-full">
                  Kağıtsız Resmi Süreç (internships & academicApprovals)
                </span>
                <h2 className="text-base font-bold text-[#1e3a5f] mt-2">
                  Zorunlu Staj & SGK Belgesi Takip Çizelgesi
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Kampüste elden imza toplamak yerine staj onayını ve SGK müstehaklık belgeni canlı takip et.
                </p>

                <div className="mt-4 space-y-3">
                  {[
                    {
                      step: 1,
                      title: "1. Şirket Kabulü & Staj Formu Yüklendi",
                      desc: "Borusan Lojistik A.Ş. (30 İş Günü) başvurusu sisteme kaydedildi.",
                    },
                    {
                      step: 2,
                      title: "2. Bölüm Staj Komisyonu / Akademik Danışman Onayı",
                      desc: "Dr. Öğr. Üyesi danışman onayı dijital imzada.",
                    },
                    {
                      step: 3,
                      title: "3. İESÜ SGK İşe Giriş Bildirgesi Hazır",
                      desc: "Onay tamamlandığında barkodlu PDF belgeni buradan indirebilirsin.",
                    },
                  ].map((item) => {
                    const done = internshipStep >= item.step;
                    return (
                      <div
                        key={item.step}
                        className={`p-3 rounded-xl border flex items-start gap-3 ${
                          done
                            ? "bg-emerald-50/60 border-emerald-300"
                            : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <CheckCircle2
                          className={`w-5 h-5 shrink-0 mt-0.5 ${
                            done ? "text-emerald-600" : "text-slate-400"
                          }`}
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setInternshipStep(3);
                      showToast("🎉 Akademik onay simüle edildi! SGK Belgen indirmeye hazır.");
                    }}
                    className="flex-1 bg-[#990000] hover:bg-[#800000] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition"
                  >
                    {internshipStep === 3
                      ? "📄 Barkodlu SGK Belgesini İndir (PDF)"
                      : "Danışman Onayını Simüle Et (Adım 3'e Geç)"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SEKME 4: İESÜ DİJİTAL KAMPÜS & MEZUN KARTI + ROZET CÜZDANI */}
          {activeBottomTab === "wallet" && (
            <div className="p-4 space-y-4">
              {/* Dijital Kampüs Kartı */}
              <div className="bg-gradient-to-br from-[#1e3a5f] via-[#152945] to-[#990000] text-white p-5 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-white/75 font-bold block">
                      İSTANBUL ESENYURT ÜNİVERSİTESİ
                    </span>
                    <h2 className="text-base font-extrabold tracking-tight">
                      Dijital Kampüs & Kariyer Kartı
                    </h2>
                  </div>
                  <CreditCard className="w-6 h-6 text-amber-300" />
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/15">
                  <div>
                    <p className="text-xs font-bold">Doğrulanmış İESÜ Öğrencisi</p>
                    <p className="text-[11px] text-white/80">
                      Yetkinlik Puanı: {studentXp} XP • {badges.length} Resmi Rozet
                    </p>
                  </div>
                  <div className="bg-white text-slate-900 p-2 rounded-xl flex items-center gap-1.5 text-[11px] font-extrabold">
                    <QrCode className="w-5 h-5 text-[#990000]" />
                    <span>KAMPÜS QR</span>
                  </div>
                </div>
              </div>

              {/* CV'ye Otomatik İşlenen Üniversite Onaylı Rozetler */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-[#1e3a5f] mb-1">
                  CV&apos;ne Otomatik İşlenen Resmi Kampüs Rozetleri
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  Instagram&apos;da hikaye izlemek yerine kulüp etkinliklerinde QR okutarak kazandığın rektörlük/kariyer merkezi onaylı sertifikalar:
                </p>
                <div className="space-y-2">
                  {badges.map((badge) => (
                    <div
                      key={badge}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs font-bold text-emerald-950"
                    >
                      <span className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                        {badge}
                      </span>
                      <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full">
                        Onaylı
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* MOBİL ALT NAVİGASYON ÇUBUĞU (THUMB-ZONE ERGONOMİK BAR) */}
        <nav
          aria-label="Mobil Alt Menü"
          className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around"
        >
          <button
            type="button"
            onClick={() => setActiveBottomTab("feed")}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[11px] font-bold transition min-h-[44px] ${
              activeBottomTab === "feed"
                ? "text-[#990000]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Flame className="w-5 h-5" />
            <span className="mt-0.5">Kampüs Akışı</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveBottomTab("jobs")}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[11px] font-bold transition min-h-[44px] ${
              activeBottomTab === "jobs"
                ? "text-[#990000]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span className="mt-0.5">Özel İlanlar</span>
          </button>

          {/* Ortadaki Hızlı Paylaş / QR Butonu */}
          <button
            type="button"
            onClick={() => setNewPostModalOpen(true)}
            className="flex flex-col items-center justify-center -mt-4 bg-gradient-to-tr from-[#990000] to-[#D32F2F] text-white w-12 h-12 rounded-2xl shadow-lg hover:scale-105 transition"
            aria-label="Yeni Paylaşım Ekle"
          >
            <Plus className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={() => setActiveBottomTab("internship")}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[11px] font-bold transition min-h-[44px] ${
              activeBottomTab === "internship"
                ? "text-[#990000]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <FileCheck2 className="w-5 h-5" />
            <span className="mt-0.5">Staj & SGK</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveBottomTab("wallet")}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[11px] font-bold transition min-h-[44px] ${
              activeBottomTab === "wallet"
                ? "text-[#990000]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="mt-0.5">İESÜ Kartım</span>
          </button>
        </nav>

        {/* TAM EKRAN HİKAYE (STORY) MODALI */}
        {activeStory && (
          <div className="fixed sm:absolute inset-0 z-50 bg-slate-950/95 text-white flex flex-col justify-between p-5">
            <div>
              {/* Hikaye İlerleme Çubuğu */}
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mb-4">
                <div className="w-2/3 h-full bg-white rounded-full" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-10 h-10 rounded-full ${activeStory.avatarBg} flex items-center justify-center font-bold text-xs`}
                  >
                    {activeStory.initials}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">{activeStory.author}</h4>
                    <p className="text-[11px] text-white/70">{activeStory.role}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveStory(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div
              className={`my-auto p-6 rounded-3xl bg-gradient-to-br ${activeStory.gradient} border border-white/15 shadow-2xl space-y-3 text-center`}
            >
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                {activeStory.badge}
              </span>
              <h3 className="text-lg font-extrabold leading-snug">
                {activeStory.title}
              </h3>
              <p className="text-xs text-white/85 leading-relaxed">
                {activeStory.subtitle}
              </p>
              <p className="text-[11px] text-amber-300 font-semibold pt-2">
                {activeStory.stats}
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleStoryAction(activeStory)}
                className="w-full py-3 px-4 rounded-2xl bg-white text-slate-900 font-extrabold text-xs shadow-lg hover:bg-slate-100 transition"
              >
                {activeStory.ctaText} →
              </button>
            </div>
          </div>
        )}

        {/* YENİ PAYLAŞIM / PROJE EKLEME MODALI */}
        {newPostModalOpen && (
          <div className="fixed sm:absolute inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-3">
            <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[#1e3a5f]">
                  Kampüs Akışında Paylaş (+10 XP)
                </h3>
                <button
                  type="button"
                  onClick={() => setNewPostModalOpen(false)}
                  className="p-1.5 rounded-full bg-slate-100 text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewPostType("showcase")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border ${
                      newPostType === "showcase"
                        ? "bg-red-50 border-[#990000] text-[#990000]"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    🚀 Proje / Takım Arkadaşı
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPostType("exclusive-job")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border ${
                      newPostType === "exclusive-job"
                        ? "bg-red-50 border-[#990000] text-[#990000]"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    💼 Staj / Deneyim Notu
                  </button>
                </div>

                <input
                  type="text"
                  required
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Başlık (Örn: Bitirme projemiz için React arkadaşı arıyoruz)"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#990000]"
                />

                <textarea
                  rows={3}
                  required
                  value={newPostBody}
                  onChange={(e) => setNewPostBody(e.target.value)}
                  placeholder="Detayları paylaş..."
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#990000]"
                />

                <button
                  type="submit"
                  className="w-full bg-[#990000] hover:bg-[#800000] text-white font-bold text-xs py-2.5 rounded-xl transition"
                >
                  Kampüs Akışında Yayınla (+10 XP)
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
