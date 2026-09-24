import React, { useState, useEffect } from 'react';
import PanelHeader from './PanelHeader';
import { Card, Badge, Progress } from './AdminShared';
import { 
  Rocket, Search, Filter, Eye, CheckCircle2, Clock, X, 
  Lightbulb, TrendingUp, Users, Award, Building, Send, 
  MessageSquare, Trash2, Edit3, Target, DollarSign, ShieldCheck 
} from 'lucide-react';
import { toast } from '../shared/Toast';

const INITIAL_PROJECTS = [
  {
    id: 'proj_1',
    name: 'SmartCampus IoT - Akıllı Enerji Yönetimi',
    founderName: 'Alperen Şahin',
    founderDept: 'Yazılım Mühendisliği',
    founderEmail: 'alperen.sahin@esenyurt.edu.tr',
    category: 'Yeşil Dönüşüm & IoT',
    score: 92,
    stage: 'Kuluçka',
    mentorName: 'Doç. Dr. Emre Yıldız',
    date: '15 Ağustos 2026',
    pitch: 'Üniversite kampüsleri ve kurumsal binalar için otonom sensörler ile elektrik ve su tüketimini %35 optimize eden IoT donanım ve bulut kontrol yazılımı.',
    canvas: {
      problem: ['Yüksek enerji maliyetleri', 'Manuel sayaç okuma gecikmeleri', 'Karbon ayak izi regülasyon baskısı'],
      solution: ['LoRaWAN tabanlı otonom sensör ağı', 'Gerçek zamanlı tüketim optimizasyon paneli'],
      uniqueValue: 'Kurulumu 24 saat süren, mevcut bina otomasyonlarına entegre %35 enerji tasarrufu garantili B2B SaaS.',
      customerSegment: ['Üniversite Rektörlükleri', 'Büyük Hastaneler', 'Plaza Yönetimleri'],
      revenueStreams: ['Donanım Satış & Kurulum', 'Yıllık SaaS Lisanslama']
    }
  },
  {
    id: 'proj_2',
    name: 'MedVision - Radyoloji Asistan Yazılımı',
    founderName: 'Zeynep Kaya',
    founderDept: 'Bilgisayar Mühendisliği',
    founderEmail: 'zeynep.kaya@esenyurt.edu.tr',
    category: 'Sağlık Bilişimi & Görsel İşleme',
    score: 88,
    stage: 'Hızlandırma',
    mentorName: 'Dr. Selin Öztürk',
    date: '10 Ağustos 2026',
    pitch: 'MR ve BT görüntülerinde erken evre lezyonları tespit ederek radyoloji uzmanlarının karar destek sürecini hızlandıran görüntü işleme platformu.',
    canvas: {
      problem: ['Radyolog başına düşen aşırı iş yükü', 'Gözden kaçabilecek mikro-lezyon riskleri'],
      solution: ['Yüksek çözünürlüklü tıbbi görüntü analizi ve anomali tespiti'],
      uniqueValue: 'Radyologların ön tanı hazırlama süresini %60 kısaltan yerli ve KVKK uyumlu karar destek çözümü.',
      customerSegment: ['Özel Hastane Zincirleri', 'Tanı ve Görüntüleme Merkezleri'],
      revenueStreams: ['Tetkik Başına Ücretlendirme', 'Kurumsal Sunucu Lisansı']
    }
  },
  {
    id: 'proj_3',
    name: 'EduChain - Blokzincir Tabanlı Diploma Doğrulama',
    founderName: 'Caner Demir',
    founderDept: 'Yönetim Bilişim Sistemleri',
    founderEmail: 'caner.demir@esenyurt.edu.tr',
    category: 'Blokzincir & Eğitim Teknolojileri',
    score: 85,
    stage: 'Ön Kuluçka',
    mentorName: 'Burak Arslan',
    date: '02 Ağustos 2026',
    pitch: 'Yükseköğretim kurumları ve mezunlar için sahteciliği imkansız kılan, anında doğrulanabilir akıllı diploma ve sertifika protokolü.',
    canvas: {
      problem: ['Diploma ve sertifika sahteciliği', 'Uluslararası denklik süreçlerinin aylar sürmesi'],
      solution: ['Ethereum L2 üzerinde şifreli ve doğrulanabilir akademik kimlik cüzdanı'],
      uniqueValue: 'Tek tıkla küresel İK departmanları tarafından doğrulanabilir dijital diploma.',
      customerSegment: ['Üniversiteler', 'Sertifika Veren SEM Kurumları', 'Kurumsal İK Departmanları'],
      revenueStreams: ['Belge Başına Mint Ücreti', 'Kurumsal Doğrulama API Aboneliği']
    }
  },
  {
    id: 'proj_4',
    name: 'AgriSense - Tarımsal Verim Analitiği',
    founderName: 'Mert Aksoy',
    founderDept: 'Endüstri Mühendisliği',
    founderEmail: 'mert.aksoy@esenyurt.edu.tr',
    category: 'Tarım Teknolojileri (AgriTech)',
    score: 79,
    stage: 'Ön Kuluçka',
    mentorName: 'Atanmadı',
    date: '28 Temmuz 2026',
    pitch: 'Uydu görüntüleri ve toprak nem sensörleri kullanarak sulama ve gübreleme planını optimize eden çiftçi mobil uygulaması.',
    canvas: {
      problem: ['Aşırı su ve gübre israfı', 'İklim krizine bağlı rekolte kaybı'],
      solution: ['Uydu destekli bölgesel sulama rehberi'],
      uniqueValue: 'Karmaşık donanım gerektirmeyen, basit akıllı telefon bildirimleriyle çalışan tarım rehberi.',
      customerSegment: ['Sözleşmeli Tarım Yapan Çiftçiler', 'Tarım Kredi Kooperatifleri'],
      revenueStreams: ['Freemium Mobil Abonelik', 'B2B Kurumsal Raporlama']
    }
  }
];

export default function CMSIncubator() {
  const [projects, setProjects] = useState(() => {
    try {
      const stored = localStorage.getItem('iesu_incubator_projects_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_PROJECTS;
  });

  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('Tümü');
  const [selectedProject, setSelectedProject] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('iesu_incubator_projects_v1', JSON.stringify(projects));
    } catch (e) {}
  }, [projects]);

  const handleStageChange = (id, newStage) => {
    const updated = projects.map(p => p.id === id ? { ...p, stage: newStage } : p);
    setProjects(updated);
    if (selectedProject?.id === id) {
      setSelectedProject(prev => ({ ...prev, stage: newStage }));
    }
    toast.success(`Girişim aşaması "${newStage}" olarak güncellendi.`);
  };

  const handleAssignMentor = (id, mentorName) => {
    const updated = projects.map(p => p.id === id ? { ...p, mentorName } : p);
    setProjects(updated);
    if (selectedProject?.id === id) {
      setSelectedProject(prev => ({ ...prev, mentorName }));
    }
    toast.success(`Danışman/Mentör "${mentorName}" başarıyla atandı.`);
  };

  const handleDeleteProject = (id) => {
    if (window.confirm('Bu girişim projesini kuluçka listesinden kaldırmak istediğinize emin misiniz?')) {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      setSelectedProject(null);
      toast.info('Proje kuluçka havuzundan silindi.');
    }
  };

  const handleSendFeedback = () => {
    if (!feedbackText.trim()) {
      toast.error('Lütfen girişimciye iletmek istediğiniz değerlendirme notunu giriniz.');
      return;
    }
    toast.success(`Değerlendirme notunuz "${selectedProject.founderName}" öğrencimize başarıyla iletildi.`);
    setFeedbackText('');
  };

  const filtered = projects.filter(p => {
    const matchSearch = !search || 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.founderName.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === 'Tümü' || p.stage === stageFilter;
    return matchSearch && matchStage;
  });

  const STAGES = ['Tümü', 'Ön Kuluçka', 'Kuluçka', 'Hızlandırma', 'Yatırımcı Hazır'];

  return (
    <div className="space-y-6 animate-fade-in pb-24">
      <PanelHeader
        title="Kuluçka & Girişimcilik Projeleri Masası"
        sub="Öğrencilerin hazırladığı girişim projeleri, fizibilite skorları ve TTO kuluçka takip süreçleri"
      />

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-[#990000] flex items-center justify-center shrink-0">
            <Rocket size={20} />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">{projects.length}</div>
            <div className="text-[11px] font-bold text-slate-500">Toplam Başvuru</div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">
              {projects.filter(p => p.stage === 'Ön Kuluçka').length}
            </div>
            <div className="text-[11px] font-bold text-slate-500">Ön Kuluçka</div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">
              {projects.filter(p => p.stage === 'Kuluçka').length}
            </div>
            <div className="text-[11px] font-bold text-slate-500">Aktif Kuluçka</div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">
              {projects.filter(p => p.stage === 'Hızlandırma' || p.stage === 'Yatırımcı Hazır').length}
            </div>
            <div className="text-[11px] font-bold text-slate-500">Yatırımcı Aşaması</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Girişim adı, öğrenci veya sektör ara..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#990000] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Aşama:</span>
          {STAGES.map(st => (
            <button
              key={st}
              onClick={() => setStageFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                stageFilter === st
                  ? 'bg-[#990000] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-black uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Girişim Projesi</th>
                <th className="p-4">Kurucu Öğrenci</th>
                <th className="p-4">Sektör / Kategori</th>
                <th className="p-4">Fizibilite Skoru</th>
                <th className="p-4">Kuluçka Aşaması</th>
                <th className="p-4">Atanan Mentör</th>
                <th className="p-4 text-right">İşlem & Detay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-slate-400 font-bold">
                    Kriterlere uygun kayıtlı kuluçka projesi bulunamadı.
                  </td>
                </tr>
              ) : (
                filtered.map(proj => (
                  <tr key={proj.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4">
                      <div className="font-extrabold text-slate-900 text-sm">{proj.name}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{proj.pitch}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{proj.founderName}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{proj.founderDept}</div>
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-lg text-[11px]">
                        {proj.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-[#990000] text-xs">%{proj.score}</span>
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              proj.score >= 85 ? 'bg-emerald-500' : proj.score >= 70 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${proj.score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          proj.stage === 'Kuluçka'
                            ? 'bg-blue-100 text-blue-800'
                            : proj.stage === 'Hızlandırma' || proj.stage === 'Yatırımcı Hazır'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {proj.stage}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-slate-700">{proj.mentorName || 'Atanmadı'}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedProject(proj)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-[#990000] hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye size={13} /> İncele
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 flex items-center justify-center transition cursor-pointer"
                          title="Sil"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[10000] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-[#990000] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-amber-400">
                  <Rocket size={24} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white">{selectedProject.name}</h3>
                  <p className="text-xs text-slate-300">
                    Kurucu: {selectedProject.founderName} ({selectedProject.founderDept}) • {selectedProject.date}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs">
              {/* Pitch Summary */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="font-black text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Lightbulb size={14} className="text-amber-600" /> Girişim Özeti & Asansör Cümlesi
                </h4>
                <p className="text-slate-700 leading-relaxed font-medium">{selectedProject.pitch}</p>
              </div>

              {/* Business Model Canvas Details */}
              {selectedProject.canvas && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100 space-y-2">
                    <span className="font-black text-red-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Target size={14} className="text-red-700" /> Çözülen Problem
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-red-900 font-medium">
                      {(selectedProject.canvas.problem || []).map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2">
                    <span className="font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-700" /> Geliştirilen Çözüm
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-emerald-900 font-medium">
                      {(selectedProject.canvas.solution || []).map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-2">
                    <span className="font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Award size={14} className="text-blue-700" /> Benzersiz Değer Önerisi
                    </span>
                    <p className="text-blue-900 font-medium leading-relaxed">{selectedProject.canvas.uniqueValue}</p>
                  </div>

                  <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2">
                    <span className="font-black text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
                      <DollarSign size={14} className="text-purple-700" /> Gelir Modelleri
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-purple-900 font-medium">
                      {(selectedProject.canvas.revenueStreams || []).map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Status and Mentor Assignment Controls */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-black text-slate-700 uppercase tracking-wider mb-2">
                    Kuluçka Aşamasını Güncelle:
                  </label>
                  <select
                    value={selectedProject.stage}
                    onChange={e => handleStageChange(selectedProject.id, e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-[#990000]"
                  >
                    {['Ön Kuluçka', 'Kuluçka', 'Hızlandırma', 'Yatırımcı Hazır'].map(st => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-black text-slate-700 uppercase tracking-wider mb-2">
                    Atanan Danışman / Mentör:
                  </label>
                  <select
                    value={selectedProject.mentorName || 'Atanmadı'}
                    onChange={e => handleAssignMentor(selectedProject.id, e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-[#990000]"
                  >
                    <option value="Atanmadı">Atanmadı</option>
                    <option value="Doç. Dr. Emre Yıldız">Doç. Dr. Emre Yıldız (TTO Koordinatörü)</option>
                    <option value="Dr. Selin Öztürk">Dr. Selin Öztürk (Yazılım ve Veri Bilimi)</option>
                    <option value="Burak Arslan">Burak Arslan (Melek Yatırımcı & Girişimci)</option>
                    <option value="Zeynep Tekin">Zeynep Tekin (Hukuk & Fikri Mülkiyet)</option>
                  </select>
                </div>
              </div>

              {/* Feedback to Founder */}
              <div className="space-y-2">
                <label className="block font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare size={14} className="text-[#990000]" /> Girişimci Öğrenciye Değerlendirme & Jüri Notu İlet
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={feedbackText}
                    onChange={e => setFeedbackText(e.target.value)}
                    placeholder="Örn: Fizibilite skorunuz olumlu. TTO ile kuluçka sözleşmesi ve ofis tahsisi için salı günü görüşmeye bekleniyorsunuz..."
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-[#990000] focus:bg-white"
                  />
                  <button
                    onClick={handleSendFeedback}
                    className="px-5 py-2.5 bg-[#990000] hover:bg-red-800 text-white rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Send size={14} /> Gönder
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
