import React from 'react';
import { Users, Info, ShieldCheck, MessageCircle, Calendar, Home, Compass, Briefcase } from 'lucide-react';
import PostComposer from './PostComposer';
import PostCard from './PostCard';
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

export default function GroupProfile({ userRole, groupId, groupData, posts, setPosts, currentUser, setView, setSelectedUserId }) {
  if (!groupData || Object.keys(groupData).length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
        <Users size={48} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-black text-gray-900 mb-2">Grup Bulunamadı</h2>
        <p className="text-gray-500 max-w-md">Aradığınız kulüp veya topluluk sistemde kayıtlı değil veya yönetici onayı bekliyor.</p>
        <button onClick={() => setView(userRole === 'admin' ? 'admin' : userRole === 'employer' ? 'company' : userRole || 'landing')} className="mt-6 px-6 py-2 bg-iesu-red text-white font-bold rounded-xl">Akışa Dön</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-16">
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setView(userRole === 'admin' ? 'admin' : userRole === 'employer' ? 'company' : userRole || 'landing')}>
            <Logo className="h-10 w-auto text-iesu-red hover:scale-105 transition-transform" />
            <div className="hidden lg:block">
              <h1 className="text-[13px] font-black text-gray-900 tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kariyer Merkezi</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <NavIcon icon={<Home />} label="Akış" onClick={() => setView(userRole === 'admin' ? 'admin' : userRole === 'employer' ? 'company' : userRole || 'landing')} />
            <NavIcon icon={<Compass />} label="Kariyer Ağı" onClick={() => setView(userRole === 'admin' ? 'admin' : userRole === 'employer' ? 'company' : userRole || 'landing')} />
            <NavIcon icon={<Users />} label="Topluluklar" active={true} onClick={() => setView('groups')} />
            <NavIcon icon={<Briefcase />} label="İş ve Staj" onClick={() => setView('jobs')} />
            <div className="ml-2">
              <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
            </div>
          </div>
        </div>
      </nav>

      {/* Cover Image */}
      <div className="h-48 md:h-64 bg-gray-200 w-full relative">
        {groupData.cover ? (
          <img src={groupData.cover} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-red-700 to-red-900"></div>
        )}
      </div>

      <div className="max-w-[1000px] mx-auto px-4 lg:px-8 relative -mt-16 sm:-mt-24">
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center sm:items-end gap-6 mb-8 relative z-10">
          <div className="w-32 h-32 rounded-2xl bg-white border-4 border-white shadow-lg overflow-hidden shrink-0 flex items-center justify-center">
            {groupData.logo ? (
              <img src={groupData.logo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <Users size={48} className="text-gray-400" />
            )}
          </div>
          
          <div className="flex-1 text-center sm:text-left mb-2">
            <h1 className="text-2xl font-black text-gray-900 flex items-center justify-center sm:justify-start gap-2">
              {groupData.name} {groupData.verified && <ShieldCheck size={20} className="text-blue-500" />}
            </h1>
            <p className="text-sm font-medium text-gray-500 mt-1">{groupData.type || 'Öğrenci Kulübü'} • {groupData.memberCount || 0} Üye</p>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-6 py-2.5 bg-iesu-red text-white font-bold rounded-xl hover:bg-iesu-darkRed transition flex items-center justify-center gap-2">
              Katıl
            </button>
            <button className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition">
              <MessageCircle size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Panel: About */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                <Info className="text-iesu-red" size={20} /> Hakkında
              </h3>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                {groupData.description || 'Bu topluluk henüz bir açıklama eklemedi.'}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                <Users className="text-iesu-red" size={20} /> Yönetim Kurulu
              </h3>
              <div className="space-y-3">
                {[
                  { title: 'Kulüp Başkanı', name: groupData.president || 'Ahmet Yılmaz', role: 'Öğrenci' },
                  { title: 'Başkan Yardımcısı', name: groupData.vicePresident || 'Ayşe Demir', role: 'Öğrenci' },
                  { title: 'Sayman', name: 'Can Özkan', role: 'Öğrenci' },
                  { title: 'Sekreter', name: 'Zeynep Çelik', role: 'Öğrenci' }
                ].map((boardMember, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition cursor-pointer" onClick={() => { setSelectedUserId('USR-3'); setView('user_profile'); }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(boardMember.name)}&background=132A49&color=fff`} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-[13px]">{boardMember.name}</p>
                        <p className="text-[11px] text-gray-500 font-medium">{boardMember.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Feed */}
          <div className="md:col-span-2 space-y-6">
            <PostComposer currentUser={currentUser} posts={posts} setPosts={setPosts} />

            <div className="space-y-6">
              {(posts || []).filter(p => p.groupId === groupId).length > 0 ? (
                (posts || []).filter(p => p.groupId === groupId).map(post => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm">
                  <p className="text-gray-500 font-medium">Bu grupta henüz bir paylaşım yapılmadı.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


