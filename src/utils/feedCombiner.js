export function combineFeedItems(posts, events, news, announcements, jobs) {
  const combined = [...(posts || []).filter(p => p.status !== 'Beklemede' && p.status !== 'Reddedildi')];

  const adminAuthor = {
    name: 'Kariyer Geliştirme Merkezi',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=KGO&background=0A2342&color=fff',
    title: 'Süper Yönetici'
  };

  // Deterministik tarih üretici (Her renderda aynı ID için aynı tarihi verir)
  const getDeterministicDate = (idStr) => {
    const sum = String(idStr).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    // Sabit bir geçmiş tarih üzerinden deterministic saniye çıkarımı (Örn: Son 30 gün içinde)
    return new Date(1710000000000 - (sum * 10000000)).toISOString();
  };

  if (events) {
    events.filter(e => e.status !== 'Taslak' && e.status !== 'Pasif').forEach(e => {
      combined.push({
        id: e.id,
        author: { ...adminAuthor, title: 'Etkinlik Duyurusu' },
        content: `${e.title}\n\n${e.description || ''}\n\n📅 ${e.date || ''} ${e.time || ''}\n📍 ${e.location || ''}`,
        image: e.imageUrl || null,
        time: e.date || 'Yakın Zamanda',
        createdAt: e.createdAt || getDeterministicDate(e.id),
        likes: e.likes || 0,
        comments: e.comments || 0,
      });
    });
  }

  if (news) {
    news.filter(n => n.status !== 'Taslak' && n.status !== 'Pasif').forEach(n => {
      combined.push({
        id: n.id,
        author: { ...adminAuthor, title: 'Üniversite Haberleri' },
        content: `${n.title}\n\n${n.description || ''}`,
        image: n.imageUrl || null,
        time: n.date || 'Yakın Zamanda',
        createdAt: n.createdAt || getDeterministicDate(n.id),
        likes: n.likes || 0,
        comments: n.comments || 0,
      });
    });
  }

  if (announcements) {
    announcements.filter(a => a.status !== 'Taslak' && a.status !== 'Pasif').forEach(a => {
      combined.push({
        id: a.id,
        author: { ...adminAuthor, title: 'Genel Duyuru' },
        content: `📢 ${a.title}\n\n${a.description || ''}`,
        pdf: (a.attachmentData || a.attachments) ? true : false,
        time: a.date || 'Yakın Zamanda',
        createdAt: a.createdAt || getDeterministicDate(a.id),
        likes: a.likes || 0,
        comments: a.comments || 0,
      });
    });
  }

  if (jobs) {
    jobs.filter(j => j.status !== 'Taslak' && j.status !== 'Pasif').forEach(j => {
      combined.push({
        id: j.id,
        author: { ...adminAuthor, title: 'Kariyer Fırsatı' },
        content: `💼 YENİ İLAN: ${j.title}\n🏢 ${j.company || 'Firma'}\n📍 ${j.location || 'Konum'}\n\n${j.description || ''}`,
        image: j.imageUrl || j.companyLogo || null,
        isJob: true,
        time: j.date || 'Yakın Zamanda',
        createdAt: j.createdAt || getDeterministicDate(j.id),
        likes: j.likes || 0,
        comments: j.comments || 0,
      });
    });
  }

  return combined.sort((a, b) => {
    const timeA = new Date(a.createdAt || a.timestamp || 0).getTime();
    const timeB = new Date(b.createdAt || b.timestamp || 0).getTime();
    return timeB - timeA;
  });
}

