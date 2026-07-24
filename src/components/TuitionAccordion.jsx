import React, { useState } from 'react';
import { ChevronDown, ChevronUp, GraduationCap, Building2, HeartPulse, Palette, Dumbbell, Stethoscope, BookOpen } from 'lucide-react';

export const tuitionData = [
  {
    faculty: "İşletme ve Yönetim Bilimleri Fakültesi (Lisans)",
    icon: Building2,
    badge: "4 Yıllık Lisans",
    color: "from-blue-900 to-indigo-900",
    programs: [
      { name: "Ekonomi ve Finans (İngilizce) (%50 İndirimli)", type: "EA", quota: "10", price: "₺363.000", discount: "%30", discountedPrice: "₺254.100", campusPrice: "₺228.690" },
      { name: "Ekonomi ve Finans (İngilizce) (Tam Burslu)", type: "EA", quota: "6", price: "Ücretsiz", discount: "%100", discountedPrice: "₺0", campusPrice: "₺0" },
      { name: "Elektronik Ticaret ve Yönetimi (%50 İndirimli)", type: "EA", quota: "10", price: "₺363.000", discount: "%30", discountedPrice: "₺254.100", campusPrice: "₺228.690" },
      { name: "Elektronik Ticaret ve Yönetimi (Tam Burslu)", type: "EA", quota: "6", price: "Ücretsiz", discount: "%100", discountedPrice: "₺0", campusPrice: "₺0" },
      { name: "Havacılık Yönetimi (%50 İndirimli)", type: "EA", quota: "25", price: "₺363.000", discount: "%30", discountedPrice: "₺254.100", campusPrice: "₺228.690" },
      { name: "Havacılık Yönetimi (Tam Burslu)", type: "EA", quota: "4", price: "Ücretsiz", discount: "%100", discountedPrice: "₺0", campusPrice: "₺0" },
      { name: "İşletme (%50 İndirimli)", type: "EA", quota: "16", price: "₺363.000", discount: "%30", discountedPrice: "₺254.100", campusPrice: "₺228.690" },
      { name: "İşletme (Tam Burslu)", type: "EA", quota: "4", price: "Ücretsiz", discount: "%100", discountedPrice: "₺0", campusPrice: "₺0" },
      { name: "Lojistik Yönetimi (%50 İndirimli)", type: "EA", quota: "16", price: "₺363.000", discount: "%30", discountedPrice: "₺254.100", campusPrice: "₺228.690" },
      { name: "Siyaset Bilimi ve Uluslararası İlişkiler (%50 İndirimli)", type: "EA", quota: "16", price: "₺363.000", discount: "%30", discountedPrice: "₺254.100", campusPrice: "₺228.690" }
    ]
  },
  {
    faculty: "Mühendislik ve Mimarlık Fakültesi (Lisans)",
    icon: GraduationCap,
    badge: "4 Yıllık Lisans",
    color: "from-slate-900 to-blue-950",
    programs: [
      { name: "Bilgisayar Mühendisliği (%50 İndirimli)", type: "SAY", quota: "30", price: "₺395.000", discount: "%30", discountedPrice: "₺276.500", campusPrice: "₺248.850" },
      { name: "Bilgisayar Mühendisliği (Tam Burslu)", type: "SAY", quota: "8", price: "Ücretsiz", discount: "%100", discountedPrice: "₺0", campusPrice: "₺0" },
      { name: "Yazılım Mühendisliği (%50 İndirimli)", type: "SAY", quota: "30", price: "₺395.000", discount: "%30", discountedPrice: "₺276.500", campusPrice: "₺248.850" },
      { name: "Yazılım Mühendisliği (Tam Burslu)", type: "SAY", quota: "8", price: "Ücretsiz", discount: "%100", discountedPrice: "₺0", campusPrice: "₺0" },
      { name: "Mimarlık (%50 İndirimli)", type: "SAY", quota: "20", price: "₺395.000", discount: "%30", discountedPrice: "₺276.500", campusPrice: "₺248.850" },
      { name: "İç Mimarlık (%50 İndirimli)", type: "SAY", quota: "25", price: "₺395.000", discount: "%30", discountedPrice: "₺276.500", campusPrice: "₺248.850" },
      { name: "Inşaat Mühendisliği (%50 İndirimli)", type: "SAY", quota: "15", price: "₺395.000", discount: "%30", discountedPrice: "₺276.500", campusPrice: "₺248.850" }
    ]
  },
  {
    faculty: "Sağlık Bilimleri Fakültesi (Lisans)",
    icon: HeartPulse,
    badge: "4 Yıllık Lisans",
    color: "from-emerald-900 to-teal-950",
    programs: [
      { name: "Beslenme ve Diyetetik (%50 İndirimli)", type: "SAY", quota: "30", price: "₺450.125", discount: "%10", discountedPrice: "₺405.113", campusPrice: "₺364.601" },
      { name: "Beslenme ve Diyetetik (Tam Burslu)", type: "SAY", quota: "6", price: "Ücretsiz", discount: "%100", discountedPrice: "₺0", campusPrice: "₺0" },
      { name: "Fizyoterapi ve Rehabilitasyon (%50 İndirimli)", type: "SAY", quota: "37", price: "₺450.125", discount: "%25", discountedPrice: "₺337.594", campusPrice: "₺303.834" },
      { name: "Hemşirelik (%50 İndirimli)", type: "SAY", quota: "53", price: "₺450.125", discount: "%10", discountedPrice: "₺405.113", campusPrice: "₺364.601" },
      { name: "Sosyal Hizmet (%50 İndirimli)", type: "EA", quota: "10", price: "₺450.125", discount: "%50", discountedPrice: "₺225.063", campusPrice: "₺202.556" }
    ]
  },
  {
    faculty: "Sanat ve Sosyal Bilimler Fakültesi (Lisans)",
    icon: Palette,
    badge: "4 Yıllık Lisans",
    color: "from-purple-900 to-slate-900",
    programs: [
      { name: "Dijital Oyun Tasarımı (%50 İndirimli)", type: "SAY", quota: "15", price: "₺411.000", discount: "%40", discountedPrice: "₺246.600", campusPrice: "₺221.940" },
      { name: "Gastronomi ve Mutfak Sanatları (%50 İndirimli)", type: "SÖZ", quota: "31", price: "₺411.000", discount: "%30", discountedPrice: "₺287.700", campusPrice: "₺258.930" },
      { name: "Halkla İlişkiler ve Reklamcılık (%50 İndirimli)", type: "SÖZ", quota: "15", price: "₺411.000", discount: "%45", discountedPrice: "₺226.050", campusPrice: "₺203.445" },
      { name: "Psikoloji (%50 İndirimli)", type: "EA", quota: "34", price: "₺411.000", discount: "%10", discountedPrice: "₺369.900", campusPrice: "₺332.910" },
      { name: "Radyo, Televizyon ve Sinema (%50 İndirimli)", type: "SÖZ", quota: "15", price: "₺411.000", discount: "%45", discountedPrice: "₺226.050", campusPrice: "₺203.445" },
      { name: "Sosyoloji (%50 İndirimli)", type: "EA", quota: "15", price: "₺411.000", discount: "%50", discountedPrice: "₺205.500", campusPrice: "₺184.950" },
      { name: "Yeni Medya ve İletişim (%50 İndirimli)", type: "SÖZ", quota: "15", price: "₺411.000", discount: "%45", discountedPrice: "₺226.050", campusPrice: "₺203.445" }
    ]
  },
  {
    faculty: "Spor Bilimleri Fakültesi (Lisans)",
    icon: Dumbbell,
    badge: "Özel Yetenek / Lisans",
    color: "from-amber-900 to-orange-950",
    programs: [
      { name: "Antrenörlük Eğitimi (%50 İndirimli)", type: "ÖZEL YETENEK", quota: "25", price: "₺360.000", discount: "%30", discountedPrice: "₺252.000", campusPrice: "₺226.800" },
      { name: "Egzersiz ve Spor Bilimleri (%50 İndirimli)", type: "ÖZEL YETENEK", quota: "20", price: "₺360.000", discount: "%30", discountedPrice: "₺252.000", campusPrice: "₺226.800" },
      { name: "Spor Yöneticiliği (%50 İndirimli)", type: "EA", quota: "25", price: "₺360.000", discount: "%30", discountedPrice: "₺252.000", campusPrice: "₺226.800" }
    ]
  },
  {
    faculty: "Meslek Yüksekokulu (2 Yıllık Önlisans)",
    icon: BookOpen,
    badge: "2 Yıllık Önlisans",
    color: "from-blue-800 to-sky-950",
    programs: [
      { name: "Adalet (%50 İndirimli)", type: "TYT", quota: "40", price: "₺195.000", discount: "%30", discountedPrice: "₺136.500", campusPrice: "₺122.850" },
      { name: "Aşçılık (%50 İndirimli)", type: "TYT", quota: "35", price: "₺195.000", discount: "%30", discountedPrice: "₺136.500", campusPrice: "₺122.850" },
      { name: "Bilgisayar Programcılığı (%50 İndirimli)", type: "TYT", quota: "50", price: "₺195.000", discount: "%30", discountedPrice: "₺136.500", campusPrice: "₺122.850" },
      { name: "Sivil Havacılık Kabin Hizmetleri (%50 İndirimli)", type: "TYT", quota: "40", price: "₺195.000", discount: "%30", discountedPrice: "₺136.500", campusPrice: "₺122.850" },
      { name: "Grafik Tasarımı (%50 İndirimli)", type: "TYT", quota: "30", price: "₺195.000", discount: "%30", discountedPrice: "₺136.500", campusPrice: "₺122.850" }
    ]
  },
  {
    faculty: "Sağlık Hizmetleri Meslek Yüksekokulu (2 Yıllık Önlisans)",
    icon: Stethoscope,
    badge: "2 Yıllık Önlisans",
    color: "from-rose-900 to-red-950",
    programs: [
      { name: "Ameliyathane Hizmetleri (%50 İndirimli)", type: "TYT", quota: "40", price: "₺215.000", discount: "%30", discountedPrice: "₺150.500", campusPrice: "₺135.450" },
      { name: "Anestezi (%50 İndirimli)", type: "TYT", quota: "50", price: "₺215.000", discount: "%25", discountedPrice: "₺161.250", campusPrice: "₺145.125" },
      { name: "İlk ve Acil Yardım (%50 İndirimli)", type: "TYT", quota: "60", price: "₺215.000", discount: "%25", discountedPrice: "₺161.250", campusPrice: "₺145.125" },
      { name: "Tıbbi Görüntüleme Teknikleri (%50 İndirimli)", type: "TYT", quota: "45", price: "₺215.000", discount: "%30", discountedPrice: "₺150.500", campusPrice: "₺135.450" },
      { name: "Tıbbi Laboratuvar Teknikleri (%50 İndirimli)", type: "TYT", quota: "40", price: "₺215.000", discount: "%30", discountedPrice: "₺150.500", campusPrice: "₺135.450" }
    ]
  }
];

export default function TuitionAccordion() {
  const [openIndex, setOpenIndex] = useState(0); // Default open first section

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4 my-6">
      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <div>
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <span className="w-2.5 h-6 bg-[#990000] rounded-full inline-block"></span>
            2026-2027 Fakülte & Yüksekokul Ücret Tabloları
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-1">İlgili fakültenin veya yüksekokulun üzerine tıklayarak tüm bölüm ücretlerini alt alta görüntüleyebilirsiniz.</p>
        </div>
      </div>

      {tuitionData.map((item, index) => {
        const IconComponent = item.icon;
        const isOpen = openIndex === index;

        return (
          <div key={index} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm transition-all bg-white">
            {/* Header Accordion Button */}
            <button
              onClick={() => toggleAccordion(index)}
              className={`w-full p-4 flex items-center justify-between text-left transition-colors bg-gradient-to-r ${item.color} text-white`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl">
                  <IconComponent size={22} className="text-white" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-md inline-block mb-1">
                    {item.badge}
                  </span>
                  <h4 className="text-base md:text-lg font-black text-white leading-tight">
                    {item.faculty}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-xs font-bold bg-white/20 px-3 py-1 rounded-full text-white">
                  {item.programs.length} Bölüm / Program
                </span>
                <div className="p-2 rounded-full bg-white/20">
                  {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
            </button>

            {/* Expandable Table Content */}
            {isOpen && (
              <div className="p-4 bg-gray-50/50 border-t border-gray-100 overflow-x-auto">
                <table className="w-full text-left text-xs md:text-sm border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-[#0A2342] text-white">
                      <th className="px-3.5 py-3 font-extrabold uppercase">Bölüm / Program</th>
                      <th className="px-3.5 py-3 font-extrabold uppercase text-center">Puan</th>
                      <th className="px-3.5 py-3 font-extrabold uppercase text-center">Kontenjan</th>
                      <th className="px-3.5 py-3 font-extrabold uppercase text-right">Peşin Ücret</th>
                      <th className="px-3.5 py-3 font-extrabold uppercase text-center">Tercih İnd.</th>
                      <th className="px-3.5 py-3 font-extrabold uppercase text-right">İndirimli Peşin</th>
                      <th className="px-3.5 py-3 font-extrabold uppercase text-right text-emerald-300">Kampüs Burslu Peşin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {item.programs.map((prog, pIdx) => (
                      <tr key={pIdx} className={pIdx % 2 === 0 ? 'bg-white hover:bg-red-50/30' : 'bg-gray-50/60 hover:bg-red-50/30'}>
                        <td className="px-3.5 py-3 font-bold text-gray-900">{prog.name}</td>
                        <td className="px-3.5 py-3 font-extrabold text-center text-blue-900">{prog.type}</td>
                        <td className="px-3.5 py-3 font-bold text-center text-gray-600">{prog.quota}</td>
                        <td className="px-3.5 py-3 font-bold text-right text-gray-500 line-through">{prog.price}</td>
                        <td className="px-3.5 py-3 font-black text-center text-orange-600 bg-orange-50/60">{prog.discount}</td>
                        <td className="px-3.5 py-3 font-black text-right text-blue-900">{prog.discountedPrice}</td>
                        <td className="px-3.5 py-3 font-black text-right text-emerald-700 bg-emerald-50/60">{prog.campusPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
