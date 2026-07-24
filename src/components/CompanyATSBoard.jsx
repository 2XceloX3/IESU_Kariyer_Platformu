import React, { useState } from 'react';
import { Briefcase, MapPin, Building2, ChevronLeft, Search, Plus, MoreHorizontal, User, ShieldCheck, MessageSquare, Phone, Mail, FileText, CheckCircle2, Clock } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const INITIAL_COLUMNS = [
  { id: 'new', title: 'Yeni Başvuru', count: 5, color: 'bg-red-50 text-red-700 border-red-200' },
  { id: 'review', title: 'İnceleniyor', count: 3, color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'interview', title: 'Mülakat', count: 2, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'offer', title: 'Teklif Aşaması', count: 1, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'rejected', title: 'Reddedildi', count: 8, color: 'bg-rose-50 text-rose-700 border-rose-200' }
];

const INITIAL_APPLICANTS = {
  'new': [
    { id: 'app-1', name: 'Ahmet Yılmaz', role: 'Frontend Developer', uni: 'İstanbul Esenyurt Üniversitesi', date: 'Bugün', avatar: 'https://ui-avatars.com/api/?name=AY&background=0A2342&color=fff', match: 92 },
    { id: 'app-2', name: 'Ayşe Demir', role: 'UI/UX Tasarımcı', uni: 'İstanbul Esenyurt Üniversitesi', date: 'Dün', avatar: 'https://ui-avatars.com/api/?name=AD&background=0A2342&color=fff', match: 85 }
  ],
  'review': [
    { id: 'app-3', name: 'Mehmet Can', role: 'Data Scientist', uni: 'İstanbul Esenyurt Üniversitesi', date: '2 gün önce', avatar: 'https://ui-avatars.com/api/?name=MC&background=0A2342&color=fff', match: 78 }
  ],
  'interview': [
    { id: 'app-4', name: 'Zeynep Kaya', role: 'Backend Engineer', uni: 'İstanbul Esenyurt Üniversitesi', date: 'Geçen hafta', avatar: 'https://ui-avatars.com/api/?name=ZK&background=0A2342&color=fff', match: 95 }
  ],
  'offer': [
    { id: 'app-5', name: 'Can Özkan', role: 'Product Manager', uni: 'İstanbul Esenyurt Üniversitesi', date: 'Geçen hafta', avatar: 'https://ui-avatars.com/api/?name=CO&background=0A2342&color=fff', match: 88 }
  ],
  'rejected': [
    { id: 'app-6', name: 'Elif Şahin', role: 'Frontend Developer', uni: 'İstanbul Esenyurt Üniversitesi', date: '2 hafta önce', avatar: 'https://ui-avatars.com/api/?name=ES&background=0A2342&color=fff', match: 45 }
  ]
};

export default function CompanyATSBoard({ setView, currentUser }) {
  const [columns] = useState(INITIAL_COLUMNS);
  const [applicants, setApplicants] = useState(INITIAL_APPLICANTS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Basic drag and drop without external library to keep it robust
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedSourceCol, setDraggedSourceCol] = useState(null);

  const handleDragStart = (e, item, sourceColId) => {
    setDraggedItem(item);
    setDraggedSourceCol(sourceColId);
    e.dataTransfer.effectAllowed = 'move';
    // Small delay to allow visual drag
    setTimeout(() => {
      e.target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
    setDraggedSourceCol(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetColId) => {
    e.preventDefault();
    if (!draggedItem || draggedSourceCol === targetColId) return;

    setApplicants(prev => {
      const newApplicants = { ...prev };
      // Remove from source
      newApplicants[draggedSourceCol] = newApplicants[draggedSourceCol].filter(app => app.id !== draggedItem.id);
      // Add to target
      newApplicants[targetColId] = [draggedItem, ...newApplicants[targetColId]];
      return newApplicants;
    });
    
    if (window.toast) {
      window.toast.success(`${draggedItem.name} adlı adayın durumu güncellendi.`);
    }
  };

  const moveApplicant = (item, sourceColId, targetColId) => {
    setApplicants(prev => {
      const newApplicants = { ...prev };
      newApplicants[sourceColId] = newApplicants[sourceColId].filter(app => app.id !== item.id);
      newApplicants[targetColId] = [item, ...newApplicants[targetColId]];
      return newApplicants;
    });
    if (window.toast) {
      window.toast.success(`${item.name} adlı adayın durumu güncellendi.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setView('company')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
              >
                <ChevronLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-black text-[#990000] flex items-center gap-2">
                  <Briefcase className="text-red-600" size={24} />
                  İşe Alım Panosu (ATS)
                </h1>
                <p className="text-sm text-gray-500 font-medium">Aday takip ve süreç yönetimi</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Aday ara..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-red-700 transition shadow-sm shrink-0">
                <Plus size={16} /> İlan Ekle
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="max-w-[1600px] mx-auto px-4 py-6 sm:px-6 lg:px-8 overflow-x-auto">
        <div className="flex gap-6 min-h-[calc(100vh-180px)] pb-4">
          {columns.map(column => (
            <div 
              key={column.id} 
              className="flex-shrink-0 w-[320px] flex flex-col bg-gray-100/50 rounded-2xl border border-gray-200/60"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className={`p-3 rounded-t-2xl border-b flex justify-between items-center ${column.color}`}>
                <h3 className="font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                  {column.title}
                  <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs">{applicants[column.id]?.length || 0}</span>
                </h3>
                <button className="text-current opacity-60 hover:opacity-100 transition">
                  <MoreHorizontal size={16} />
                </button>
              </div>
              
              {/* Column Body */}
              <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                {applicants[column.id]
                  ?.filter(app => app.name.toLowerCase().includes(searchQuery.toLowerCase()) || app.role.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(app => (
                  <div 
                    key={app.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, app, column.id)}
                    onDragEnd={handleDragEnd}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group relative"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <img src={app.avatar} alt={app.name} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                        <div>
                          <h4 className="font-bold text-sm text-gray-900 leading-tight flex items-center gap-1">
                            {app.name}
                            <ShieldCheck size={14} className="text-red-500" title="Doğrulanmış Öğrenci" />
                          </h4>
                          <p className="text-xs text-gray-500 font-medium">{app.uni}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-xs font-bold text-[#990000] bg-red-50 px-2 py-1 rounded inline-block mb-2">
                        {app.role}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Clock size={12} /> {app.date}</span>
                        <span className={`font-bold flex items-center gap-1 ${app.match >= 90 ? 'text-emerald-600' : app.match >= 75 ? 'text-red-600' : 'text-amber-600'}`}>
                          Uyum: %{app.match}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <button className="flex-1 py-1.5 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded transition flex items-center justify-center gap-1.5">
                        <FileText size={14} /> CV'yi Gör
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition" title="Mesaj Gönder">
                        <MessageSquare size={16} />
                      </button>
                      
                      {/* Mobile Move Buttons (Visible on hover or touch) */}
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition flex flex-col gap-1 bg-white p-1 rounded-lg shadow-sm border border-gray-100 z-10">
                        {column.id !== 'new' && (
                          <button onClick={() => moveApplicant(app, column.id, 'new')} className="text-[10px] p-1 text-gray-500 hover:text-red-600 text-left">Yeni'ye</button>
                        )}
                        {column.id !== 'review' && (
                          <button onClick={() => moveApplicant(app, column.id, 'review')} className="text-[10px] p-1 text-gray-500 hover:text-amber-600 text-left">İnceleme'ye</button>
                        )}
                        {column.id !== 'interview' && (
                          <button onClick={() => moveApplicant(app, column.id, 'interview')} className="text-[10px] p-1 text-gray-500 hover:text-purple-600 text-left">Mülakat'a</button>
                        )}
                        {column.id !== 'offer' && (
                          <button onClick={() => moveApplicant(app, column.id, 'offer')} className="text-[10px] p-1 text-gray-500 hover:text-emerald-600 text-left">Teklif'e</button>
                        )}
                        {column.id !== 'rejected' && (
                          <button onClick={() => moveApplicant(app, column.id, 'rejected')} className="text-[10px] p-1 text-gray-500 hover:text-rose-600 text-left">Reddet</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {applicants[column.id]?.length === 0 && (
                  <div className="h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-xs font-bold text-gray-400">
                    Sürükleyip Bırakın
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
