import React, { useState } from 'react';
import { 
  Building2, BookOpen, FileText, Phone, Mail, 
  MapPin, ShieldAlert, ArrowLeft, ArrowRight, Download 
} from 'lucide-react';
import useAppStore from '../store/useAppStore';

const MOCK_ANNOUNCEMENTS = [
  {
    id: 1,
    title: "İstanbul Esenyurt Üniversitesi YÖK Kalite Güvencesi Değerlendirme Raporu Yayınlandı",
    summary: "İESÜ, kalite standartları doğrultusunda ulusal ve uluslararası eğitim akreditasyon süreçlerini başarıyla sürdürüyor.",
    category: "Genel",
    date: "2026-07-15",
    link: "https://www.esenyurt.edu.tr/tr/iesu-anasayfa",
    documents: []
  },
  {
    id: 2,
    title: "Cumhurbaşkanlığı İnsan Kaynakları Ofisi Ulusal Staj Programı Başvuruları",
    summary: "Esenyurt Kariyer Geliştirme Merkezi aracılığıyla öğrencilerimizin zorunlu ve gönüllü staj süreçlerini başlatacak form ve belgeler yayınlanmıştır.",
    category: "Kariyer",
    date: "2026-07-18",
    link: "https://kariyer.esenyurt.edu.tr/tr/idari-anasayfa",
    documents: [
      { name: "Zorunlu Staj Formu (3 Nüsha)", type: "PDF", size: "1.2 MB" },
      { name: "Staj Defteri Teslim Yönergesi", type: "PDF", size: "850 KB" }
    ]
  },
  {
    id: 3,
    title: "Eduroam Kablosuz Ağ Bağlantı Kılavuzu Güncellendi",
    summary: "Kampüs sınırlarındaki yüksek hızlı internet ağımıza cep telefonu ve bilgisayarlardan bağlantı ayarlarını gösteren kılavuzlar.",
    category: "BİDB",
    date: "2026-07-10",
    link: "https://bidb.esenyurt.edu.tr/tr/idari-anasayfa",
    documents: [
      { name: "Eduroam Windows Kurulum Rehberi", type: "PDF", size: "1.4 MB" },
      { name: "Öğrenci E-Posta Şifre Sıfırlama Formu", type: "DOCX", size: "420 KB" }
    ]
  },
  {
    id: 4,
    title: "Öğrenci Etkinlik & Organizasyon Başvuru Formları",
    summary: "Öğrencilerimizin bilimsel, kültürel ve sanatsal etkinliklerini sürdürebilmesi için SKSDB'ye teslim etmesi gereken formlar.",
    category: "SKSDB",
    date: "2026-07-19",
    link: "https://sksdb.esenyurt.edu.tr/tr/idari-anasayfa",
    documents: [
      { name: "Kulüp Kuruluş Dilekçesi ve Tüzük Şablonu", type: "DOCX", size: "1.8 MB" },
      { name: "Spor Tesisleri Rezervasyon Başvuru Formu", type: "PDF", size: "620 KB" }
    ]
  }
];

const MOCK_STAFF = [
  {
    name: "Dr. Öğr. Üyesi Ahmet Yılmaz",
    title: "Kariyer Daire Başkanı / Merkez Müdürü",
    unit: "Kariyer Daire Başkanlığı",
    email: "ayilmaz@esenyurt.edu.tr",
    phone: "0212 422 7000 - 1240",
    office: "Esenyurt Kule - Kat 4",
    avatar: "https://ui-avatars.com/api/?name=Ahmet+Yilmaz&background=2563eb&color=fff"
  },
  {
    name: "Elif Demir",
    title: "Yazılım Geliştirme ve Ağ Güvenliği Şube Müdürü",
    unit: "Bilgi İşlem Daire Başkanlığı (BİDB)",
    email: "edemir@esenyurt.edu.tr",
    phone: "0212 422 7000 - 1530",
    office: "Rektörlük Binası - Zemin Kat",
    avatar: "https://ui-avatars.com/api/?name=Elif+Demir&background=0f172a&color=fff"
  },
  {
    name: "Hakan Kaya",
    title: "Kültür ve Spor Hizmetleri Birim Sorumlusu",
    unit: "Sağlık, Kültür ve Spor Daire Başkanlığı (SKSDB)",
    email: "hkaya@esenyurt.edu.tr",
    phone: "0212 422 7000 - 1822",
    office: "J Blok Spor Kompleksi - Oda 102",
    avatar: "https://ui-avatars.com/api/?name=Hakan+Kaya&background=16a34a&color=fff"
  }
];

export default function IdariPortal({ setView, previousView }) {
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const logAction = useAppStore(state => state.logAction);

  const categories = ['Tümü', 'Genel', 'Kariyer', 'BİDB', 'SKSDB'];

  const filteredAnnouncements = selectedCategory === 'Tümü'
    ? MOCK_ANNOUNCEMENTS
    : MOCK_ANNOUNCEMENTS.filter(item => item.category === selectedCategory);

  const filteredStaff = selectedCategory === 'Tümü'
    ? MOCK_STAFF
    : MOCK_STAFF.filter(member => {
        if (selectedCategory === 'BİDB') return member.unit.includes('Bilgi İşlem');
        if (selectedCategory === 'SKSDB') return member.unit.includes('Sağlık');
        if (selectedCategory === 'Kariyer') return member.unit.includes('Kariyer');
        return false;
      });

  const handleDocDownload = (docName) => {
    if (logAction) {
      logAction(null, `Dosya İndirildi: ${docName}`, "Sistem");
    }
    window.toast && window.toast.success(`${docName} başarıyla indirildi (Simüle).`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-red-900 p-4 sm:p-6 lg:p-8 pb-24">
      <div className="max-w-6xl mx-auto">
        
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => setView(previousView || 'landing')} 
            className="flex items-center gap-2 text-sm font-bold text-[#990000] hover:text-red-700 bg-white px-4 py-2.5 rounded-full shadow-sm border border-slate-200 transition"
          >
            <ArrowLeft size={16} /> Geri Dön
          </button>
          <div className="flex items-center gap-2">
            <Building2 size={24} className="text-[#990000]" />
            <h1 className="text-xl font-black text-[#990000] tracking-tight">İESÜ İDARİ PORTAL</h1>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-900 to-[#990000] rounded-3xl p-6 sm:p-10 text-white mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-12 translate-y-12">
            <Building2 size={300} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <span className="bg-red-500/20 text-red-300 border border-red-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">İESÜ Ortak Altyapı</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mt-3 mb-4 leading-tight">Üniversite İdari Birimler & Hizmetleri</h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Bilgi İşlem (BİDB), Sağlık Kültür Spor (SKSDB) ve Kariyer Daire Başkanlıklarının kadro, resmi form ve staj bağlantılarını içeren hibrit kontrol merkezi.
            </p>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-slate-200">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                if (logAction) {
                  logAction(null, `Birim Filtrelendi: ${cat}`, "Navigasyon");
                }
              }}
              className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm whitespace-nowrap transition ${
                selectedCategory === cat 
                  ? 'bg-[#990000] text-white shadow-md' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main Grid: Announcements vs Kadro */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Announcements & Documents Column (Spans 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-black text-red-900 border-l-4 border-red-600 pl-3">Birim Duyuruları & Belgeler</h3>
            
            {filteredAnnouncements.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                Bu kategoriye ait duyuru bulunmamaktadır.
              </div>
            ) : (
              filteredAnnouncements.map(item => (
                <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-red-100 text-red-800 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">
                      {item.category}
                    </span>
                    <span className="text-slate-400 text-xs font-semibold">{item.date}</span>
                  </div>
                  
                  <h4 className="text-lg font-bold text-red-900 mb-2">{item.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">{item.summary}</p>
                  
                  <div className="flex justify-end border-b border-slate-100 pb-4 mb-4">
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      Resmi Daire Web Sitesi <ArrowRight size={14} />
                    </a>
                  </div>

                  {item.documents.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">İndirilebilir Formlar</p>
                      {item.documents.map((doc, idx) => (
                        <div 
                          key={idx}
                          onClick={() => handleDocDownload(doc.name)}
                          className="flex items-center justify-between p-3 bg-slate-50 hover:bg-red-50 border border-slate-100 rounded-xl cursor-pointer transition text-sm text-slate-700"
                        >
                          <span className="font-semibold flex items-center gap-2">
                            <FileText size={16} className="text-slate-400" /> {doc.name}
                          </span>
                          <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                            {doc.type} ({doc.size}) <Download size={14} />
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Kadro Column (Spans 1 col) */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-red-900 border-l-4 border-red-600 pl-3">İdari Kadro & Rehber</h3>
            
            {filteredStaff.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
                Bu kategoriye kayıtlı personel bilgisi bulunamadı.
              </div>
            ) : (
              filteredStaff.map((member, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex gap-4 items-start hover:shadow-md transition">
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="w-14 h-14 rounded-full border-2 border-red-500 object-cover shrink-0"
                  />
                  <div className="space-y-1">
                    <h4 className="font-bold text-red-900 text-sm sm:text-base leading-snug">{member.name}</h4>
                    <p className="text-xs font-bold text-red-600">{member.title}</p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{member.unit}</p>
                    <p className="text-xs text-slate-500 pt-1">📍 {member.office}</p>
                    
                    <div className="text-xs text-slate-600 pt-2 border-t border-slate-100 mt-2 space-y-1">
                      <p className="flex items-center gap-1.5 hover:text-red-600 transition">
                        <Mail size={12} /> {member.email}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Phone size={12} /> {member.phone}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

