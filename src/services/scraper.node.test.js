import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseIesuRssXml,
  parseIesuHtmlPayload,
  deduplicateFeedItems,
  cleanScrapedText,
  normalizeScrapedImageUrl,
  normalizeTitleForDedup,
  OFFICIAL_FALLBACK_IMAGES,
  normalizeInstagramGraphPost,
  deduplicateSocialMediaPosts,
  fetchInstagramGraphMedia
} from './scraper.js';
import { combineFeedItems } from '../utils/feedCombiner.js';

test('parseIesuRssXml parses RSS 2.0 items into news, events, and announcements', () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <item>
          <title><![CDATA[İESÜ Ulusal Kariyer Zirvesi ve Sempozyumu 2026]]></title>
          <link>https://www.esenyurt.edu.tr/etkinlik/kariyer-zirvesi-2026</link>
          <pubDate>Wed, 15 Apr 2026 10:00:00 GMT</pubDate>
          <category>Etkinlik</category>
          <description><![CDATA[<p>Sektör liderleriyle kariyer buluşması.</p>]]></description>
        </item>
        <item>
          <title>2026 Bahar Dönemi Zorunlu Staj Başvuru Duyurusu</title>
          <link>/duyuru/zorunlu-staj-2026</link>
          <pubDate>Mon, 13 Apr 2026 09:00:00 GMT</pubDate>
          <category>Duyuru</category>
          <description>Staj başvuru takvimi güncellenmiştir.</description>
        </item>
        <item>
          <title>İstanbul Esenyurt Üniversitesi Sanayi İş Birliği Protokolü</title>
          <link>https://www.esenyurt.edu.tr/haber/sanayi-protokolu</link>
          <pubDate>Sun, 12 Apr 2026 08:00:00 GMT</pubDate>
          <category>Haber</category>
          <description>OSB ile istihdam garantili protokol imzalandı.</description>
        </item>
      </channel>
    </rss>`;

  const result = parseIesuRssXml(xml);
  assert.equal(result.events.length, 1);
  assert.equal(result.events[0].title, 'İESÜ Ulusal Kariyer Zirvesi ve Sempozyumu 2026');
  assert.equal(result.announcements.length, 1);
  assert.equal(result.announcements[0].link, 'https://www.esenyurt.edu.tr/duyuru/zorunlu-staj-2026');
  assert.equal(result.news.length, 1);
  assert.equal(result.news[0].title, 'İstanbul Esenyurt Üniversitesi Sanayi İş Birliği Protokolü');
});

test('deduplicateFeedItems removes duplicate titles, duplicate canonical IDs, and sanitizes HTML tags', () => {
  const existing = [
    { id: '1', title: 'İESÜ Kariyer Günleri Başladı', url: 'https://www.esenyurt.edu.tr/etkinlik/1814-kariyer' },
    { id: '2', title: 'TEKNOFEST 2026 Takımları', url: 'https://www.esenyurt.edu.tr/haber/1864-teknofest' }
  ];
  const incoming = [
    { id: 'new-1', title: '<b>İESÜ Kariyer Günleri Başladı</b>', url: 'https://www.esenyurt.edu.tr/etkinlik/1814-kariyer' },
    { id: 'new-3', title: 'Yeni Ar-Ge Laboratuvarı Açıldı', url: 'https://www.esenyurt.edu.tr/haber/2643-arge' }
  ];

  const merged = deduplicateFeedItems(existing, incoming, 10);
  assert.equal(merged.length, 3);
  assert.equal(merged[0].id, 'new-1');
  assert.equal(merged[0].title, 'İESÜ Kariyer Günleri Başladı');
  assert.equal(merged[1].id, 'new-3');
  assert.equal(merged[2].id, '2');
  assert.equal(cleanScrapedText('<div>İstanbul &amp; Esenyurt</div>'), 'İstanbul & Esenyurt');
});

test('parseIesuHtmlPayload merges dual-anchor event cards from esenyurt.edu.tr/etkinlikler without duplicating', () => {
  const html = `
    <html>
      <body>
        <div class="col-12">
          <div class="box">
            <a title="Mimari Kültür ve Sanat Kulübü Teknik Gezi" href="/etkinlik/1840-mimari-kultur">
              <img src="https://www.esenyurt.edu.tr/uploads/2026/10/nz19buzmdccs4-mimari.jpg" alt="Mimari" class="w-100">
            </a>
            <div class="content">
              <div class="info-box">
                <p class="date text-uppercase"><span>09</span> Kasım</p>
                <p class="time">11:00</p>
              </div>
              <a title="Mimari Kültür ve Sanat Kulübü Teknik Gezi" href="/etkinlik/1840-mimari-kultur">
                <h3>Mimari Kültür ve Sanat Kulübü Teknik Gezi</h3>
                <p>Detaylı bilgi için tıklayınız...</p>
                <span class="read-more">devamını oku</span>
              </a>
            </div>
          </div>
        </div>
        <a href="/haber/1901-iesu-teknoloji-zirvesi"><h3>İESÜ Teknoloji ve İnovasyon Zirvesi Gerçekleştirildi</h3></a>
        <a href="/duyuru/301-staj-basvuru"><h3>2026 Staj Başvuru Takvimi Duyurusu</h3></a>
      </body>
    </html>
  `;
  const parsed = parseIesuHtmlPayload(html);
  assert.equal(parsed.events.length, 1);
  assert.equal(parsed.events[0].id, 'etkinlik-1840');
  assert.equal(parsed.events[0].title, 'Mimari Kültür ve Sanat Kulübü Teknik Gezi');
  assert.equal(parsed.events[0].imageUrl, 'https://www.esenyurt.edu.tr/uploads/2026/10/nz19buzmdccs4-mimari.jpg');
  assert.equal(parsed.events[0].date, '09 Kasım');
  assert.equal(parsed.events[0].time, '11:00');
  assert.ok(parsed.news.some((n) => n.title.includes('İESÜ Teknoloji ve İnovasyon Zirvesi')));
  assert.ok(parsed.announcements.some((a) => a.title.includes('2026 Staj Başvuru Takvimi Duyurusu')));
  assert.ok(Array.isArray(parsed.socialMedia) && parsed.socialMedia.length > 0);
});

test('Instagram Graph API normalizer, deduplicator, and fetchInstagramGraphMedia work as expected', async () => {
  const rawGraphPayload = {
    data: [
      {
        id: '179900112233',
        caption: 'İstanbul Esenyurt Üniversitesi Kariyer Günleri başladı! Sektör temsilcileriyle kampüste buluşuyoruz. #İESÜ #Kariyer',
        media_type: 'IMAGE',
        media_url: 'https://www.esenyurt.edu.tr/uploads/2026/10/kariyer-1.jpg',
        permalink: 'https://www.instagram.com/p/C990011/',
        timestamp: '2026-10-29T09:00:00+0000',
        username: 'esenyurtuniversitesi',
        like_count: 312,
        comments_count: 14
      },
      {
        id: '179900112233',
        caption: 'İstanbul Esenyurt Üniversitesi Kariyer Günleri başladı! Sektör temsilcileriyle kampüste buluşuyoruz. #İESÜ #Kariyer',
        media_type: 'IMAGE',
        media_url: 'https://www.esenyurt.edu.tr/uploads/2026/10/kariyer-1.jpg',
        permalink: 'https://www.instagram.com/p/C990011/',
        timestamp: '2026-10-29T09:00:00+0000',
        username: 'esenyurtuniversitesi',
        like_count: 312,
        comments_count: 14
      }
    ]
  };

  const normalized = normalizeInstagramGraphPost(rawGraphPayload.data[0]);
  assert.equal(normalized.id, 'ig-179900112233');
  assert.equal(normalized.platform, 'instagram');
  assert.equal(normalized.username, 'esenyurtuniversitesi');
  assert.equal(normalized.likes, 312);
  assert.deepEqual(normalized.hashtags, ['#İESÜ', '#Kariyer']);

  const deduped = deduplicateSocialMediaPosts([], rawGraphPayload.data, 10);
  assert.equal(deduped.length, 1);

  const mockFetch = async () => ({
    ok: true,
    json: async () => rawGraphPayload
  });

  const liveResult = await fetchInstagramGraphMedia({
    accessToken: 'test-token-123',
    userId: '17841400000',
    fetchImpl: mockFetch
  });
  assert.equal(liveResult.ok, true);
  assert.equal(liveResult.source, 'instagram-graph-api');
  assert.equal(liveResult.posts.length, 1);
  assert.equal(liveResult.posts[0].id, 'ig-179900112233');
});

test('cleanScrapedText preserves dates followed by tarihli while stripping raw card badge dates', () => {
  const gazeteText = '19.10.2026 tarihli 33403 Sayılı Resmi Gazete’de yayımlanan Öğretim Üyesi Alım İlanı';
  assert.equal(
    cleanScrapedText(gazeteText),
    '19.10.2026 tarihli 33403 Sayılı Resmi Gazete’de yayımlanan Öğretim Üyesi Alım İlanı'
  );

  const badgePrefixed = '24.10.2026 Cumhuriyetimizin 103. Yıl Dönümü Kutlu Olsun';
  assert.equal(
    cleanScrapedText(badgePrefixed),
    'Cumhuriyetimizin 103. Yıl Dönümü Kutlu Olsun'
  );
});

test('normalizeScrapedImageUrl repairs soft-404 &amp; URLs and normalizeTitleForDedup merges Turkish cross-category duplicates', () => {
  const brokenSoft404 =
    'https://www.esenyurt.edu.tr/uploads/2026/10/2e6bua6grui8j-spor-bilimleri-fakultesi-&amp;-ek-yerlestirme-ile-gelen-ogrencilerimizin-dikkatine.jpg';
  assert.equal(normalizeScrapedImageUrl(brokenSoft404, 'news'), OFFICIAL_FALLBACK_IMAGES.news);

  const newsTitle = 'SPOR BİLİMLERİ FAKÜLTESİ & EK YERLEŞTİRME İLE GELEN ÖĞRENCİLERİMİZİN DİKKATİNE!';
  const annTitle = 'Spor Bilimleri Fakültesi Ve Ek Yerleştirme İle Gelen Öğrencilerin Dikkatine!';
  assert.equal(normalizeTitleForDedup(newsTitle), normalizeTitleForDedup(annTitle));

  const deduped = deduplicateFeedItems(
    [{ id: 'duyuru-1576', title: annTitle, imageUrl: brokenSoft404 }],
    [{ id: 'haber-2608', title: newsTitle, imageUrl: brokenSoft404 }],
    10
  );
  assert.equal(deduped.length, 1);
  assert.equal(deduped[0].imageUrl, OFFICIAL_FALLBACK_IMAGES.news);
});

test('combineFeedItems prevents duplicate events across events and generalEvents and maps imageUrl to image', () => {
  const events = [
    {
      id: 'etkinlik-1610',
      title: 'GençFest 2026 Başlıyor!',
      imageUrl: 'https://www.esenyurt.edu.tr/uploads/2026/04/vzf9ndd1pvpb8-gencfest-2026-basliyor.jfif'
    }
  ];
  const generalEvents = [
    {
      id: 'GEVT-003',
      title: 'GençFest 2026 Başlıyor!',
      imageUrl: 'https://www.esenyurt.edu.tr/uploads/2026/04/vzf9ndd1pvpb8-gencfest-2026-basliyor.jfif',
      status: 'Yayında'
    }
  ];

  const feed = combineFeedItems({ events, generalEvents });
  assert.equal(feed.length, 1);
  assert.equal(feed[0].id, 'etkinlik-1610');
  assert.equal(
    feed[0].image,
    'https://www.esenyurt.edu.tr/uploads/2026/04/vzf9ndd1pvpb8-gencfest-2026-basliyor.jfif'
  );
});


