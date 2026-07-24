import React, { useState } from 'react';
import PanelHeader from './PanelHeader';
import { MessageSquare, Bell, CheckCircle2, Send, Trash2, Search, Filter, Users, User, Building2, BookOpen } from 'lucide-react';

export default function CMSMessages({ messages, setMessages }) {
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [reply, setReply] = useState('');
  const [activeTab, setActiveTab] = useState('inbox'); // inbox, bulk
  
  // Bulk messaging state
  const [bulkForm, setBulkForm] = useState({
    targetAudience: 'all', // all, students, alumni, companies, academics
    subject: '',
    content: ''
  });

  const sortedMessages = [...(messages || [])].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  const selectedMessage = sortedMessages.find(m => m.id === selectedMessageId);

  const handleDelete = (id) => {
    if (window.confirm("Bu mesajı silmek istediğinize emin misiniz?")) {
      setMessages(prev => (prev || []).filter(m => m.id !== id));
      if (selectedMessageId === id) setSelectedMessageId(null);
    }
  };

  const handleReply = (e) => {
    e.preventDefault();
    if (!reply.trim() || !selectedMessage) return;

    const newMsg = {
      id: 'MSG-' + Date.now(),
      senderId: 'admin',
      senderName: 'Sistem Yöneticisi',
      senderAvatar: '',
      receiverId: selectedMessage.senderId,
      receiverName: selectedMessage.senderName,
      receiverAvatar: selectedMessage.senderAvatar,
      content: reply.trim(),
      timestamp: Date.now(),
      read: false
    };

    setMessages(prev => [...(prev || []), newMsg]);
    setReply('');
    window.toast.success("Yanıtınız başarıyla gönderildi.");
  };

  const markAsRead = (id) => {
    setMessages(prev => (prev || []).map(m => m.id === id ? { ...m, read: true } : m));
    setSelectedMessageId(id);
  };

  const handleBulkSend = (e) => {
    e.preventDefault();
    if (!bulkForm.subject || !bulkForm.content) return window.toast.info("Konu ve mesaj içeriği zorunludur.");
    
    // In a real app, this would iterate over the target audience and send individual messages
    window.toast.success(`Toplu mesaj '${bulkForm.targetAudience}' kitlesine başarıyla iletildi.`);
    setBulkForm({ targetAudience: 'all', subject: '', content: '' });
  };

  const unreadCount = sortedMessages.filter(m => !m.read && m.receiverId === 'admin').length;

  return (
    <div className="animate-fade-in space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <PanelHeader 
        title="İletişim & Mesaj Merkezi" 
        sub="Platform içi mesajlaşmaları yönetin, toplu duyurular gönderin ve iletişim havuzunu denetleyin." 
      />
      <div className="shrink-0">
        <div className="flex justify-end mb-4">
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('inbox')}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition ${activeTab === 'inbox' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Gelen Kutusu {unreadCount > 0 && <span className="bg-red-100 text-red-600 px-1.5 rounded-md ml-1">{unreadCount}</span>}
              </button>
              <button 
                onClick={() => setActiveTab('bulk')}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition ${activeTab === 'bulk' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Toplu Mesaj
              </button>
              <button 
                onClick={() => setActiveTab('pool')}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition ${activeTab === 'pool' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                İletişim Havuzu
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'bulk' ? (
          <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-50">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Send size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">Segmentli Toplu Mesaj</h3>
                  <p className="text-sm text-gray-500">Seçili hedef kitleye platform içi bildirim ve e-posta gönderin.</p>
                </div>
              </div>

              <form onSubmit={handleBulkSend} className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-3">Hedef Kitle (Segment)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { id: 'all', label: 'Tüm Kullanıcılar', icon: <Users size={16}/> },
                      { id: 'students', label: 'Öğrenciler', icon: <User size={16}/> },
                      { id: 'alumni', label: 'Mezunlar', icon: <User size={16}/> },
                      { id: 'companies', label: 'Firmalar', icon: <Building2 size={16}/> },
                      { id: 'academics', label: 'Akademisyenler', icon: <BookOpen size={16}/> }
                    ].map(aud => (
                      <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  
                        key={aud.id}
                        onClick={() => setBulkForm({...bulkForm, targetAudience: aud.id})}
                        className={`border rounded-xl p-3 cursor-pointer transition flex flex-col items-center justify-center text-center gap-2
                          ${bulkForm.targetAudience === aud.id ? 'border-red-600 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-600 hover:border-red-300'}`}
                      >
                        {aud.icon}
                        <span className="text-[11px] font-bold uppercase">{aud.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2">Mesaj Konusu</label>
                  <input 
                    type="text" 
                    value={bulkForm.subject} 
                    onChange={e => setBulkForm({...bulkForm, subject: e.target.value})} 
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-red-500/20"
                    placeholder="Örn: Kariyer Fuarı Daveti"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2">Mesaj İçeriği</label>
                  <textarea 
                    value={bulkForm.content} 
                    onChange={e => setBulkForm({...bulkForm, content: e.target.value})} 
                    rows={6}
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-red-500/20 resize-none"
                    placeholder="Gönderilecek mesajı buraya yazın..."
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-50">
                  <button type="submit" className="bg-red-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-red-700 transition flex items-center gap-2 shadow-sm">
                    <Send size={18} /> Toplu Mesajı Gönder
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : activeTab === 'inbox' ? (
          <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex">
            {/* INBOX LIST */}
            <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/50">
              <div className="p-4 border-b border-gray-100 bg-white">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
                  <input 
                    type="text" 
                    placeholder="Mesajlarda ara..." 
                    className="w-full bg-gray-50 border-none rounded-xl pl-9 pr-4 py-2 text-sm font-medium focus:ring-2 focus:ring-red-500/20 transition"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                {sortedMessages.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">Mesaj kutusu boş.</div>
                ) : (
                  sortedMessages.map(msg => (
                    <button 
                      key={msg.id} 
                      onClick={() => markAsRead(msg.id)}
                      className={`w-full text-left p-4 hover:bg-red-50/50 transition border-l-4 
                        ${selectedMessageId === msg.id ? 'border-red-600 bg-red-50' : !msg.read ? 'border-blue-500 bg-white' : 'border-transparent bg-white'}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm truncate pr-2 ${!msg.read ? 'font-black text-gray-900' : 'font-bold text-gray-700'}`}>
                          {msg.senderName}
                        </h4>
                        <span className="text-[10px] text-gray-500 shrink-0 font-medium">
                          {msg.timestamp ? new Date(msg.timestamp).toLocaleDateString('tr-TR') : ''}
                        </span>
                      </div>
                      <p className={`text-xs line-clamp-2 ${!msg.read ? 'font-bold text-gray-800' : 'text-gray-500'}`}>
                        {msg.content}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* MESSAGE DETAIL */}
            <div className="flex-1 flex flex-col bg-white">
              {selectedMessage ? (
                <>
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white shadow-sm z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden">
                        {selectedMessage.senderAvatar ? <img src={selectedMessage.senderAvatar} className="w-full h-full object-cover" /> : <MessageSquare size={20} className="text-gray-500"/>}
                      </div>
                      <div>
                        <h3 className="font-black text-gray-900 text-lg">{selectedMessage.senderName}</h3>
                        <p className="text-xs font-medium text-gray-500 mt-0.5">
                          {selectedMessage.timestamp ? new Date(selectedMessage.timestamp).toLocaleString('tr-TR') : ''}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(selectedMessage.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition">
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex-1 p-6 overflow-y-auto bg-gray-50/30">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-[14px] text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.content}
                    </div>
                  </div>

                  <div className="p-4 bg-white border-t border-gray-100">
                    <form onSubmit={handleReply} className="flex gap-3">
                      <textarea 
                        rows="2"
                        value={reply}
                        onChange={e => setReply(e.target.value)}
                        placeholder="Yanıtınızı yazın..." 
                        className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-red-500/20 resize-none"
                      />
                      <button aria-label="İşlem Butonu" type="submit" disabled={!reply.trim()} className="bg-red-600 text-white px-6 rounded-xl hover:bg-red-700 disabled:opacity-50 transition font-bold flex items-center justify-center shadow-sm">
                        <Send size={18} />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-50/50">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-4 text-red-600">
                    <MessageSquare size={32} />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-1">Mesaj Seçilmedi</h3>
                  <p className="text-sm text-gray-500">Okumak veya yanıtlamak için bir mesaj seçin.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* POOL TAB (ALL COMMUNICATIONS) */
          activeTab === 'pool' && (
            <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h3 className="font-black text-gray-900 text-lg">Platform İçi İletişim Havuzu</h3>
                  <p className="text-sm text-gray-500 mt-1">Sistemdeki tüm kullanıcıların (Öğrenci, Mezun, Firma, Akademisyen) kendi aralarındaki yazışmaları.</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-0">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-100 text-slate-500 font-bold text-xs uppercase sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-4">Tarih</th>
                      <th className="px-6 py-4">Gönderen</th>
                      <th className="px-6 py-4">Alıcı</th>
                      <th className="px-6 py-4">Mesaj İçeriği</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sortedMessages.map(msg => (
                      <tr key={msg.id} className="hover:bg-slate-50 transition group">
                        <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">
                          {new Date(msg.timestamp).toLocaleString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{msg.senderName}</div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-wide">{msg.senderId}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{msg.receiverName}</div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-wide">{msg.receiverId}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-700 font-medium max-w-md truncate" title={msg.content}>
                          {msg.content}
                        </td>
                      </tr>
                    ))}
                    {sortedMessages.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium">Sistemde henüz mesaj kaydı bulunmuyor.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
    </div>
  );
}
