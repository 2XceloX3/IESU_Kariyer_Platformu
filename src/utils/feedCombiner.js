export function combineFeedItems(posts, events, news, announcements, jobs) {
  const combined = [...(posts || [])];

  const adminAuthor = {
    name: 'Kariyer Geliştirme Ofisi',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=KGO&background=132A49&color=fff',
    title: 'Süper Yönetici'
  };

  if (events) {
    events.filter(e => e.status !== 'Taslak' && e.status !== 'Pasif').forEach(e => {
      combined.push({
        id: e.id,
        author: { ...adminAuthor, title: 'Etkinlik Duyurusu' },
        content: `${e.title}\n\n${e.description || ''}\n\n📅 ${e.date || ''} ${e.time || ''}\n📍 ${e.location || ''}`,
        image: e.imageUrl || null,
        time: e.date || 'Yakın Zamanda',
        createdAt: e.createdAt || new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        likes: (e.id.length * 7) % 50 + 10,
        comments: (e.id.length * 3) % 10,
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
        createdAt: n.createdAt || new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        likes: (n.id.length * 11) % 80 + 20,
        comments: (n.id.length * 5) % 15,
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
        createdAt: a.createdAt || new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        likes: (a.id.length * 4) % 30 + 5,
        comments: 0,
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
        createdAt: j.createdAt || new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        likes: (j.id.length * 6) % 40 + 5,
        comments: (j.id.length * 2) % 5,
      });
    });
  }

  return combined.sort((a, b) => {
    const timeA = new Date(a.createdAt || a.timestamp || 0).getTime();
    const timeB = new Date(b.createdAt || b.timestamp || 0).getTime();
    return timeB - timeA;
  });
}

