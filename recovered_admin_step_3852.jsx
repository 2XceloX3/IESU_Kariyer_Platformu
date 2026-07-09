                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-white/50 border-b border-white">
                      <tr className="text-gray-600 text-sm">
                        <th className="p-5 font-bold uppercase tracking-wider text-center">ID</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Mentor (Uzman)</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Menti (Öğrenci)</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-center">Tarih</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-center">Durum</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {mentorships.map((m) => (
                        <tr key={m.id} className="border-b border-white/40 hover:bg-white/50 transition-colors">
                          <td className="p-5 text-gray-400 font-mono text-center">#{m.id}</td>
                          <td className="p-5 font-bold text-gray-900">{m.mentor}</td>
                          <td className="p-5 text-gray-700 font-medium">{m.mentee}</td>
                          <td className="p-5 text-gray-600 font-mono text-center">{m.date}</td>
                          <td className="p-5 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${m.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                              {m.status}
                            </span>
                          </td>
                          <td className="p-5 text-right flex items-center justify-end gap-2">
                            {m.status === 'Eşleştirme Bekliyor' && (
                              <button onClick={() => setMentorships(mentorships.map(x => x.id === m.id ? { ...x, status: 'Aktif' } : x))} className="text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg text-xs font-bold transition">Onayla</button>
                            )}
                            <button onClick={() => handleDeleteMentorship(m.id)} className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold transition">Sil</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>