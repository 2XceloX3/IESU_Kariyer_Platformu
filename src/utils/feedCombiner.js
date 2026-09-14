export function combineFeedItems(posts, events, news, announcements, jobs, generalEvents = [], careerOpportunities = []) {
  const combined = [...(Array.isArray(posts) ? posts : []).filter(p => typeof p === 'object' && p !== null && p.status !== 'Beklemede' && p.status !== 'Reddedildi')];

  const adminAuthor = {
    name: 'Kariyer Geliştirme Merkezi',
    role: 'admin',
    avatar: '/iesu-logo.svg',
    title: 'Süper Yönetici'
  };

  // Deterministik tarih üretici (Her renderda aynı ID için aynı tarihi verir)
  const getDeterministicDate = (idStr) => {
    const sum = String(idStr || '0').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    // Sabit bir geçmiş tarih üzerinden deterministic saniye çıkarımı (Örn: Son 30 gün içinde)
    return new Date(1710000000000 - (sum * 10000000)).toISOString();
  };

  if (Array.isArray(events)) {
    events.filter(e => typeof e === 'object' && e !== null && e.status !== 'Taslak' && e.status !== 'Pasif').forEach(e => {
      combined.push({
        id: e.id,
        author: { ...adminAuthor, title: 'Etkinlik Duyurusu' },
        content: `${e.title || ''}\n\n${e.description || ''}\n\n📅 ${e.date || ''} ${e.time || ''}\n📍 ${e.location || ''}`,
        image: e.imageUrl || null,
        time: e.date || 'Yakın Zamanda',
        createdAt: e.createdAt || getDeterministicDate(e.id),
        likes: e.likes || 0,
        comments: e.comments || 0,
      });
    });
  }

  if (Array.isArray(generalEvents)) {
    generalEvents.filter(e => typeof e === 'object' && e !== null && e.status !== 'Taslak' && e.status !== 'Pasif').forEach(e => {
      combined.push({
        id: e.id,
        author: {
          name: e.organizer || 'İstanbul Esenyurt Üniversitesi',
          role: 'admin',
          avatar: '/iesu-logo.svg',
          title: `🏛️ Kampüs Etkinliği • ${e.category || 'Genel'}`
        },
        content: `🎉 ${e.title || ''}\n\n${e.description || ''}\n\n📅 Tarih: ${e.date || ''} ${e.time ? `• ${e.time}` : ''}\n📍 Mekan: ${e.location || 'Merkez Kampüs'}${e.quota ? `\n👥 Kontenjan: ${e.quota} Kişi` : ''}${e.registrationLink ? `\n🔗 Kayıt / Bilgi: ${e.registrationLink}` : ''}`,
        image: e.imageUrl || null,
        time: e.date || 'Yakın Zamanda',
        createdAt: e.createdAt || getDeterministicDate(e.id),
        likes: e.likes || 18,
        comments: e.comments || 3,
        isGeneralEvent: true,
        eventData: e
      });
    });
  }

  if (Array.isArray(news)) {
    news.filter(n => typeof n === 'object' && n !== null && n.status !== 'Taslak' && n.status !== 'Pasif').forEach(n => {
      combined.push({
        id: n.id,
        author: { ...adminAuthor, title: 'Üniversite Haberleri' },
        content: `${n.title || ''}\n\n${n.description || ''}`,
        image: n.imageUrl || null,
        time: n.date || 'Yakın Zamanda',
        createdAt: n.createdAt || getDeterministicDate(n.id),
        likes: n.likes || 0,
        comments: n.comments || 0,
      });
    });
  }

  if (Array.isArray(announcements)) {
    announcements.filter(a => typeof a === 'object' && a !== null && a.status !== 'Taslak' && a.status !== 'Pasif').forEach(a => {
      combined.push({
        id: a.id,
        author: { ...adminAuthor, title: 'Genel Duyuru' },
        content: `📢 ${a.title || ''}\n\n${a.description || ''}`,
        pdf: (a.attachmentData || a.attachments) ? true : false,
        time: a.date || 'Yakın Zamanda',
        createdAt: a.createdAt || getDeterministicDate(a.id),
        likes: a.likes || 0,
        comments: a.comments || 0,
      });
    });
  }

  if (Array.isArray(jobs)) {
    jobs.filter(j => typeof j === 'object' && j !== null && j.status !== 'Taslak' && j.status !== 'Pasif').forEach(j => {
      combined.push({
        id: j.id,
        author: { ...adminAuthor, title: 'Kariyer Fırsatı' },
        content: `💼 YENİ İLAN: ${j.title || ''}\n🏢 ${j.company || 'İESÜ Kariyer Geliştirme Merkezi'}\n📍 ${j.location || 'Konum'}\n\n${j.description || ''}`,
        image: j.imageUrl || j.companyLogo || null,
        isJob: true,
        jobData: j,
        time: j.date || 'Yakın Zamanda',
        createdAt: j.createdAt || getDeterministicDate(j.id),
        likes: j.likes || 0,
        comments: j.comments || 0,
      });
    });
  }

  if (Array.isArray(careerOpportunities)) {
    careerOpportunities.filter(o => typeof o === 'object' && o !== null && o.status !== 'Taslak' && o.status !== 'Pasif').forEach(o => {
      combined.push({
        id: o.id,
        author: {
          name: o.organization || 'Kariyer Geliştirme Koordinatörlüğü',
          role: 'admin',
          avatar: o.logo || '/iesu-logo.svg',
          title: `🌟 Kariyer Fırsatı • ${o.category || 'Özel Program'}`
        },
        content: `🌟 ${o.title || ''}\n\n${o.description || ''}\n\n🎯 Hedef Kitle: ${o.targetAudience || 'Tüm Öğrenci ve Mezunlar'}\n📍 Lokasyon: ${o.location || 'İstanbul'}\n⏳ Son Başvuru: ${o.deadline || 'Yakında'}${o.benefits && o.benefits.length ? `\n✨ Avantajlar: ${Array.isArray(o.benefits) ? o.benefits.join(', ') : o.benefits}` : ''}${o.applicationUrl ? `\n🔗 Başvuru: ${o.applicationUrl}` : ''}`,
        image: o.logo || null,
        time: o.deadline || 'Yakın Zamanda',
        createdAt: o.createdAt || getDeterministicDate(o.id),
        likes: o.likes || 24,
        comments: o.comments || 5,
        isCareerOpportunity: true,
        opportunityData: o
      });
    });
  }

  return combined.sort((a, b) => {
    const timeA = new Date(a.createdAt || a.timestamp || 0).getTime();
    const timeB = new Date(b.createdAt || b.timestamp || 0).getTime();
    return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
  });
}
