import React, { useState, useEffect } from 'react';
import useAppStore from '../../store/useAppStore';
import {
  Users,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  Search,
  Filter,
  Award,
  Sparkles,
  GraduationCap,
  Star,
  UserCheck,
  ChevronRight,
  Check,
  FileText,
  RefreshCw,
  SlidersHorizontal,
  Briefcase,
  TrendingUp,
  Percent,
  X,
  ChevronLeft,
  Mail,
  Phone,
  BarChart3,
  CheckSquare,
  Square,
  AlertCircle,
  Eye,
  ArrowUpRight,
  Download
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'iesu_candidate_pool_v1';

const INITIAL_DATA = {
  candidates: [
    // Başvuru (12 candidates)
    { id: 'cand-1', name: 'Zeynep Yılmaz', department: 'Yazılım Mühendisliği', gpa: '3.85', company: 'Trendyol', date: '01.08.2026', stage: 'Başvuru', matchScore: 96, experience: '2 Proje, React Native', lang: 'İngilizce (C1)', phone: '0532 111 2233', email: 'zeynep.y@iesu.edu.tr' },
    { id: 'cand-2', name: 'Ahmet Kaya', department: 'Bilgisayar Mühendisliği', gpa: '3.72', company: 'Aselsan', date: '30.07.2026', stage: 'Başvuru', matchScore: 94, experience: 'C++, Gömülü Sistemler', lang: 'İngilizce (B2)', phone: '0533 222 3344', email: 'ahmet.k@iesu.edu.tr' },
    { id: 'cand-3', name: 'Elif Demir', department: 'Endüstri Mühendisliği', gpa: '3.60', company: 'Logo Yazılım', date: '29.07.2026', stage: 'Başvuru', matchScore: 89, experience: 'Süreç Analizi, Python', lang: 'İngilizce (B2)', phone: '0534 333 4455', email: 'elif.d@iesu.edu.tr' },
    { id: 'cand-4', name: 'Burak Şahin', department: 'Elektrik-Elektronik Müh.', gpa: '3.45', company: 'Turkcell', date: '28.07.2026', stage: 'Başvuru', matchScore: 87, experience: 'Sinyal İşleme, MATLAB', lang: 'İngilizce (B1)', phone: '0535 444 5566', email: 'burak.s@iesu.edu.tr' },
    { id: 'cand-5', name: 'Selin Öztürk', department: 'Yazılım Mühendisliği', gpa: '3.90', company: 'Trendyol', date: '28.07.2026', stage: 'Başvuru', matchScore: 98, experience: 'Node.js, Docker, Kubernetes', lang: 'İngilizce (C2)', phone: '0536 555 6677', email: 'selin.o@iesu.edu.tr' },
    { id: 'cand-6', name: 'Caner Yıldız', department: 'Bilgisayar Mühendisliği', gpa: '3.30', company: 'Aselsan', date: '27.07.2026', stage: 'Başvuru', matchScore: 82, experience: 'FPGA, Verilog', lang: 'İngilizce (B1)', phone: '0537 666 7788', email: 'caner.y@iesu.edu.tr' },
    { id: 'cand-7', name: 'Merve Aydın', department: 'Veri Bilimi ve Analitiği', gpa: '3.78', company: 'Logo Yazılım', date: '26.07.2026', stage: 'Başvuru', matchScore: 92, experience: 'Pandas, SQL, ML', lang: 'İngilizce (B2)', phone: '0538 777 8899', email: 'merve.a@iesu.edu.tr' },
    { id: 'cand-8', name: 'Emre Çelik', department: 'Yazılım Mühendisliği', gpa: '3.50', company: 'Turkcell', date: '25.07.2026', stage: 'Başvuru', matchScore: 85, experience: 'Spring Boot, Java', lang: 'İngilizce (B2)', phone: '0539 888 9900', email: 'emre.c@iesu.edu.tr' },
    { id: 'cand-9', name: 'Deniz Arslan', department: 'Endüstri Mühendisliği', gpa: '3.68', company: 'Trendyol', date: '24.07.2026', stage: 'Başvuru', matchScore: 88, experience: 'Lojistik Optimizasyonu', lang: 'İngilizce (C1)', phone: '0540 999 0011', email: 'deniz.a@iesu.edu.tr' },
    { id: 'cand-10', name: 'Alperen Polat', department: 'Siber Güvenlik Mühendisliği', gpa: '3.62', company: 'Turkcell', date: '23.07.2026', stage: 'Başvuru', matchScore: 90, experience: 'Penetrasyon Testi, Wireshark', lang: 'İngilizce (B2)', phone: '0541 123 4567', email: 'alperen.p@iesu.edu.tr' },
    { id: 'cand-11', name: 'Gizem Aksoy', department: 'Yazılım Mühendisliği', gpa: '3.40', company: 'Logo Yazılım', date: '22.07.2026', stage: 'Başvuru', matchScore: 84, experience: 'Vue.js, Tailwind', lang: 'İngilizce (B1)', phone: '0542 234 5678', email: 'gizem.a@iesu.edu.tr' },
    { id: 'cand-12', name: 'Ömer Faruk', department: 'Bilgisayar Mühendisliği', gpa: '3.75', company: 'Aselsan', date: '21.07.2026', stage: 'Başvuru', matchScore: 91, experience: 'ROS, Otonom Sistemler', lang: 'İngilizce (B2)', phone: '0543 345 6789', email: 'omer.f@iesu.edu.tr' },

    // Ön Eleme (8 candidates)
    { id: 'cand-13', name: 'Kaan Tekin', department: 'Yazılım Mühendisliği', gpa: '3.88', company: 'Trendyol', date: '20.07.2026', stage: 'Ön Eleme', matchScore: 95, experience: 'Fullstack Dev, Go', lang: 'İngilizce (C1)', phone: '0544 456 7890', email: 'kaan.t@iesu.edu.tr' },
    { id: 'cand-14', name: 'Gamze Ulusoy', department: 'Bilgisayar Mühendisliği', gpa: '3.80', company: 'Aselsan', date: '19.07.2026', stage: 'Ön Eleme', matchScore: 93, experience: 'Yapay Zeka, PyTorch', lang: 'İngilizce (C1)', phone: '0545 567 8901', email: 'gamze.u@iesu.edu.tr' },
    { id: 'cand-15', name: 'Serkan Kurt', department: 'Elektrik-Elektronik Müh.', gpa: '3.55', company: 'Turkcell', date: '18.07.2026', stage: 'Ön Eleme', matchScore: 86, experience: '5G Ağları, RF Tasarım', lang: 'İngilizce (B2)', phone: '0546 678 9012', email: 'serkan.k@iesu.edu.tr' },
    { id: 'cand-16', name: 'Buse Solmaz', department: 'Yazılım Mühendisliği', gpa: '3.70', company: 'Logo Yazılım', date: '17.07.2026', stage: 'Ön Eleme', matchScore: 90, experience: 'C# .NET Core, Microservices', lang: 'İngilizce (B2)', phone: '0547 789 0123', email: 'buse.s@iesu.edu.tr' },
    { id: 'cand-17', name: 'Tarkan Öz', department: 'Yazılım Mühendisliği', gpa: '3.65', company: 'Trendyol', date: '16.07.2026', stage: 'Ön Eleme', matchScore: 89, experience: 'Frontend, React, Next.js', lang: 'İngilizce (B2)', phone: '0548 890 1234', email: 'tarkan.o@iesu.edu.tr' },
    { id: 'cand-18', name: 'Ezgi Varol', department: 'Endüstri Mühendisliği', gpa: '3.76', company: 'Aselsan', date: '15.07.2026', stage: 'Ön Eleme', matchScore: 91, experience: 'Tedarik Zinciri Yönetimi', lang: 'İngilizce (C1)', phone: '0549 901 2345', email: 'ezgi.v@iesu.edu.tr' },
    { id: 'cand-19', name: 'Mehmet Yavaş', department: 'Bilgisayar Mühendisliği', gpa: '3.42', company: 'Turkcell', date: '14.07.2026', stage: 'Ön Eleme', matchScore: 83, experience: 'Android Native, Kotlin', lang: 'İngilizce (B1)', phone: '0550 012 3456', email: 'mehmet.y@iesu.edu.tr' },
    { id: 'cand-20', name: 'Nazlı Sever', department: 'Yazılım Mühendisliği', gpa: '3.92', company: 'Logo Yazılım', date: '13.07.2026', stage: 'Ön Eleme', matchScore: 97, experience: 'Cloud Architecture, AWS', lang: 'İngilizce (C2)', phone: '0551 123 4567', email: 'nazli.s@iesu.edu.tr' },

    // Mülakat (5 candidates)
    { id: 'cand-21', name: 'Onur Yılmaz', department: 'Bilgisayar Mühendisliği', gpa: '3.86', company: 'Aselsan', date: '12.07.2026', stage: 'Mülakat', matchScore: 96, experience: 'Savunma Sanayi Projesi, C++', lang: 'İngilizce (C1)', phone: '0552 234 5678', email: 'onur.y@iesu.edu.tr' },
    { id: 'cand-22', name: 'Seda Çetin', department: 'Yazılım Mühendisliği', gpa: '3.82', company: 'Trendyol', date: '11.07.2026', stage: 'Mülakat', matchScore: 94, experience: 'High Traffic Systems, Go', lang: 'İngilizce (C1)', phone: '0553 345 6789', email: 'seda.c@iesu.edu.tr' },
    { id: 'cand-23', name: 'Fatih Güler', department: 'Veri Bilimi ve Analitiği', gpa: '3.79', company: 'Turkcell', date: '10.07.2026', stage: 'Mülakat', matchScore: 92, experience: 'Big Data, Spark, Kafka', lang: 'İngilizce (B2)', phone: '0554 456 7890', email: 'fatih.g@iesu.edu.tr' },
    { id: 'cand-24', name: 'Derya Kaan', department: 'Yazılım Mühendisliği', gpa: '3.74', company: 'Logo Yazılım', date: '09.07.2026', stage: 'Mülakat', matchScore: 89, experience: 'ERP Modül Geliştirme, SQL', lang: 'İngilizce (B2)', phone: '0555 567 8901', email: 'derya.k@iesu.edu.tr' },
    { id: 'cand-25', name: 'Kerem Sönmez', department: 'Siber Güvenlik Mühendisliği', gpa: '3.85', company: 'Aselsan', date: '08.07.2026', stage: 'Mülakat', matchScore: 95, experience: 'Kriptografi, Network Sec', lang: 'İngilizce (C1)', phone: '0556 678 9012', email: 'kerem.s@iesu.edu.tr' },

    // Kabul (3 candidates)
    { id: 'cand-26', name: 'Aylin Bulut', department: 'Yazılım Mühendisliği', gpa: '3.95', company: 'Trendyol', date: '05.07.2026', stage: 'Kabul', matchScore: 99, experience: 'TÜBİTAK Derecesi, Microservices', lang: 'İngilizce (C2)', phone: '0557 789 0123', email: 'aylin.b@iesu.edu.tr' },
    { id: 'cand-27', name: 'Bora Yaman', department: 'Bilgisayar Mühendisliği', gpa: '3.91', company: 'Aselsan', date: '04.07.2026', stage: 'Kabul', matchScore: 97, experience: 'TEKNOFEST 1.liği, Avionics', lang: 'İngilizce (C1)', phone: '0558 890 1234', email: 'bora.y@iesu.edu.tr' },
    { id: 'cand-28', name: 'Ceren Kozan', department: 'Yazılım Mühendisliği', gpa: '3.87', company: 'Logo Yazılım', date: '03.07.2026', stage: 'Kabul', matchScore: 95, experience: 'SaaS Geliştirme, React & C#', lang: 'İngilizce (C1)', phone: '0559 901 2345', email: 'ceren.k@iesu.edu.tr' },

    // Staj Başlangıcı (2 candidates)
    { id: 'cand-29', name: 'Volkan Şimşek', department: 'Bilgisayar Mühendisliği', gpa: '3.94', company: 'Turkcell', date: '01.07.2026', stage: 'Staj Başlangıcı', matchScore: 98, experience: '5G Core Dev, Python, Linux', lang: 'İngilizce (C2)', phone: '0560 012 3456', email: 'volkan.s@iesu.edu.tr' },
    { id: 'cand-30', name: 'Sinem Karaca', department: 'Yazılım Mühendisliği', gpa: '3.89', company: 'Trendyol', date: '30.06.2026', stage: 'Staj Başlangıcı', matchScore: 96, experience: 'E-ticaret Platform Mimarisi', lang: 'İngilizce (C1)', phone: '0561 123 4567', email: 'sinem.k@iesu.edu.tr' }
  ],

  firmRequests: [
    { id: 'freq-1', firmName: 'Trendyol', position: 'Backend Developer Stajyeri', count: 5, departmentPreference: 'Yazılım Mühendisliği, Bilgisayar Müh.', applicantCount: 18, status: 'Aktif', urgency: 'Yüksek', matchRatio: '%96', details: 'Node.js/Go ve mikroservis mimarileri deneyimi olan stajyer geliştiriciler aranıyor.' },
    { id: 'freq-2', firmName: 'Aselsan', position: 'Gömülü Sistemler Mühendisi Adayı', count: 4, departmentPreference: 'Bilgisayar Müh., Elektrik-Elektronik', applicantCount: 14, status: 'Aktif', urgency: 'Kritik', matchRatio: '%94', details: 'C/C++ ve gömülü yazılım alanında akademik veya proje tecrübesi gereklidir.' },
    { id: 'freq-3', firmName: 'Logo Yazılım', position: 'Fullstack Web Developer', count: 3, departmentPreference: 'Yazılım Mühendisliği', applicantCount: 12, status: 'Aktif', urgency: 'Orta', matchRatio: '%90', details: 'React ve C# .NET altyapısına hakim stajyer adaylar tercih edilmektedir.' },
    { id: 'freq-4', firmName: 'Turkcell', position: 'Veri Analisti & Siber Güvenlik', count: 6, departmentPreference: 'Veri Bilimi, Siber Güvenlik, YM', applicantCount: 22, status: 'Aktif', urgency: 'Yüksek', matchRatio: '%92', details: 'SQL, Python ve ağ güvenliği temel bilgisine sahip uzun dönem stajyerler.' }
  ],

  matchScores: [
    {
      id: 'match-1',
      candidateName: 'Selin Öztürk',
      candidateDept: 'Yazılım Mühendisliği',
      gpa: '3.90',
      companyName: 'Trendyol',
      position: 'Backend Developer Stajyeri',
      matchScore: 98,
      factors: {
        deptFit: 100,
        gpaFit: 98,
        internExp: 95,
        langFit: 100
      }
    },
    {
      id: 'match-2',
      candidateName: 'Bora Yaman',
      candidateDept: 'Bilgisayar Mühendisliği',
      gpa: '3.91',
      companyName: 'Aselsan',
      position: 'Gömülü Sistemler Mühendisi Adayı',
      matchScore: 97,
      factors: {
        deptFit: 100,
        gpaFit: 98,
        internExp: 96,
        langFit: 94
      }
    },
    {
      id: 'match-3',
      candidateName: 'Aylin Bulut',
      candidateDept: 'Yazılım Mühendisliği',
      gpa: '3.95',
      companyName: 'Trendyol',
      position: 'Backend Developer Stajyeri',
      matchScore: 96,
      factors: {
        deptFit: 98,
        gpaFit: 100,
        internExp: 92,
        langFit: 95
      }
    },
    {
      id: 'match-4',
      candidateName: 'Volkan Şimşek',
      candidateDept: 'Bilgisayar Mühendisliği',
      gpa: '3.94',
      companyName: 'Turkcell',
      position: 'Veri Analisti & Siber Güvenlik',
      matchScore: 95,
      factors: {
        deptFit: 95,
        gpaFit: 99,
        internExp: 94,
        langFit: 92
      }
    },
    {
      id: 'match-5',
      candidateName: 'Nazlı Sever',
      candidateDept: 'Yazılım Mühendisliği',
      gpa: '3.92',
      companyName: 'Logo Yazılım',
      position: 'Fullstack Web Developer',
      matchScore: 93,
      factors: {
        deptFit: 96,
        gpaFit: 98,
        internExp: 88,
        langFit: 90
      }
    }
  ]
};

const PIPELINE_STAGES = [
  { id: 'Başvuru', label: 'Başvuru', bgHeader: 'from-blue-50 to-indigo-50/80', borderHeader: 'border-blue-200/80', textHeader: 'text-blue-900', badgeBg: 'bg-blue-600 text-white' },
  { id: 'Ön Eleme', label: 'Ön Eleme', bgHeader: 'from-amber-50 to-orange-50/80', borderHeader: 'border-amber-200/80', textHeader: 'text-amber-900', badgeBg: 'bg-amber-500 text-white' },
  { id: 'Mülakat', label: 'Mülakat', bgHeader: 'from-purple-50 to-fuchsia-50/80', borderHeader: 'border-purple-200/80', textHeader: 'text-purple-900', badgeBg: 'bg-purple-600 text-white' },
  { id: 'Kabul', label: 'Kabul', bgHeader: 'from-emerald-50 to-teal-50/80', borderHeader: 'border-emerald-200/80', textHeader: 'text-emerald-900', badgeBg: 'bg-emerald-600 text-white' },
  { id: 'Staj Başlangıcı', label: 'Staj Başlangıcı', bgHeader: 'from-red-50 to-rose-100/80', borderHeader: 'border-red-200/80', textHeader: 'text-red-950', badgeBg: 'bg-[#990000] text-white' }
];

export default function CMSCandidatePool() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.candidates && parsed.firmRequests) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("LocalStorage load error:", e);
    }
    return INITIAL_DATA;
  });

  // LocalStorage save effect
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("LocalStorage save error:", e);
    }
  }, [data]);

  // Synchronize applications from useAppStore
  const storeApplications = useAppStore(state => state.applications) || [];
  useEffect(() => {
    if (storeApplications.length > 0) {
      setData(prev => {
        const existingIds = new Set(prev.candidates.map(c => c.id));
        const newOnes = [];
        storeApplications.forEach(app => {
          if (!existingIds.has(app.id)) {
            newOnes.push({
              id: app.id,
              name: app.applicantName || 'Öğrenci Adayı',
              department: app.applicantDept || 'Bilgisayar Mühendisliği',
              gpa: '3.50',
              company: app.company || 'Genel',
              date: app.date || new Date().toLocaleDateString('tr-TR'),
              stage: app.status === 'Mülakat' ? 'Mülakat' : (app.status === 'Kabul Edildi' || app.status === 'Onaylandı') ? 'Kabul' : 'Başvuru',
              matchScore: 95,
              experience: (app.coverLetter || '').slice(0, 45) + '...',
              lang: 'İngilizce (B2)',
              phone: app.applicantPhone || '0555 000 0000',
              email: app.applicantEmail || 'aday@esenyurt.edu.tr'
            });
          }
        });
        if (newOnes.length > 0) {
          return {
            ...prev,
            candidates: [...newOnes, ...prev.candidates]
          };
        }
        return prev;
      });
    }
  }, [storeApplications]);

  // Filters & State
  const [pipelineSearch, setPipelineSearch] = useState('');
  const [pipelineCompanyFilter, setPipelineCompanyFilter] = useState('Tümü');
  const [pipelineDeptFilter, setPipelineDeptFilter] = useState('Tümü');

  // Bulk dispatch form state
  const [selectedFirm, setSelectedFirm] = useState('Trendyol');
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [bulkNote, setBulkNote] = useState('');
  const [bulkSearch, setBulkSearch] = useState('');
  const [bulkDeptFilter, setBulkDeptFilter] = useState('Tümü');

  // Modal & Toast states
  const [selectedCandidateDetail, setSelectedCandidateDetail] = useState(null);
  const [selectedFirmDetail, setSelectedFirmDetail] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleExportCandidatesExcel = () => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += `İSTANBUL ESENYURT ÜNİVERSİTESİ - ADAY HAVUZU VE İK YÖNLENDİRME RAPORU\n`;
    csvContent += `Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')}\n\n`;
    csvContent += `Aday ID;Adı Soyadı;Bölüm;Hedef / Başvurulan Firma;Mevcut Aşama;AI Uyum Skoru;Tecrübe & Beceriler;Yabancı Dil;E-posta;Telefon\n`;

    data.candidates.forEach(c => {
      csvContent += `${c.id};"${c.name}";"${c.department}";"${c.company}";"${c.stage}";"%${c.matchScore}";"${c.experience}";"${c.lang}";"${c.email}";"${c.phone}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `IESU_Aday_Havuzu_Raporu_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Aday Havuzu detaylı Excel raporu (.CSV) indirildi.");
  };

  // Helper to reset data
  const handleResetData = () => {
    if (window.confirm("Aday havuzu verilerini varsayılana sıfırlamak istediğinize emin misiniz?")) {
      setData(INITIAL_DATA);
      setSelectedCandidates([]);
      showToast("Aday havuzu verileri başarıyla sıfırlandı.");
    }
  };

  // Move candidate to another stage
  const handleMoveStage = (candId, newStage) => {
    const updatedCandidates = data.candidates.map(c => 
      c.id === candId ? { ...c, stage: newStage } : c
    );
    const candidateName = data.candidates.find(c => c.id === candId)?.name || 'Aday';
    setData(prev => ({ ...prev, candidates: updatedCandidates }));
    showToast(`${candidateName} statüsü "${newStage}" olarak güncellendi.`);
  };

  // Bulk send submit handler
  const handleBulkSubmit = (e) => {
    e.preventDefault();
    if (selectedCandidates.length === 0) {
      if (window.toast?.warn) window.toast.warn("Lütfen en az bir aday seçiniz.");
      else if (window.toast?.info) window.toast.info("Lütfen en az bir aday seçiniz.");
      else alert("Lütfen en az bir aday seçiniz.");
      return;
    }

    // Update selected candidates to belong to the selected firm if needed or mark as forwarded
    const updatedCandidates = data.candidates.map(c => {
      if (selectedCandidates.includes(c.id)) {
        return {
          ...c,
          company: selectedFirm,
          stage: c.stage === 'Başvuru' ? 'Ön Eleme' : c.stage
        };
      }
      return c;
    });

    setData(prev => ({ ...prev, candidates: updatedCandidates }));
    
    const count = selectedCandidates.length;
    showToast(`${count} aday ${selectedFirm} firmasına başarıyla yönlendirildi!`);
    setSelectedCandidates([]);
    setBulkNote('');
  };

  // Toggle candidate selection for bulk form
  const toggleSelectCandidate = (candId) => {
    setSelectedCandidates(prev => 
      prev.includes(candId) ? prev.filter(id => id !== candId) : [...prev, candId]
    );
  };

  // Select all or unselect all visible candidates in bulk dispatch form
  const toggleSelectAllCandidates = (filteredList) => {
    const visibleIds = filteredList.map(c => c.id);
    const allSelected = visibleIds.every(id => selectedCandidates.includes(id));
    if (allSelected) {
      setSelectedCandidates(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
      setSelectedCandidates(prev => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  // Scroll to bulk dispatch section and preselect firm
  const handleQuickSendToFirm = (firmName) => {
    setSelectedFirm(firmName);
    const el = document.getElementById('bulk-dispatch-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filtered lists for options
  const allDepartments = Array.from(new Set(data.candidates.map(c => c.department))).sort();
  const allCompanies = Array.from(new Set([
    'Trendyol', 'Aselsan', 'Logo Yazılım', 'Turkcell', 'Baykar Teknoloji', ...data.candidates.map(c => c.company)
  ])).sort();

  // Pipeline filtered candidates
  const filteredPipelineCandidates = data.candidates.filter(c => {
    const matchName = c.name.toLowerCase().includes(pipelineSearch.toLowerCase()) ||
                      c.department.toLowerCase().includes(pipelineSearch.toLowerCase()) ||
                      c.experience.toLowerCase().includes(pipelineSearch.toLowerCase());
    const matchCompany = pipelineCompanyFilter === 'Tümü' || c.company === pipelineCompanyFilter;
    const matchDept = pipelineDeptFilter === 'Tümü' || c.department === pipelineDeptFilter;
    return matchName && matchCompany && matchDept;
  });

  // Bulk form candidates filter
  const bulkCandidatesList = data.candidates.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(bulkSearch.toLowerCase()) ||
                        c.department.toLowerCase().includes(bulkSearch.toLowerCase());
    const matchDept = bulkDeptFilter === 'Tümü' || c.department === bulkDeptFilter;
    return matchSearch && matchDept;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 animate-bounce">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Sistem Bildirimi</p>
            <p className="text-sm font-semibold">{toastMessage}</p>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="ml-3 text-slate-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-red-50/80 via-white to-red-50/40 p-5 rounded-3xl border border-red-100/80 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#990000] to-red-800 text-white flex items-center justify-center shadow-md shadow-red-900/10 shrink-0">
            <Users size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#990000] text-white">
                Kurumsal İK & Kariyer Radarı
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 leading-tight mt-0.5">
              Aday Havuzu & Takip Merkezi
            </h2>
            <p className="text-xs text-slate-500 font-medium">Anlaşmalı firma talepleri, aday uyum skorları ve süreç yönetimi.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCandidatesExcel}
            className="flex items-center gap-2 bg-[#990000] hover:bg-red-800 text-white px-4 py-2.5 rounded-2xl text-xs font-black transition-all shadow-md cursor-pointer"
          >
            <Download size={14} />
            <span>Aday Havuzunu Excele Aktar (.CSV)</span>
          </button>

          <button
            onClick={handleResetData}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border border-slate-200 shadow-sm cursor-pointer"
            title="Varsayılan Verileri Sıfırla"
          >
            <RefreshCw size={14} className="text-[#990000]" />
            <span>Verileri Sıfırla</span>
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:border-red-200 transition">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Toplam Kayıtlı Aday</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{data.candidates.length}</h3>
            <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <TrendingUp size={12} /> +%14 Aktif Büyüme
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:border-red-200 transition">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mülakattaki Adaylar</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {data.candidates.filter(c => c.stage === 'Mülakat').length}
            </h3>
            <p className="text-[11px] text-purple-600 font-bold mt-1">Aktif Mülakat Aşamasında</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold border border-purple-100">
            <Clock size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:border-red-200 transition">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kabul & Staj Başlangıcı</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {data.candidates.filter(c => c.stage === 'Kabul' || c.stage === 'Staj Başlangıcı').length}
            </h3>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">Başarı Oranı %88</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-100">
            <UserCheck size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:border-red-200 transition">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Açık Firma Talepleri</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{data.firmRequests.length}</h3>
            <p className="text-[11px] text-[#990000] font-bold mt-1">4 Firma Öncelikli Kontenjan</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#990000] flex items-center justify-center font-bold border border-red-100">
            <Building2 size={24} />
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------
          SECTION 1: PIPELINE GÖRÜNÜMÜ (KANBAN COLUMNS)
         ---------------------------------------------------- */}
      <section className="bg-slate-50/60 p-6 rounded-2xl border border-slate-200/80 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#990000]"></span>
              <h2 className="text-xl font-bold text-slate-900">1. Pipeline Görünümü</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Adayların aşama süreçlerini takip edin ve dinamik olarak güncelleyin.
            </p>
          </div>

          {/* Filters for Pipeline */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Aday, bölüm ara..."
                value={pipelineSearch}
                onChange={(e) => setPipelineSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#990000] focus:border-transparent outline-none w-48 shadow-sm"
              />
            </div>

            <select
              value={pipelineCompanyFilter}
              onChange={(e) => setPipelineCompanyFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-[#990000] outline-none shadow-sm cursor-pointer"
            >
              <option value="Tümü">Tüm Firmalar</option>
              {allCompanies.map(comp => (
                <option key={comp} value={comp}>{comp}</option>
              ))}
            </select>

            <select
              value={pipelineDeptFilter}
              onChange={(e) => setPipelineDeptFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-[#990000] outline-none shadow-sm cursor-pointer"
            >
              <option value="Tümü">Tüm Bölümler</option>
              {allDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Alt Alta Ferah ve Geniş Aşama Panelleri */}
        <div className="space-y-4">
          {PIPELINE_STAGES.map((stage) => {
            const stageCandidates = filteredPipelineCandidates.filter(c => c.stage === stage.id);
            return (
              <div 
                key={stage.id} 
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden"
              >
                {/* Section Banner Header */}
                <div className={`p-4 sm:p-5 bg-gradient-to-r ${stage.bgHeader} border-b ${stage.borderHeader} flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${stage.badgeBg}`}></span>
                    <h3 className={`font-black text-sm uppercase tracking-wider ${stage.textHeader}`}>
                      {stage.label} Aşaması
                    </h3>
                    <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                      ({stageCandidates.length} Kayıtlı Aday)
                    </span>
                  </div>
                  <span className={`px-3 py-1 text-xs font-black rounded-full ${stage.badgeBg} shadow-sm`}>
                    {stageCandidates.length} Aday
                  </span>
                </div>

                {/* Candidate Cards Grid (Alt Alta Paneller İçinde Yan Yana Kartlar) */}
                <div className="p-4 sm:p-5">
                  {stageCandidates.length === 0 ? (
                    <div className="py-8 flex flex-col items-center justify-center text-center border border-dashed border-slate-200 rounded-2xl text-slate-400 bg-slate-50/50">
                      <Users size={28} className="mb-2 opacity-40 text-slate-400" />
                      <p className="text-xs font-bold text-slate-400">Bu aşamada henüz aday bulunmuyor.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {stageCandidates.map((cand) => (
                        <div
                          key={cand.id}
                          className="p-4 bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-red-200 hover:shadow-lg transition-all group relative cursor-pointer space-y-3"
                          onClick={() => setSelectedCandidateDetail(cand)}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4 className="font-black text-slate-900 text-sm group-hover:text-[#990000] transition-colors">
                                {cand.name}
                              </h4>
                              <p className="text-xs text-slate-600 font-medium mt-0.5">
                                {cand.department}
                              </p>
                            </div>
                            <span className="text-[10px] font-black px-2.5 py-1 rounded-xl bg-red-50 text-[#990000] border border-red-100 shrink-0 flex items-center gap-1 shadow-2xs">
                              <Sparkles size={11} /> %{cand.matchScore} Uyum
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs text-slate-500 pt-2.5 border-t border-slate-200/60">
                            <span className="font-bold text-slate-800 flex items-center gap-1.5">
                              <Building2 size={14} className="text-[#990000]" />
                              {cand.company}
                            </span>
                            <span className="text-slate-400 font-medium">{cand.date}</span>
                          </div>

                          {/* Quick stage changer action menu */}
                          <div 
                            className="pt-2 border-t border-dashed border-slate-200/80 flex items-center justify-between gap-2 text-xs"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="text-[11px] text-slate-500 font-bold">Aşamayı Değiştir:</span>
                            <select
                              value={cand.stage}
                              onChange={(e) => handleMoveStage(cand.id, e.target.value)}
                              className="bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-2.5 py-1 focus:ring-2 focus:ring-[#990000] outline-none shadow-2xs cursor-pointer"
                            >
                              {PIPELINE_STAGES.map(s => (
                                <option key={s.id} value={s.id}>{s.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION 2: FİRMA TALEP YÖNETİMİ (TABLE)
         ---------------------------------------------------- */}
      <section className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#990000]"></span>
              <h2 className="text-xl font-black text-slate-900">2. Firma Talep Yönetimi</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Anlaşmalı firmaların stajyer/aday talepleri, kontenjanları ve başvuru durumları.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#990000] font-black bg-red-50 px-3 py-1.5 rounded-xl border border-red-100">
              Toplam {data.firmRequests.length} Açık Talep
            </span>
          </div>
        </div>

        {/* Demands Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#990000] to-red-900 text-white text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Firma Adı</th>
                <th className="py-3.5 px-4">İstenen Pozisyon</th>
                <th className="py-3.5 px-4 text-center">Adet</th>
                <th className="py-3.5 px-4">Bölüm Tercihi</th>
                <th className="py-3.5 px-4 text-center">Başvuru Sayısı</th>
                <th className="py-3.5 px-4 text-center">Durum</th>
                <th className="py-3.5 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {data.firmRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-[#990000] font-black flex items-center justify-center shrink-0 border border-red-100">
                        {req.firmName.charAt(0)}
                      </div>
                      <div>
                        <span>{req.firmName}</span>
                        <span className="block text-[10px] text-slate-400 font-normal">Uyum Oranı: {req.matchRatio}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {req.position}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg">
                      {req.count} Kişi
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                    {req.departmentPreference}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-blue-600">
                    {req.applicantCount} Aday
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        req.status === 'Aktif'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${req.status === 'Aktif' ? 'bg-emerald-600' : 'bg-slate-400'}`}></span>
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleQuickSendToFirm(req.firmName)}
                        className="px-3 py-1.5 bg-[#990000] hover:bg-[#770000] text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <Send size={12} />
                        <span>Aday Gönder</span>
                      </button>
                      <button
                        onClick={() => setSelectedFirmDetail(req)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all flex items-center gap-1"
                      >
                        <Eye size={12} />
                        <span>Detay</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION 3: TOPLU ADAY GÖNDERİMİ (FORM)
         ---------------------------------------------------- */}
      <section id="bulk-dispatch-section" className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#990000]"></span>
            <h2 className="text-xl font-bold text-slate-900">3. Toplu Aday Gönderimi</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Seçilen adayları toplu olarak hedef firmaya yönlendirin ve başvuru sürecini başlatın.
          </p>
        </div>

        <form onSubmit={handleBulkSubmit} className="space-y-6">
          {/* Form Header Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200/70">
            {/* Firm Dropdown */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. Hedef Firma Seçimi <span className="text-[#990000]">*</span>
              </label>
              <select
                value={selectedFirm}
                onChange={(e) => setSelectedFirm(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#990000] focus:border-transparent outline-none shadow-sm"
              >
                {allCompanies.map(comp => (
                  <option key={comp} value={comp}>{comp}</option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500">
                Adayların CV ve profil dosyaları ilgili firmanın insan kaynakları paneline iletilecektir.
              </p>
            </div>

            {/* Optional Note */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. İletim Notu / Açıklama (Opsiyonel)
              </label>
              <input
                type="text"
                placeholder="Örn: 2026 Güz Dönemi Öncelikli Stajyer Aday Listesi"
                value={bulkNote}
                onChange={(e) => setBulkNote(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#990000] focus:border-transparent outline-none shadow-sm"
              />
              <p className="text-[11px] text-slate-500">
                Firmaya gönderilecek resmi e-posta ve panel bildirimine eklenecektir.
              </p>
            </div>
          </div>

          {/* Candidate Selection Section */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  3. Aday Seçimi ({selectedCandidates.length} Aday Seçildi)
                </h3>
                <button
                  type="button"
                  onClick={() => toggleSelectAllCandidates(bulkCandidatesList)}
                  className="text-xs font-bold text-[#990000] hover:underline"
                >
                  {bulkCandidatesList.every(c => selectedCandidates.includes(c.id)) ? 'Tüm Seçimleri Kaldır' : 'Tümünü Seç'}
                </button>
              </div>

              {/* Filters for Candidate Table */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="text"
                    placeholder="Aday ismi ile filtrele..."
                    value={bulkSearch}
                    onChange={(e) => setBulkSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#990000] w-44"
                  />
                </div>

                <select
                  value={bulkDeptFilter}
                  onChange={(e) => setBulkDeptFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none focus:ring-1 focus:ring-[#990000]"
                >
                  <option value="Tümü">Tüm Bölümler</option>
                  {allDepartments.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Candidate Checklist Table */}
            <div className="max-h-72 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 custom-scrollbar">
              {bulkCandidatesList.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Arama kriterlerine uygun aday bulunamadı.
                </div>
              ) : (
                bulkCandidatesList.map((cand) => {
                  const isChecked = selectedCandidates.includes(cand.id);
                  return (
                    <div
                      key={cand.id}
                      onClick={() => toggleSelectCandidate(cand.id)}
                      className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                        isChecked ? 'bg-red-50/40 hover:bg-red-50/70' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by div onClick
                          className="w-4 h-4 text-[#990000] border-slate-300 rounded focus:ring-[#990000] cursor-pointer"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{cand.name}</p>
                          <p className="text-[11px] text-slate-500">{cand.department} • Staj/Tecrübe: {cand.experience}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                          <Sparkles size={11} /> %{cand.matchScore} Uyum
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-medium text-[11px]">
                          {cand.stage}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCandidateDetail(cand);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
                          title="Aday Detayı Göster"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setSelectedCandidates([])}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
            >
              Seçimleri Temizle
            </button>
            <button
              type="submit"
              disabled={selectedCandidates.length === 0}
              className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-md ${
                selectedCandidates.length > 0
                  ? 'bg-[#990000] hover:bg-[#770000] text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send size={14} />
              <span>Seçili {selectedCandidates.length} Adayı {selectedFirm} Firmasına Gönder</span>
            </button>
          </div>
        </form>
      </section>

      {/* ----------------------------------------------------
          MODAL 1: CANDIDATE DETAIL MODAL
         ---------------------------------------------------- */}
      {selectedCandidateDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 bg-slate-900 text-white flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#990000] text-white font-black text-lg flex items-center justify-center">
                  {selectedCandidateDetail.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{selectedCandidateDetail.name}</h3>
                  <p className="text-xs text-slate-300">{selectedCandidateDetail.department}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidateDetail(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3 bg-red-50/60 p-4 rounded-2xl border border-red-100">
                <div>
                  <p className="text-slate-500 font-bold uppercase text-[10px]">Staj Başvuru Türü</p>
                  <p className="text-sm font-black text-slate-900">Zorunlu / Kurumsal Staj</p>
                </div>
                <div>
                  <p className="text-slate-500 font-bold uppercase text-[10px]">Mevcut Aşama</p>
                  <p className="text-sm font-black text-[#990000]">{selectedCandidateDetail.stage}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-bold uppercase text-[10px]">Başvurduğu Firma</p>
                  <p className="text-sm font-bold text-slate-800">{selectedCandidateDetail.company}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-bold uppercase text-[10px]">Aday Uyum Skoru</p>
                  <p className="text-sm font-black text-emerald-600">%{selectedCandidateDetail.matchScore}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-slate-800 uppercase text-[10px]">İletişim & Yetkinlikler</p>
                <div className="space-y-1.5 text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                  <p className="flex items-center gap-2"><Mail size={14} className="text-slate-400"/> {selectedCandidateDetail.email}</p>
                  <p className="flex items-center gap-2"><Phone size={14} className="text-slate-400"/> {selectedCandidateDetail.phone}</p>
                  <p className="flex items-center gap-2"><GraduationCap size={14} className="text-slate-400"/> {selectedCandidateDetail.lang}</p>
                  <p className="flex items-center gap-2"><FileText size={14} className="text-slate-400"/> {selectedCandidateDetail.experience}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-slate-800 uppercase text-[10px]">Aşamayı Güncelle</label>
                <select
                  value={selectedCandidateDetail.stage}
                  onChange={(e) => {
                    handleMoveStage(selectedCandidateDetail.id, e.target.value);
                    setSelectedCandidateDetail(prev => ({ ...prev, stage: e.target.value }));
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#990000] outline-none"
                >
                  {PIPELINE_STAGES.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedCandidateDetail(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          MODAL 2: FIRM REQUEST DETAIL MODAL
         ---------------------------------------------------- */}
      {selectedFirmDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 bg-slate-900 text-white flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-red-400">Firma Talep Detayı</span>
                <h3 className="text-lg font-bold">{selectedFirmDetail.firmName}</h3>
              </div>
              <button
                onClick={() => setSelectedFirmDetail(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="space-y-2">
                <p className="text-slate-400 font-bold uppercase text-[10px]">Pozisyon</p>
                <p className="text-sm font-bold text-slate-900">{selectedFirmDetail.position}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <p className="text-slate-400 font-bold uppercase text-[10px]">Kontenjan</p>
                  <p className="text-xs font-bold text-slate-800">{selectedFirmDetail.count} Personel/Stajyer</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase text-[10px]">Mevcut Başvuru</p>
                  <p className="text-xs font-bold text-blue-600">{selectedFirmDetail.applicantCount} Aday</p>
                </div>
              </div>

              <div>
                <p className="text-slate-400 font-bold uppercase text-[10px]">Tercih Edilen Bölümler</p>
                <p className="text-xs font-semibold text-slate-800 mt-1">{selectedFirmDetail.departmentPreference}</p>
              </div>

              <div>
                <p className="text-slate-400 font-bold uppercase text-[10px]">Detay & Nitelikler</p>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 mt-1 leading-relaxed">
                  {selectedFirmDetail.details}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <button
                onClick={() => {
                  const firmName = selectedFirmDetail.firmName;
                  setSelectedFirmDetail(null);
                  handleQuickSendToFirm(firmName);
                }}
                className="px-4 py-2 bg-[#990000] hover:bg-[#770000] text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Send size={13} />
                <span>Bu Firmaya Aday Gönder</span>
              </button>
              <button
                onClick={() => setSelectedFirmDetail(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-300 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
