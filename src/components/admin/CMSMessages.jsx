import React, { useState } from 'react';
import SafeAvatar from '../shared/SafeAvatar';
import PanelHeader from './PanelHeader';
import { MessageSquare, Send, Trash2, Search, Building2 } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

export default function CMSMessages({ messages, setMessages }) {
  const storeAdminMessages = useAppStore(state => state.adminMessages) || [];
  const setAdminMessages = useAppStore(state => state.setAdminMessages);
  const [localContactMessages] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('iesu_admin_messages_v1') || '[]');
      if (!Array.isArray(saved)) return [];
      return saved.map((m, idx) => ({
        id: m.id || `LOCAL-MSG-${idx}`,
        companyName: m.senderName || m.companyName || m.name || 'Web İletişim Formu',
        subject: m.subject || m.topic || 'Genel İletişim Talebi',
        email: m.email || m.senderEmail || '-',
        phone: m.phone || '-',
        message: m.message || m.content || '',
        date: m.date || (m.timestamp ? new Date(m.timestamp).toLocaleDateString('tr-TR') : 'Yeni'),
        status: m.status || 'Beklemede',
        source: 'contact_form'
      }));
    } catch {
      return [];
    }
  });

  const adminMessages = React.useMemo(() => {
    const existingIds = new Set(storeAdminMessages.map(m => m.id));
    return [...localContactMessages.filter(m => !existingIds.has(m.id)), ...storeAdminMessages];
  }, [storeAdminMessages, localContactMessages]);

  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [selectedAdminMsgId, setSelectedAdminMsgId] = useState(null);
  const [reply, setReply] = useState('');
  const [inboxSearch, setInboxSearch] = useState('');
  const [activeTab, setActiveTab] = useState('admin_pool'); // admin_pool | inbox (KVKK: kişisel kullanıcı yazışmaları asla izlenmez)

  // KVKK uyumlu: yalnızca KGM / admin hesabına gelen veya gönderilen mesajlar
  const sortedMessages = [...(messages || [])]
    .filter(m => {
      const q = inboxSearch.trim().toLowerCase();
      if (!q) return true;
      return (
        (m.senderName || m.from || '').toLowerCase().includes(q) ||
        (m.content || m.subject || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  const selectedMessage = sortedMessages.find(m => m.id === selectedMessageId);

  const handleDelete = (id) => {
    if (window.confirm('Bu mesajı silmek istediğinize emin misiniz?')) {
      setMessages?.(prev => (prev || []).filter(m => m.id !== id));
      if (selectedMessageId === id) setSelectedMessageId(null);
    }
  };

  const handleReply = (e) => {
    e.preventDefault();
    if (!reply.trim() || !selectedMessage) return;

    const newMsg = {
      id: 'MSG-' + Date.now(),
      senderId: 'admin',
      senderName: 'Kariyer Geliştirme Koordinatörlüğü',
      senderAvatar: '',
      receiverId: selectedMessage.senderId,
      receiverName: selectedMessage.senderName,
      receiverAvatar: selectedMessage.senderAvatar,
      content: reply.trim(),
      timestamp: Date.now(),
      read: false
    };

    setMessages?.(prev => [...(prev || []), newMsg]);
    setReply('');
    window.toast?.success?.('Yanıtınız başarıyla gönderildi.');
  };

  const markAsRead = (id) => {
    setMessages?.(prev => (prev || []).map(m => m.id === id ? { ...m, read: true } : m));
    setSelectedMessageId(id);
  };

  const pendingCorpCount = (adminMessages || []).filter(m => m.status === 'Beklemede').length;
  const unreadCount = sortedMessages.filter(m => !m.read && m.receiverId === 'admin').length;

  return (
    <div className="animate-fade-in space-y-6 h-[calc(100vh-150px)] flex flex-col">
      <PanelHeader
        title="Gelen Talepler & Mesaj Merkezi"
        sub="Kurumsal firma taleplerini, web iletişim formlarını ve KGM gelen kutusunu KVKK uyumlu olarak yönetin."
        action={
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('admin_pool')}
              className={`px-4 py-2 text-xs font-black rounded-lg transition cursor-pointer ${activeTab === 'admin_pool' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Firma & Web Talepleri
              {pendingCorpCount > 0 && (
                <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full ml-1.5 font-black">
                  {pendingCorpCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('inbox')}
              className={`px-4 py-2 text-xs font-black rounded-lg transition cursor-pointer ${activeTab === 'inbox' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Gelen Kutusu
              {unreadCount > 0 && (
                <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md ml-1.5 text-[10px] font-black">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        }
      />

      {activeTab === 'admin_pool' ? (
        <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex min-h-0">
          {/* ADMIN MESSAGES LIST */}
          <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/50">
            <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center">
              <h4 className="font-black text-gray-900 text-sm">Kurumsal Talepler ({adminMessages?.length || 0})</h4>
              <span className="text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-600 px-2 py-0.5 rounded border border-red-100">Resmî Havuz</span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {(adminMessages || []).length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">Havuzda talep bulunmuyor.</div>
              ) : (
                (adminMessages || []).map(msg => (
                  <button
                    type="button"
                    key={msg.id}
                    onClick={() => {
                      setSelectedAdminMsgId(msg.id);
                      if (setAdminMessages) {
                        setAdminMessages(prev => (prev || []).map(m => m.id === msg.id ? { ...m, status: 'İncelendi' } : m));
                      }
                    }}
                    className={`w-full text-left p-4 hover:bg-red-50/50 transition border-l-4 cursor-pointer
                      ${selectedAdminMsgId === msg.id ? 'border-red-600 bg-red-50' : msg.status === 'Beklemede' ? 'border-amber-500 bg-amber-50/30' : 'border-transparent bg-white'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-black text-gray-900 truncate pr-2">
                        {msg.companyName}
                      </h4>
                      <span className="text-[10px] text-gray-400 shrink-0 font-bold">
                        {msg.date}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-red-700 truncate mb-1">
                      {msg.subject}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {msg.message}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* ADMIN MESSAGE DETAIL */}
          <div className="flex-1 flex flex-col bg-white p-6 overflow-y-auto">
            {(() => {
              const currentMsg = (adminMessages || []).find(m => m.id === selectedAdminMsgId);
              if (!currentMsg) {
                return (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                    <Building2 size={48} className="mb-3 opacity-40 text-red-600" />
                    <p className="font-bold text-base text-gray-700">Detaylarını görmek için soldan bir talep seçin.</p>
                    <p className="text-xs text-gray-400 mt-1">Firmaların protokol, etkinlik ve iletişim formları burada listelenir.</p>
                  </div>
                );
              }
              return (
                <div className="space-y-6 max-w-2xl">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-600 px-2 py-0.5 rounded border border-red-100">Kurumsal Talep</span>
                      <h2 className="text-xl font-black text-gray-900 mt-1">{currentMsg.companyName}</h2>
                      <p className="text-xs text-gray-500 font-medium">{currentMsg.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-black ${currentMsg.status === 'Beklemede' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {currentMsg.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-600 uppercase block mb-0.5">İletişim E-Posta</span>
                      <a href={`mailto:${currentMsg.email}`} className="text-xs font-bold text-red-600 hover:underline">{currentMsg.email}</a>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-600 uppercase block mb-0.5">İletişim Telefonu</span>
                      <a href={`tel:${currentMsg.phone}`} className="text-xs font-bold text-slate-900">{currentMsg.phone}</a>
                    </div>
                  </div>

                  <div className="p-4 bg-red-50/50 rounded-xl border border-red-100">
                    <span className="text-[11px] font-black text-red-700 uppercase tracking-wider block mb-1">Konu Başlığı</span>
                    <h3 className="text-base font-black text-slate-900">{currentMsg.subject}</h3>
                  </div>

                  <div>
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider block mb-2">Talep İçeriği</span>
                    <div className="p-5 bg-white rounded-2xl border border-slate-200 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap shadow-sm font-medium">
                      {currentMsg.message}
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <a
                      href={`mailto:${currentMsg.email}?subject=RE: ${encodeURIComponent(currentMsg.subject)}`}
                      className="px-6 py-3 bg-[#990000] hover:bg-red-800 text-white rounded-xl font-bold text-xs transition shadow-md flex items-center gap-2"
                    >
                      <Send size={15} /> E-Posta İle Yanıt Ver
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Bu talebi havuzdan silmek istediğinize emin misiniz?')) {
                          setAdminMessages?.(prev => (prev || []).filter(m => m.id !== currentMsg.id));
                          setSelectedAdminMsgId(null);
                        }
                      }}
                      className="px-4 py-3 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 rounded-xl font-bold text-xs transition cursor-pointer"
                    >
                      Talebi Sil
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex min-h-0">
          {/* INBOX LIST */}
          <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/50">
            <div className="p-4 border-b border-gray-100 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
                <input
                  type="text"
                  value={inboxSearch}
                  onChange={e => setInboxSearch(e.target.value)}
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
                    type="button"
                    key={msg.id}
                    onClick={() => markAsRead(msg.id)}
                    className={`w-full text-left p-4 hover:bg-red-50/50 transition border-l-4 cursor-pointer
                      ${selectedMessageId === msg.id ? 'border-red-600 bg-red-50' : !msg.read ? 'border-red-500 bg-white' : 'border-transparent bg-white'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm truncate pr-2 ${!msg.read ? 'font-black text-gray-900' : 'font-bold text-gray-700'}`}>
                        {msg.senderName || msg.from}
                      </h4>
                      <span className="text-[10px] text-gray-500 shrink-0 font-medium">
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleDateString('tr-TR') : ''}
                      </span>
                    </div>
                    <p className={`text-xs line-clamp-2 ${!msg.read ? 'font-bold text-gray-800' : 'text-gray-500'}`}>
                      {msg.content || msg.subject}
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
                      {selectedMessage.senderAvatar ? (
                        <SafeAvatar src={selectedMessage.senderAvatar} name={selectedMessage.senderName || 'User'} size={20} className="w-full h-full object-cover" />
                      ) : (
                        <MessageSquare size={20} className="text-gray-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-lg">{selectedMessage.senderName || selectedMessage.from}</h3>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">
                        {selectedMessage.timestamp ? new Date(selectedMessage.timestamp).toLocaleString('tr-TR') : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                    title="Mesajı Sil"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex-1 p-6 overflow-y-auto bg-gray-50/30">
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-[14px] text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.content || selectedMessage.subject}
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
                    <button
                      aria-label="Yanıt Gönder"
                      type="submit"
                      disabled={!reply.trim()}
                      className="bg-red-600 text-white px-6 rounded-xl hover:bg-red-700 disabled:opacity-50 transition font-bold flex items-center justify-center shadow-sm cursor-pointer"
                    >
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
                <p className="text-sm text-gray-500">Okumak veya yanıtlamak için soldan bir mesaj seçin.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
