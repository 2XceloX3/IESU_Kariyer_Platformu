import React from 'react';
import { Users, Info, ShieldCheck, MessageCircle, Calendar } from 'lucide-react';
import PostComposer from './PostComposer';
import PostCard from './PostCard';

export default function GroupProfile({ userRole, groupId, groupData, posts, setPosts, currentUser, setView }) {
  if (!groupData) {
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
    <div className="min-h-screen bg-gray-50 pb-20">
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


