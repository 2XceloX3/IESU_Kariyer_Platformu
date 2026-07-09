import React from 'react';
import {  Briefcase, CheckCircle2, Clock, XCircle, ChevronRight, UserCircle2 , ChevronLeft } from 'lucide-react';

export default function ApplicationsPanel({ applications = [], setApplications, jobs = [], currentUser, userRole }) {
  // If student: show their applications
  // If company: show applications to their jobs

  const myApplications = userRole === 'student' 
    ? (applications || []).filter(app => app.applicantId === currentUser?.id)
    : (applications || []).filter(app => app.company === currentUser?.name);

  const handleStatusChange = (appId, newStatus) => {
    setApplications((applications || []).map(app => 
      app.id === appId ? { ...app, status: newStatus } : app
    ));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Onaylandı': case 'Mülakat': return 'bg-green-100 text-green-700 border-green-200';
      case 'Reddedildi': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-orange-100 text-orange-700 border-orange-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Onaylandı': case 'Mülakat': return <CheckCircle2 size={16} />;
      case 'Reddedildi': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1000px] mx-auto px-4 lg:px-8 h-16 flex items-center">
          <button onClick={() => {
            if (typeof setView === 'function') {
              if (!userRole) { setView(userRole === 'admin' ? 'admin' : userRole === 'employer' ? 'company' : userRole || 'landing'); }
              else if (userRole === 'employer') { setView('company'); }
              else { setView(userRole); }
            }
          }} className="flex items-center gap-2 text-gray-600 hover:text-iesu-red font-bold transition-colors">
            <ChevronLeft size={20} /> Geri Dön
          </button>
        </div>
      </nav>
      <main className="max-w-[1000px] mx-auto px-4 lg:px-8 pt-8">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 min-h-[500px]">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Briefcase size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-900">
            {userRole === 'student' ? 'Başvurularım' : 'Gelen Başvurular'}
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            {userRole === 'student' ? 'İş ve staj başvurularınızın durumunu takip edin.' : 'İlanlarınıza gelen başvuruları inceleyin ve yönetin.'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {myApplications.length === 0 ? (
          <div className="text-center py-12 px-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Henüz Başvuru Yok</h3>
            <p className="text-gray-500">
              {userRole === 'student' ? 'Henüz hiçbir ilana başvurmadınız. İlanlar sekmesinden fırsatları inceleyebilirsiniz.' : 'Henüz ilanlarınıza başvuru yapılmadı.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(myApplications || []).map(app => (
              <div key={app.id} className="p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)} {app.status}
                    </div>
                    <span className="text-xs text-gray-400 font-medium">{app.date}</span>
                  </div>
                  
                  {userRole === 'company' && (
                    <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                        <img src={`https://ui-avatars.com/api/?name=${app.applicantName}&background=random&color=fff`} alt={app.applicantName} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{app.applicantName}</p>
                        <p className="text-xs text-gray-500">Aday Profili</p>
                      </div>
                    </div>
                  )}

                  <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{app.jobTitle}</h3>
                  <p className="text-sm text-gray-600 mb-4">{app.company}</p>
                </div>

                {userRole === 'company' && (
                  <div className="pt-4 mt-2 border-t border-gray-100 grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => handleStatusChange(app.id, 'Mülakat')}
                      className={`py-2 rounded-xl text-xs font-bold transition ${app.status === 'Mülakat' ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600'}`}
                    >
                      Mülakat
                    </button>
                    <button 
                      onClick={() => handleStatusChange(app.id, 'Reddedildi')}
                      className={`py-2 rounded-xl text-xs font-bold transition ${app.status === 'Reddedildi' ? 'bg-red-100 text-red-700' : 'bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600'}`}
                    >
                      Reddet
                    </button>
                    <button 
                      onClick={() => handleStatusChange(app.id, 'Beklemede')}
                      className={`py-2 rounded-xl text-xs font-bold transition ${app.status === 'Beklemede' ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-600'}`}
                    >
                      Beklet
                    </button>
                  </div>
                )}
                
                {userRole === 'student' && (
                  <div className="pt-4 mt-2 border-t border-gray-100 flex justify-end">
                    <button className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition">
                      İlan Detayı <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
      </main>
    </div>
  );
}

