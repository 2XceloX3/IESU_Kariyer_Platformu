import React, { useState } from 'react';
import { Users, Search, Plus, ShieldCheck, MapPin, Calendar, Home, Compass, Briefcase } from 'lucide-react';
import TopProfileMenu from './TopProfileMenu';
import Logo from './Logo';

const NavIcon = ({ icon, label, badge, active, onClick }) => {
  const getClasses = () => {
    switch (label) {
      case 'Akış': return { text: 'text-blue-500', bg: 'bg-blue-50', badge: 'bg-blue-500', glow: 'drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]' };
      case 'Kariyer Ağı': return { text: 'text-purple-500', bg: 'bg-purple-50', badge: 'bg-purple-500', glow: 'drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]' };
      case 'İş ve Staj': return { text: 'text-emerald-500', bg: 'bg-emerald-50', badge: 'bg-emerald-500', glow: 'drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]' };
      case 'Topluluklar': return { text: 'text-teal-500', bg: 'bg-teal-50', badge: 'bg-teal-500', glow: 'drop-shadow-[0_0_12px_rgba(20,184,166,0.8)]' };
      default: return { text: 'text-iesu-red', bg: 'bg-red-50', badge: 'bg-iesu-red', glow: 'drop-shadow-[0_0_12px_rgba(220,38,38,0.8)]' };
    }
  };
  const theme = getClasses();
  return (
    <div className="relative group cursor-pointer" onClick={onClick} title={label}>
      <div className={`p-2 sm:p-2.5 rounded-2xl transition-all duration-300 ${active ? `${theme.bg} scale-105` : 'hover:bg-gray-100/80 hover:scale-105'}`}>
        <div className={`transition-all duration-300 ${active ? `${theme.text} ${theme.glow}` : 'text-gray-500 group-hover:text-gray-900'}`}>
          {React.cloneElement(icon, { size: active ? 22 : 20, strokeWidth: active ? 2.5 : 2 })}
        </div>
      </div>
      <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-300 ${active ? `${theme.badge} opacity-100 scale-100` : 'opacity-0 scale-0'}`} />
    </div>
  );
};

export default function GroupsPanel({ groups, setGroups, currentUser, userRole, setView, setSelectedGroupId, setSelectedUserId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    type: 'Öğrenci Kulübü'
  });

  const filteredGroups = (groups || []).filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!newGroup.name || !newGroup.description) return;

    const group = {
      id: `GRP-${Date.now()}`,
      name: newGroup.name,
      description: newGroup.description,
      type: newGroup.type,
      cover: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2084&q=80",
      logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(newGroup.name)}&background=0D9488&color=fff&size=200`,
      memberCount: 1,
      verified: false,
      createdBy: currentUser?.id,
      status: "Aktif",
      events: []
    };

    setGroups([group, ...(groups || [])]);
    setShowCreateModal(false);
    setNewGroup({ name: '', description: '', type: 'Öğrenci Kulübü' });
  };

  const handleGroupClick = (id) => {
    setSelectedGroupId(id);
    setView('group_profile');
  };

  const handleOpenChat = (e, id) => {
    e.stopPropagation();
    setSelectedGroupId(id);
    setView('messaging');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setView(previousView === 'academic' ? 'academic' : previousView === 'admin' ? 'admin' : previousView === 'student' ? 'student' : previousView === 'alumni' ? 'alumni' : previousView === 'company' ? 'company' : userRole === 'admin' ? 'admin' : userRole === 'employer' ? 'company' : userRole || 'landing')}>
            <Logo className="h-10 w-auto text-iesu-red hover:scale-105 transition-transform" />
            <div className="hidden lg:block">
              <h1 className="text-[13px] font-black text-gray-900 tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kariyer Merkezi</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <NavIcon icon={<Home />} label="Akış" onClick={() => setView(previousView === 'academic' ? 'academic' : previousView === 'admin' ? 'admin' : previousView === 'student' ? 'student' : previousView === 'alumni' ? 'alumni' : previousView === 'company' ? 'company' : userRole === 'admin' ? 'admin' : userRole === 'employer' ? 'company' : userRole || 'landing')} />
            <NavIcon icon={<Compass />} label="Kariyer Ağı" onClick={() => setView(previousView === 'academic' ? 'academic' : previousView === 'admin' ? 'admin' : previousView === 'student' ? 'student' : previousView === 'alumni' ? 'alumni' : previousView === 'company' ? 'company' : userRole === 'admin' ? 'admin' : userRole === 'employer' ? 'company' : userRole || 'landing')} />
            <NavIcon icon={<Users />} label="Topluluklar" active={true} onClick={() => {}} />
            <NavIcon icon={<Briefcase />} label="İş ve Staj" onClick={() => setView('jobs')} />
            <div className="ml-2">
              <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
            </div>
          </div>
        </div>
      </nav>

      {/* Header for search and create */}
      <div className="pt-24 max-w-[1200px] mx-auto px-4 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2">
            <Users className="text-iesu-red" size={28} /> Topluluklar ve Gruplar
          </h1>
        </div>
        
        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Topluluk ara..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-iesu-red outline-none shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {['student', 'academic', 'alumni'].includes(userRole) && (
            <button onClick={() => setShowCreateModal(true)} className="flex items-center justify-center gap-2 bg-iesu-red text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-iesu-darkRed transition shadow-sm shrink-0">
              <Plus size={18} /> <span className="hidden sm:inline">Topluluk Kur</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map(group => (
            <div key={group.id} onClick={() => handleGroupClick(group.id)} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer group">
              <div className="h-32 bg-gray-200 relative overflow-hidden">
                <img src={group.cover} alt={group.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              <div className="p-6 relative">
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-white shadow-sm absolute -top-10 left-6 overflow-hidden">
                  <img src={group.logo} alt="Logo" className="w-full h-full object-cover" />
                </div>
                
                <div className="pt-8">
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-1.5 mb-1 line-clamp-1">
                    {group.name} {group.verified && <ShieldCheck size={16} className="text-blue-500 shrink-0" />}
                  </h3>
                  <p className="text-xs font-medium text-gray-500 mb-3">{group.type} • {group.memberCount} Üye</p>
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4">
                    {group.description}
                  </p>
                  
                  {group.events?.length > 0 && (
                    <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100/50 mb-4">
                      <p className="text-xs font-bold text-blue-700 flex items-center gap-1.5 mb-1">
                        <Calendar size={12} /> Yaklaşan Etkinlik
                      </p>
                      <p className="text-sm text-gray-800 font-medium truncate">{group.events[0].title}</p>
                    </div>
                  )}

                  <button 
                    onClick={(e) => handleOpenChat(e, group.id)}
                    className="w-full mt-2 py-2.5 bg-gray-50 hover:bg-[#DCF8C6] hover:text-[#00A884] hover:border-[#00A884] text-gray-600 font-bold text-sm rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-2 group-hover:shadow-sm"
                  >
                    Sohbete Katıl
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredGroups.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500">
              Aradığınız kriterlere uygun topluluk bulunamadı.
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-900">Yeni Topluluk Kur</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleCreateGroup} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Topluluk Adı</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-iesu-red outline-none"
                  value={newGroup.name}
                  onChange={e => setNewGroup({...newGroup, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Topluluk Türü</label>
                <select 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-iesu-red outline-none"
                  value={newGroup.type}
                  onChange={e => setNewGroup({...newGroup, type: e.target.value})}
                >
                  <option value="Öğrenci Kulübü">Öğrenci Kulübü</option>
                  <option value="Mezun Ağı">Mezun Ağı</option>
                  <option value="Akademik Çalışma Grubu">Akademik Çalışma Grubu</option>
                  <option value="Proje Takımı">Proje Takımı</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Açıklama / Vizyon</label>
                <textarea 
                  required
                  rows="3"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-iesu-red outline-none resize-none"
                  value={newGroup.description}
                  onChange={e => setNewGroup({...newGroup, description: e.target.value})}
                ></textarea>
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full py-3 bg-iesu-red text-white font-bold rounded-xl hover:bg-iesu-darkRed transition shadow-md">
                  Kuruluş Talebini Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
