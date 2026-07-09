import React, { useState } from 'react';
import TopProfileMenu from './TopProfileMenu';
import { contentData } from './NewsEvents';
import { Megaphone, Star } from 'lucide-react';
import CMSEvents from './admin/CMSEvents';
import CMSNews from './admin/CMSNews';
import CMSAnnouncements from './admin/CMSAnnouncements';
import CMSJobs from './admin/CMSJobs';
import CMSFeatured from './admin/CMSFeatured';
import CMSMentorship from './admin/CMSMentorship';
import CMSStudents from './admin/CMSStudents';
import CMSAlumni from './admin/CMSAlumni';
import CMSCompanies from './admin/CMSCompanies';
import CMSMessages from './admin/CMSMessages';
import CMSIntegrations from './admin/CMSIntegrations';
import CMSAcademicStaff from './admin/CMSAcademicStaff';
import CMSVoluntaryInternships from './admin/CMSVoluntaryInternships';
import CMSSEMCourses from './admin/CMSSEMCourses';
import CMSAcademicCatalog from './admin/CMSAcademicCatalog';
import CMSAcademicApprovals from './admin/CMSAcademicApprovals';
import DataCleanup from './admin/DataCleanup';
import OfficialContentImport from './admin/OfficialContentImport';
import CMSSurveys from './admin/CMSSurveys';
import CMSAnalytics from './admin/CMSAnalytics';
import CMSAlumniAssoc from './admin/CMSAlumniAssoc';
import CMSAlumniCard from './admin/CMSAlumniCard';
import CMSGroups from './admin/CMSGroups';
import PanelHeader from './admin/PanelHeader';
import Logo from './Logo';
import {
  LayoutDashboard, Users, Briefcase, Calendar,
  MessageSquare, GraduationCap, Building2, CreditCard,
  BarChart3, Network, ClipboardList, LogOut,
  ChevronDown, ChevronUp, Search, Bell, Bell as BellIcon,
  CheckCircle, XCircle, Plus, Trash2, Send,
  UserCheck, BookOpen, FileText, Heart, Award, ShieldCheck, Library,
  TrendingUp, Activity, Eye, Edit, Newspaper, Database, UserPlus, ShieldAlert, Settings
} from 'lucide-react';

// ══════════════════════════════════════════════════════════════
//  MOCK DATA
// ══════════════════════════════════════════════════════════════
const STUDENTS = [
  { id:'STD-001', name:'Ayşe Kaya',      dept:'Bilgisayar Müh.', year:3, gpa:3.4, cv:true,  status:'Aktif' },
  { id:'STD-002', name:'Mehmet Demir',   dept:'Endüstri Müh.',   year:4, gpa:2.9, cv:false, status:'Aktif' },
  { id:'STD-003', name:'Elif Şahin',     dept:'İşletme',         year:2, gpa:3.8, cv:true,  status:'Aktif' },
  { id:'STD-004', name:'Burak Yılmaz',   dept:'Yazılım Müh.',    year:3, gpa:3.1, cv:true,  status:'Pasif' },
  { id:'STD-005', name:'Selin Çelik',    dept:'Makine Müh.',     year:4, gpa:3.6, cv:false, status:'Aktif' },
  { id:'STD-006', name:'Can Arslan',     dept:'Elektrik Müh.',   year:1, gpa:3.2, cv:false, status:'Aktif' },
  { id:'STD-007', name:'Zeynep Kurt',    dept:'Bilgisayar Müh.', year:4, gpa:3.9, cv:true,  status:'Aktif' },
  { id:'STD-008', name:'Emre Doğan',     dept:'İnşaat Müh.',     year:2, gpa:2.7, cv:false, status:'Aktif' },
  { id:'STD-009', name:'Seda Tunç',      dept:'İşletme',         year:3, gpa:3.5, cv:true,  status:'Aktif' },
  { id:'STD-010', name:'Tarık Polat',    dept:'Yazılım Müh.',    year:1, gpa:2.5, cv:false, status:'Aktif' },
];

const ALUMNI = [];

const COMPANIES = [];

const ALUMNI_CARDS = [];

const JOBS_INIT = [];

const MENTORSHIPS_INIT = [];

const VOLUNTEER_INIT = [];

const MESSAGES_INIT = [];

const SURVEYS_INIT = [
  { id:'SRV-001', title:'Kariyer Beklentileri Anketi 2026', responses:87, total:120, status:'Aktif',  date:'01.07.2026' },
  { id:'SRV-002', title:'Staj Memnuniyet Anketi',          responses:34, total:50,  status:'Kapandı', date:'15.06.2026' },
  { id:'SRV-003', title:'SEM Kurs Değerlendirmesi',        responses:12, total:30,  status:'Aktif',  date:'05.07.2026' },
];

const SEM_INIT = [
  { id:'SEM-001', title:'Python ile Veri Bilimi',      instructor:'Dr. Hasan Öztürk', quota:30, enrolled:24, date:'10.07.2026', status:'Aktif'       },
  { id:'SEM-002', title:'Dijital Pazarlama Sertifikası',instructor:'Fatma Yıldız',    quota:25, enrolled:25, date:'20.07.2026', status:'Dolu'         },
  { id:'SEM-003', title:'Kariyer Koçluğu Programı',    instructor:'Ali Koç',          quota:20, enrolled:8,  date:'01.08.2026', status:'Kayıt Açık'   },
  { id:'SEM-004', title:'İş Hukuku Temelleri',         instructor:'Av. Selin Ekici', quota:35, enrolled:18, date:'05.08.2026', status:'Kayıt Açık'   },
];

const NEWS_INIT = [
  ...((contentData?.haberler || []) || []).map((h, i) => ({ id: 'NE-H' + i, type: 'Haber', title: h?.title, date: h?.date, status: 'Yayında' })),
  ...((contentData?.duyurular || []) || []).map((d, i) => ({ id: 'NE-D' + i, type: 'Duyuru', title: d?.title, date: d?.date, status: 'Yayında' })),
  ...((contentData?.etkinlikler || []) || []).map((e, i) => ({ id: 'NE-E' + i, type: 'Etkinlik', title: e?.title, date: e?.date, status: 'Beklemede' }))
];





const EVENTS_INIT = [
  { id:'EVT-001', title:'Kariyer Fuarı 2026',  category:'Kariyer', type:'Yüz yüze', date:'15.07.2026', quota:500, status:'Yayında'   },
  { id:'EVT-002', title:'Google ile Buluşma',  category:'Firma',   type:'Online',   date:'20.07.2026', quota:200, status:'Beklemede' },
  { id:'EVT-003', title:'Mezun Günü',          category:'Mezun',   type:'Yüz yüze', date:'01.08.2026', quota:300, status:'Yayında'   },
];

const ORG = {
  name:'Prof. Dr. Ahmet Bulut', title:'Rektör',
  children:[{
    name:'Dr. Zeynep Aksoy', title:'Kariyer Ofisi Direktörü',
    children:[
      { name:'Murat Koç',     title:'Kariyer Danışmanı',    children:[] },
      { name:'Seda Türkmen',  title:'Mezun İlişkileri',     children:[] },
      { name:'Tarık Polat',   title:'Firma İlişkileri',     children:[] },
    ]
  }]
};

// ══════════════════════════════════════════════════════════════
//  SHARED UI COMPONENTS
// ══════════════════════════════════════════════════════════════
function Badge({ status }) {
  const map = {
    'Yayında':'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Aktif':'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Onaylı':'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Kayıt Açık':'bg-sky-100 text-sky-700 border-sky-200',
    'İnceleniyor':'bg-sky-100 text-sky-700 border-sky-200',
    'Beklemede':'bg-amber-100 text-amber-700 border-amber-200',
    'Onay Bekliyor':'bg-amber-100 text-amber-700 border-amber-200',
    'Eşleştirme Bekliyor':'bg-amber-100 text-amber-700 border-amber-200',
    'Kapandı':'bg-gray-100 text-gray-500 border-gray-200',
    'Pasif':'bg-gray-100 text-gray-500 border-gray-200',
    'Dolu':'bg-orange-100 text-orange-700 border-orange-200',
    'PART TIME':'bg-purple-100 text-purple-700 border-purple-200',
    'TAM ZAMANLI':'bg-blue-100 text-blue-700 border-blue-200',
    'STAJ':'bg-indigo-100 text-indigo-700 border-indigo-200',
    'Reddedildi':'bg-red-100 text-red-700 border-red-200',
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${map[status]||'bg-gray-100 text-gray-500 border-gray-200'}`}>{status}</span>;
}

function Card({ children, className='' }) {
  return <div className={`bg-white/80 backdrop-blur-xl rounded-3xl border border-[var(--border-soft)] shadow-[var(--shadow-soft)] ${className}`}>{children}</div>;
}

function StatCard({ icon, label, value, sub, color='red' }) {
  const colors = {
    red:   { bg:'bg-red-50',    text:'text-red-600',    ring:'ring-red-200'    },
    blue:  { bg:'bg-blue-50',   text:'text-blue-600',   ring:'ring-blue-200'   },
    green: { bg:'bg-emerald-50',text:'text-emerald-600',ring:'ring-emerald-200'},
    purple:{ bg:'bg-purple-50', text:'text-purple-600', ring:'ring-purple-200' },
    orange:{ bg:'bg-orange-50', text:'text-orange-600', ring:'ring-orange-200' },
  };
  const c = colors[color]||colors.red;
  return (
    <Card className="p-5">
      <div className={`w-11 h-11 rounded-xl ${c.bg} ${c.text} flex items-center justify-center mb-4 ring-1 ${c.ring}`}>{icon}</div>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      <p className="text-sm font-semibold text-gray-700 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </Card>
  );
}

function Progress({ value, max, color='red' }) {
  const pct = Math.round((value / (max || 1)) * 100);
  const colors = { red:'bg-red-500', blue:'bg-blue-500', green:'bg-emerald-500', orange:'bg-orange-500', purple:'bg-purple-500' };
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${colors[color]||colors.red} rounded-full transition-all`} style={{width:`${pct}%`}} />
      </div>
      <span className="text-xs font-bold text-gray-600 w-8 text-right">{pct}%</span>
    </div>
  );
}


function Tbl({ headers, rows, empty='Kayıt bulunamadı' }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {(headers || []).map((h,i)=><th key={i} className="text-left text-[11px] font-black text-gray-400 uppercase tracking-wider pb-3 pr-4 first:pl-0">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {(rows || []).length===0 ? (
            <tr><td colSpan={(headers || []).length} className="py-8 text-center text-gray-400 text-sm">{empty}</td></tr>
          ) : (rows || []).map((row,i)=>(
            <tr key={i} className="hover:bg-gray-50/60 transition-colors">
              {(row || []).map((cell,j)=><td key={j} className="py-3 pr-4 text-gray-700 align-middle first:pl-0">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BtnGreen({ onClick, children }) {
  return <button onClick={onClick} className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg text-xs font-bold transition">{children}</button>;
}
function BtnRed({ onClick, children }) {
  return <button onClick={onClick} className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-bold transition">{children}</button>;
}
function BtnPrimary({ onClick, children, type='button', className='' }) {
  return <button type={type} onClick={onClick} className={`flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition shadow-sm ${className}`}>{children}</button>;
}

// ══════════════════════════════════════════════════════════════
//  PANELS
// ══════════════════════════════════════════════════════════════

// ── 1. Kontrol Merkezi ────────────────────────────────────────
function OverviewPanel({ students = [], alumni = [], jobs = [], events = [], announcements = [], messages = [], mentorships = [], voluntaryInternships = [], surveys = [], academicApprovals = [] }) {
  const depts = {};
  (students || []).forEach(s => { depts[s?.dept]=(depts[s?.dept]||0)+1; });
  const deptList = Object.entries(depts).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const maxDept = deptList[0]?.[1]||1;

  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader title="Kontrol Merkezi" sub="Sistemin genel durumu" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users size={20}/>} label="Aktif Öğrenci" value={(students || []).filter(s=>s?.status==='Aktif').length} sub="Toplam kayıtlı" color="blue" />
        <StatCard icon={<Briefcase size={20}/>} label="Açık İlanlar" value={(jobs || []).filter(j=>j?.status==='Yayında').length} sub={`${(jobs || []).filter(j=>j?.status==='Beklemede').length} onay bekliyor`} color="red" />
        <StatCard icon={<GraduationCap size={20}/>} label="Mezun Kaydı" value={(alumni || []).length} sub={`${(alumni || []).filter(a=>a.mentor).length} aktif mentor`} color="purple" />
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
              <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-600 font-medium">{item.label}</span>
                <span className={`text-lg font-black ${item.val>0?'text-red-600':'text-gray-400'}`}>{item.val}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent messages */}
        <Card className="p-6 col-span-1">
          <h3 className="font-black text-gray-900 mb-4">Son Mesajlar</h3>
          <div className="space-y-3">
            {(messages || []).slice(0,4).map(m=>(
              <div key={m?.id} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${m?.read?'bg-gray-300':'bg-red-500'}`}/>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{m?.from}</p>
                  <p className="text-xs text-gray-500 truncate">{m?.subject}</p>
                  <p className="text-xs text-gray-400">{m?.date}</p>
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

// ── 2. Operasyon Özeti ────────────────────────────────────────
function OperasyonPanel({ jobs = [], setJobs, voluntaryInternships = [], setVoluntaryInternships, mentorships = [] }) {
  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader title="Operasyon Özeti" sub="Günlük iş akışı ve onay gerektiren işlemler" />

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5 border-l-4 border-amber-400">
          <p className="text-3xl font-black text-gray-900">{(jobs || []).filter(j=>j?.status==='Beklemede').length}</p>
          <p className="text-xs font-bold text-gray-500 uppercase mt-1">Onay Bekleyen İlan</p>
        </Card>
        <Card className="p-5 border-l-4 border-blue-400">
          <p className="text-3xl font-black text-gray-900">{(voluntaryInternships || []).filter(v=>v.status==='Onay Bekliyor').length}</p>
          <p className="text-xs font-bold text-gray-500 uppercase mt-1">Staj Onay Bekliyor</p>
        </Card>
        <Card className="p-5 border-l-4 border-purple-400">
          <p className="text-3xl font-black text-gray-900">{(mentorships || []).filter(m=>m.status==='Eşleştirme Bekliyor').length}</p>
          <p className="text-xs font-bold text-gray-500 uppercase mt-1">Mentor Eşleşme Bekliyor</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-black text-gray-900 mb-4">Onay Bekleyen İlanlar</h3>
        {(jobs || []).filter(j=>j?.status==='Beklemede').length===0
          ? <p className="text-gray-400 text-sm text-center py-6">✓ Onay bekleyen ilan yok</p>
          : <Tbl
              headers={['İlan','Firma','Tür','Tarih','İşlem']}
              rows={(jobs || []).filter(j=>j?.status==='Beklemede').map(j=>[
                <span className="font-bold text-gray-900">{j?.title}</span>,
                j?.company, <Badge status={j?.type}/>, j?.date,
                <div className="flex gap-2">
                  <BtnGreen onClick={()=>setJobs((jobs || []).map(x=>x.id===j?.id?{...x,status:'Yayında'}:x))}>Onayla</BtnGreen>
                  <BtnRed onClick={()=>setJobs((jobs || []).filter(x=>x.id!==j?.id))}>Reddet</BtnRed>
                </div>
              ])}
            />}
      </Card>

      <Card className="p-6">
        <h3 className="font-black text-gray-900 mb-4">Onay Bekleyen Stajlar</h3>
        {(voluntaryInternships || []).filter(v=>v.status==='Onay Bekliyor').length===0
          ? <p className="text-gray-400 text-sm text-center py-6">✓ Onay bekleyen staj yok</p>
          : <Tbl
              headers={['Öğrenci','Firma','Pozisyon','Başlangıç','İşlem']}
              rows={(voluntaryInternships || []).filter(v=>v.status==='Onay Bekliyor').map(v=>[
                <span className="font-bold">{v.student}</span>,
                v.company, v.position, v.startDate,
                <div className="flex gap-2">
                  <BtnGreen onClick={()=>setVoluntaryInternships((voluntaryInternships || []).map(x=>x.id===v.id?{...x,status:'Onaylı'}:x))}>Onayla</BtnGreen>
                  <BtnRed onClick={()=>setVoluntaryInternships((voluntaryInternships || []).map(x=>x.id===v.id?{...x,status:'Reddedildi'}:x))}>Reddet</BtnRed>
                </div>
              ])}
            />}
      </Card>
    </div>
  );
}

// ── 3. Akademik Performans ────────────────────────────────────
function AkademikPanel({ students = [] }) {
  const avg = ((students || []).reduce((a,s)=>a+parseFloat(s?.gpa||0),0)/((students || []).length||1)).toFixed(2);
  const honor = (students || []).filter(s=>s?.gpa>=3.5).length;
  const withCV = (students || []).filter(s=>s?.cv).length;
  const [search, setSearch] = useState('');
  const filtered = (students || []).filter(s=>s?.name.toLowerCase().includes(search.toLowerCase())||s?.dept.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader title="Akademik Performans" sub="GPA, bölüm dağılımı ve öğrenci özeti" />

      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={<BarChart3 size={20}/>} label="Ortalama GPA" value={avg} sub="Tüm öğrenciler" color="blue"/>
        <StatCard icon={<Award size={20}/>} label="Yüksek Onur" value={honor} sub="GPA ≥ 3.5" color="green"/>
        <StatCard icon={<FileText size={20}/>} label="CV Yüklemiş" value={withCV} sub={`${(students || []).length-withCV} eksik`} color="orange"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6 col-span-1">
          <h3 className="font-black text-gray-900 mb-4">GPA Dağılımı</h3>
          <div className="space-y-3">
            {[
              {label:'3.5 – 4.0 (Yüksek Onur)',val:(students || []).filter(s=>s?.gpa>=3.5).length,color:'green'},
              {label:'3.0 – 3.5 (Onur)',        val:(students || []).filter(s=>s?.gpa>=3.0&&s?.gpa<3.5).length,color:'blue'},
              {label:'2.5 – 3.0 (Geçer)',       val:(students || []).filter(s=>s?.gpa>=2.5&&s?.gpa<3.0).length,color:'orange'},
              {label:'2.0 – 2.5 (Alt Sınır)',   val:(students || []).filter(s=>s?.gpa<2.5).length,color:'red'},
            ].map(g=>(
              <div key={g.label}>
                <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                  <span>{g.label}</span><span className="font-black text-gray-900">{g.val}</span>
                </div>
                <Progress value={g.val} max={(students || []).length || 1} color={g.color}/>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-900">Öğrenci Listesi</h3>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Ara..." className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-300"/>
            </div>
          </div>
          <Tbl
            headers={['Ad Soyad','Bölüm','Sınıf','GPA','CV','Durum']}
            rows={filtered.map(s=>[
              <span className="font-bold text-gray-900">{s?.name}</span>,
              s?.dept,
              `${s?.year}. Sınıf`,
              <span className={`font-black ${s?.gpa>=3.5?'text-emerald-600':s?.gpa>=3.0?'text-blue-600':'text-orange-600'}`}>{s?.gpa}</span>,
              s?.cv?<CheckCircle size={15} className="text-emerald-500"/>:<XCircle size={15} className="text-gray-300"/>,
              <Badge status={s?.status}/>
            ])}
          />
        </Card>
      </div>
    </div>
  );
}

// ── 4. İçerik Yönetimi ───────────────────────────────────────
function IcerikPanel({ newsEvents = [], setNewsEvents }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({type:'Haber',title:'',date:''});
  const handleAdd = e => {
    e.preventDefault();
    setNewsEvents([{id:`NE-${Date.now()}`, ...form, status:'Beklemede'},...(newsEvents || [])]);
    setForm({type:'Haber',title:'',date:''}); setShowForm(false);
  };
  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader title="İçerik Yönetimi" sub="Vitrin haber, duyuru ve etkinliklerini yönetin"
        action={<BtnPrimary onClick={()=>setShowForm(!showForm)}><Plus size={15}/>Yeni Ekle</BtnPrimary>}/>

      {showForm && (
        <Card className="p-6 border-l-4 border-red-500">
          <h3 className="font-black text-gray-900 mb-4">Yeni İçerik</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Tür</label>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300">
                <option>Haber</option><option>Duyuru</option><option>Etkinlik</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Başlık</label>
              <input type="text" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Başlık giriniz..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" required/>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Tarih</label>
              <input type="date" value={form?.date} onChange={e=>setForm({...form,date:e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"/>
            </div>
            <div className="col-span-3 flex gap-3">
              <button type="submit" className="bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-700 transition">Kaydet</button>
              <button type="button" onClick={()=>setShowForm(false)} className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 transition">İptal</button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={<FileText size={20}/>} label="Toplam İçerik" value={(newsEvents || []).length} color="blue"/>
        <StatCard icon={<CheckCircle size={20}/>} label="Yayında" value={(newsEvents || []).filter(n=>n.status==='Yayında').length} color="green"/>
        <StatCard icon={<Bell size={20}/>} label="Onay Bekliyor" value={(newsEvents || []).filter(n=>n.status==='Beklemede').length} color="orange"/>
      </div>

      <Card className="p-6">
        <Tbl
          headers={['Tür','Başlık','Tarih','Durum','İşlem']}
          rows={(newsEvents || []).map(ne=>[
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-bold">{ne?.type}</span>,
            <span className="font-semibold">{ne?.title}</span>,
            ne?.date,
            <Badge status={ne?.status}/>,
            <div className="flex gap-2">
              {ne?.status==='Beklemede'&&<BtnGreen onClick={()=>setNewsEvents((newsEvents || []).map(x=>x.id===ne?.id?{...x,status:'Yayında'}:x))}>Yayınla</BtnGreen>}
              <button onClick={()=>setNewsEvents((newsEvents || []).filter(x=>x.id!==ne?.id))} className="text-red-400 hover:text-red-600 transition p-1"><Trash2 size={14}/></button>
            </div>
          ])}
        />
      </Card>
    </div>
  );
}

// ── 5. Aktif Öğrenciler ───────────────────────────────────────
function OgrencilerPanel({ students }) {
  const [search, setSearch] = useState('');
  const filtered = (students || []).filter(s=>
    s?.name.toLowerCase().includes(search.toLowerCase())||
    s?.dept.toLowerCase().includes(search.toLowerCase())||
    s?.id.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader title="Aktif Öğrenciler" sub="Sistemde kayıtlı tüm öğrenciler"/>
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={<Users size={20}/>} label="Toplam Öğrenci" value={(students || []).length} color="blue"/>
        <StatCard icon={<CheckCircle size={20}/>} label="Aktif" value={(students || []).filter(s=>s?.status==='Aktif').length} color="green"/>
        <StatCard icon={<FileText size={20}/>} label="CV Yüklemiş" value={(students || []).filter(s=>s?.cv).length} color="purple"/>
        <StatCard icon={<Award size={20}/>} label="Onur Öğrencisi" value={(students || []).filter(s=>s?.gpa>=3.5).length} color="orange"/>
      </div>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-gray-900">Öğrenci Havuzu <span className="text-gray-400 font-normal text-base">({filtered.length} kayıt)</span></h3>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="İsim, bölüm veya numara..." className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-300 w-72"/>
          </div>
        </div>
        <Tbl
          headers={['No','Ad Soyad','Bölüm','Sınıf','GPA','CV','Durum']}
          rows={filtered.map(s=>[
            <span className="text-gray-400 text-xs font-mono">{s?.id}</span>,
            <span className="font-bold text-gray-900">{s?.name}</span>,
            s?.dept,
            `${s?.year}. Sınıf`,
            <span className={`font-black text-sm ${s?.gpa>=3.5?'text-emerald-600':s?.gpa>=3.0?'text-blue-600':'text-orange-600'}`}>{s?.gpa}</span>,
            s?.cv?<CheckCircle size={15} className="text-emerald-500"/>:<XCircle size={15} className="text-gray-300"/>,
            <Badge status={s?.status}/>
          ])}
        />
      </Card>
    </div>
  );
}

// ── 6. Mezun Bilgi Havuzu ─────────────────────────────────────
function MezunPanel({ alumni }) {
  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader title="Mezun Bilgi Havuzu" sub="Mezun kariyer profilleri ve mentor ağı"/>
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={<GraduationCap size={20}/>} label="Toplam Mezun" value={(alumni || []).length} color="blue"/>
        <StatCard icon={<UserCheck size={20}/>} label="Aktif Mentor" value={(alumni || []).filter(a=>a.mentor).length} color="green"/>
        <StatCard icon={<Building2 size={20}/>} label="Farklı Firma" value={[...new Set((alumni || []).map(a=>a.company))].length} color="purple"/>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {(alumni || []).map(a=>(
          <Card key={a.id} className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-black text-lg shrink-0">
                {a.name.charAt(a.name.indexOf(' ')+1)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-black text-gray-900">{a.name}</p>
                  {a.mentor && <span className="text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">Mentor</span>}
                </div>
                <p className="text-sm text-gray-500">{a.dept} · {a.gradYear}</p>
                <p className="text-sm font-bold text-red-600 mt-0.5">{a?.title}</p>
                <p className="text-xs text-gray-400">{a.company}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── 7. Firma Bilgi Havuzu ─────────────────────────────────────
function FirmaPanel({ companies = [] }) {
  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader title="Firma Bilgi Havuzu" sub="Sisteme kayıtlı ve onaylı firmalar"/>
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={<Building2 size={20}/>} label="Toplam Firma" value={(companies || []).length} color="blue"/>
        <StatCard icon={<CheckCircle size={20}/>} label="Onaylı" value={(companies || []).filter(c=>c?.status==='Onaylı').length} color="green"/>
        <StatCard icon={<Bell size={20}/>} label="Onay Bekliyor" value={(companies || []).filter(c=>c?.status==='Onay Bekliyor').length} color="orange"/>
        <StatCard icon={<Briefcase size={20}/>} label="Toplam İlan" value={(companies || []).reduce((a,c)=>a+c?.jobs,0)} color="purple"/>
      </div>
      <Card className="p-6">
        <Tbl
          headers={['Kod','Firma','Sektör','İletişim','Aktif İlan','Durum','İşlem']}
          rows={(companies || []).map(c=>[
            <span className="text-gray-400 text-xs font-mono">{c?.id}</span>,
            <span className="font-bold text-gray-900">{c?.name}</span>,
            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded font-bold text-gray-700">{c?.sector}</span>,
            <span className="text-xs text-blue-600">{c?.contact}</span>,
            <span className="font-black text-gray-900">{c?.jobs}</span>,
            <Badge status={c?.status}/>,
            <div className="flex gap-2">
              {c?.status!=='Onaylı'&&<BtnGreen onClick={()=>{}}>Onayla</BtnGreen>}
              <BtnRed onClick={()=>{}}>Sil</BtnRed>
            </div>
          ])}
        />
      </Card>
    </div>
  );
}

// ── 10. İlan Yönetimi ─────────────────────────────────────────
function IlanPanel({ jobs, setJobs }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({title:'',company:'',type:'TAM ZAMANLI'});
  const handleAdd = e => {
    e.preventDefault();
    setJobs([{id:`JOB-${Date.now()}`,applicants:0,date:new Date().toLocaleDateString('tr-TR'),status:'Beklemede',...form},...(jobs || [])]);
    setForm({title:'',company:'',type:'TAM ZAMANLI'}); setShowForm(false);
  };
  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader title="İlan Yönetimi" sub="İş ve staj ilanlarını yönetin"
        action={<BtnPrimary onClick={()=>setShowForm(!showForm)}><Plus size={15}/>Yeni İlan</BtnPrimary>}/>

      {showForm&&(
        <Card className="p-6 border-l-4 border-red-500">
          <h3 className="font-black text-gray-900 mb-4">Yeni İlan Ekle</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-3 gap-4">
            <div><label className="text-xs font-bold text-gray-600 block mb-1">İlan Başlığı</label>
              <input type="text" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Örn: Frontend Developer" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" required/></div>
            <div><label className="text-xs font-bold text-gray-600 block mb-1">Firma</label>
              <input type="text" value={form.company} onChange={e=>setForm({...form,company:e.target.value})} placeholder="Örn: Google Turkey" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" required/></div>
            <div><label className="text-xs font-bold text-gray-600 block mb-1">Tür</label>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300">
                <option>TAM ZAMANLI</option><option>STAJ</option><option>PART TIME</option>
              </select></div>
            <div className="col-span-3 flex gap-3">
              <button type="submit" className="bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-700 transition">Kaydet</button>
              <button type="button" onClick={()=>setShowForm(false)} className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 transition">İptal</button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={<Briefcase size={20}/>} label="Toplam İlan" value={(jobs || []).length} color="blue"/>
        <StatCard icon={<CheckCircle size={20}/>} label="Yayında" value={(jobs || []).filter(j=>j?.status==='Yayında').length} color="green"/>
        <StatCard icon={<Bell size={20}/>} label="Onay Bekliyor" value={(jobs || []).filter(j=>j?.status==='Beklemede').length} color="orange"/>
        <StatCard icon={<Users size={20}/>} label="Toplam Başvuran" value={(jobs || []).reduce((a,j)=>a+j.applicants,0)} color="purple"/>
      </div>

      <Card className="p-6">
        <Tbl
          headers={['No','Başlık','Firma','Tür','Başvuran','Tarih','Durum','İşlem']}
          rows={(jobs || []).map(j=>[
            <span className="text-gray-400 text-xs font-mono">{j?.id}</span>,
            <span className="font-bold text-gray-900">{j?.title}</span>,
            j?.company, <Badge status={j?.type}/>,
            <span className="font-bold">{j.applicants}</span>,
            j?.date, <Badge status={j?.status}/>,
            <div className="flex gap-2">
              {j?.status==='Beklemede'&&<BtnGreen onClick={()=>setJobs((jobs || []).map(x=>x.id===j?.id?{...x,status:'Yayında'}:x))}>Yayınla</BtnGreen>}
              <button onClick={()=>setJobs((jobs || []).filter(x=>x.id!==j?.id))} className="text-red-400 hover:text-red-600 p-1 transition"><Trash2 size={14}/></button>
            </div>
          ])}
        />
      </Card>
    </div>
  );
}

// ── 11. Etkinlik Yönetimi ─────────────────────────────────────
function EtkinlikPanel({ events, setEvents }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({title:'',category:'',type:'Yüz yüze',date:'',quota:'',description:'',image:null});
  const handleImg = e => { const f=e.target.files[0]; if(f)setForm({...form,image:URL.createObjectURL(f)}); };
  const handleSubmit = e => {
    e.preventDefault();
    setEvents([{id:`EVT-${Date.now()}`,...form,status:'Beklemede'},...(events || [])]);
    setForm({title:'',category:'',type:'Yüz yüze',date:'',quota:'',description:'',image:null}); setStep(1);
  };
  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader title="Etkinlik Yönetimi" sub="Yeni etkinlik oluştur ve mevcut etkinlikleri yönet"/>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              {[1,2,3].map(n=>(
                <React.Fragment key={n}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all ${step>=n?'bg-red-600 text-white':'bg-gray-100 text-gray-400'}`}>{n}</div>
                  {n<3&&<div className={`h-0.5 flex-1 transition-all ${step>n?'bg-red-600':'bg-gray-200'}`}/>}
                </React.Fragment>
              ))}
              <span className="ml-2 text-xs text-gray-500">{['Temel Bilgiler','İçerik','Yayın'][step-1]}</span>
            </div>
            <form onSubmit={handleSubmit}>
              {step===1&&(
                <div className="space-y-4">
                  <div><label className="text-xs font-bold text-gray-600 block mb-1">Etkinlik Adı</label>
                    <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Örn. 2026 Kariyer Zirvesi" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" required/></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-bold text-gray-600 block mb-1">Kategori</label>
                      <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300">
                        <option value="">Seçiniz</option><option>Kariyer</option><option>Firma</option><option>SEM</option><option>Mezun</option>
                      </select></div>
                    <div><label className="text-xs font-bold text-gray-600 block mb-1">Etkinlik Türü</label>
                      <div className="flex gap-2">
                        {['Yüz yüze','Online','Hibrit'].map(t=>(
                          <button type="button" key={t} onClick={()=>setForm({...form,type:t})} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition ${form.type===t?'bg-red-600 text-white border-red-600':'bg-gray-50 text-gray-600 border-gray-200 hover:border-red-300'}`}>{t}</button>
                        ))}
                      </div></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-bold text-gray-600 block mb-1">Tarih</label>
                      <input type="date" value={form?.date} onChange={e=>setForm({...form,date:e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"/></div>
                    <div><label className="text-xs font-bold text-gray-600 block mb-1">Kontenjan</label>
                      <input type="number" value={form.quota} onChange={e=>setForm({...form,quota:e.target.value})} placeholder="Örn. 100" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"/></div>
                  </div>
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-red-300 hover:bg-red-50 transition">
                    {form.image?<img src={form.image} className="h-full w-full object-cover rounded-xl" alt=""/>:<>
                      <svg className="text-red-400 mb-1" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <p className="text-xs text-gray-500">Görsel seçmek için tıklayın</p>
                      <p className="text-xs text-gray-400">PNG, JPG veya WEBP · 16:9 önerilir</p>
                    </>}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImg}/>
                  </label>
                  <button type="button" onClick={()=>setStep(2)} className="w-full bg-red-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-red-700 transition">Devam Et →</button>
                </div>
              )}
              {step===2&&(
                <div className="space-y-4">
                  <div><label className="text-xs font-bold text-gray-600 block mb-1">Açıklama</label>
                    <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={6} placeholder="Etkinlik açıklaması..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"/></div>
                  <div className="flex gap-3">
                    <button type="button" onClick={()=>setStep(1)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-bold text-sm">← Geri</button>
                    <button type="button" onClick={()=>setStep(3)} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-red-700 transition">Devam Et →</button>
                  </div>
                </div>
              )}
              {step===3&&(
                <div className="space-y-4">
                  <Card className="p-4 bg-gray-50">
                    {[['Etkinlik Adı',form.title||'—'],['Kategori',form.category||'—'],['Tür',form.type],['Tarih',form?.date||'—'],['Kontenjan',form.quota||'—']].map(([k,v])=>(
                      <div key={k} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0 text-sm">
                        <span className="text-gray-500">{k}</span><span className="font-bold text-gray-900">{v}</span>
                      </div>
                    ))}
                  </Card>
                  <div className="flex gap-3">
                    <button type="button" onClick={()=>setStep(2)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-bold text-sm">← Geri</button>
                    <button type="submit" className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-red-700 transition">Etkinliği Yayınla</button>
                  </div>
                </div>
              )}
            </form>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card className="p-5">
            <h3 className="font-black text-gray-900 mb-4">Etkinlikler</h3>
            <div className="space-y-3">
              {(events || []).map(ev=>(
                <div key={ev.id} className="p-3.5 border border-gray-100 rounded-xl hover:border-red-200 transition">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-bold text-sm text-gray-900">{ev.title}</p>
                    <Badge status={ev.status}/>
                  </div>
                  <p className="text-xs text-gray-500">{ev.category} · {ev.type} · {ev.date}</p>
                  <p className="text-xs text-gray-400 mt-1">Kontenjan: {ev.quota}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── 12. Mentorluk ─────────────────────────────────────────────
function MentorlukPanel({ mentorships, alumni }) {
  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader title="Mentorluk Programı" sub="Mentor-öğrenci eşleştirme ve takip"/>
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={<UserCheck size={20}/>} label="Aktif Eşleşme" value={(mentorships || []).filter(m=>m.status==='Aktif').length} color="green"/>
        <StatCard icon={<Bell size={20}/>} label="Eşleşme Bekliyor" value={(mentorships || []).filter(m=>m.status==='Eşleştirme Bekliyor').length} color="orange"/>
        <StatCard icon={<Users size={20}/>} label="Gönüllü Mentor" value={(alumni || []).filter(a=>a.mentor).length} color="blue"/>
      </div>
      <Card className="p-6">
        <h3 className="font-black text-gray-900 mb-4">Eşleşme Listesi</h3>
        <Tbl
          headers={['No','Mentor','Öğrenci','Alan','Tarih','Durum']}
          rows={(mentorships || []).map(m=>[
            <span className="text-gray-400 text-xs font-mono">{m?.id}</span>,
            <span className="font-bold text-gray-900">{m.mentor}</span>,
            m.mentee,
            <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full font-bold">{m.field}</span>,
            m?.date, <Badge status={m.status}/>
          ])}
        />
      </Card>
      <Card className="p-6">
        <h3 className="font-black text-gray-900 mb-4">Aktif Mentorlar</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {(alumni || []).filter(a=>a.mentor).map(a=>(
            <div key={a.id} className="p-4 border border-gray-100 rounded-xl">
              <p className="font-bold text-gray-900 text-sm">{a.name}</p>
              <p className="text-xs text-red-600 font-semibold">{a?.title}</p>
              <p className="text-xs text-gray-400">{a.company}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── 13. Gönüllü Staj ─────────────────────────────────────────
function GonulluPanel({ volunteerInterns, setVolunteerInterns }) {
  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader title="Gönüllü Staj Başvuruları" sub="Öğrenci staj onay süreçleri"/>
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={<Bell size={20}/>} label="Onay Bekliyor" value={(volunteerInterns || []).filter(v=>v.status==='Onay Bekliyor').length} color="orange"/>
        <StatCard icon={<CheckCircle size={20}/>} label="Onaylı" value={(volunteerInterns || []).filter(v=>v.status==='Onaylı').length} color="green"/>
        <StatCard icon={<XCircle size={20}/>} label="Reddedilen" value={(volunteerInterns || []).filter(v=>v.status==='Reddedildi').length} color="red"/>
      </div>
      <Card className="p-6">
        <Tbl
          headers={['No','Öğrenci','Firma','Pozisyon','Başlangıç','Durum','İşlem']}
          rows={(volunteerInterns || []).map(v=>[
            <span className="text-gray-400 text-xs font-mono">{v.id}</span>,
            <span className="font-bold text-gray-900">{v.student}</span>,
            v.company, v.position, v.startDate,
            <Badge status={v.status}/>,
            v.status==='Onay Bekliyor'?(
              <div className="flex gap-2">
                <BtnGreen onClick={()=>setVolunteerInterns((volunteerInterns || []).map(x=>x.id===v.id?{...x,status:'Onaylı'}:x))}>Onayla</BtnGreen>
                <BtnRed onClick={()=>setVolunteerInterns((volunteerInterns || []).map(x=>x.id===v.id?{...x,status:'Reddedildi'}:x))}>Reddet</BtnRed>
              </div>
            ):<span className="text-gray-400 text-xs">—</span>
          ])}
        />
      </Card>
    </div>
  );
}

// ── 14. SEM ───────────────────────────────────────────────────
function SEMPanel({ semCourses }) {
  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader title="SEM Kurs Yönetimi" sub="Sürekli Eğitim Merkezi kurs takibi"/>
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={<CheckCircle size={20}/>} label="Aktif Kurs" value={(semCourses || []).filter(c=>c?.status==='Aktif').length} color="green"/>
        <StatCard icon={<Users size={20}/>} label="Toplam Kayıtlı" value={(semCourses || []).reduce((a,c)=>a+c.enrolled,0)} color="purple"/>
        <StatCard icon={<Award size={20}/>} label="Dolan Kurs" value={(semCourses || []).filter(c=>c?.status==='Dolu').length} color="orange"/>
      </div>
      <Card className="p-6">
        <h3 className="font-black text-gray-900 mb-4">Kurs Doluluk Oranları</h3>
        <div className="space-y-4">
          {(semCourses || []).map(c=>(
            <div key={c?.id} className="p-4 border border-gray-100 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-bold text-gray-900">{c.title}</p>
                  <p className="text-xs text-gray-500">{c.instructor} · {c.date}</p>
                </div>
                <Badge status={c?.status}/>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={c.enrolled} max={c.quota} color={c.enrolled===c.quota?'red':'green'}/>
                <span className="text-xs font-bold text-gray-600 shrink-0">{c.enrolled}/{c.quota}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── 16. Anket ─────────────────────────────────────────────────
function AnketPanel({ surveys }) {
  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader title="Anket Yönetimi" sub="Aktif ve tamamlanmış anket sonuçları"/>
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={<BarChart3 size={20}/>} label="Toplam Anket" value={(surveys || []).length} color="blue"/>
        <StatCard icon={<CheckCircle size={20}/>} label="Aktif" value={(surveys || []).filter(s=>s?.status==='Aktif').length} color="green"/>
        <StatCard icon={<Users size={20}/>} label="Toplam Yanıt" value={(surveys || []).reduce((a,s)=>a+s.responses,0)} color="purple"/>
      </div>
      <div className="space-y-4">
        {(surveys || []).map(s=>(
          <Card key={s?.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-black text-gray-900 text-lg">{s.title}</p>
                <p className="text-xs text-gray-400 mt-1">{s.date}</p>
              </div>
              <Badge status={s?.status}/>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <p className="text-2xl font-black text-gray-900">{s.responses}</p>
                <p className="text-xs text-gray-500">Yanıt</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <p className="text-2xl font-black text-gray-900">{s.total}</p>
                <p className="text-xs text-gray-500">Hedef</p>
              </div>
            </div>
            <Progress value={s.responses} max={s.total} color={s.responses===s.total?'green':'red'}/>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── 17. Org Şeması ────────────────────────────────────────────
function OrgNode({ node }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white border-2 border-red-200 rounded-xl px-5 py-3 text-center shadow-sm min-w-[160px] hover:border-red-400 transition">
        <p className="font-black text-gray-900 text-sm">{node.name}</p>
        <p className="text-xs text-red-600 font-bold mt-0.5">{node?.title}</p>
      </div>
      {node.children&&(node.children || []).length>0&&(
        <div className="flex flex-col items-center">
          <div className="w-0.5 h-6 bg-red-200"/>
          <div className="flex gap-8">
            {(node.children || []).map((c,i)=>(
              <div key={i} className="flex flex-col items-center">
                <div className="w-0.5 h-4 bg-red-200"/>
                <OrgNode node={c}/>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
function OrgPanel() {
  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader title="Organizasyon Şeması" sub="Kariyer Ofisi yapısı"/>
      <Card className="p-10 overflow-auto"><OrgNode node={ORG}/></Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  SIDEBAR NAVIGATION CONFIG
// ══════════════════════════════════════════════════════════════
const PANEL_CATEGORIES = [
  { id: 'genel', label: 'Genel Bakış', icon: <LayoutDashboard size={14}/>, panels: ['overview', 'operasyon', 'akademik'] },
  { id: 'kullanici', label: 'Kullanıcı Yönetimi', icon: <Users size={14}/>, panels: ['students', 'alumni', 'companies', 'academic_staff', 'mezun_dernek', 'sem', 'cms_groups'] },
  { id: 'icerik', label: 'İçerik & Platform', icon: <FileText size={14}/>, panels: ['cms_news', 'cms_ann', 'cms_events', 'cms_jobs', 'cms_feat', 'cms_ment'] },
  { id: 'sistem', label: 'Sistem & Analiz', icon: <Settings size={14}/>, panels: ['cleanup', 'content_import', 'analytics', 'anket', 'kart'] }
];

const MAIN_TABS = [
  { id:'overview',   label:'Kontrol Merkezi',    icon:<LayoutDashboard size={17}/> },
  { id:'operasyon',  label:'Operasyon Özeti',    icon:<Activity size={17}/> },
  { id:'akademik',   label:'Akademik Performans',icon:<TrendingUp size={17}/> },
  { id:'academic_catalog', label:'Akademik Katalog', icon:<Library size={17}/> },
  { id:'academic_approvals', label:'Akademik Bilgi Onayları', icon:<ShieldCheck size={17}/> },
  { id:'cms_news',    label:'Haberler (CMS)',   icon:<FileText size={17}/> },
  { id:'students',   label:'Aktif Öğrenciler',   icon:<Users size={17}/> },
  { id:'academic_staff', label:'Akademik Personel', icon:<BookOpen size={17}/> },
  { id:'alumni',     label:'Mezun Bilgi Havuzu', icon:<GraduationCap size={17}/> },
  { id:'companies',  label:'Firma Bilgi Havuzu', icon:<Building2 size={17}/> },
  { id:'mezun_dernek',label:'Mezun Derneği',     icon:<Heart size={17}/> },
  { id:'kart',       label:'Kart Başvuruları',   icon:<CreditCard size={17}/> },
  { id:'cms_jobs',   label:'İlan & Başvuru Havuzu', icon:<Briefcase size={17}/> },
  { id:'cms_events', label:'Etkinlikler (CMS)',  icon:<Calendar size={17}/> },
  { id:'cms_ann',    label:'Duyurular (CMS)',    icon:<Megaphone size={17}/> },
  { id:'cms_feat',   label:'Öne Çıkanlar (CMS)', icon:<Star size={17}/> },
  { id:'cms_groups', label:'Topluluklar ve Gruplar', icon:<Users size={17}/> },
  { id:'mesajlar',   label:'İletişim Havuzu (Loglar)', icon:<MessageSquare size={17}/> },
];
const MORE_TABS = [
  { id:'cms_ment',   label:'Mentorluk (CMS)', icon:<UserCheck size={17}/> },
  { id:'gonullu',    label:'Gönüllü Staj',        icon:<Award size={17}/> },
  { id:'sem',        label:'SEM Kurs Yönetimi',   icon:<BookOpen size={17}/> },
  
  { id:'anket',      label:'Anket & Veri Havuzu',      icon:<BarChart3 size={17}/> },
  { id:'analytics',  label:'Sistem Analitiği',    icon:<Activity size={17}/> },
  { id:'content_import', label:'Resmî İçerik İçe Aktar', icon:<Database size={17}/> },
  { id:'org',        label:'Organizasyon Şeması', icon:<Network size={17}/> },
  { id:'entegrasyon',label:'Sistem Entegrasyonları',icon:<Database size={17}/> },
  { id:'cleanup',    label:'Veri Temizliği',      icon:<ShieldAlert size={17}/> },
];

// ══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
export default function AdminDashboard({
  currentUser, userRole, academicRole,
  setView, setSelectedUserId,
  posts, setPosts, 
  news, setNews, 
  announcements, setAnnouncements, 
  events, setEvents, 
  semCourses, setSemCourses, 
  surveys, setSurveys, 
  students, setStudents, 
  alumni, setAlumni, 
  companies, setCompanies, 
  jobs, setJobs, 
  featuredOpportunities, setFeaturedOpportunities, 
  mentorships, setMentorships, 
  voluntaryInternships, setVoluntaryInternships,
  messages, setMessages,
  applications, setApplications,
  academicStaff, setAcademicStaff,
  alumniCardApplications, setAlumniCardApplications,
  alumniCardForms, setAlumniCardForms,
  academicCatalog, setAcademicCatalog,
  academicApprovals, setAcademicApprovals,
  groups, setGroups
}) {
    const [activeTab, setActiveTab]       = useState('overview');
  const [activeCategory, setActiveCategory] = useState('genel');
  const [searchQuery, setSearchQuery] = useState('');
  const [alumniCards]                    = useState(ALUMNI_CARDS);
  
  const [showMore,   setShowMore]        = useState(false);

  const unread  = (messages || []).filter(m=>!m?.read).length;
  const pending = (jobs || []).filter(j=>j?.status==='Beklemede').length + (voluntaryInternships || []).filter(v=>v.status==='Taslak').length;

  const renderPanel = () => {
    const p = { students, alumni, companies, jobs, setJobs, mentorships, voluntaryInternships, setVoluntaryInternships, messages, setMessages, surveys, semCourses, newsEvents: news, setNewsEvents: setNews, alumniCards, events, setEvents, academicApprovals, alumniCardApplications, setAlumniCardApplications, alumniCardForms, setAlumniCardForms, posts, setPosts, currentUser };
    switch(activeTab) {
      case 'academic_catalog': return <CMSAcademicCatalog academicCatalog={academicCatalog || []} setAcademicCatalog={setAcademicCatalog} />;
      case 'academic_approvals': return <CMSAcademicApprovals academicApprovals={academicApprovals || []} setAcademicApprovals={setAcademicApprovals} students={students || []} setStudents={setStudents} alumni={alumni || []} setAlumni={setAlumni} />;
      case 'cms_events':  return <CMSEvents events={events || []} setEvents={setEvents} posts={posts} setPosts={setPosts} currentUser={currentUser} />;
      case 'cms_ann':     return <CMSAnnouncements announcements={announcements || []} setAnnouncements={setAnnouncements} posts={posts} setPosts={setPosts} currentUser={currentUser} />;
      case 'cms_jobs':    return <CMSJobs jobs={jobs || []} setJobs={setJobs} applications={applications || []} />;
      case 'cms_feat':    return <CMSFeatured featuredOpportunities={featuredOpportunities || []} setFeaturedOpportunities={setFeaturedOpportunities} />;
      case 'cms_ment':    return <CMSMentorship mentorships={mentorships || []} setMentorships={setMentorships} />;
      case 'cms_groups':  return <CMSGroups groups={groups || []} setGroups={setGroups} currentUser={currentUser} />;
      case 'overview':    return <OverviewPanel {...p}/>;
      case 'operasyon':   return <OperasyonPanel {...p}/>;
      case 'akademik':    return <AkademikPanel {...p}/>;
      case 'cms_news':    return <CMSNews news={p.newsEvents || []} setNews={p.setNewsEvents} posts={posts} setPosts={setPosts} currentUser={currentUser} />;
      case 'companies':   return <CMSCompanies companies={companies || []} setCompanies={setCompanies} />;
      case 'students':    return <CMSStudents students={students || []} setStudents={setStudents} />;
      case 'academic_staff': return <CMSAcademicStaff academicStaff={academicStaff || []} setAcademicStaff={setAcademicStaff} />;
      case 'alumni':      return <CMSAlumni alumni={alumni || []} setAlumni={setAlumni} />;
      case 'mezun_dernek':return <CMSAlumniAssoc posts={posts} setPosts={setPosts} currentUser={currentUser} />;
      case 'kart':        return <CMSAlumniCard alumniCardApplications={alumniCardApplications} setAlumniCardApplications={setAlumniCardApplications} alumniCardForms={alumniCardForms} setAlumniCardForms={setAlumniCardForms} />;
      case 'ilan':        return <CMSJobs jobs={jobs || []} setJobs={setJobs} applications={applications || []} />;
      case 'etkinlik':    return <CMSEvents events={events || []} setEvents={setEvents} posts={posts} setPosts={setPosts} currentUser={currentUser} />;
      case 'mentorluk':   return <CMSMentorship mentorships={mentorships || []} setMentorships={setMentorships} />;
      case 'gonullu':     return <CMSVoluntaryInternships volunteerInterns={voluntaryInternships || []} setVolunteerInterns={setVoluntaryInternships} />;
      case 'sem':         return <CMSSEMCourses semCourses={semCourses || []} setSemCourses={setSemCourses} posts={posts} setPosts={setPosts} currentUser={currentUser} />;
      case 'mesajlar':    return <CMSMessages messages={messages || []} setMessages={setMessages} />;
      case 'entegrasyon': return <CMSIntegrations />;
      case 'anket':       return <CMSSurveys surveys={surveys || []} setSurveys={setSurveys} posts={posts} setPosts={setPosts} currentUser={currentUser} announcements={announcements} setAnnouncements={setAnnouncements} students={students || []} alumni={alumni || []} />;
      case 'analytics':   return <CMSAnalytics students={students || []} alumni={alumni || []} companies={companies || []} jobs={jobs || []} applications={applications || []} />;
      case 'content_import': return <OfficialContentImport news={news || []} setNews={setNews} announcements={announcements || []} setAnnouncements={setAnnouncements} events={events || []} setEvents={setEvents} />;
      case 'org':         return <OrgPanel/>;
      case 'cleanup':     return <DataCleanup students={students || []} setStudents={setStudents} alumni={alumni || []} setAlumni={setAlumni} companies={companies || []} setCompanies={setCompanies} messages={messages || []} setMessages={setMessages} posts={posts || []} setPosts={setPosts} jobs={jobs || []} setJobs={setJobs} />;
      default:            return <OverviewPanel {...p}/>;
    }
  };

  // ALL_TABS birleştirilmesi
  const ALL_TABS = [...MAIN_TABS, ...MORE_TABS];

  // Arama filtresi
  const filteredPanels = searchQuery 
    ? ALL_TABS.filter(t => t.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : ALL_TABS.filter(t => {
        const cat = PANEL_CATEGORIES.find(c => c.id === activeCategory);
        return cat ? cat.panels.includes(t.id) : false;
      });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans relative">

      {/* ── HEADER ─────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100 px-5 py-3 flex items-center gap-4 shrink-0 sticky top-0 z-40">
        
        <div className="flex items-center gap-3 pr-4 border-r border-gray-100 shrink-0">
          <Logo className="w-9 h-9 text-red-700 bg-red-50 rounded-xl p-1.5" />
          <div className="hidden sm:block">
            <h1 className="text-[14px] font-black text-gray-900 leading-tight">Yönetici Paneli</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{academicRole === 'super_admin' ? 'SÜPER ADMİN' : 'KARİYER OFİSİ'}</p>
          </div>
        </div>

        <div className="relative w-64 xl:w-80 ml-2 shrink-0">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Panel ara... (örn: ilan, öğrenci)" 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-[13px] font-medium text-gray-700 focus:outline-none focus:bg-white focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all placeholder:text-gray-400"
          />
        </div>

        <div className="flex overflow-x-auto hide-scrollbar gap-1 flex-1 mx-2 justify-end">
          {PANEL_CATEGORIES.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => { setActiveCategory(cat.id); setActiveTab(cat.panels[0]); setSearchQuery(''); }}
              className={`group flex items-center gap-1.5 px-4 py-2 text-[12px] font-bold transition-all duration-300 whitespace-nowrap rounded-lg ${
                activeCategory === cat.id 
                  ? (() => {
                      switch (cat.id) {
                        case 'genel': return 'bg-blue-50 text-blue-700 border border-blue-200 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]';
                        case 'kullanici': return 'bg-purple-50 text-purple-700 border border-purple-200 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]';
                        case 'icerik': return 'bg-emerald-50 text-emerald-700 border border-emerald-200 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]';
                        case 'sistem': return 'bg-amber-50 text-amber-700 border border-amber-200 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]';
                        default: return 'bg-red-50 text-red-700 border border-red-200 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]';
                      }
                    })()
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:drop-shadow-[0_0_5px_rgba(0,0,0,0.1)]'
              }`}
            >
              <span className={`transition-transform duration-300 group-hover:scale-110 ${
                activeCategory === cat.id 
                  ? (() => {
                      switch (cat.id) {
                        case 'genel': return 'text-blue-600 drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]';
                        case 'kullanici': return 'text-purple-600 drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]';
                        case 'icerik': return 'text-emerald-600 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]';
                        case 'sistem': return 'text-amber-600 drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]';
                        default: return 'text-red-600 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]';
                      }
                    })()
                  : (() => {
                      switch (cat.id) {
                        case 'genel': return 'text-gray-400 group-hover:text-blue-500 group-hover:drop-shadow-[0_0_5px_rgba(59,130,246,0.6)]';
                        case 'kullanici': return 'text-gray-400 group-hover:text-purple-500 group-hover:drop-shadow-[0_0_5px_rgba(168,85,247,0.6)]';
                        case 'icerik': return 'text-gray-400 group-hover:text-emerald-500 group-hover:drop-shadow-[0_0_5px_rgba(16,185,129,0.6)]';
                        case 'sistem': return 'text-gray-400 group-hover:text-amber-500 group-hover:drop-shadow-[0_0_5px_rgba(245,158,11,0.6)]';
                        default: return 'text-gray-400 group-hover:text-red-500 group-hover:drop-shadow-[0_0_5px_rgba(239,68,68,0.6)]';
                      }
                    })()
              }`}>
                {cat.icon}
              </span>
              {cat.label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-2 mr-2">
            {pending>0&&(
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer hover:bg-amber-100 transition" onClick={()=>{setSearchQuery(''); setActiveCategory('genel'); setActiveTab('operasyon');}}>
                <ClipboardList size={13}/> {pending} Onay
              </div>
            )}
            {unread>0&&(
              <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer hover:bg-red-100 transition" onClick={()=>{setSearchQuery(''); setActiveCategory('genel'); setActiveTab('mesajlar');}}>
                <Bell size={13}/> {unread} Mesaj
              </div>
            )}
          </div>
          <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} academicRole={academicRole} />
        </div>
      </header>

      {/* Alt Sekme Butonları (seçili kategorinin panelleri) */}
      <div className="bg-white border-b border-gray-200 shadow-sm shrink-0 sticky top-[65px] z-30">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-2.5">
          <div className="flex flex-wrap gap-2">
            {searchQuery && <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider self-center mr-1">"{searchQuery}" araması:</span>}
            {filteredPanels.map(tab => {
              const catId = PANEL_CATEGORIES.find(c => c.panels.includes(tab.id))?.id || 'genel';
              const theme = {
                genel: { active: 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-300', hoverText: 'group-hover:text-blue-600', iconGlow: 'drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]', hoverGlow: 'group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]' },
                kullanici: { active: 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-300', hoverText: 'group-hover:text-purple-600', iconGlow: 'drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]', hoverGlow: 'group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]' },
                icerik: { active: 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-300', hoverText: 'group-hover:text-emerald-600', iconGlow: 'drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]', hoverGlow: 'group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]' },
                sistem: { active: 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-300', hoverText: 'group-hover:text-amber-500', iconGlow: 'drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]', hoverGlow: 'group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]' },
              }[catId] || { active: 'bg-red-600 text-white border-red-600 shadow-md shadow-red-300', hoverText: 'group-hover:text-red-600', iconGlow: 'drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]', hoverGlow: 'group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]' };

              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
                  className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all duration-300 border ${
                    activeTab === tab.id
                      ? theme.active
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className={`transition-transform duration-300 group-hover:scale-110 ${activeTab === tab.id ? `text-white ${theme.iconGlow}` : `text-gray-400 ${theme.hoverText} ${theme.hoverGlow}`}`}>{tab.icon}</span>
                  <span className={activeTab === tab.id ? '' : theme.hoverText}>{tab.label}</span>
                </button>
              );
            })}
            {filteredPanels.length === 0 && (
              <p className="text-[13px] font-medium text-gray-500 p-2">Eşleşen panel bulunamadı.</p>
            )}
          </div>
        </div>
      </div>

      {/* ── İÇERİK ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col max-w-[1400px] mx-auto w-full p-4 lg:p-6 pb-20">
        <main className="flex-1 bg-transparent">
          {renderPanel()}
        </main>
      </div>
    </div>
  );
}
