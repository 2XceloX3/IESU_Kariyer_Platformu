import React, { useState } from 'react';
import { Award, Globe, Users, ShieldCheck, HeartHandshake, CheckCircle2, Building, BookOpen, Sparkles, TrendingUp, Compass, Clock, GraduationCap, Target, FileText, ChevronRight, UserCheck, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';
import corporateData from '../data/knowledge_base/corporate_hierarchy.json';
import MainHeader from './MainHeader';
import SubPanelFooter from './SubPanelFooter';
import SubPanelFloatingDock from './SubPanelFloatingDock';
import useAppStore from '../store/useAppStore';

export default function AboutUsPage({ setView, currentUser, userRole, setSelectedUserId }) {
  const [activeSubTab, setActiveSubTab] = useState('biz_kimiz');
  const storeStaffList = useAppStore((state) => state.staffList) || [];
  const defaultStaff = [
    {
      id: 'staff-1',
      name: 'Öğr. Gör. Mutlu Gülsev YAĞIZ',
      title: 'Kariyer Geliştirme Ofis Müdürü',
      phone: '444 9 123',
      email: 'mutluyagiz@esenyurt.edu.tr',
      photo: 'https://www.esenyurt.edu.tr/uploads/staffs/278.jpg',
      yokLink: 'http://akademik.yok.gov.tr/AkademikArama/AkademisyenGorevOgrenimBilgileri?islem=direct&authorId=CAC066B35D650BC1'
    },
    {
      id: 'staff-2',
      name: 'Zuhal ŞAHİN',
      title: 'Memur',
      email: 'zuhalsahin@esenyurt.edu.tr',
      photo: 'https://www.esenyurt.edu.tr/uploads/staffs/405.jpg'
    }
  ];
  const staffList = storeStaffList.length > 0 ? storeStaffList : defaultStaff;

  const STATS = [
    { label: 'Topluma Kazandırılan Mezun', value: '77.000+', icon: <GraduationCap size={22} className="text-[#990000]" /> },
    { label: 'Uluslararası Akredite Program', value: '65+', icon: <ShieldCheck size={22} className="text-emerald-600" /> },
    { label: 'Ar-Ge & Uygulama Laboratuvarı', value: '110+', icon: <Building size={22} className="text-amber-600" /> },
    { label: 'Farklı Ülkeden Uluslararası Öğrenci', value: '130+', icon: <Globe size={22} className="text-purple-600" /> }
  ];

  const TIMELINE = [
    { year: '2013', title: 'Resmî Kuruluş ve 6492 Sayılı Kanun Kararı (18 Haziran 2013)', desc: 'Yeşilköy 2001 Eğitim, Kültür ve Sağlık Vakfı tarafından 6492 sayılı kanun ile kuruldu (Resmi Gazete Sayı: 28681).' },
    { year: '2013 - 2014', title: 'İlk Öğrenci Alımı ve Akademik Hayatın Başlaması', desc: '6 bölüm ve 8 önlisans programında 296 öğrenci ile ilk akademik eğitime başlandı.' },
    { year: '2018', title: 'Fakülte ve Laboratuvar Altyapı Hamlesi', desc: 'Sağlık Bilimleri, Mühendislik ve Spor Bilimleri alanında 110+ uygulama laboratuvarı hizmete açıldı.' },
    { year: '2026', title: '6 Fakülte, 3 MYO, 1 Enstitü ile Dev Kampüs', desc: '77.000+ mezun ve küresel ölçekli kariyer entegrasyonuyla geleceğe yön veren dünya üniversitesi.' }
  ];

  const SUB_TABS = [
    { id: 'biz_kimiz', label: 'Biz Kimiz & Hedeflerimiz', icon: <Building size={16} /> },
    { id: 'misyon_vizyon', label: 'Misyon & Vizyon', icon: <Target size={16} /> },
    { id: 'koordinator_mesaji', label: 'Koordinatörün Mesajı', icon: <BookOpen size={16} /> },
    { id: 'organizasyon', label: 'Organizasyon Yapısı', icon: <TrendingUp size={16} /> },
    { id: 'ekip', label: 'Ekip & İletişim (Resmî Kadro)', icon: <Users size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-red-900 flex flex-col font-sans">
      <MainHeader setView={setView} currentUser={currentUser} userRole={userRole} />

      <main className="flex-1 w-full max-w-[1250px] mx-auto p-4 lg:p-8 flex flex-col gap-8">
        
        {/* Ultra-Premium Official Hero Section */}
        <div className="bg-gradient-to-r from-slate-950 via-[#800000] to-indigo-950 text-white rounded-3xl p-8 md:p-12 shadow-2xl border border-red-900 relative overflow-hidden">
          <div className="max-w-4xl relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-950/70 px-4 py-1.5 rounded-full border border-amber-500/40">
              İESÜ Kariyer Geliştirme Merkezi
            </span>
            <h2 className="text-3xl md:text-5xl font-black mt-4 mb-4 tracking-tight leading-tight">
              {corporateData.university}
            </h2>
            <p className="text-slate-200 text-sm md:text-base leading-relaxed font-medium">
              T.C. Anayasası ve 2547 sayılı Yükseköğretim Kanunu doğrultusunda Yeşilköy 2001 Eğitim, Kültür ve Sağlık Vakfı tarafından 18.06.2013 tarihinde (6492 Sayılı Kanun) kurulan üniversitemiz; öğrencilerimize ve mezunlarımıza yaşam boyu kariyer rehberliği sunar.
            </p>
          </div>
        </div>

        {/* Dynamic Key Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {STATS.map((st, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center justify-between hover:shadow-md transition">
              <div className="p-3 bg-red-50 rounded-2xl mb-3 border border-red-100">
                {st.icon}
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-red-950">{st.value}</h3>
              <p className="text-xs font-bold text-slate-500 mt-1">{st.label}</p>
            </div>
          ))}
        </div>

        {/* NEXT-GEN MODERN HORIZONTAL PILL TAB NAVIGATION (PLACED AT TOP) */}
        <div className="bg-white p-2 sm:p-3 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-2 overflow-x-auto scrollbar-none">
          {SUB_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                activeSubTab === tab.id
                  ? 'bg-gradient-to-r from-[#990000] to-[#800000] text-white shadow-lg shadow-red-900/20 scale-[1.02]'
                  : 'bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-[#990000]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* FULL-WIDTH MODERN CONTENT CONTAINER */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm min-h-[450px]">
          
          {/* Tab 1: Biz Kimiz & Hedeflerimiz */}
          {activeSubTab === 'biz_kimiz' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-3 bg-red-100 text-[#990000] rounded-2xl"><Building size={24} /></div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-red-950">Kariyer Geliştirme Merkezi - Biz Kimiz?</h3>
                  <p className="text-xs font-semibold text-slate-500">esenyurt.edu.tr Resmi Kurumsal Tanıtımı</p>
                </div>
              </div>

              <div className="text-slate-700 text-sm leading-relaxed space-y-4 font-medium">
                <p className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                  <strong>Kariyer Geliştirme Merkezi</strong>, İstanbul Esenyurt Üniversitesi’nin öğrenci ve mezunlarına profesyonel gelişim desteği sağlayan birimidir. Öğrencilerin üniversiteye girişlerinden itibaren seminer ve sertifika programları ile danışmanlık faaliyetleri yürüterek kişisel ve profesyonel gelişimlerine katkıda bulunmayı amaçlar.
                </p>
                <p>
                  Ayrıca öğrencileri iş hayatına hazırlamak ve mezunlarına en uygun iş imkânlarını sağlayabilmek adına özel sektör ve kamu ile pek çok alanda işbirliği faaliyetleri yürütür.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-lg font-black text-red-950 mb-4 flex items-center gap-2">
                  <Target size={20} className="text-[#990000]" /> Stratejik Hedeflerimiz
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'Tüm öğrenci ve mezunlar ile kariyer gelişiminde sürekli işbirliği halinde olmak,',
                    'Bireysel yetenekler ve ilgi alanlarına dayalı seçeneklerin keşfedildiği güvenli bir ortam sunmak,',
                    'İlgili ve etkin bir danışmanlık hizmeti sağlamak,',
                    'Gerekli insan, teknoloji ve bilgi kaynaklarına yönelik araştırmalar yapmak,',
                    'Öğrencilerimize staj olanakları sağlamak, iş arama ve işe giriş süreçlerinde destek vermektir.'
                  ].map((h, i) => (
                    <div key={i} className="flex items-start gap-3 bg-red-50/50 p-4 rounded-2xl border border-red-100 text-xs font-semibold text-slate-800">
                      <CheckCircle2 size={16} className="text-[#990000] shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Misyon & Vizyon */}
          {activeSubTab === 'misyon_vizyon' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-3 bg-indigo-100 text-indigo-700 rounded-2xl"><Target size={24} /></div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-red-950">Misyon & Vizyonumuz</h3>
                  <p className="text-xs font-semibold text-slate-500">Geleceğin Mesleklerinde Küresel Liderlik</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-red-950 to-slate-900 text-white p-7 rounded-3xl shadow-md border border-red-800 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xl font-black text-amber-300 mb-3 flex items-center gap-2">🎯 Vizyonumuz</h4>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                      Ulusal ve uluslararası düzeyde iş dünyası ile güçlü entegrasyon kuran, öğrenci ve mezunlarının kariyer yolculuklarında referans alınan, yenilikçi ve öncü bir Kariyer Geliştirme Merkezi olmaktır.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-7 rounded-3xl shadow-md border border-indigo-900 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xl font-black text-indigo-300 mb-3 flex items-center gap-2">🚀 Misyonumuz</h4>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                      Öğrenci ve mezunlarımızın, küresel ölçekte rekabet edebilir, etik değerlere sahip profesyoneller olarak iş dünyasına hazırlanmalarını sağlamak; onların potansiyellerini en üst düzeyde kullanacak kariyer hizmetleri sunmaktır.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Koordinatörün Mesajı */}
          {activeSubTab === 'koordinator_mesaji' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl"><BookOpen size={24} /></div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-red-950">Kariyer Koordinatörünün Mesajı</h3>
                  <p className="text-xs font-semibold text-slate-500">Sevgili Öğrencilerimiz ve Mezunlarımız</p>
                </div>
              </div>

              <div className="bg-slate-50 p-7 rounded-3xl border border-slate-200 text-slate-700 text-sm leading-relaxed space-y-4 font-medium italic">
                <p>
                  "İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi olarak, eğitim hayatınızın ilk gününden itibaren mesleki hedeflerinizi çizmenizde yanınızdayız. Yetenek Kapısı platformumuz, birebir mülakat simülasyonlarımız ve kurumsal iş birliklerimizle geleceğinize yön veriyoruz."
                </p>
                <p>
                  "Amacımız yalnızca bir diplomaya değil, küresel standartlarda bir mesleki kimliğe ve güçlü bir vizyona sahip mezunlar yetiştirmektir."
                </p>
                <div className="not-italic pt-4 border-t border-slate-200 font-bold text-red-950">
                  — Kariyer Geliştirme Merkezi Yönetimi
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Organizasyon Yapısı */}
          {activeSubTab === 'organizasyon' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-3 bg-purple-100 text-purple-700 rounded-2xl"><TrendingUp size={24} /></div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-red-950">Organizasyon Yapısı & İş Akış Şeması</h3>
                  <p className="text-xs font-semibold text-slate-500">Kurumsal Hiyerarşi & Birim Yönetimi</p>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                <h4 className="text-sm font-black text-red-950 uppercase tracking-wider">Hiyerarşik Yapı</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">1. Mütevelli Heyeti & Rektörlük</div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">2. Kariyer Geliştirme Ofis Koordinatörü</div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">3. Bireysel Kariyer Danışmanları</div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">4. İşveren ve Staj İlişkileri Sorumlusu</div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Ekip Üyeleri & Resmî Ofis Kadrosu */}
          {activeSubTab === 'ekip' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl"><Users size={24} /></div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-red-950">Ekip Üyeleri & Resmî Ofis Kadrosu</h3>
                  <p className="text-xs font-semibold text-slate-500">İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Ofis Kadrosu</p>
                </div>
              </div>

              {/* Staff Cards (Perfectly Framed & Dynamic) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {staffList.map((staff) => (
                  <div key={staff.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-xl transition-all">
                    <div>
                      {/* Photo Frame Container (Full Visibility, No Cut Headshots) */}
                      <div className="h-72 w-full bg-slate-100/90 relative overflow-hidden flex items-center justify-center p-3 border-b border-slate-100">
                        <img 
                          src={staff.photo} 
                          alt={staff.name} 
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/iesu-logo.svg'; }}
                          className="h-full w-full object-contain drop-shadow-md rounded-2xl group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                          İESÜ Kadro
                        </div>
                      </div>

                      <div className="p-6">
                        <h4 className="text-lg font-black text-red-950 mb-1">{staff.name}</h4>
                        <span className="text-xs font-black text-[#990000] bg-red-50 px-3 py-1.5 rounded-xl border border-red-100 inline-block mb-4">
                          {staff.title}
                        </span>

                        <div className="space-y-2 text-xs font-bold text-slate-600">
                          {staff.phone && <div className="flex items-center gap-2"><Phone size={14} className="text-[#990000]" /> {staff.phone}</div>}
                          {staff.email && <div className="flex items-center gap-2"><Mail size={14} className="text-[#990000]" /> {staff.email}</div>}
                        </div>
                      </div>
                    </div>

                    {staff.yokLink && (
                      <div className="p-4 bg-slate-50 border-t border-slate-100">
                        <a 
                          href={staff.yokLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full bg-[#990000] hover:bg-red-800 text-white text-xs font-black py-2.5 rounded-xl transition shadow"
                        >
                          <ExternalLink size={14} /> YÖK Akademik Profil Detayı
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </main>

      <SubPanelFooter setView={setView} />

      <SubPanelFloatingDock 
        currentUser={currentUser} 
        setView={setView} 
        setSelectedUserId={setSelectedUserId} 
        userRole={userRole || 'student'} 
      />
    </div>
  );
}

