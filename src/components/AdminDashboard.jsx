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
import CMSClubs from './admin/CMSClubs';
import PanelHeader from './admin/PanelHeader';
import Logo from './Logo';
import {
  LayoutDashboard, Users, Briefcase, Calendar,
  MessageSquare, GraduationCap, Building2, CreditCard,
  BarChart3, Network, ClipboardList, LogOut,
  ChevronDown, ChevronUp, Search, Bell, Bell as BellIcon,
  CheckCircle, XCircle, Plus, Trash2, Send,
  UserCheck, BookOpen, FileText, Heart, Award, ShieldCheck, Library,
  TrendingUp, Activity, Eye, Edit, Newspaper, Database, UserPlus, ShieldAlert, Settings, MessageCircle, Wand2
} from 'lucide-react';

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  MOCK DATA
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const STUDENTS = [
  { id:'STD-001', name:'AyÅŸe Kaya',      dept:'Bilgisayar MÃ¼h.', year:3, gpa:3.4, cv:true,  status:'Aktif' },
  { id:'STD-002', name:'Mehmet Demir',   dept:'EndÃ¼stri MÃ¼h.',   year:4, gpa:2.9, cv:false, status:'Aktif' },
  { id:'STD-003', name:'Elif Åahin',     dept:'Ä°ÅŸletme',         year:2, gpa:3.8, cv:true,  status:'Aktif' },
  { id:'STD-004', name:'Burak YÄ±lmaz',   dept:'YazÄ±lÄ±m MÃ¼h.',    year:3, gpa:3.1, cv:true,  status:'Pasif' },
  { id:'STD-005', name:'Selin Ã‡elik',    dept:'Makine MÃ¼h.',     year:4, gpa:3.6, cv:false, status:'Aktif' },
  { id:'STD-006', name:'Can Arslan',     dept:'Elektrik MÃ¼h.',   year:1, gpa:3.2, cv:false, status:'Aktif' },
  { id:'STD-007', name:'Zeynep Kurt',    dept:'Bilgisayar MÃ¼h.', year:4, gpa:3.9, cv:true,  status:'Aktif' },
  { id:'STD-008', name:'Emre DoÄŸan',     dept:'Ä°nÅŸaat MÃ¼h.',     year:2, gpa:2.7, cv:false, status:'Aktif' },
  { id:'STD-009', name:'Seda TunÃ§',      dept:'Ä°ÅŸletme',         year:3, gpa:3.5, cv:true,  status:'Aktif' },
  { id:'STD-010', name:'TarÄ±k Polat',    dept:'YazÄ±lÄ±m MÃ¼h.',    year:1, gpa:2.5, cv:false, status:'Aktif' },
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
  { id:'SRV-002', title:'Staj Memnuniyet Anketi',          responses:34, total:50,  status:'KapandÄ±', date:'15.06.2026' },
  { id:'SRV-003', title:'SEM Kurs DeÄŸerlendirmesi',        responses:12, total:30,  status:'Aktif',  date:'05.07.2026' },
];

const SEM_INIT = [
  { id:'SEM-001', title:'Python ile Veri Bilimi',      instructor:'Dr. Hasan Ã–ztÃ¼rk', quota:30, enrolled:24, date:'10.07.2026', status:'Aktif'       },
  { id:'SEM-002', title:'Dijital Pazarlama SertifikasÄ±',instructor:'Fatma YÄ±ldÄ±z',    quota:25, enrolled:25, date:'20.07.2026', status:'Dolu'         },
  { id:'SEM-003', title:'Kariyer KoÃ§luÄŸu ProgramÄ±',    instructor:'Ali KoÃ§',          quota:20, enrolled:8,  date:'01.08.2026', status:'KayÄ±t AÃ§Ä±k'   },
  { id:'SEM-004', title:'Ä°ÅŸ Hukuku Temelleri',         instructor:'Av. Selin Ekici', quota:35, enrolled:18, date:'05.08.2026', status:'KayÄ±t AÃ§Ä±k'   },
];

const NEWS_INIT = [
  ...((contentData?.haberler || []) || []).map((h, i) => ({ id: 'NE-H' + i, type: 'Haber', title: h?.title, date: h?.date, status: 'YayÄ±nda' })),
  ...((contentData?.duyurular || []) || []).map((d, i) => ({ id: 'NE-D' + i, type: 'Duyuru', title: d?.title, date: d?.date, status: 'YayÄ±nda' })),
  ...((contentData?.etkinlikler || []) || []).map((e, i) => ({ id: 'NE-E' + i, type: 'Etkinlik', title: e?.title, date: e?.date, status: 'Beklemede' }))
];





const EVENTS_INIT = [
  { id:'EVT-001', title:'Kariyer FuarÄ± 2026',  category:'Kariyer', type:'YÃ¼z yÃ¼ze', date:'15.07.2026', quota:500, status:'YayÄ±nda'   },
  { id:'EVT-002', title:'Google ile BuluÅŸma',  category:'Firma',   type:'Online',   date:'20.07.2026', quota:200, status:'Beklemede' },
  { id:'EVT-003', title:'Mezun GÃ¼nÃ¼',          category:'Mezun',   type:'YÃ¼z yÃ¼ze', date:'01.08.2026', quota:300, status:'YayÄ±nda'   },
];

const ORG = {
  name:'Prof. Dr. Ahmet Bulut', title:'RektÃ¶r',
  children:[{
    name:'Dr. Zeynep Aksoy', title:'Kariyer Ofisi DirektÃ¶rÃ¼',
    children:[
      { name:'Murat KoÃ§',     title:'Kariyer DanÄ±ÅŸmanÄ±',    children:[] },
      { name:'Seda TÃ¼rkmen',  title:'Mezun Ä°liÅŸkileri',     children:[] },
      { name:'TarÄ±k Polat',   title:'Firma Ä°liÅŸkileri',     children:[] },
    ]
  }]
};

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  SHARED UI COMPONENTS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function Badge({ status }) {
  const map = {
    'YayÄ±nda':'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Aktif':'bg-emerald-100 text-emerald-700 border-emerald-200',
    'OnaylÄ±':'bg-emerald-100 text-emerald-700 border-emerald-200',
    'KayÄ±t AÃ§Ä±k':'bg-sky-100 text-sky-700 border-sky-200',
    'Ä°nceleniyor':'bg-sky-100 text-sky-700 border-sky-200',
    'Beklemede':'bg-amber-100 text-amber-700 border-amber-200',
    'Onay Bekliyor':'bg-amber-100 text-amber-700 border-amber-200',
    'EÅŸleÅŸtirme Bekliyor':'bg-amber-100 text-amber-700 border-amber-200',
    'KapandÄ±':'bg-gray-100 text-gray-500 border-gray-200',
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


function Tbl({ headers, rows, empty='KayÄ±t bulunamadÄ±' }) {
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

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  PANELS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

// â”€â”€ 1. Kontrol Merkezi â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function OverviewPanel({ students = [], alumni = [], jobs = [], events = [], announcements = [], messages = [], mentorships = [], voluntaryInternships = [], surveys = [], academicApprovals = [], setView }) {
  const depts = {};
  (students || []).forEach(s => { depts[s?.dept]=(depts[s?.dept]||0)+1; });
  const deptList = Object.entries(depts).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const maxDept = deptList[0]?.[1]||1;

  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader title="Kontrol Merkezi" sub="Sistemin genel durumu" /> <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden my-4"><div className="absolute -top-10 -right-10 opacity-20 pointer-events-none"><MessageCircle size={150} /></div><div className="relative z-10"><span className="bg-white/20 px-2.5 py-1 rounded-md text-[10px] font-black tracking-widest uppercase mb-3 inline-block">YENI MODUL YAYINDA</span><h2 className="text-2xl font-black mb-1.5 tracking-tight">Yapay Zeka Mulakat ve CV Merkezi</h2><p className="text-red-100 text-sm max-w-lg mb-5 font-medium leading-relaxed">Ogrencilerinizi gercekci mulakat simulasyonlariyla gelistirin, otomatik CV olusturucu ile kariyer yolculuklarini destekleyin.</p><div className="flex flex-wrap gap-3"><button onClick={() => setView('interview_sim')} className="px-5 py-2.5 bg-white text-red-600 font-bold rounded-xl text-[13px] hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"><MessageCircle size={16} /> Mulakat Simulasyonu</button><button onClick={() => setView('cvbuilder')} className="px-5 py-2.5 bg-red-700/50 hover:bg-red-700/70 text-white border border-red-400 font-bold rounded-xl text-[13px] transition-colors flex items-center gap-2"><Wand2 size={16} /> CV Olusturucu</button></div></div></div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <StatCard icon={<Users size={20}/>} label="Aktif Ã–ÄŸrenci" value={(students || []).filter(s=>s?.status==='Aktif').length} sub="Toplam kayÄ±tlÄ±" color="blue" />
        <StatCard icon={<Briefcase size={20}/>} label="AÃ§Ä±k Ä°lanlar" value={(jobs || []).filter(j=>j?.status==='YayÄ±nda').length} sub={`${(jobs || []).filter(j=>j?.status==='Beklemede').length} onay bekliyor`} color="red" />
        <StatCard icon={<GraduationCap size={20}/>} label="Mezun KaydÄ±" value={(alumni || []).length} sub={`${(alumni || []).filter(a=>a.mentor).length} aktif mentor`} color="purple" />
        
        {/* Education Breakdown Based on Image 1 */}
        <StatCard icon={<Award size={20}/>} label="Ã–nlisans" value={(alumni || []).filter(a=>a?.degree === 'Ã–nlisans').length} sub="Mezunu" color="green" />
        <StatCard icon={<BookOpen size={20}/>} label="Lisans" value={(alumni || []).filter(a=>!a?.degree || a?.degree === 'Lisans').length} sub="Mezunu" color="blue" />
        <StatCard icon={<Library size={20}/>} label="LisansÃ¼stÃ¼" value={(alumni || []).filter(a=>a?.degree === 'LisansÃ¼stÃ¼' || a?.degree === 'YÃ¼ksek Lisans' || a?.degree === 'Doktora').length} sub="Mezunu" color="orange" />
        
        <StatCard icon={<MessageSquare size={20}/>} label="OkunmamÄ±ÅŸ" value={(messages || []).filter(m=>!m?.read).length} sub="Mesaj" color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pending approvals */}
        <Card className="p-6 col-span-1">
          <h3 className="font-black text-gray-900 mb-4">Bekleyen Ä°ÅŸlemler</h3>
          <div className="space-y-2.5">
            {[
              { label:'Onay Bekleyen Ä°lan',       val: (jobs || []).filter(j=>j?.status==='Beklemede').length,              color:'amber'   },
              { label:'Staj Onay Bekliyor',        val: (voluntaryInternships || []).filter(v=>v.status==='Taslak').length, color:'orange' },
              { label:'Akademik Profil OnayÄ±',    val: (academicApprovals || []).filter(a=>a.status==='Beklemede').length, color:'red' },
              { label:'Mentor EÅŸleÅŸme Bekliyor',  val: (mentorships || []).filter(m=>m.status==='EÅŸleÅŸtirme Bekliyor').length, color:'sky'  },
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
          <h3 className="font-black text-gray-900 mb-4">Son Eklenen Ä°lanlar</h3>
          <Tbl
            headers={['Ä°lan','Firma','TÃ¼r','Durum']}
            rows={(jobs || []).slice(0,5).map(j=>[
              <span className="font-semibold text-gray-900">{j?.title}</span>,
              j?.company, <Badge status={j?.type}/>, <Badge status={j?.status}/>
            ])}
          />
        </Card>

        {/* Super Admin Activity Feed */}
        <Card className="p-6">
          <h3 className="font-black text-gray-900 mb-4">Sistem Aktivite AkÄ±ÅŸÄ±</h3>
          <div className="space-y-4">
            {(events || []).slice(0, 2).map(e => (
              <div key={e.id} className="flex items-start gap-3 border-b border-gray-50 pb-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Calendar size={14} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Yeni Etkinlik Eklendi: {e?.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{e?.date || 'YakÄ±n Zamanda'}</p>
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
                  <p className="text-xs text-gray-500 mt-0.5">{a?.date || 'YakÄ±n Zamanda'}</p>
                </div>
              </div>
            ))}
            {(students || []).slice(0, 1).map(s => (
              <div key={s?.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <UserPlus size={14} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Yeni Ã–ÄŸrenci KaydÄ±: {s?.name}</p>
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

// â”€â”€ 2. Operasyon Ã–zeti â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function OperasyonPanel({ jobs = [], setJobs, voluntaryInternships = [], setVoluntaryInternships, mentorships = [] }) {
  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader title="Operasyon Ã–zeti" sub="GÃ¼nlÃ¼k iÅŸ akÄ±ÅŸÄ± ve onay gerektiren iÅŸlemler" />

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5 border-l-4 border-amber-400">
          <p className="text-3xl font-black text-gray-900">{(jobs || []).filter(j=>j?.status==='Beklemede').length}</p>
          <p className="text-xs font-bold text-gray-500 uppercase mt-1">Onay Bekleyen Ä°lan</p>
        </Card>
        <Card className="p-5 border-l-4 border-blue-400">
          <p className="text-3xl font-black text-gray-900">{(voluntaryInternships || []).filter(v=>v.status==='Onay Bekliyor').length}</p>
          <p className="text-xs font-bold text-gray-500 uppercase mt-1">Staj Onay Bekliyor</p>
        </Card>
        <Card className="p-5 border-l-4 border-purple-400">
          <p className="text-3xl font-black text-gray-900">{(mentorships || []).filter(m=>m.status==='EÅŸleÅŸtirme Bekliyor').length}</p>
          <p className="text-xs font-bold text-gray-500 uppercase mt-1">Mentor EÅŸleÅŸme Bekliyor</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-black text-gray-900 mb-4">Onay Bekleyen Ä°lanlar</h3>
        {(jobs || []).filter(j=>j?.status==='Beklemede').length===0
          ? <p className="text-gray-400 text-sm text-center py-6">âœ“ Onay bekleyen ilan yok</p>
          : <Tbl
              headers={['Ä°lan','Firma','TÃ¼r','Tarih','Ä°ÅŸlem']}
              rows={(jobs || []).filter(j=>j?.status==='Beklemede').map(j=>[
                <span className="font-bold text-gray-900">{j?.title}</span>,
                j?.company, <Badge status={j?.type}/>, j?.date,
                <div className="flex gap-2">
                  <BtnGreen onClick={()=>setJobs((jobs || []).map(x=>x.id===j?.id?{...x,status:'YayÄ±nda'}:x))}>Onayla</BtnGreen>
                  <BtnRed onClick={()=>setJobs((jobs || []).filter(x=>x.id!==j?.id))}>Reddet</BtnRed>
                </div>
              ])}
            />}
      </Card>

      <Card className="p-6">
        <h3 className="font-black text-gray-900 mb-4">Onay Bekleyen Stajlar</h3>
        {(voluntaryInternships || []).filter(v=>v.status==='Onay Bekliyor').length===0
          ? <p className="text-gray-400 text-sm text-center py-6">âœ“ Onay bekleyen staj yok</p>
          : <Tbl
              headers={['Ã–ÄŸrenci','Firma','Pozisyon','BaÅŸlangÄ±Ã§','Ä°ÅŸlem']}
              rows={(voluntaryInternships || []).filter(v=>v.status==='Onay Bekliyor').map(v=>[
                <span className="font-bold">{v.student}</span>,
                v.company, v.position, v.startDate,
                <div className="flex gap-2">
                  <BtnGreen onClick={()=>setVoluntaryInternships((voluntaryInternships || []).map(x=>x.id===v.id?{...x,status:'OnaylÄ±'}:x))}>Onayla</BtnGreen>
                  <BtnRed onClick={()=>setVoluntaryInternships((voluntaryInternships || []).map(x=>x.id===v.id?{...x,status:'Reddedildi'}:x))}>Reddet</BtnRed>
                </div>
              ])}
            />}
      </Card>
    </div>
  );
}

// â”€â”€ 3. Akademik Performans â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function AkademikPanel({ students = [] }) {
  const avg = ((students || []).reduce((a,s)=>a+parseFloat(s?.gpa||0),0)/((students || []).length||1)).toFixed(2);
  const honor = (students || []).filter(s=>s?.gpa>=3.5).length;
  const withCV = (students || []).filter(s=>s?.cv).length;
  const [search, setSearch] = useState('');
  const filtered = (students || []).filter(s=>s?.name.toLowerCase().includes(search.toLowerCase())||s?.dept.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader title="Akademik Performans" sub="GPA, bÃ¶lÃ¼m daÄŸÄ±lÄ±mÄ± ve Ã¶ÄŸrenci Ã¶zeti" />

      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={<BarChart3 size={20}/>} label="Ortalama GPA" value={avg} sub="TÃ¼m Ã¶ÄŸrenciler" color="blue"/>
        <StatCard icon={<Award size={20}/>} label="YÃ¼ksek Onur" value={honor} sub="GPA â‰¥ 3.5" color="green"/>
        <StatCard icon={<FileText size={20}/>} label="CV YÃ¼klemiÅŸ" value={withCV} sub={`${(students || []).length-withCV} eksik`} color="orange"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6 col-span-1">
          <h3 className="font-black text-gray-900 mb-4">GPA DaÄŸÄ±lÄ±mÄ±</h3>
          <div className="space-y-3">
            {[
              {label:'3.5 â€“ 4.0 (YÃ¼ksek Onur)',val:(students || []).filter(s=>s?.gpa>=3.5).length,color:'green'},
              {label:'3.0 â€“ 3.5 (Onur)',        val:(students || []).filter(s=>s?.gpa>=3.0&&s?.gpa<3.5).length,color:'blue'},
              {label:'2.5 â€“ 3.0 (GeÃ§er)',       val:(students || []).filter(s=>s?.gpa>=2.5&&s?.gpa<3.0).length,color:'orange'},
              {label:'2.0 â€“ 2.5 (Alt SÄ±nÄ±r)',   val:(students || []).filter(s=>s?.gpa<2.5).length,color:'red'},
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
            <h3 className="font-black text-gray-900">Ã–ÄŸrenci Listesi</h3>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Ara..." className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-300"/>
            </div>
          </div>
          <Tbl
            headers={['Ad Soyad','BÃ¶lÃ¼m','SÄ±nÄ±f','GPA','CV','Durum']}
            rows={filtered.map(s=>[
              <span className="font-bold text-gray-900">{s?.name}</span>,
              s?.dept,
              `${s?.year}. SÄ±nÄ±f`,
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



// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  SIDEBAR NAVIGATION CONFIG
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const PANEL_CATEGORIES = [
  { id: 'genel', label: 'Genel BakÄ±ÅŸ', icon: <LayoutDashboard size={14}/>, panels: ['overview', 'operasyon', 'akademik'] },
  { id: 'kullanici', label: 'KullanÄ±cÄ± YÃ¶netimi', icon: <Users size={14}/>, panels: ['students', 'alumni', 'companies', 'academic_staff', 'mezun_dernek', 'sem', 'cms_groups', 'clubs_pool'] },
  { id: 'icerik', label: 'Ä°Ã§erik & Platform', icon: <FileText size={14}/>, panels: ['cms_news', 'cms_ann', 'cms_events', 'cms_jobs', 'cms_feat', 'cms_ment'] },
  { id: 'sistem', label: 'Sistem & Analiz', icon: <Settings size={14}/>, panels: ['cleanup', 'content_import', 'analytics', 'anket', 'kart', 'platform_ayarlari'] }
];

const MAIN_TABS = [
  { id:'overview',   label:'Kontrol Merkezi',    icon:<LayoutDashboard size={17}/> },
  { id:'operasyon',  label:'Operasyon Ã–zeti',    icon:<Activity size={17}/> },
  { id:'akademik',   label:'Akademik Performans',icon:<TrendingUp size={17}/> },
  { id:'academic_catalog', label:'Akademik Katalog', icon:<Library size={17}/> },
  { id:'academic_approvals', label:'Akademik Bilgi OnaylarÄ±', icon:<ShieldCheck size={17}/> },
  { id:'cms_news',    label:'Haberler (CMS)',   icon:<FileText size={17}/> },
  { id:'students',   label:'Aktif Ã–ÄŸrenciler',   icon:<Users size={17}/> },
  { id:'academic_staff', label:'Akademik Personel', icon:<BookOpen size={17}/> },
  { id:'alumni',     label:'Mezun Bilgi Havuzu', icon:<GraduationCap size={17}/> },
  { id:'companies',  label:'Firma Bilgi Havuzu', icon:<Building2 size={17}/> },
  { id:'mezun_dernek',label:'Mezun DerneÄŸi',     icon:<Heart size={17}/> },
  { id:'kart',       label:'Kart BaÅŸvurularÄ±',   icon:<CreditCard size={17}/> },
  { id:'cms_jobs',   label:'Ä°lan & BaÅŸvuru Havuzu', icon:<Briefcase size={17}/> },
  { id:'cms_events', label:'Etkinlikler (CMS)',  icon:<Calendar size={17}/> },
  { id:'cms_ann',    label:'Duyurular (CMS)',    icon:<Megaphone size={17}/> },
  { id:'cms_feat',   label:'Ã–ne Ã‡Ä±kanlar (CMS)', icon:<Star size={17}/> },
  { id:'cms_groups', label:'Topluluklar ve Gruplar', icon:<Users size={17}/> },
  { id:'clubs_pool', label:'KulÃ¼pler Havuzu', icon:<Users size={17}/> },
  { id:'mesajlar',   label:'Ä°letiÅŸim Havuzu (Loglar)', icon:<MessageSquare size={17}/> },
];
const MORE_TABS = [
  { id:'cms_ment',   label:'Mentorluk (CMS)', icon:<UserCheck size={17}/> },
  { id:'gonullu',    label:'GÃ¶nÃ¼llÃ¼ Staj',        icon:<Award size={17}/> },
  { id:'sem',        label:'SEM Kurs YÃ¶netimi',   icon:<BookOpen size={17}/> },
  
  { id:'anket',      label:'Anket & Veri Havuzu',      icon:<BarChart3 size={17}/> },
  { id:'analytics',  label:'Sistem AnalitiÄŸi',    icon:<Activity size={17}/> },
  { id:'content_import', label:'ResmÃ® Ä°Ã§erik Ä°Ã§e Aktar', icon:<Database size={17}/> },

  { id:'entegrasyon',label:'Sistem EntegrasyonlarÄ±',icon:<Database size={17}/> },
  { id:'cleanup',    label:'Veri TemizliÄŸi',      icon:<ShieldAlert size={17}/> },
  { id:'platform_ayarlari', label:'Platform AyarlarÄ±', icon:<Settings size={17}/> },
];

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  MAIN COMPONENT
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
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
  featureSurveys, setFeatureSurveys,
  featureCareerCheckup, setFeatureCareerCheckup,
  featureAlumniCard, setFeatureAlumniCard,
  featureClubsShowcase, setFeatureClubsShowcase,
  featureClubApplications, setFeatureClubApplications,
  clubs, setClubs,
  clubApplications, setClubApplications,
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
    const p = { students, alumni, companies, jobs, setJobs, mentorships, voluntaryInternships, setVoluntaryInternships, messages, setMessages, surveys, semCourses, newsEvents: news, setNewsEvents: setNews, alumniCards, events, setEvents, academicApprovals, alumniCardApplications, setAlumniCardApplications, alumniCardForms, setAlumniCardForms, posts, setPosts, currentUser, setView };
    switch(activeTab) {
      case 'academic_catalog': return <CMSAcademicCatalog academicCatalog={academicCatalog || []} setAcademicCatalog={setAcademicCatalog} />;
      case 'academic_approvals': return <CMSAcademicApprovals academicApprovals={academicApprovals || []} setAcademicApprovals={setAcademicApprovals} students={students || []} setStudents={setStudents} alumni={alumni || []} setAlumni={setAlumni} />;
      case 'cms_events':  return <CMSEvents events={events || []} setEvents={setEvents} posts={posts} setPosts={setPosts} currentUser={currentUser} />;
      case 'cms_ann':     return <CMSAnnouncements announcements={announcements || []} setAnnouncements={setAnnouncements} posts={posts} setPosts={setPosts} currentUser={currentUser} />;
      case 'cms_jobs':    return <CMSJobs jobs={jobs || []} setJobs={setJobs} applications={applications || []} />;
      case 'cms_feat':    return <CMSFeatured featuredOpportunities={featuredOpportunities || []} setFeaturedOpportunities={setFeaturedOpportunities} />;
      case 'cms_ment':    return <CMSMentorship mentorships={mentorships || []} setMentorships={setMentorships} />;
      case 'cms_groups':  return <CMSGroups groups={groups || []} setGroups={setGroups} currentUser={currentUser} />;
      case 'clubs_pool':  return <CMSClubs clubs={clubs} setClubs={setClubs} clubApplications={clubApplications} setClubApplications={setClubApplications} currentUser={currentUser} />;
      case 'overview':    return <OverviewPanel {...p}/>;
      case 'operasyon':   return <OperasyonPanel {...p}/>;
      case 'akademik':    return <AkademikPanel {...p}/>;
      case 'cms_news':    return <CMSNews news={p.newsEvents || []} setNews={p.setNewsEvents} posts={posts} setPosts={setPosts} currentUser={currentUser} />;
      case 'companies':   return <CMSCompanies companies={companies || []} setCompanies={setCompanies} />;
      case 'students':    return <CMSStudents students={students || []} setStudents={setStudents} />;
      case 'academic_staff': return <CMSAcademicStaff academicStaff={academicStaff || []} setAcademicStaff={setAcademicStaff} />;
      case 'alumni':      return <CMSAlumni alumni={alumni || []} setAlumni={setAlumni} surveys={surveys} setSurveys={setSurveys} currentUser={currentUser} setPosts={setPosts} posts={posts} />;
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

      case 'cleanup':     return <DataCleanup students={students || []} setStudents={setStudents} alumni={alumni || []} setAlumni={setAlumni} companies={companies || []} setCompanies={setCompanies} messages={messages || []} setMessages={setMessages} posts={posts || []} setPosts={setPosts} jobs={jobs || []} setJobs={setJobs} />;
      case 'platform_ayarlari': return <PlatformSettings featureSurveys={featureSurveys} setFeatureSurveys={setFeatureSurveys} featureCareerCheckup={featureCareerCheckup} setFeatureCareerCheckup={setFeatureCareerCheckup} featureAlumniCard={featureAlumniCard} setFeatureAlumniCard={setFeatureAlumniCard} featureClubsShowcase={featureClubsShowcase} setFeatureClubsShowcase={setFeatureClubsShowcase} featureClubApplications={featureClubApplications} setFeatureClubApplications={setFeatureClubApplications} />;
      default:            return <OverviewPanel {...p}/>;
    }
  };

  // ALL_TABS birleÅŸtirilmesi ve feature toggle filtrelemesi
  const ALL_TABS = [...MAIN_TABS, ...MORE_TABS].filter(tab => {
    if (tab.id === 'anket' && !featureSurveys) return false;
    if (tab.id === 'kart' && !featureAlumniCard) return false;
    return true;
  });

  // Arama filtresi
  const filteredPanels = searchQuery 
    ? ALL_TABS.filter(t => t.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : ALL_TABS.filter(t => {
        const cat = PANEL_CATEGORIES.find(c => c.id === activeCategory);
        return cat ? cat.panels.includes(t.id) : false;
      });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans relative">

      {/* â”€â”€ HEADER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <header className="bg-white border-b border-gray-100 px-5 py-3 flex items-center gap-4 shrink-0 sticky top-0 z-40">
        
        <div className="flex items-center gap-3 pr-4 border-r border-gray-100 shrink-0">
          <Logo className="w-9 h-9 text-red-700 bg-red-50 rounded-xl p-1.5" />
          <div className="hidden sm:block">
            <h1 className="text-[14px] font-black text-gray-900 leading-tight">YÃ¶netici Paneli</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{academicRole === 'super_admin' ? 'SÃœPER ADMÄ°N' : 'KARÄ°YER OFÄ°SÄ°'}</p>
          </div>
        </div>

        <div className="relative w-64 xl:w-80 ml-2 shrink-0">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Panel ara... (Ã¶rn: ilan, Ã¶ÄŸrenci)" 
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

      {/* Alt Sekme ButonlarÄ± (seÃ§ili kategorinin panelleri) */}
      <div className="bg-white border-b border-gray-200 shadow-sm shrink-0 sticky top-[65px] z-30">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-2.5">
          <div className="flex flex-wrap gap-2">
            {searchQuery && <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider self-center mr-1">"{searchQuery}" aramasÄ±:</span>}
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
              <p className="text-[13px] font-medium text-gray-500 p-2">EÅŸleÅŸen panel bulunamadÄ±.</p>
            )}
          </div>
        </div>
      </div>

      {/* â”€â”€ Ä°Ã‡ERÄ°K â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="flex-1 flex flex-col max-w-[1400px] mx-auto w-full p-3 sm:p-4 lg:p-6 pb-28 sm:pb-20">
        <main className="flex-1 bg-transparent">
          {renderPanel()}
        </main>
      </div>
    </div>
  );
}

function PlatformSettings({ featureSurveys, setFeatureSurveys, featureCareerCheckup, setFeatureCareerCheckup, featureAlumniCard, setFeatureAlumniCard, featureClubsShowcase, setFeatureClubsShowcase, featureClubApplications, setFeatureClubApplications }) {
  return (
    <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-200 shadow-xl shadow-gray-200/50 animate-fade-in relative overflow-hidden">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
          <Settings size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900">Platform AyarlarÄ±</h2>
          <p className="text-gray-500 font-medium">ModÃ¼lleri aktif/pasif hale getirin.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50 hover:bg-white transition-colors">
          <div>
            <h3 className="font-bold text-gray-900 text-[16px]">Mezun Memnuniyet & Anket Merkezi</h3>
            <p className="text-[13px] text-gray-500 mt-1">MezunlarÄ±n gÃ¶rebileceÄŸi anket merkezini aÃ§ar/kapatÄ±r.</p>
          </div>
          <button 
            onClick={() => setFeatureSurveys(!featureSurveys)}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${featureSurveys ? 'bg-emerald-500' : 'bg-gray-300'}`}
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${featureSurveys ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50 hover:bg-white transition-colors">
          <div>
            <h3 className="font-bold text-gray-900 text-[16px]">Kariyer Check-up</h3>
            <p className="text-[13px] text-gray-500 mt-1">MezunlarÄ±n kariyer durumlarÄ±nÄ± gÃ¼ncelleyebileceÄŸi modÃ¼lÃ¼ aÃ§ar/kapatÄ±r.</p>
          </div>
          <button 
            onClick={() => setFeatureCareerCheckup(!featureCareerCheckup)}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${featureCareerCheckup ? 'bg-emerald-500' : 'bg-gray-300'}`}
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${featureCareerCheckup ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50 hover:bg-white transition-colors">
          <div>
            <h3 className="font-bold text-gray-900 text-[16px]">Mezun Kart BaÅŸvurusu</h3>
            <p className="text-[13px] text-gray-500 mt-1">MezunlarÄ±n mezun kartÄ± baÅŸvuru modÃ¼lÃ¼nÃ¼ aÃ§ar/kapatÄ±r.</p>
          </div>
          <button 
            onClick={() => setFeatureAlumniCard(!featureAlumniCard)}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${featureAlumniCard ? 'bg-emerald-500' : 'bg-gray-300'}`}
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${featureAlumniCard ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50 hover:bg-white transition-colors">
          <div>
            <h3 className="font-bold text-gray-900 text-[16px]">KulÃ¼pler Vitrini (Ana Sayfa)</h3>
            <p className="text-[13px] text-gray-500 mt-1">Ã–ÄŸrenci ve mezunlarÄ±n ana sayfasÄ±ndaki kulÃ¼pler tanÄ±tÄ±m bÃ¶lÃ¼mÃ¼nÃ¼ aÃ§ar/kapatÄ±r.</p>
          </div>
          <button 
            onClick={() => setFeatureClubsShowcase(!featureClubsShowcase)}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${featureClubsShowcase ? 'bg-emerald-500' : 'bg-gray-300'}`}
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${featureClubsShowcase ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50 hover:bg-white transition-colors">
          <div>
            <h3 className="font-bold text-gray-900 text-[16px]">KulÃ¼p BaÅŸvurularÄ±nÄ± AÃ§ / Kapat</h3>
            <p className="text-[13px] text-gray-500 mt-1">Ã–ÄŸrencilerin yeni kulÃ¼p aÃ§ma baÅŸvurularÄ±nÄ± aktif/pasif hale getirir.</p>
          </div>
          <button 
            onClick={() => setFeatureClubApplications(!featureClubApplications)}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${featureClubApplications ? 'bg-emerald-500' : 'bg-gray-300'}`}
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${featureClubApplications ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

