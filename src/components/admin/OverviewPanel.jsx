import React from 'react';
import useAppStore from '../../store/useAppStore';
import PanelHeader from './PanelHeader';
import { Card, StatCard, Badge, Tbl } from './AdminShared';
import { Users, Briefcase, GraduationCap, Award, BookOpen, Library, MessageSquare, Calendar, Megaphone, UserPlus, MessageCircle, Wand2 } from 'lucide-react';

export default function OverviewPanel({ setView }) {
  const { students, alumni, jobs, mentorships, voluntaryInternships, surveys, academicApprovals, messages } = useAppStore();
  const depts = {};
  (students || []).forEach(s => { depts[s?.dept]=(depts[s?.dept]||0)+1; });
  const deptList = Object.entries(depts).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const maxDept = deptList[0]?.[1]||1;

  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader title="Kontrol Merkezi" sub="Sistemin genel durumu" />
      
      {/* AI Modülleri Banner */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden transition-all hover:scale-[1.01] duration-500">
        <div className="absolute -top-10 -right-10 opacity-20 pointer-events-none">
          <MessageCircle size={150} />
        </div>
        <div className="relative z-10">
          <span className="bg-white/20 px-2.5 py-1 rounded-md text-[10px] font-black tracking-widest uppercase mb-3 inline-block">YENİ MODÜL YAYINDA</span>
          <h2 className="text-2xl font-black mb-1.5 tracking-tight">Yapay Zeka Mülakat ve CV Merkezi</h2>
          <p className="text-red-100 text-sm max-w-lg mb-5 font-medium leading-relaxed">Öğrencilerinizi gerçekçi mülakat simülasyonlarıyla geliştirin, otomatik CV oluşturucu ile kariyer yolculuklarını destekleyin.</p>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setView('interview_sim')} className="px-5 py-2.5 bg-white text-red-600 font-bold rounded-xl text-[13px] hover:bg-gray-50 hover:shadow-lg transition-all duration-300 active:scale-95 shadow-sm flex items-center gap-2">
              <MessageCircle size={16} /> Mülakat Simülasyonu
            </button>
            <button onClick={() => setView('cvbuilder')} className="px-5 py-2.5 bg-red-700/50 hover:bg-red-700/70 text-white border border-red-400 font-bold rounded-xl text-[13px] transition-all duration-300 active:scale-95 flex items-center gap-2">
              <Wand2 size={16} /> CV Oluşturucu
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <StatCard icon={<Users size={20}/>} label="Aktif Öğrenci" value={(students || []).filter(s=>s?.status==='Aktif').length} sub="Toplam kayıtlı" color="blue" />
        <StatCard icon={<Briefcase size={20}/>} label="Açık İlanlar" value={(jobs || []).filter(j=>j?.status==='Yayında').length} sub={`${(jobs || []).filter(j=>j?.status==='Beklemede').length} onay bekliyor`} color="red" />
        <StatCard icon={<GraduationCap size={20}/>} label="Mezun Kaydı" value={(alumni || []).length} sub={`${(alumni || []).filter(a=>a.mentor).length} aktif mentor`} color="purple" />
        
        {/* Education Breakdown Based on Image 1 */}
        <StatCard icon={<Award size={20}/>} label="Önlisans" value={(alumni || []).filter(a=>a?.degree === 'Önlisans').length} sub="Mezunu" color="green" />
        <StatCard icon={<BookOpen size={20}/>} label="Lisans" value={(alumni || []).filter(a=>!a?.degree || a?.degree === 'Lisans').length} sub="Mezunu" color="blue" />
        <StatCard icon={<Library size={20}/>} label="Lisansüstü" value={(alumni || []).filter(a=>a?.degree === 'Lisansüstü' || a?.degree === 'Yüksek Lisans' || a?.degree === 'Doktora').length} sub="Mezunu" color="orange" />
        
        <StatCard icon={<MessageSquare size={20}/>} label="Okunmamış" value={(messages || []).filter(m=>!m?.read).length} sub="Mesaj" color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pending approvals */}
        <Card className="p-6 col-span-1">
          <h3 className="font-black text-gray-900 mb-4">Bekleyen İşlemler</h3>
          <div className="space-y-2.5">
            {[
              { label:'Onay Bekleyen İlan',       val: (jobs || []).filter(j=>j?.status==='Beklemede').length,              color:'amber'   },
              { label:'Staj Onay Bekliyor',        val: (voluntaryInternships || []).filter(v=>v.status==='Taslak').length, color:'orange' },
              { label:'Akademik Profil Onayı',    val: (academicApprovals || []).filter(a=>a.status==='Beklemede').length, color:'red' },
              { label:'Mentor Eşleşme Bekliyor',  val: (mentorships || []).filter(m=>m.status==='Eşleştirme Bekliyor').length, color:'sky'  },
              { label:'Aktif Anket',               val: (surveys || []).filter(s=>s?.status==='Aktif').length,                color:'green'  },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                <span className="text-sm text-gray-600 font-medium">{item.label}</span>
                <span className={`text-lg font-black ${item.val>0?'text-red-600':'text-gray-500'}`}>{item.val}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent */}
        <Card className="p-6 col-span-1">
          <h3 className="font-black text-gray-900 mb-4">Son Mesajlar</h3>
          <div className="space-y-3">
            {(messages || []).slice(0,4).map(m=>(
              <div key={m?.id} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${m?.read?'bg-gray-300':'bg-red-500'}`}/>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{m?.from}</p>
                  <p className="text-xs text-gray-500 truncate">{m?.subject}</p>
                  <p className="text-xs text-gray-500">{m?.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Latest jobs */}
        <Card className="p-6">
          <h3 className="font-black text-gray-900 mb-4">Son Eklenen İlanlar</h3>
          <Tbl
            headers={['İlan','Firma','Tür','Durum']}
            rows={(jobs || []).slice(0,5).map(j=>[
              <span className="font-semibold text-gray-900">{j?.title}</span>,
              j?.company, <Badge status={j?.type}/>, <Badge status={j?.status}/>
            ])}
          />
        </Card>

        {/* Super Admin Activity Feed */}
        <Card className="p-6">
          <h3 className="font-black text-gray-900 mb-4">Sistem Aktivite Akışı</h3>
          <div className="space-y-4">
            {(events || []).slice(0, 2).map(e => (
              <div key={e.id} className="flex items-start gap-3 border-b border-gray-50 pb-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Calendar size={14} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Yeni Etkinlik Eklendi: {e?.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{e?.date || 'Yakın Zamanda'}</p>
                </div>
              </div>
            ))}
            {(announcements || []).slice(0, 2).map(a => (
              <div key={a.id} className="flex items-start gap-3 border-b border-gray-50 pb-3">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <Megaphone size={14} className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Yeni Duyuru: {a?.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{a?.date || 'Yakın Zamanda'}</p>
                </div>
              </div>
            ))}
            {(students || []).slice(0, 1).map(s => (
              <div key={s?.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <UserPlus size={14} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Yeni Öğrenci Kaydı: {s?.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s?.department}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
