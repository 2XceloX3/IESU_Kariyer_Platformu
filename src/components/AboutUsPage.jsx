import React from 'react';
import { ChevronLeft, Award, Globe, Users, ShieldCheck, HeartHandshake, CheckCircle2, Building, BookOpen, Sparkles, TrendingUp, Compass, Clock, GraduationCap } from 'lucide-react';
import TopProfileMenu from './TopProfileMenu';
import corporateData from '../data/knowledge_base/corporate_hierarchy.json';

const STATS = [
  { label: 'Topluma Kazandırılan Mezun', value: '77.000+', icon: <GraduationCap size={22} className="text-red-600" /> },
  { label: 'Uluslararası Akredite Program', value: '65+', icon: <ShieldCheck size={22} className="text-emerald-600" /> },
  { label: 'Ar-Ge & Uygulama Laboratuvarı', value: '110+', icon: <Building size={22} className="text-amber-600" /> },
  { label: 'Farklı Ülkeden Uluslararası Öğrenci', value: '130+', icon: <Globe size={22} className="text-purple-600" /> }
];

const ACCREDITATIONS = [
  { name: 'AQAS', desc: 'Alman Sosyal ve Eğitim Bilimleri Akreditasyon Kurumu', status: 'Tam Akredite' },
  { name: 'AHPGS', desc: 'Sağlık ve Sosyal Bilimler Akreditasyon Kurumu', status: 'Tam Akredite' },
  { name: 'PEARSON', desc: 'İngiltere Uluslararası Dil Eğitimi Akreditasyonu', status: 'Sertifikalı' }
];

const TIMELINE = [
  { year: '2008', title: 'İstanbul Esenyurt Meslek Yüksekokulu Kuruluşu', desc: 'Mütevelli Heyeti tarafından mesleki eğitimi güçlendirme vizyonuyla kuruldu.' },
  { year: '2011', title: 'Üniversite Statüsünün Kazanılması', desc: 'Kanun kararıyla İstanbul Esenyurt Üniversitesi olarak yükseköğretim dünyasına katıldı.' },
  { year: '2018', title: 'Türkiye Rekorlu Uluslararası Akreditasyon Hamlesi', desc: '60\'tan fazla lisans ve önlisans programına Avrupa standartlarında akreditasyon kazandırıldı.' },
  { year: '2026', title: 'Dünya Sıralamaları & Sürdürülebilirlik Liderliği', desc: 'Times Higher Education (THE) etki sıralamasında Türkiye\'nin öncü üniversiteleri arasında yer aldı.' }
];

export default function AboutUsPage({ setView, currentUser, userRole, setSelectedUserId }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-red-900 flex flex-col font-sans">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView((currentUser && currentUser.id) ? (userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : userRole === 'admin' ? 'admin' : 'student') : 'landing')} 
            className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Award className="text-red-600" size={24} />
            <h1 className="font-black text-red-950 tracking-tight">Hakkımızda & Kurumsal Yapı</h1>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      <main className="flex-1 w-full max-w-[1150px] mx-auto p-4 lg:p-8 flex flex-col gap-10">
        
        {/* Ultra-Premium Hero Section */}
        <div className="bg-gradient-to-r from-slate-950 via-red-950 to-indigo-950 text-white rounded-3xl p-8 md:p-12 shadow-2xl border border-red-900 relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-950/70 px-4 py-1.5 rounded-full border border-indigo-900/60">
              {corporateData.motto}
            </span>
            <h2 className="text-3xl md:text-5xl font-black mt-4 mb-4 tracking-tight leading-tight">
              {corporateData.university}
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium">
              Geleceğin dünyasını şekillendiren, uluslararası akreditasyon başarısıyla küresel standartlarda eğitim veren ve sürdürülebilir kalkınmayı ilke edinen dünya üniversitesi.
            </p>
          </div>
        </div>

        {/* Dynamic Key Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {STATS.map((st, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center justify-between hover:shadow-md transition">
              <div className="p-3 bg-slate-50 rounded-2xl mb-3 border border-slate-100">
                {st.icon}
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-red-950">{st.value}</h3>
              <p className="text-xs font-bold text-slate-500 mt-1">{st.label}</p>
            </div>
          ))}
        </div>

        {/* Vision & Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-indigo-50 text-red-600 rounded-2xl flex items-center justify-center mb-4 border border-indigo-100">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-black text-red-950 mb-3">Objektif Vizyonumuz</h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                {corporateData.vision} Ar-Ge ve yenilikçi projeleri destekleyerek uluslararası düzeyde bilime ve sanata yön veren saygın bir yükseköğretim kurumu olmaktır.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 border border-emerald-100">
                <HeartHandshake size={24} />
              </div>
              <h3 className="text-xl font-black text-red-950 mb-3">Kurumsal Misyonumuz</h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                {corporateData.mission} Toplumsal ve ekonomik esenyurte yüksek katma değer katan sürdürülebilir eğitim modelleri geliştirmektir.
              </p>
            </div>
          </div>
        </div>

        {/* Accreditations Section */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-red-950 mb-6 flex items-center gap-2">
            <ShieldCheck className="text-emerald-600" size={24} /> Uluslararası Akreditasyon Standartlarımız
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ACCREDITATIONS.map((acc, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-black text-lg text-indigo-950">{acc.name}</span>
                    <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">{acc.status}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed">{acc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-slate-950 text-white p-8 md:p-10 rounded-3xl border border-red-900 shadow-xl">
          <h3 className="text-xl font-black text-slate-100 mb-8 flex items-center gap-2">
            <Clock className="text-indigo-400" size={24} /> Üniversite Tarihçesi & Kilometre Taşları
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {TIMELINE.map((t, idx) => (
              <div key={idx} className="bg-red-950/90 p-5 rounded-2xl border border-red-900/90 flex flex-col justify-between">
                <div>
                  <span className="text-2xl font-black text-indigo-400 block mb-2">{t.year}</span>
                  <h4 className="font-black text-slate-100 text-xs mb-2 leading-snug">{t.title}</h4>
                  <p className="text-[11px] font-medium text-slate-400 leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
