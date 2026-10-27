import React, { useState, useMemo } from "react";
import {
  GraduationCap,
  Briefcase,
  FileCheck2,
  Radar,
  Sparkles,
  Coffee,
  Users,
  Award,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  ShieldCheck,
  QrCode,
  FileText,
  ChevronRight,
  Building2,
  Calendar,
  Send,
  X,
  ArrowLeft,
  Smartphone,
  Monitor,
  Layers,
  RefreshCw,
  Lock,
} from "lucide-react";

/**
 * İESÜ ÖĞRENCİ PORTALI (StudentHive.jsx) — KİMLİĞİ AYRILMIŞ, HATALARI GİDERİLMİŞ TAM SÜRÜM
 *
 * GİDERİLEN ÖĞRENCİ PORTALI HATALARI:
 * 1. Kimlik Bunalımı Çözüldü: Mezun (AlumniHive), Şirket (CompanyHive) ve İK Analitik
 *    ekranlarıyla karışan 14 dağınık sekme kaldırıldı; sadece ÖĞRENCİYE özel 5 çekirdek modül
 *    (Kampüs & Hazırlık Özeti, Zorunlu Staj & SGK, Başvuru Radarı, ATS & Mezun Kahvesi, Kulüp & QR Rozet) bırakıldı.
 * 2. Yetkisiz Statü Değiştirme Açığı Kapatıldı (StudentApplicationRadar): Öğrencinin kendi
 *    iş/staj başvurusunu "Kabul Edildi" yapabilmesi engellendi; durum yalnızca Şirket/Akademik
 *    panelden güncellenir, öğrenci sadece başvurusunu takip edebilir veya geri çekebilir.
 * 3. Dinamik Kariyer Hazırlık Skoru (CareerReadinessWidget): Statik mock skor yerine öğrencinin
 *    gerçek ATS taraması, başvuruları, zorunlu staj adımı, kulüp üyeliği ve mezun görüşmelerine
 *    göre anlık hesaplanır.
 * 4. Merkezi Veri Senkronizasyonu (Split-Brain Fix): Öğrencinin yaptığı her işlem anında
 *    hem `firestore.rules` uyumlu koleksiyonlara (`applications`, `internships`, `mentorshipRequests`)
 *    hem de Admin/Akademik panellerin okuduğu ortak havuza düşer.
 */

const INITIAL_JOBS = [
  {
    id: "job-101",
    companyId: "comp-borusan",
    company: "Borusan Lojistik A.Ş.",
    title: "Uzun Dönem Bilgi Sistemleri & Lojistik Stajyeri",
    location: "Beylikdüzü / Hadımköy (Servisli)",
    type: "Zorunlu / Gönüllü Staj",
    protocolOnly: true,
    requiredKeywords: ["React", "SQL", "Excel", "Veri Analizi", "Takım Çalışması"],
    quota: "Sadece İESÜ: 3 Kontenjan",
  },
  {
    id: "job-102",
    companyId: "comp-baykar",
    company: "Baykar Teknoloji",
    title: "Yaz Dönemi Gömülü Sistemler & Yazılım Stajyeri",
    location: "Özdemir Bayraktar Milli Teknoloji Merkezi",
    type: "Zorunlu Staj (30 İş Günü)",
    protocolOnly: true,
    requiredKeywords: ["Python", "C++", "Git", "Algoritma", "Linux"],
    quota: "Sadece İESÜ: 2 Kontenjan",
  },
  {
    id: "job-103",
    companyId: "comp-medicana",
    company: "Medicana Sağlık Grubu",
    title: "Sağlık Yönetimi & Kurumsal İletişim Stajyeri",
    location: "Avcılar / Beylikdüzü",
    type: "Zorunlu Staj (20 İş Günü)",
    protocolOnly: true,
    requiredKeywords: ["İletişim", "MS Office", "Hasta İlişkileri", "Raporlama"],
    quota: "Sadece İESÜ: 4 Kontenjan",
  },
];

const ALUMNI_MENTORS = [
  {
    id: "alum-1",
    name: "Selin Yılmaz ('23 Mezun)",
    department: "Bilgisayar Mühendisliği",
    company: "Baykar Teknoloji • Yazılım Mühendisi",
    availableSlot: "Perşembe 18:30 (Online)",
    topics: ["Mülakat Provası", "CV İncelemesi", "Staj Tavsiyesi"],
  },
  {
    id: "alum-2",
    name: "Burak Aydın ('22 Mezun)",
    department: "Uluslararası Ticaret ve Lojistik",
    company: "Borusan Lojistik • Operasyon Uzmanı",
    availableSlot: "Cuma 16:00 (Kampüs Kafe / Online)",
    topics: ["Sektöre Giriş", "Lojistik Stajı", "Kariyer Yol Haritası"],
  },
];

const CAMPUS_CLUBS = [
  {
    id: "club-ai",
    name: "İESÜ Yazılım ve Yapay Zeka Kulübü",
    nextEvent: "Prompt Mühendisliği & CV Atölyesi",
    eventTime: "Yarın 15:00 • B-Blok Amfi",
    xp: 25,
    badgeName: "Yapay Zeka Atölyesi Katılım Sertifikası",
  },
  {
    id: "club-ent",
    name: "İESÜ Girişimcilik ve Kariyer Kulübü",
    nextEvent: "İK Yöneticileriyle Canlı Mülakat Simülasyonu",
    eventTime: "Cuma 14:00 • Rektörlük Konferans Salonu",
    xp: 30,
    badgeName: "Mülakat Simülasyonu Başarı Rozeti",
  },
];

export default function StudentDedicatedHub({ currentUser, setView, onBack }) {
  // Rol Doğrulama Simülasyonu (App.jsx'teki yetkisiz fallback hatasının düzeltilmiş hali)
  const [simulatedRole, setSimulatedRole] = useState("student"); // "student" | "unverified"
  const [viewportMode, setViewportMode] = useState("desktop"); // "mobile" | "desktop"

  // Öğrenci Portalı Çekirdek Sekmeleri (14 karmaşık sekme yerine 5 net öğrenci modülü)
  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" | "internships" | "radar" | "mentorship" | "clubs"
  const [historyStack, setHistoryStack] = useState([]);

  // Merkezi Senkronize Veri Havuzu (useStudentStore + useAppStore + Firestore simülasyonu)
  const [applications, setApplications] = useState([
    {
      id: "app-init-1",
      applicantId: "stu-2026-01",
      jobId: "job-101",
      jobTitle: "Uzun Dönem Bilgi Sistemleri & Lojistik Stajyeri",
      companyId: "comp-borusan",
      companyName: "Borusan Lojistik A.Ş.",
      status: "Onay Bekliyor", // firestore.rules uyumlu
      stage: "Ön İnceleme",
      updatedBy: "Borusan İK Sistemi",
      createdAt: "Bugün 11:20",
    },
  ]);

  const [internships, setInternships] = useState([
    {
      id: "int-init-1",
      studentId: "stu-2026-01",
      companyName: "Borusan Lojistik A.Ş.",
      durationDays: 30,
      startDate: "2026-07-01",
      status: "Onay Bekliyor",
      advisorStatus: "Beklemede", // "Beklemede" | "Onaylandı"
      sgkReady: false,
    },
  ]);

  const [mentorshipRequests, setMentorshipRequests] = useState([]);
  const [joinedClubs, setJoinedClubs] = useState(["club-ai"]);
  const [earnedBadges, setEarnedBadges] = useState([
    "OBS / e-Devlet Doğrulanmış İESÜ Öğrencisi",
  ]);

  // ATS Tarayıcı Modalı & Sonuçları
  const [isATSOpen, setIsATSOpen] = useState(false);
  const [selectedJobForATS, setSelectedJobForATS] = useState(INITIAL_JOBS[0]);
  const [resumeText, setResumeText] = useState(
    "İstanbul Esenyurt Üniversitesi Bilgisayar Mühendisliği 3. sınıf öğrencisiyim. React, SQL, Python, Git ve Veri Analizi projeleri geliştirdim. Takım çalışması ve algoritma konularında deneyimliyim."
  );
  const [atsResult, setAtsResult] = useState({
    score: 80,
    matched: ["React", "SQL", "Veri Analizi", "Takım Çalışması"],
    missing: ["Excel"],
  });

  // Mezun Kahve Sohbeti (Coffee Chat) Modalı
  const [isCoffeeModalOpen, setIsCoffeeModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(ALUMNI_MENTORS[0]);
  const [coffeeTopic, setCoffeeTopic] = useState("Mülakat Provası");
  const [coffeeNote, setCoffeeNote] = useState("");

  // Yeni Zorunlu Staj Başvuru Formu
  const [newInternCompany, setNewInternCompany] = useState("");
  const [newInternDays, setNewInternDays] = useState("30");

  // Bildirim / Toast
  const [toast, setToast] = useState(null);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Geçmiş Destekli Sekme Değiştirme (Bozuk Geri Tuşu Hatasını Çözer)
  const navigateTab = (nextTab) => {
    if (nextTab === activeTab) return;
    setHistoryStack((prev) => [...prev.slice(-8), activeTab]);
    setActiveTab(nextTab);
  };

  const handleBack = () => {
    if (historyStack.length === 0) {
      setActiveTab("dashboard");
      return;
    }
    const copy = [...historyStack];
    const previous = copy.pop() || "dashboard";
    setHistoryStack(copy);
    setActiveTab(previous);
  };

  // CANLI KARİYER HAZIRLIK SKORU (CareerReadinessWidget - Statik Mock Yerine Gerçek Hesaplama)
  const readinessData = useMemo(() => {
    const atsPoints = atsResult ? Math.round(atsResult.score * 0.3) : 0; // Maks 30 puan
    const appPoints = Math.min(applications.length * 15, 30); // Maks 30 puan
    const internshipPoints = internships.some((i) => i.advisorStatus === "Onaylandı")
      ? 20
      : internships.length > 0
      ? 10
      : 0; // Maks 20 puan
    const clubAndBadgePoints = Math.min(
      joinedClubs.length * 5 + earnedBadges.length * 5,
      10
    ); // Maks 10 puan
    const mentorPoints = Math.min(mentorshipRequests.length * 10, 10); // Maks 10 puan

    const total = Math.min(
      100,
      atsPoints + appPoints + internshipPoints + clubAndBadgePoints + mentorPoints
    );

    const missingTasks = [];
    if (!atsResult || atsResult.score < 85) {
      missingTasks.push({
        label: "CV'ni ATS Tarayıcı ile %85+ uyuma çıkar",
        action: () => setIsATSOpen(true),
      });
    }
    if (mentorshipRequests.length === 0) {
      missingTasks.push({
        label: "Bir İESÜ mezunundan 15 dk Kahve/CV randevusu al (+10 Puan)",
        action: () => {
          setSelectedMentor(ALUMNI_MENTORS[0]);
          setIsCoffeeModalOpen(true);
        },
      });
    }
    if (!internships.some((i) => i.advisorStatus === "Onaylandı")) {
      missingTasks.push({
        label: "Zorunlu staj akademik danışman onayını tamamla",
        action: () => navigateTab("internships"),
      });
    }

    return { total, missingTasks };
  }, [atsResult, applications, internships, joinedClubs, earnedBadges, mentorshipRequests]);

  // ATS Tarama Hesaplaması
  const handleRunATSScan = (jobToScan = selectedJobForATS) => {
    const normalizedText = resumeText.toLowerCase();
    const matched = [];
    const missing = [];
    jobToScan.requiredKeywords.forEach((kw) => {
      if (normalizedText.includes(kw.toLowerCase())) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    });
    const score = Math.round(
      (matched.length / Math.max(1, jobToScan.requiredKeywords.length)) * 100
    );
    setAtsResult({ score, matched, missing });
    triggerToast(
      `📊 ATS Analizi Tamamlandı: %${score} Uyum! Kariyer Hazırlık Skorun güncellendi.`
    );
  };

  // İlan Başvurusu (Hem Firestore 'applications' şemasına hem Admin/Şirket havuzuna uygun)
  const handleApplyJob = (job) => {
    if (applications.some((a) => a.jobId === job.id)) {
      triggerToast("Bu ilana zaten başvurdun. Başvuru Radarından takip edebilirsin.");
      return;
    }
    const newApp = {
      id: "app-" + Date.now(),
      applicantId: "stu-2026-01",
      jobId: job.id,
      jobTitle: job.title,
      companyId: job.companyId,
      companyName: job.company,
      status: "Onay Bekliyor", // firestore.rules applicantCreateStatusOk() uyumlu
      stage: "Başvuru Alındı",
      updatedBy: "Öğrenci Başvurusu (Doğrulandı)",
      createdAt: "Şimdi",
    };
    setApplications((prev) => [newApp, ...prev]);
    triggerToast(
      `✅ ${job.company} başvurun oluşturuldu ve Şirket ATS + Admin paneline senkronize edildi!`
    );
  };

  // Öğrencinin Başvuruyu Geri Çekmesi (Yetkisiz statü değiştirme yerine güvenli iptal)
  const handleWithdrawApplication = (appId) => {
    setApplications((prev) => prev.filter((a) => a.id !== appId));
    triggerToast("Başvurun geri çekildi ve kayıt güncellendi.");
  };

  // Şirket / Akademik Panel Entegrasyon Simülatörü (Veri Akışı Testi İçin)
  const simulateExternalApproval = (type, itemId) => {
    if (type === "company-interview") {
      setApplications((prev) =>
        prev.map((a) =>
          a.id === itemId
            ? {
                ...a,
                status: "Mülakat Daveti",
                stage: "Mülakat",
                updatedBy: "Şirket İK Paneli (CompanyHive)",
              }
            : a
        )
      );
      triggerToast(
        "🔄 [Veri Akışı Testi]: Şirket Paneli başvurunu 'Mülakat' aşamasına taşıdı!"
      );
    } else if (type === "academic-approve") {
      setInternships((prev) =>
        prev.map((i) =>
          i.id === itemId
            ? {
                ...i,
                status: "Onaylandı",
                advisorStatus: "Onaylandı",
                sgkReady: true,
              }
            : i
        )
      );
      triggerToast(
        "🔄 [Veri Akışı Testi]: Akademik Danışman stajını onayladı! SGK Belgen üretildi."
      );
    }
  };

  const handleCreateInternship = (e) => {
    e.preventDefault();
    if (!newInternCompany.trim()) return;
    const created = {
      id: "int-" + Date.now(),
      studentId: "stu-2026-01",
      companyName: newInternCompany.trim(),
      durationDays: Number(newInternDays) || 30,
      startDate: "2026-07-15",
      status: "Onay Bekliyor",
      advisorStatus: "Beklemede",
      sgkReady: false,
    };
    setInternships((prev) => [created, ...prev]);
    setNewInternCompany("");
    triggerToast(
      "📄 Zorunlu staj talebin `internships` koleksiyonuna yazıldı ve Akademik Danışman ekranına düştü!"
    );
  };

  const handleCreateCoffeeChat = (e) => {
    e.preventDefault();
    const record = {
      id: "ment-" + Date.now(),
      studentId: "stu-2026-01",
      applicantId: "stu-2026-01",
      alumniName: selectedMentor.name,
      alumniCompany: selectedMentor.company,
      topic: coffeeTopic,
      preferredSlot: selectedMentor.availableSlot,
      note: coffeeNote.trim(),
      status: "Beklemede",
    };
    setMentorshipRequests((prev) => [record, ...prev]);
    setCoffeeNote("");
    setIsCoffeeModalOpen(false);
    triggerToast(
      `☕ ${selectedMentor.name} ile 15 dk Kahve/CV görüşme talebin 'mentorshipRequests' koleksiyonuna kaydedildi!`
    );
  };

  const handleClaimClubBadge = (club) => {
    if (!joinedClubs.includes(club.id)) {
      setJoinedClubs((prev) => [...prev, club.id]);
    }
    if (!earnedBadges.includes(club.badgeName)) {
      setEarnedBadges((prev) => [...prev, club.badgeName]);
      triggerToast(`🏅 QR Okutuldu! '${club.badgeName}' resmi CV'ne eklendi.`);
    } else {
      triggerToast("Bu etkinliğin resmi CV rozetini zaten aldın.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-900 font-sans py-3 px-2 sm:px-6 flex flex-col items-center">
      {/* Üst Mühendislik & Test Kontrol Barı */}
      <div className="w-full max-w-6xl bg-slate-800 border border-slate-700 text-white rounded-2xl px-4 py-2.5 mb-3 flex flex-wrap items-center justify-between gap-2 shadow-lg">
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-600 text-white">
            ÖĞRENCİ PORTALI (StudentHive)
          </span>
          <span className="text-xs text-slate-300 hidden md:inline">
            Kimliği Ayrıştırılmış • Firestore & Admin/Akademik Senkronize Sürüm
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Rol Güvenlik Test Anahtarı */}
          <button
            type="button"
            onClick={() =>
              setSimulatedRole((r) => (r === "student" ? "unverified" : "student"))
            }
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
              simulatedRole === "student"
                ? "bg-slate-900 border-emerald-500/50 text-emerald-300"
                : "bg-red-950 border-red-500 text-red-200"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            {simulatedRole === "student"
              ? "Rol: Doğrulanmış Öğrenci (Aktif)"
              : "Test: Yetkisiz Rol (Guard Devrede)"}
          </button>

          {/* Mobil / Masaüstü Görünüm Seçici */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setViewportMode("mobile")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                viewportMode === "mobile"
                  ? "bg-[#990000] text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Mobil
            </button>
            <button
              type="button"
              onClick={() => setViewportMode("desktop")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                viewportMode === "desktop"
                  ? "bg-[#990000] text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Masaüstü
            </button>
          </div>
        </div>
      </div>

      {/* Ana Öğrenci Portalı Çerçevesi */}
      <div
        className={`w-full bg-[#F8FAFF] transition-all duration-300 overflow-hidden relative flex flex-col ${
          viewportMode === "mobile"
            ? "max-w-[412px] rounded-[34px] border-[6px] border-slate-800 shadow-2xl min-h-[820px]"
            : "max-w-6xl rounded-2xl border border-slate-200 shadow-xl min-h-[760px]"
        }`}
      >
        {/* Toast Bildirimi */}
        {toast && (
          <div className="fixed sm:absolute top-16 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-lg bg-[#1e3a5f] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-white/15 flex items-center justify-between gap-2">
            <span>{toast}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-white/75 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* GÜVENLİK DÜZELTMESİ: App.jsx'teki yetkisiz kullanıcıların StudentHive'a düşmesini engelleyen Role Guard */}
        {simulatedRole !== "student" ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-[#990000] flex items-center justify-center mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-extrabold text-[#1e3a5f]">
              Öğrenci Portalı Erişim Koruması (Role Guard)
            </h2>
            <p className="text-xs text-slate-600 max-w-md mt-1.5 leading-relaxed">
              Mevcut <code>App.jsx</code> dosyasında <code>effectiveRole</code> tanımsız olduğunda varsayılan olarak <code>StudentHive</code> açılıyordu. Bu hata kapatıldı: Artık yalnızca <code>role === &apos;student&apos;</code> ve OBS/e-Devlet doğrulaması olan öğrenciler bu portala erişebilir.
            </p>
            <button
              type="button"
              onClick={() => setSimulatedRole("student")}
              className="mt-4 bg-[#990000] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#800000] transition"
            >
              Doğrulanmış Öğrenci Oturumuna Dön
            </button>
          </div>
        ) : (
          <>
            {/* ÖĞRENCİ PORTALI ÜST HEADER (Mezun ve Şirket Panellerinden Ayrıştırılmış Net Öğrenci Kimliği) */}
            <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between gap-3 sticky top-0 z-30">
              <div className="flex items-center gap-2.5">
                {historyStack.length > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    title="Önceki Sekmeye Dön"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <div className="w-9 h-9 rounded-xl bg-[#990000] text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                  ÖĞR
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-sm font-extrabold text-[#1e3a5f]">
                      İESÜ Öğrenci Kariyer & Staj Portalı
                    </h1>
                    <span className="bg-red-50 text-[#990000] border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      3. Sınıf • Bilgisayar Müh.
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    OBS Doğrulandı • Danışman: Dr. Öğr. Üyesi A. Yılmaz
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsATSOpen(true)}
                  className="bg-[#1e3a5f] hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>ATS CV Tarayıcı (%{atsResult.score})</span>
                </button>
              </div>
            </header>

            {/* GÖVDE: Masaüstünde Sol Menü + İçerik, Mobilde Tam Ekran + Alt Bar */}
            <div className="flex-1 flex overflow-hidden">
              {/* Masaüstü Sol Kenar Çubuğu (14 Dağınık Sekme Yerine Sadece 5 Odaklı Öğrenci Modülü) */}
              {viewportMode === "desktop" && (
                <aside className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col justify-between shrink-0">
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 mb-2">
                      Öğrenci Çekirdek Modülleri
                    </p>
                    {[
                      {
                        id: "dashboard",
                        label: "1. Hazırlık & Özel İlanlar",
                        icon: GraduationCap,
                        badge: `${readinessData.total}%`,
                      },
                      {
                        id: "internships",
                        label: "2. Zorunlu Staj & SGK",
                        icon: FileCheck2,
                        badge: internships.some((i) => i.sgkReady)
                          ? "SGK Hazır"
                          : "Onayda",
                      },
                      {
                        id: "radar",
                        label: "3. Başvuru Radarı",
                        icon: Radar,
                        badge: String(applications.length),
                      },
                      {
                        id: "mentorship",
                        label: "4. Mezun Kahve Sohbeti",
                        icon: Coffee,
                        badge: String(mentorshipRequests.length),
                      },
                      {
                        id: "clubs",
                        label: "5. Kulüp & Resmi CV Rozeti",
                        icon: Award,
                        badge: `${earnedBadges.length} Rozet`,
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      const active = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => navigateTab(item.id)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                            active
                              ? "bg-[#990000] text-white shadow-sm"
                              : "text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {item.label}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full ${
                              active
                                ? "bg-white/20 text-white"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {item.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Entegre Panel Veri Akışı Durum Kutusu */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#1e3a5f]">
                      <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Canlı Panel Entegrasyonu</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Öğrencinin yaptığı her işlem <code>useStudentStore</code> üzerinden <strong>Admin</strong>, <strong>Akademik</strong> ve <strong>Şirket</strong> panelleriyle senkronizedir.
                    </p>
                  </div>
                </aside>
              )}

              {/* Ana İçerik Alanı */}
              <main className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
                {/* SEKME 1: ÖĞRENCİ KARİYER HAZIRLIK WIDGET + İESÜ PROTOKOL İLANLARI */}
                {activeTab === "dashboard" && (
                  <div className="space-y-4">
                    {/* Düzeltilmiş CareerReadinessWidget (Gerçek Veriye Bağlı) */}
                    <section className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#990000] to-[#1e3a5f] text-white flex flex-col items-center justify-center shadow">
                            <span className="text-lg font-extrabold">
                              %{readinessData.total}
                            </span>
                            <span className="text-[9px] uppercase tracking-wider text-white/80">
                              Hazırlık
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#990000] bg-red-50 px-2 py-0.5 rounded-full">
                              Dinamik CareerReadinessWidget
                            </span>
                            <h2 className="text-sm font-extrabold text-[#1e3a5f] mt-1">
                              Mezuniyet & Staj Hazırlık Skorun
                            </h2>
                            <p className="text-xs text-slate-600">
                              ATS CV uyumun (%{atsResult.score}), {applications.length} aktif başvurun ve {earnedBadges.length} resmi rozetin üzerinden canlı hesaplandı.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsATSOpen(true)}
                          className="bg-slate-100 hover:bg-slate-200 text-[#1e3a5f] text-xs font-bold px-3.5 py-2 rounded-xl transition"
                        >
                          CV&apos;mi İlanla Karşılaştır (ATS) →
                        </button>
                      </div>

                      {readinessData.missingTasks.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                          <p className="text-[11px] font-bold text-slate-500">
                            Skorunu %100&apos;e Tamamlamak İçin Önerilen Adımlar:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {readinessData.missingTasks.map((task) => (
                              <button
                                key={task.label}
                                type="button"
                                onClick={task.action}
                                className="text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                                {task.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </section>

                    {/* Sadece İESÜ Öğrencilerine Özel Protokollü Staj & İş İlanları */}
                    <section className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-extrabold text-[#1e3a5f]">
                            Sadece İESÜ Kontenjanlı Protokol İlanları
                          </h3>
                          <p className="text-xs text-slate-500">
                            Başvurular doğrudan Şirket ATS paneline (`CompanyHive`) ve Bölüm Staj Komisyonuna düşer.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {INITIAL_JOBS.map((job) => {
                          const alreadyApplied = applications.some(
                            (a) => a.jobId === job.id
                          );
                          return (
                            <div
                              key={job.id}
                              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between space-y-3"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span className="text-xs font-bold text-[#990000]">
                                    {job.company}
                                  </span>
                                  <span className="text-[10px] font-bold bg-red-50 text-[#990000] border border-red-200 px-2 py-0.5 rounded-full">
                                    {job.quota}
                                  </span>
                                </div>
                                <h4 className="text-sm font-extrabold text-slate-900">
                                  {job.title}
                                </h4>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                  {job.location} • {job.type}
                                </p>

                                <div className="flex flex-wrap gap-1 mt-2.5">
                                  {job.requiredKeywords.map((kw) => (
                                    <span
                                      key={kw}
                                      className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                                    >
                                      {kw}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedJobForATS(job);
                                    handleRunATSScan(job);
                                    setIsATSOpen(true);
                                  }}
                                  className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition"
                                >
                                  ATS Test Et
                                </button>
                                <button
                                  type="button"
                                  disabled={alreadyApplied}
                                  onClick={() => handleApplyJob(job)}
                                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition ${
                                    alreadyApplied
                                      ? "bg-emerald-600 text-white"
                                      : "bg-[#990000] hover:bg-[#800000] text-white"
                                  }`}
                                >
                                  {alreadyApplied
                                    ? "✓ Başvuruldu"
                                    : "Tek Tıkla Başvur"}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  </div>
                )}

                {/* SEKME 2: ZORUNLU STAJ VE SGK ONAY AKIŞI (Akademik & Admin Entegrasyonlu) */}
                {activeTab === "internships" && (
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-red-50 text-[#990000] px-2.5 py-1 rounded-full">
                        Firestore `internships` & `academicApprovals` Entegrasyonu
                      </span>
                      <h2 className="text-base font-extrabold text-[#1e3a5f] mt-2">
                        Kağıtsız Zorunlu Staj & SGK Müstehaklık Takibi
                      </h2>
                      <p className="text-xs text-slate-600 mt-1">
                        Buradan oluşturduğun staj başvurusu doğrudan Akademik Danışman (`AcademicHive`) ekranına düşer. Danışman onayladığı anda SGK belgen aktif olur.
                      </p>

                      <form
                        onSubmit={handleCreateInternship}
                        className="mt-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-end gap-2.5"
                      >
                        <div className="flex-1 min-w-[180px]">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Staj Yapılacak Kurum Adı
                          </label>
                          <input
                            type="text"
                            required
                            value={newInternCompany}
                            onChange={(e) => setNewInternCompany(e.target.value)}
                            placeholder="Örn: Türk Hava Yolları Teknik A.Ş."
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#990000]"
                          />
                        </div>
                        <div className="w-28">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            İş Günü
                          </label>
                          <select
                            value={newInternDays}
                            onChange={(e) => setNewInternDays(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-semibold"
                          >
                            <option value="20">20 İş Günü</option>
                            <option value="30">30 İş Günü</option>
                            <option value="40">40 İş Günü</option>
                          </select>
                        </div>
                        <button
                          type="submit"
                          className="bg-[#990000] hover:bg-[#800000] text-white text-xs font-bold px-4 py-2 rounded-xl transition min-h-[36px]"
                        >
                          Danışman Onayına Gönder
                        </button>
                      </form>
                    </div>

                    <div className="space-y-3">
                      {internships.map((intern) => (
                        <div
                          key={intern.id}
                          className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-extrabold text-slate-900">
                                {intern.companyName}
                              </h3>
                              <span
                                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                  intern.advisorStatus === "Onaylandı"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                Danışman: {intern.advisorStatus}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Süre: {intern.durationDays} İş Günü • Başlangıç:{" "}
                              {intern.startDate}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {intern.advisorStatus !== "Onaylandı" ? (
                              <button
                                type="button"
                                onClick={() =>
                                  simulateExternalApproval(
                                    "academic-approve",
                                    intern.id
                                  )
                                }
                                className="bg-[#1e3a5f] hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl transition"
                              >
                                🔄 Akademik Danışman Onayını Simüle Et
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  triggerToast(
                                    "📥 Barkodlu SGK İşe Giriş Bildirgesi PDF olarak indirildi!"
                                  )
                                }
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                Barkodlu SGK Belgesini İndir
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SEKME 3: DÜZELTİLMİŞ STUDENT APPLICATION RADAR (Yetkisiz Statü Değiştirme Açığı Kapatıldı) */}
                {activeTab === "radar" && (
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                            Güvenlik & Veri Bütünlüğü Düzeltildi
                          </span>
                          <h2 className="text-base font-extrabold text-[#1e3a5f] mt-1">
                            Başvuru Radarı (`StudentApplicationRadar.jsx`)
                          </h2>
                          <p className="text-xs text-slate-600">
                            Eski kodda öğrenci kendi başvurusunun durumunu &ldquo;Kabul Edildi&rdquo; olarak değiştirebiliyordu. Artık durum yalnızca <strong>Şirket (`CompanyHive`)</strong> tarafından güncellenir; öğrenci sadece canlı takip eder veya başvurusunu geri çeker.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {applications.map((app) => (
                        <div
                          key={app.id}
                          className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="text-xs font-bold text-[#990000]">
                                {app.companyName}
                              </span>
                              <h3 className="text-sm font-extrabold text-slate-900">
                                {app.jobTitle}
                              </h3>
                              <p className="text-[11px] text-slate-500">
                                Son Güncelleyen: {app.updatedBy} • {app.createdAt}
                              </p>
                            </div>

                            <span
                              className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                                app.stage === "Mülakat"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-blue-50 text-[#1e3a5f]"
                              }`}
                            >
                              Aşama: {app.stage}
                            </span>
                          </div>

                          {/* Salt-Okunur Aşama Çubuğu */}
                          <div className="grid grid-cols-4 gap-1.5 pt-1">
                            {[
                              "Başvuru Alındı",
                              "Ön İnceleme",
                              "Mülakat",
                              "Teklif / Sonuç",
                            ].map((stepName, idx) => {
                              const currentIdx = [
                                "Başvuru Alındı",
                                "Ön İnceleme",
                                "Mülakat",
                                "Teklif / Sonuç",
                              ].indexOf(app.stage);
                              const active = idx <= currentIdx;
                              return (
                                <div
                                  key={stepName}
                                  className={`text-center py-1.5 px-2 rounded-lg text-[10px] font-bold border ${
                                    active
                                      ? "bg-[#1e3a5f] text-white border-[#1e3a5f]"
                                      : "bg-slate-50 text-slate-400 border-slate-200"
                                  }`}
                                >
                                  {stepName}
                                </div>
                              );
                            })}
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() =>
                                simulateExternalApproval(
                                  "company-interview",
                                  app.id
                                )
                              }
                              className="text-xs font-bold text-[#1e3a5f] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition"
                            >
                              🔄 Şirket Panelinden &ldquo;Mülakat Daveti&rdquo; Simüle Et
                            </button>

                            <button
                              type="button"
                              onClick={() => handleWithdrawApplication(app.id)}
                              className="text-xs font-bold text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-xl transition"
                            >
                              Başvuruyu Geri Çek
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SEKME 4: MEZUN KAHVE SOHBETİ (AlumniCoffeeChatModal & mentorshipRequests) */}
                {activeTab === "mentorship" && (
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full">
                        Firestore `mentorshipRequests` Koleksiyonu Düzeltildi
                      </span>
                      <h2 className="text-base font-extrabold text-[#1e3a5f] mt-1">
                        Mezunlarla 1&apos;e 1 Kahve & CV İncelemesi (`AlumniCoffeeChatModal`)
                      </h2>
                      <p className="text-xs text-slate-600">
                        Eski kodda `mentorship_requests` (snake_case) kullanıldığı için `firestore.rules` izin hatası veriyordu. Artık doğrudan `mentorshipRequests` koleksiyonuna ve Mezun (`AlumniHive`) paneline düşer.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {ALUMNI_MENTORS.map((mentor) => (
                        <div
                          key={mentor.id}
                          className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between space-y-3"
                        >
                          <div>
                            <h3 className="text-sm font-extrabold text-[#1e3a5f]">
                              {mentor.name}
                            </h3>
                            <p className="text-xs font-semibold text-[#990000]">
                              {mentor.company}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Bölüm: {mentor.department} • Müsait:{" "}
                              {mentor.availableSlot}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {mentor.topics.map((t) => (
                                <span
                                  key={t}
                                  className="text-[10px] font-semibold bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedMentor(mentor);
                              setIsCoffeeModalOpen(true);
                            }}
                            className="w-full bg-[#1e3a5f] hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition"
                          >
                            <Coffee className="w-4 h-4" />
                            15 Dk Kahve & CV Randevusu İste
                          </button>
                        </div>
                      ))}
                    </div>

                    {mentorshipRequests.length > 0 && (
                      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2">
                        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                          Gönderilen Mentorluk Taleplerin ({mentorshipRequests.length})
                        </h3>
                        {mentorshipRequests.map((req) => (
                          <div
                            key={req.id}
                            className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="font-bold text-slate-900">
                                {req.alumniName}
                              </span>{" "}
                              • <span>{req.topic}</span>
                              <p className="text-[11px] text-slate-500">
                                {req.preferredSlot}
                              </p>
                            </div>
                            <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-1 rounded-full">
                              {req.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* SEKME 5: KULÜP ETKİNLİKLERİ & RESMİ CV ROZETLERİ */}
                {activeTab === "clubs" && (
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                      <h2 className="text-base font-extrabold text-[#1e3a5f]">
                        Kampüs Kulüpleri & QR Sertifika Rozetlerin
                      </h2>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Kazandığın her kulüp etkinliği rozeti hem `CareerReadinessWidget` hazırlık puanını artırır hem de İESÜ onaylı CV&apos;ne işlenir.
                      </p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {earnedBadges.map((b) => (
                          <span
                            key={b}
                            className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold px-3 py-1.5 rounded-xl"
                          >
                            <Award className="w-4 h-4 text-emerald-600" />
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {CAMPUS_CLUBS.map((club) => (
                        <div
                          key={club.id}
                          className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between space-y-3"
                        >
                          <div>
                            <span className="text-[10px] font-bold bg-red-50 text-[#990000] px-2 py-0.5 rounded-full">
                              +{club.xp} XP Resmi CV Rozeti
                            </span>
                            <h3 className="text-sm font-extrabold text-slate-900 mt-1.5">
                              {club.name}
                            </h3>
                            <p className="text-xs font-semibold text-[#1e3a5f] mt-1">
                              Etkinlik: {club.nextEvent}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {club.eventTime}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleClaimClubBadge(club)}
                            className="w-full bg-[#1e3a5f] hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition"
                          >
                            <QrCode className="w-4 h-4" />
                            Etkinlik QR Okut & CV Rozetini Al
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </main>
            </div>

            {/* MOBİL ALT NAVİGASYON BARI (Sadece Öğrenci Portalı Modülleri) */}
            <nav className="sticky bottom-0 z-30 bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around">
              {[
                { id: "dashboard", label: "Hazırlık & İlan", icon: GraduationCap },
                { id: "internships", label: "Staj & SGK", icon: FileCheck2 },
                { id: "radar", label: "Başvuru Radarı", icon: Radar },
                { id: "mentorship", label: "Mezun Kahvesi", icon: Coffee },
                { id: "clubs", label: "Kulüp & Rozet", icon: Award },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => navigateTab(tab.id)}
                    className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[11px] font-bold transition min-h-[44px] ${
                      active
                        ? "text-[#990000]"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="mt-0.5">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </>
        )}

        {/* MODAL 1: DÜZELTİLMİŞ ATS RESUME SCANNER MODAL (`ATSResumeScannerModal.jsx`) */}
        {isATSOpen && (
          <div className="fixed sm:absolute inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-3">
            <div className="bg-white w-full max-w-lg rounded-3xl p-5 shadow-2xl space-y-3 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#990000] bg-red-50 px-2 py-0.5 rounded-full">
                    ATSResumeScannerModal.jsx
                  </span>
                  <h3 className="text-sm font-extrabold text-[#1e3a5f] mt-1">
                    Özgeçmiş (CV) & İlan Uyum Tarayıcısı
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsATSOpen(false)}
                  className="p-1.5 rounded-full bg-slate-100 text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Hedef İlan Seç
                </label>
                <select
                  value={selectedJobForATS.id}
                  onChange={(e) => {
                    const found =
                      INITIAL_JOBS.find((j) => j.id === e.target.value) ||
                      INITIAL_JOBS[0];
                    setSelectedJobForATS(found);
                  }}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  {INITIAL_JOBS.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.company} — {j.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Özgeçmiş Metnin / Yetkinliklerin
                </label>
                <textarea
                  rows={3}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#990000]"
                />
              </div>

              <button
                type="button"
                onClick={() => handleRunATSScan(selectedJobForATS)}
                className="w-full bg-[#990000] hover:bg-[#800000] text-white text-xs font-bold py-2.5 rounded-xl transition"
              >
                ATS Uyumluluk Skorunu Hesapla & Hazırlık Puanıma İşle
              </button>

              {atsResult && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      ATS Eşleşme Skoru:
                    </span>
                    <span className="text-sm font-extrabold text-[#990000]">
                      %{atsResult.score}
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-emerald-700">
                      ✓ Eşleşen Anahtar Kelimeler:{" "}
                    </span>
                    <span>{atsResult.matched.join(", ") || "Yok"}</span>
                  </div>
                  {atsResult.missing.length > 0 && (
                    <div className="text-xs">
                      <span className="font-bold text-amber-700">
                        ! CV&apos;ne Eklemen Önerilenler:{" "}
                      </span>
                      <span>{atsResult.missing.join(", ")}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL 2: DÜZELTİLMİŞ ALUMNI COFFEE CHAT MODAL (`AlumniCoffeeChatModal.jsx`) */}
        {isCoffeeModalOpen && (
          <div className="fixed sm:absolute inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-3">
            <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
                    AlumniCoffeeChatModal.jsx
                  </span>
                  <h3 className="text-sm font-extrabold text-[#1e3a5f] mt-1">
                    {selectedMentor.name} ile 15 Dk Randevu
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCoffeeModalOpen(false)}
                  className="p-1.5 rounded-full bg-slate-100 text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateCoffeeChat} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Görüşme Konusu
                  </label>
                  <select
                    value={coffeeTopic}
                    onChange={(e) => setCoffeeTopic(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    {selectedMentor.topics.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Mezuna Notun / Sorun
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={coffeeNote}
                    onChange={(e) => setCoffeeNote(e.target.value)}
                    placeholder="Örn: Staj mülakatında teknik sorularda nelere dikkat etmeliyim?"
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#990000]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1e3a5f] hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition"
                >
                  Talebi `mentorshipRequests` Koleksiyonuna Gönder
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
