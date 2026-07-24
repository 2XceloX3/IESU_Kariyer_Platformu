import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { BarChart3, TrendingUp, Users, Eye, MousePointerClick, Briefcase, GraduationCap, Building2, Calendar, Target, PhoneCall, MailCheck, CheckCircle2 } from 'lucide-react';
import AdminCMSLayout, { TopInfoCard } from './AdminCMSLayout';
import PanelHeader from './PanelHeader';
import CMSWorldMap from './CMSWorldMap';

export default function CMSAnalytics({ students = [], alumni = [], companies = [], jobs = [], applications = [] }) {
  // Mock analytics calculation based on existing arrays
  const totalStudents = (students || []).length || 350;
  const activeStudents = (students || []).filter(s => s.status === 'Aktif').length || 280;
  const totalAlumni = (alumni || []).length || 120;
  
  const totalJobs = (jobs || []).length || 45;
  const totalApplications = (applications || []).length || 156;

  // Mock data for graphs
  const engagementStats = [
    { label: 'Öğrenci Girişi', value: 85, color: 'bg-blue-500' },
    { label: 'Mezun Girişi', value: 45, color: 'bg-emerald-500' },
    { label: 'Firma Girişi', value: 20, color: 'bg-amber-500' },
    { label: 'Akademisyen Girişi', value: 30, color: 'bg-purple-500' }
  ];

  const popularJobs = (jobs.slice(0, 4) || []).map(j => ({
    title: j.title,
    company: j.company,
    clicks: Math.floor(Math.random() * 200) + 50,
    applications: j.applicants || Math.floor(Math.random() * 50) + 10
  })).sort((a, b) => b.clicks - a.clicks);

  if (popularJobs.length === 0) {
    popularJobs.push(
      { title: 'Frontend Developer', company: 'Trendyol', clicks: 245, applications: 85 },
      { title: 'Marketing Intern', company: 'Google Turkey', clicks: 190, applications: 60 },
      { title: 'Veri Analisti', company: 'Ford Otosan', clicks: 155, applications: 42 }
    );
  }

  const popularCompanies = (companies.slice(0, 3) || []).map(c => ({
    name: c.name,
    sector: c.sector,
    views: Math.floor(Math.random() * 1000) + 100
  })).sort((a, b) => b.views - a.views);

  if (popularCompanies.length === 0) {
    popularCompanies.push(
      { name: 'ASELSAN', sector: 'Savunma', views: 890 },
      { name: 'Getir', sector: 'Teknoloji', views: 750 },
      { name: 'Koç Holding', sector: 'Otomotiv', views: 620 }
    );
  }

  const monthlyVisits = [
    { month: 'Oca', value: 45 }, { month: 'Şub', value: 55 }, { month: 'Mar', value: 65 }, 
    { month: 'Nis', value: 50 }, { month: 'May', value: 80 }, { month: 'Haz', value: 95 }
  ];

  const checkupData = [
    { name: 'Çalışıyor', value: 65 },
    { name: 'Stajda', value: 15 },
    { name: 'İş Arıyor', value: 20 }
  ];
  const COLORS = ['#10B981', '#3B82F6', '#F59E0B'];

  const StatProgress = ({ label, value, max, colorClass }) => (
    <div className="mb-4">
      <div className="flex justify-between items-end mb-1">
        <span className="text-sm font-bold text-gray-700">{label}</span>
        <span className="text-xs font-bold text-gray-500">{value} / {max}</span>
      </div>
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${colorClass} rounded-full`} style={{ width: `${Math.min(100, (value / max) * 100)}%` }}></div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader 
        title="Sistem Analitiği" 
        sub="Platformun kullanım istatistiklerini, öğrenci etkileşimini ve ilan performanslarını izleyin." 
        action={
          <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all">
            <Calendar size={16} /> Son 30 Gün
          </button>
        } 
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TopInfoCard icon={<Users size={20} />} title="Aktif Kullanıcı" value={activeStudents + totalAlumni} color="blue" />
        <TopInfoCard icon={<MousePointerClick size={20} />} title="Aylık Etkileşim" value="24.5K" color="emerald" />
        <TopInfoCard icon={<Briefcase size={20} />} title="Toplam Başvuru" value={totalApplications} color="orange" />
        <TopInfoCard icon={<Eye size={20} />} title="İlan Görüntülenmesi" value="128K" color="purple" />
      </div>

      {/* KARIYER CHECK-UP ANALITIKLERI */}
      <div className="bg-indigo-50/50 rounded-2xl border border-indigo-100 shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-black text-indigo-900 flex items-center gap-2"><CheckCircle2 size={18} className="text-indigo-600"/> Kariyer Check-up & İletişim Havuzu</h3>
            <p className="text-xs text-indigo-700/70 mt-1">Sistem üzerinden güncellenen veriler ve mezun istihdam durumları</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-5 border border-indigo-50 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                <PhoneCall size={20}/>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-800">Telefon Güncellemesi</h4>
                <p className="text-xs text-gray-500">Havuzda biriken yeni veri</p>
              </div>
            </div>
            <div className="text-3xl font-black text-green-600">42 <span className="text-sm font-bold text-gray-400">kişi</span></div>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-indigo-50 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                <MailCheck size={20}/>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-800">E-posta Güncellemesi</h4>
                <p className="text-xs text-gray-500">Havuzda biriken yeni veri</p>
              </div>
            </div>
            <div className="text-3xl font-black text-blue-600">85 <span className="text-sm font-bold text-gray-400">kişi</span></div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-indigo-50 shadow-sm flex flex-col items-center justify-center">
            <h4 className="text-xs font-bold text-gray-500 w-full mb-2">İstihdam Dağılımı</h4>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={checkupData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={2} dataKey="value">
                    {checkupData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip wrapperStyle={{ fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-black text-gray-900 flex items-center gap-2"><TrendingUp size={18} className="text-[#0A66C2]"/> Aylık Ziyaretçi Trendi</h3>
              <p className="text-xs text-gray-500 mt-1">Son 6 aydaki tekil giriş sayısı (bin)</p>
            </div>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyVisits} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A66C2" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0A66C2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="#0A66C2" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Demographics */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-black text-gray-900 flex items-center gap-2 mb-6"><Target size={18} className="text-blue-500"/> Kullanıcı Dağılımı</h3>
            <div className="space-y-1">
              <StatProgress label="Öğrenciler" value={totalStudents} max={500} colorClass="bg-blue-500" />
              <StatProgress label="Mezunlar" value={totalAlumni} max={500} colorClass="bg-emerald-500" />
              <StatProgress label="Firmalar" value={(companies || []).length || 45} max={100} colorClass="bg-amber-500" />
            </div>
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Öğrenci aktiflik oranı <b>%{(activeStudents / totalStudents * 100).toFixed(1)}</b> seviyesinde. Mezun derneği kampanyalarıyla mezun katılımını artırabilirsiniz.
            </p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Jobs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-black text-gray-900 flex items-center gap-2"><Briefcase size={18} className="text-orange-500"/> En Çok İlgi Gören İlanlar</h3>
          </div>
          <div className="p-5 space-y-4">
            {popularJobs.map((job, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 font-black shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{job.title}</h4>
                    <p className="text-xs font-medium text-gray-500">{job.company}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-gray-900">{job.clicks} <span className="text-[10px] text-gray-500 font-bold uppercase">Tık</span></div>
                  <div className="text-xs font-bold text-emerald-600">{job.applications} Başvuru</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Companies */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-black text-gray-900 flex items-center gap-2"><Building2 size={18} className="text-purple-500"/> En Çok İncelenen Firmalar</h3>
          </div>
          <div className="p-5 space-y-4">
            {popularCompanies.map((comp, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 font-black shrink-0">
                    <Eye size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{comp.name}</h4>
                    <p className="text-xs font-medium text-gray-500">{comp.sector}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-gray-900">{comp.views}</div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase">Profil Görüntülenmesi</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* World Map Analytics */}
      <CMSWorldMap />
    </div>
  );
}
