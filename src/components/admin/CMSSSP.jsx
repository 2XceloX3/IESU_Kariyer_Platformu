import React, { useState } from 'react';
import { Card, Badge, Tbl } from './AdminShared';
import { Award, Search, CheckCircle2, AlertCircle, Plus, Trash2, ChevronDown, ChevronUp, FileSpreadsheet, ShieldCheck, Smartphone, Eye, LayoutGrid, CalendarRange, ListTodo, UploadCloud, Edit3, Megaphone, Target, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { toast } from '../shared/Toast';

export default function CMSSSP({ sspEnabled, setSspEnabled, sspUsers, setSspUsers }) {
  // 6 Ana Havuz
  const [activePool, setActivePool] = useState('ssp_pool'); 
  const [viewState, setViewState] = useState('list'); 
  
  // -- SSP POOL --
  const [searchTerm, setSearchTerm] = useState('');
  const filteredUsers = (sspUsers || []).filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // -- COMMON FORM STATES --
  const [dragActive, setDragActive] = useState(false);
  const [formImage, setFormImage] = useState(null);

  // -- EVENT POOL --
  const [events, setEvents] = useState([
    { id: 'E1', title: 'Bahar Şenliği', attendees: 450, totalPoints: 22500, status: 'Bitti' },
    { id: 'E2', title: 'Kariyer Fuarı Gönüllülüğü', attendees: 120, totalPoints: 6000, status: 'Aktif' },
  ]);
  const [eventTitle, setEventTitle] = useState('');
  const [eventPoints, setEventPoints] = useState(50);

  // -- MISSION POOL (Haftalık Görevler) --
  const [missions, setMissions] = useState([
    { id: 'M1', title: 'LinkedIn Profilini Güncelle', participants: 840, points: 15, status: 'Aktif' },
    { id: 'M2', title: 'Kariyer Geliştirme Koordinatörlüğüni Ziyaret Et', participants: 320, points: 25, status: 'Aktif' },
  ]);
  const [missionTitle, setMissionTitle] = useState('');
  const [missionPoints, setMissionPoints] = useState(15);
  const [missionDesc, setMissionDesc] = useState('');

  // -- ANNOUNCEMENT POOL (Duyurular) --
  const [announcements, setAnnouncements] = useState([
    { id: 'A1', title: 'Yaz Dönemi Staj Başvuruları Başladı', views: 1250, status: 'Aktif' },
    { id: 'A2', title: 'Erasmus+ Yabancı Dil Sınavı Sonuçları', views: 3400, status: 'Bitti' },
  ]);
  const [announceTitle, setAnnounceTitle] = useState('');
  const [announceDesc, setAnnounceDesc] = useState('');

  // -- SURVEY POOL --
  const [surveys, setSurveys] = useState([
    { id: 'S1', title: 'Bahar Şenliği Memnuniyet', event: 'Bahar Şenliği', responses: 412 },
    { id: 'S2', title: 'Kariyer Fuarı Değerlendirme', event: 'Kariyer Fuarı Gönüllülüğü', responses: 89 },
  ]);
  const [surveyTitle, setSurveyTitle] = useState('');
  const [questions, setQuestions] = useState([{ id: Date.now(), title: '', analysisNote: '' }]);
  const [expandedQuestion, setExpandedQuestion] = useState(questions[0].id);

  // -- KVKK STATES --
  const [kvkkEnabled, setKvkkEnabled] = useState(true);
  const [consentEnabled, setConsentEnabled] = useState(true);

  // -- HANDLERS --
  const handleExportSPSS = () => {
    toast.info('Veriler SPSS formatında (CSV) hazırlanıyor...', { icon: '🔄' });
    setTimeout(() => { 
      const csvContent = "data:text/csv;charset=utf-8,ID,Soru1,Soru2,Soru3\n1,5,4,5\n2,3,4,4\n3,5,5,5";
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "spss_verileri.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('SPSS veri dosyası başarıyla indirildi!'); 
    }, 1500);
  };

  const handleManageSurvey = (surveyId) => {
    const s = surveys.find(x => x.id === surveyId);
    if(s) {
      setSurveyTitle(s.title);
      setQuestions([
        { id: Date.now() + 1, title: 'Etkinlik organizasyonundan memnun kaldınız mı?', analysisNote: 'VAR_MEMNUNIYET' },
        { id: Date.now() + 2, title: 'Konuşmacıların bilgi düzeyi yeterli miydi?', analysisNote: 'VAR_KONUSMACI' }
      ]);
      setViewState('create_survey');
    }
  };

  const handleAddQuestion = () => {
    const newId = Date.now();
    setQuestions([...questions, { id: newId, title: '', analysisNote: '' }]);
    setExpandedQuestion(newId);
  };

  const handleRemoveQuestion = (id) => {
    if(questions.length === 1) {
      toast.error('En az 1 soru olmalıdır!');
      return;
    }
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleQuestionChange = (id, field, value) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const handleDrag = function(e) {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = function(e) {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    toast.success("Fotoğraf başarıyla yüklendi!");
    setFormImage('https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&w=800&q=80'); // Mock image
  };

  const resetForm = () => {
    setFormImage(null);
    setViewState('list');
  };

  // Navigasyon Menüsü
  const navItems = [
    { id: 'ssp_pool', icon: <LayoutGrid size={18}/>, label: 'SSP Liderlik Havuzu' },
    { id: 'event_pool', icon: <CalendarRange size={18}/>, label: 'Etkinlik Havuzu' },
    { id: 'mission_pool', icon: <Target size={18}/>, label: 'Haftalık Görev Havuzu' },
    { id: 'announcement_pool', icon: <Megaphone size={18}/>, label: 'Duyurular Havuzu' },
    { id: 'survey_pool', icon: <ListTodo size={18}/>, label: 'Anket Havuzu' },
    { id: 'kvkk_pool', icon: <ShieldCheck size={18}/>, label: 'KVKK İzin Havuzu' },
  ];

  // Live Preview Component
  const LivePreview = ({ type }) => {
    let title = ''; let desc = ''; let points = null; let btnText = '';
    if (type === 'event') {
      title = eventTitle || 'Örnek Etkinlik Başlığı';
      desc = 'Etkinliğimiz için kayıtlar başladı! Katılımcılara anket sonunda SSP verilecektir.';
      points = eventPoints;
      btnText = 'Kayıt Ol ve Puan Kazan';
    } else if (type === 'mission') {
      title = missionTitle || 'Örnek Haftalık Görev';
      desc = missionDesc || 'Bu haftaki görevi tamamlayarak SSP havuzunuzu genişletin!';
      points = missionPoints;
      btnText = 'Görevi Tamamla';
    } else if (type === 'announcement') {
      title = announceTitle || 'Önemli Duyuru Başlığı';
      desc = announceDesc || 'Üniversitemiz ile ilgili en güncel gelişmeler ve bildirimler.';
      btnText = 'Detayları Oku';
    }

    return (
      <div className="lg:col-span-2 relative hidden lg:block">
        <div className="sticky top-6">
          <div className="flex items-center gap-2 mb-3 justify-center">
            <Smartphone size={18} className="text-gray-400" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Canlı Önizleme (İESÜ Akış)</span>
          </div>
          
          <div className="w-[320px] h-[650px] mx-auto bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl relative border-8 border-gray-900">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-20"></div>
            <div className="w-full h-full bg-gray-100 rounded-[1.8rem] overflow-hidden relative flex flex-col">
              <div className="h-10 bg-white flex justify-between items-center px-6 pt-1">
                <span className="text-[10px] font-bold">14:20</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full border-2 border-black"></div>
                </div>
              </div>
              
              <div className="flex-1 bg-gray-100 p-3 overflow-y-auto custom-scrollbar">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
                  <div className="p-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs shrink-0">İESÜ</div>
                    <div>
                      <p className="text-[11px] font-bold leading-tight">Esenyurt Kariyer Geliştirme Koordinatörlüğü</p>
                      <p className="text-[9px] text-gray-500">Şimdi paylaştı</p>
                    </div>
                  </div>
                  
                  <div className="px-3 pb-2">
                    <h4 className="text-sm font-black text-gray-900 mb-1">{title}</h4>
                    <p className="text-[11px] text-gray-800 line-clamp-3">{desc}</p>
                  </div>
                  
                  {formImage ? (
                    <div className="w-full h-32 bg-gray-200">
                      <img src={formImage} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-full h-32 bg-gray-100 flex items-center justify-center border-y border-gray-100">
                      <ImageIcon size={32} className="text-gray-300"/>
                    </div>
                  )}
                  
                  <div className="p-3">
                    <button className={`w-full text-white font-bold text-[11px] py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md ${type === 'mission' ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-gradient-to-r from-red-600 to-indigo-700'}`}>
                      <CheckCircle2 size={14}/> {btnText}
                    </button>
                    {points !== null && (
                      <div className="mt-2 text-center">
                        <span className="inline-block bg-amber-100 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                          +{points} SSP
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in flex gap-6 max-w-[1400px]">
      
      {/* SOL MENÜ (SIDEBAR) */}
      <div className="w-64 shrink-0 space-y-4">
        <div className="bg-red-950 rounded-2xl p-5 text-white shadow-xl">
          <Award className="text-amber-500 w-10 h-10 mb-3" />
          <h2 className="text-xl font-black leading-tight">İçerik & SSP<br/>Merkezi</h2>
          <p className="text-xs text-slate-400 mt-2">Gelişmiş Yönetim Modülü</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-3 shadow-sm flex flex-col gap-1">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => { setActivePool(item.id); setViewState('list'); }}
              className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${activePool === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* SAĞ İÇERİK ALANI */}
      <div className="flex-1 space-y-6">
        
        {/* ======================= 1. SSP POOL ======================= */}
        {activePool === 'ssp_pool' && (
          <div className="space-y-6 animate-fade-in">
             <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-black text-gray-900">Öğrenci Liderlik Tablosu</h3>
                  <p className="text-xs text-gray-500">Öğrencilerin anket ve etkinliklerden kazandığı toplam puanlar.</p>
                </div>
                <div className="flex gap-3">
                  <div className="relative w-64">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Öğrenci Ara..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-red-500 outline-none" />
                  </div>
                  <button onClick={handleExportSPSS} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition active:scale-95 shadow-sm">
                    <FileSpreadsheet size={16} /> SPSS Excel İndir
                  </button>
                </div>
              </div>
              <Tbl 
                headers={['Sıra', 'Öğrenci Adı', 'Bölüm', 'Puan (SSP)', 'Rozet']}
                rows={filteredUsers.sort((a,b) => b.points - a.points).map((u, index) => [
                  <span className="font-bold text-gray-500">#{index + 1}</span>,
                  <span className="font-bold text-gray-900">{u.name}</span>,
                  <span className="text-sm text-gray-600">{u.department}</span>,
                  <span className="font-black text-red-600">{u.points.toLocaleString()} SSP</span>,
                  <Badge status={index === 0 ? 'Aktif' : index < 3 ? 'Yayında' : 'Beklemede'} label={index === 0 ? 'Lider' : index < 3 ? 'Elit' : 'Katılımcı'} />
                ])}
              />
            </Card>
          </div>
        )}

        {/* ======================= 2. EVENT POOL ======================= */}
        {activePool === 'event_pool' && viewState === 'list' && (
          <Card className="p-6 animate-fade-in border-t-4 border-red-500">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-black text-gray-900 text-lg">Etkinlik Havuzu</h3>
                <p className="text-xs text-gray-500">Kayıt gerektiren ve katılımcılara SSP kazandıran etkinlikler.</p>
              </div>
              <button onClick={() => setViewState('create_event')} className="bg-red-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2">
                <Plus size={16}/> Yeni Etkinlik
              </button>
            </div>
            <Tbl 
              headers={['ID', 'Etkinlik Adı', 'Kayıtlı', 'Puan Ödülü', 'Durum', 'İşlem']}
              rows={events.map(e => [
                <span className="text-xs font-bold text-gray-500">{e.id}</span>,
                <span className="font-bold text-gray-900">{e.title}</span>,
                <span className="font-medium text-gray-600">{e.attendees} Kişi</span>,
                <span className="font-black text-amber-600">{e.totalPoints} SSP</span>,
                <Badge status={e.status === 'Aktif' ? 'Aktif' : 'Bitti'} label={e.status} />,
                <button className="text-red-600 font-bold flex items-center gap-1 text-xs"><Edit3 size={14}/> Yönet</button>
              ])}
            />
          </Card>
        )}
        
        {activePool === 'event_pool' && viewState === 'create_event' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in">
            <div className="lg:col-span-3 space-y-6">
               <button onClick={resetForm} className="text-sm font-bold text-gray-500 hover:text-gray-800">← Havuza Dön</button>
               <Card className="p-6 border-t-4 border-red-600">
                 <h3 className="text-xl font-black text-gray-900 mb-6">Etkinlik Yayınla</h3>
                 <div className="space-y-4">
                    <div>
                      <label className="text-sm font-bold text-gray-700 block mb-2">Başlık</label>
                      <input type="text" value={eventTitle} onChange={e=>setEventTitle(e.target.value)} className="w-full p-3 border rounded-xl" />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 block mb-2">Kapak Görseli</label>
                      <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className={`w-full h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer ${dragActive ? 'border-red-500 bg-indigo-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                        <UploadCloud className={`mb-2 ${dragActive ? 'text-red-500' : 'text-gray-400'}`} />
                        <p className="text-sm font-bold text-gray-600">Görseli Sürükleyin</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 block mb-2">Kazanılacak SSP</label>
                      <input type="number" value={eventPoints} onChange={e=>setEventPoints(Number(e.target.value))} className="w-full p-3 border rounded-xl font-bold text-amber-600" />
                    </div>
                    <button onClick={() => { toast.success('Etkinlik Yayınlandı'); resetForm(); }} className="w-full bg-red-600 text-white font-bold py-3 rounded-xl mt-4">Yayınla</button>
                 </div>
               </Card>
            </div>
            <LivePreview type="event" />
          </div>
        )}

        {/* ======================= 3. MISSION POOL ======================= */}
        {activePool === 'mission_pool' && viewState === 'list' && (
          <Card className="p-6 animate-fade-in border-t-4 border-orange-500">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-black text-gray-900 text-lg">Haftalık Görev Havuzu</h3>
                <p className="text-xs text-gray-500">Öğrencilerin yaparak puan kazandığı mini görevler.</p>
              </div>
              <button onClick={() => setViewState('create_mission')} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2">
                <Plus size={16}/> Yeni Görev
              </button>
            </div>
            <Tbl 
              headers={['ID', 'Görev Adı', 'Tamamlayan', 'Puan', 'Durum', 'İşlem']}
              rows={missions.map(m => [
                <span className="text-xs font-bold text-gray-500">{m.id}</span>,
                <span className="font-bold text-gray-900">{m.title}</span>,
                <span className="font-medium text-gray-600">{m.participants}</span>,
                <span className="font-black text-amber-600">+{m.points} SSP</span>,
                <Badge status={m.status === 'Aktif' ? 'Aktif' : 'Bitti'} label={m.status} />,
                <button className="text-teal-600 font-bold flex items-center gap-1 text-xs"><Edit3 size={14}/> Yönet</button>
              ])}
            />
          </Card>
        )}

        {activePool === 'mission_pool' && viewState === 'create_mission' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in">
            <div className="lg:col-span-3 space-y-6">
               <button onClick={resetForm} className="text-sm font-bold text-gray-500 hover:text-gray-800">← Havuza Dön</button>
               <Card className="p-6 border-t-4 border-orange-500">
                 <h3 className="text-xl font-black text-gray-900 mb-6">Haftalık Görev Yayınla</h3>
                 <div className="space-y-4">
                    <div>
                      <label className="text-sm font-bold text-gray-700 block mb-2">Görev Başlığı</label>
                      <input type="text" value={missionTitle} onChange={e=>setMissionTitle(e.target.value)} className="w-full p-3 border rounded-xl" />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 block mb-2">Görev Açıklaması</label>
                      <textarea value={missionDesc} onChange={e=>setMissionDesc(e.target.value)} rows={3} className="w-full p-3 border rounded-xl resize-none"></textarea>
                    </div>
                    <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className={`w-full h-24 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer ${dragActive ? 'border-orange-500 bg-teal-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                        <UploadCloud className="mb-1 text-gray-400" size={24}/>
                        <p className="text-xs font-bold text-gray-600">İkon / Görsel Sürükleyin</p>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 block mb-2">Tamamlama Puanı</label>
                      <input type="number" value={missionPoints} onChange={e=>setMissionPoints(Number(e.target.value))} className="w-full p-3 border rounded-xl font-black text-amber-600" />
                    </div>
                    <button onClick={() => { toast.success('Görev Yayınlandı'); resetForm(); }} className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl mt-4">Yayına Al</button>
                 </div>
               </Card>
            </div>
            <LivePreview type="mission" />
          </div>
        )}

        {/* ======================= 4. ANNOUNCEMENT POOL ======================= */}
        {activePool === 'announcement_pool' && viewState === 'list' && (
          <Card className="p-6 animate-fade-in border-t-4 border-red-500">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-black text-gray-900 text-lg">Duyurular Havuzu</h3>
                <p className="text-xs text-gray-500">Puan içermeyen, genel bilgilendirme amaçlı duyurular.</p>
              </div>
              <button onClick={() => setViewState('create_announce')} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2">
                <Plus size={16}/> Yeni Duyuru
              </button>
            </div>
            <Tbl 
              headers={['ID', 'Duyuru Başlığı', 'Görüntülenme', 'Durum', 'İşlem']}
              rows={announcements.map(a => [
                <span className="text-xs font-bold text-gray-500">{a.id}</span>,
                <span className="font-bold text-gray-900">{a.title}</span>,
                <span className="font-medium text-gray-600">{a.views}</span>,
                <Badge status={a.status === 'Aktif' ? 'Aktif' : 'Bitti'} label={a.status} />,
                <button className="text-red-600 font-bold flex items-center gap-1 text-xs"><Edit3 size={14}/> Yönet</button>
              ])}
            />
          </Card>
        )}

        {activePool === 'announcement_pool' && viewState === 'create_announce' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in">
            <div className="lg:col-span-3 space-y-6">
               <button onClick={resetForm} className="text-sm font-bold text-gray-500 hover:text-gray-800">← Havuza Dön</button>
               <Card className="p-6 border-t-4 border-red-600">
                 <h3 className="text-xl font-black text-gray-900 mb-6">Duyuru Yayınla</h3>
                 <div className="space-y-4">
                    <div>
                      <label className="text-sm font-bold text-gray-700 block mb-2">Duyuru Başlığı</label>
                      <input type="text" value={announceTitle} onChange={e=>setAnnounceTitle(e.target.value)} className="w-full p-3 border rounded-xl" />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 block mb-2">Duyuru Detayı</label>
                      <textarea value={announceDesc} onChange={e=>setAnnounceDesc(e.target.value)} rows={4} className="w-full p-3 border rounded-xl resize-none"></textarea>
                    </div>
                    <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className={`w-full h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer ${dragActive ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                        <UploadCloud className="mb-2 text-gray-400" size={32}/>
                        <p className="text-sm font-bold text-gray-600">Afiş / Görsel Sürükleyin</p>
                    </div>
                    <button onClick={() => { toast.success('Duyuru Yayınlandı'); resetForm(); }} className="w-full bg-red-600 text-white font-bold py-3 rounded-xl mt-4">Herkese Duyur</button>
                 </div>
               </Card>
            </div>
            <LivePreview type="announcement" />
          </div>
        )}

        {/* ======================= 5. SURVEY POOL (LIKERT) ======================= */}
        {activePool === 'survey_pool' && viewState === 'list' && (
          <Card className="p-6 animate-fade-in border-t-4 border-emerald-500">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-black text-gray-900 text-lg">Likert Anket Havuzu</h3>
                <p className="text-xs text-gray-500">Değerlendirme anketleri (Zorunlu 1-5 Ölçekli).</p>
              </div>
              <button onClick={() => setViewState('create_survey')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                <Plus size={16}/> Yeni Anket Tasarla
              </button>
            </div>
            <Tbl 
              headers={['ID', 'Anket Başlığı', 'Bağlı Olduğu Etkinlik', 'Yanıt', 'Veri Analizi', 'İşlem']}
              rows={surveys.map(s => [
                <span className="text-xs font-bold text-gray-500">{s.id}</span>,
                <span className="font-bold text-gray-900">{s.title}</span>,
                <span className="font-medium text-gray-600">{s.event}</span>,
                <span className="font-black text-emerald-600">{s.responses}</span>,
                <button onClick={handleExportSPSS} className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded font-bold text-[11px] flex items-center gap-1 hover:bg-emerald-100"><FileSpreadsheet size={12}/> SPSS İndir</button>,
                <button onClick={() => handleManageSurvey(s.id)} className="text-red-600 font-bold flex items-center gap-1 text-xs"><Edit3 size={14}/> Yönet</button>
              ])}
            />
          </Card>
        )}

        {activePool === 'survey_pool' && viewState === 'create_survey' && (
          <div className="space-y-6 animate-fade-in max-w-4xl">
             <button onClick={resetForm} className="text-sm font-bold text-gray-500 hover:text-gray-800">← Havuza Dön</button>
             <Card className="p-6 border-t-4 border-emerald-500">
              <h3 className="text-xl font-black text-gray-900 mb-2">Likert Ölçekli Anket Kurucu</h3>
              <p className="text-sm text-gray-500 mb-6">Kendi sorularınızı oluşturun. Sistem SPSS analizi için zorunlu olarak "1-5 Likert" skalasını uygulayacaktır.</p>
              
              <div className="mb-6">
                <label className="text-sm font-bold text-gray-700 block mb-2">Anket Başlığı</label>
                <input type="text" value={surveyTitle} onChange={e=>setSurveyTitle(e.target.value)} className="w-full p-3 border rounded-xl" />
              </div>

              <div className="flex justify-between items-center mb-4 mt-8">
                <h4 className="font-black text-gray-800 flex items-center gap-2"><ListTodo size={18}/> Anket Soruları</h4>
                <button onClick={handleAddQuestion} className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1 hover:bg-emerald-200">
                  <Plus size={16}/> Soru Ekle
                </button>
              </div>

              <div className="space-y-4">
                {questions.map((q, idx) => {
                  const isExpanded = expandedQuestion === q.id;
                  return (
                    <div key={q.id} className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isExpanded ? 'border-emerald-500 shadow-md' : 'border-gray-200'}`}>
                      <div onClick={() => setExpandedQuestion(isExpanded ? null : q.id)} className={`p-4 flex items-center justify-between cursor-pointer ${isExpanded ? 'bg-emerald-50' : 'bg-white'}`}>
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-800 flex justify-center items-center font-black shrink-0">{idx + 1}</div>
                          <p className="font-bold text-gray-800 truncate">{q.title || <span className="text-gray-400 italic">Soru girilmedi...</span>}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-1 rounded">1-5 LIKERT</span>
                          <button onClick={(e) => { e.stopPropagation(); handleRemoveQuestion(q.id); }} className="text-gray-400 hover:text-red-600 p-2"><Trash2 size={18}/></button>
                          {isExpanded ? <ChevronUp size={24} className="text-emerald-600"/> : <ChevronDown size={24} className="text-gray-400"/>}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="p-5 bg-white border-t border-emerald-100 space-y-4">
                          <div>
                            <label className="text-xs font-bold text-gray-600 block mb-1">Soru Cümlesi</label>
                            <input type="text" value={q.title} onChange={e=>handleQuestionChange(q.id, 'title', e.target.value)} className="w-full p-3 border rounded-xl font-medium focus:border-emerald-500 outline-none" />
                          </div>
                          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                            <label className="text-xs font-black text-indigo-900 block mb-2 flex items-center gap-1"><Eye size={14}/> Yönetici Analiz Notu (SPSS Değişkeni)</label>
                            <textarea value={q.analysisNote} onChange={e=>handleQuestionChange(q.id, 'analysisNote', e.target.value)} rows={2} className="w-full p-3 border rounded-lg text-sm focus:border-indigo-400 outline-none resize-none"></textarea>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-6 mt-6 flex justify-end">
                <button onClick={() => { toast.success('Anket Tasarlandı!'); resetForm(); }} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-emerald-700">Kaydet</button>
              </div>
            </Card>
          </div>
        )}

        {/* ======================= 6. KVKK POOL ======================= */}
        {activePool === 'kvkk_pool' && (
          <Card className="p-6 animate-fade-in border-t-4 border-slate-700">
             <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2"><ShieldCheck size={24}/> Yasal İzinler & KVKK Havuzu</h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div><p className="font-bold text-gray-900">KVKK Aydınlatma Metni Eki</p><p className="text-sm text-gray-600">Etkinlik/Anketlerde zorunlu gösterim.</p></div>
                  <button onClick={() => setKvkkEnabled(!kvkkEnabled)} className={`relative h-8 w-14 rounded-full transition-colors ${kvkkEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                    <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${kvkkEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div><p className="font-bold text-gray-900">Açık Rıza Beyanı (Opt-in)</p><p className="text-sm text-gray-600">Onay kutucuğunu işaretlemeyi zorunlu kılar.</p></div>
                  <button onClick={() => setConsentEnabled(!consentEnabled)} className={`relative h-8 w-14 rounded-full transition-colors ${consentEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                    <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${consentEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
             </div>
          </Card>
        )}

      </div>
    </div>
  );
}
