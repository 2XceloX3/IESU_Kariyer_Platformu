import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Ticket, CheckCircle2, Search, UserCheck, Sparkles, Share2, Tag } from 'lucide-react';
import MainHeader from './MainHeader';

const EVENTS_CATALOG = [
  {
    id: 'EVT-2026-01',
    title: 'Yapay Zeka ve Geleceğin Meslekleri Paneli',
    category: 'Akademik',
    speaker: 'Prof. Dr. Bahri Şahin & Sektör Liderleri',
    date: '2026-10-15',
    time: '14:00 - 16:30',
    location: 'J Blok Mehmet Akif Ersoy Konferans Salonu',
    capacity: 450,
    registered: 312,
    desc: 'Yapay zeka teknolojilerinin mühendislik, sağlık ve medya sektörlerinde yarattığı dönüşüm ve geleceğin yetenek gereksinimleri.'
  },
  {
    id: 'EVT-2026-02',
    title: 'Hackathon 2026: Sürdürülebilir Akıllı Şehirler',
    category: 'Teknoloji',
    speaker: 'İESÜ Teknoloji Transfer Ofisi (TTO)',
    date: '2026-11-04',
    time: '09:00 - 18:00',
    location: 'Kuluçka Merkezi A Blok Zemin Kat',
    capacity: 200,
    registered: 184,
    desc: '48 saatlik kesintisiz yazılım ve prototip maratonu. Dereceye giren takımlara kuluçka desteği ve ödüller.'
  },
  {
    id: 'EVT-2026-03',
    title: 'İESÜ Kariyer Zirvesi 2026: 50+ Şirketle Birebir Mülakat',
    category: 'Kariyer',
    speaker: 'İnsan Kaynakları Direktörleri & İESÜ Mezunları',
    date: '2026-12-01',
    time: '10:00 - 17:00',
    location: 'Esenyurt Kompleksi Spor ve Kongre Merkezi',
    capacity: 1200,
    registered: 890,
    desc: 'Türkiye\'nin önde gelen 50+ ulusal ve uluslararası firmasıyla tanışma, staj ve iş başvurusu yapma fırsatı.'
  },
  {
    id: 'EVT-2026-04',
    title: 'Bahar Festivali & Kulüpler Sahne Gösterileri',
    category: 'Kültür & Sanat',
    speaker: 'İESÜ Müzik ve Tiyatro Kulüpleri',
    date: '2027-05-12',
    time: '15:00 - 22:00',
    location: 'Açık Hava Festival Alanı (Avcılar Kampüsü)',
    capacity: 2500,
    registered: 1420,
    desc: 'Müzik dinletileri, halk oyunları, tiyatro performansları ve öğrenci kulüpleri stant açılışları.'
  }
];

export default function EventsPage({ setView, currentUser, userRole, setSelectedUserId }) {
  const [filter, setFilter] = useState('Tümü');
  const [search, setSearch] = useState('');
  const [registeredEvents, setRegisteredEvents] = useState([]);

  const filteredEvents = EVENTS_CATALOG.filter(evt => {
    const matchesCat = filter === 'Tümü' || evt.category === filter;
    const matchesSearch = evt.title.toLowerCase().includes(search.toLowerCase()) || evt.location.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleRegister = (evtId, evtTitle) => {
    if (!registeredEvents.includes(evtId)) {
      setRegisteredEvents([...registeredEvents, evtId]);
      window.toast && window.toast.success(`"${evtTitle}" etkinliği için dijital biletiniz oluşturuldu!`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-red-900 flex flex-col font-sans">
      <MainHeader setView={setView} />

      <main className="flex-1 w-full max-w-[1150px] mx-auto p-4 lg:p-8 flex flex-col gap-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-red-950 to-indigo-950 text-white rounded-3xl p-8 md:p-10 shadow-xl border border-red-900">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-950/70 px-3.5 py-1.5 rounded-full border border-indigo-900/60">
            Resmi Etkinlik Ekosistemi
          </span>
          <h2 className="text-2xl md:text-3xl font-black mt-3 mb-2 tracking-tight">
            Kampüs Etkinlikleri & Konferans Portalı
          </h2>
          <p className="text-slate-300 text-xs md:text-sm font-semibold max-w-2xl leading-relaxed">
            Akademik panellerden zirvelere, hackathonlardan bahar şenliklerine kadar tüm etkinliklere anında katılın ve dijital biletinizi alın.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-full sm:w-80 bg-slate-50 border border-slate-200 rounded-2xl flex items-center px-4 py-2.5">
            <Search size={18} className="text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Etkinlik veya salon ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs font-bold w-full focus:outline-none text-red-900"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {['Tümü', 'Akademik', 'Teknoloji', 'Kariyer', 'Kültür & Sanat'].map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition ${filter === cat ? 'bg-red-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Events Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map(evt => {
            const isReg = registeredEvents.includes(evt.id);
            return (
              <div key={evt.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black uppercase text-red-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">{evt.category}</span>
                    <span className="text-xs font-bold text-slate-400">{evt.registered} / {evt.capacity} Katılımcı</span>
                  </div>

                  <h3 className="text-base font-black text-red-950 mb-2">{evt.title}</h3>
                  <p className="text-xs font-medium text-slate-500 mb-4 leading-relaxed">{evt.desc}</p>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs font-semibold text-slate-600 mb-6">
                    <div className="flex items-center gap-2">
                      <UserCheck size={14} className="text-red-600 shrink-0" /> Konuşmacı: <span className="font-bold text-red-900">{evt.speaker}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-red-600 shrink-0" /> Tarih: <span className="font-bold text-red-900">{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-red-600 shrink-0" /> Saat: <span className="font-bold text-red-900">{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-red-600 shrink-0" /> Salon: <span className="font-bold text-red-900">{evt.location}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleRegister(evt.id, evt.title)}
                  className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 ${isReg ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-600 hover:bg-indigo-700 text-white shadow-md'}`}
                >
                  {isReg ? <CheckCircle2 size={16} /> : <Ticket size={16} />}
                  {isReg ? 'Biletiniz Hazır (Barkodlu)' : 'Ücretsiz Kayıt Ol & Bilet Al'}
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
