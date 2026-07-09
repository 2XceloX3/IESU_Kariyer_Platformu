                    <button onClick={() => alert('Başvuru Havuzu Excel olarak indiriliyor...')} className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition shadow-sm justify-center">
                      <Download size={18} /> Havuzu Dışa Aktar
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto bg-white/40 max-h-[600px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white shadow-sm z-10">
                      <tr className="text-gray-500 text-sm border-b border-gray-200">
                        <th className="p-5 font-bold uppercase tracking-wider text-center">ID</th>
                        <th className="p-5 font-bold uppercase tracking-wider">İlan Başlığı & Türü</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Firma / Kurum</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-center">Tarih</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-center">Durum</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {jobs.map((job) => (
                        <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="p-5 text-gray-400 font-mono text-center">#{job.id}</td>
                          <td className="p-5 font-bold text-gray-900">
                            {job.title}
                            <span className={`block mt-1 w-max px-2 py-0.5 rounded text-[10px] font-bold ${job.type === 'STAJ' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                              {job.type}
                            </span>
                          </td>
                          <td className="p-5 text-gray-600 font-medium">{job.company}</td>
                          <td className="p-5 text-gray-500 font-mono text-center">{job.date}</td>
                          <td className="p-5 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${job.status === 'Yayında' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="p-5 text-right flex items-center justify-end gap-2">
                            {job.status === 'Beklemede' && (
                              <button onClick={() => setJobs(jobs.map(j => j.id === job.id ? { ...j, status: 'Yayında' } : j))} className="text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg text-xs font-bold transition">Yayınla</button>
                            )}
                            <button onClick={() => handleEditJob(job)} className="text-blue-500 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold transition">Düzenle</button>
                            <button onClick={() => handleDeleteJob(job.id)} className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold transition">Sil</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>