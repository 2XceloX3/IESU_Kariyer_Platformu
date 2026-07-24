import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const htmlPath = 'C:\\Users\\celil\\.gemini\\antigravity\\brain\\d6aead45-240e-4d48-ac3d-69f45e9e346d\\.system_generated\\steps\\1515\\content.md';
const liveDataPathActive = 'C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IESU_Kariyer_Platformu_Active\\src\\utils\\liveData.js';
const liveDataPathClean = 'C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IESU_Kariyer_Platformu_Clean\\src\\utils\\liveData.js';

try {
  let rawContent = fs.readFileSync(htmlPath, 'utf8');
  const htmlStart = rawContent.indexOf('<!DOCTYPE html>');
  if (htmlStart !== -1) {
    rawContent = rawContent.substring(htmlStart);
  }

  const dom = new JSDOM(rawContent);
  const document = dom.window.document;

  const scrapedNews = [];
  const scrapedAnnouncements = [];
  const scrapedEvents = [];

  // Parse Main Page News
  const newsBoxes = document.querySelectorAll('.col-12.col-md-6.col-lg-6.col-xl-4.mb-4, .box');
  newsBoxes.forEach((box, idx) => {
    const a = box.querySelector('a[href*="/haber/"]') || box.querySelector('a');
    if (!a) return;
    const title = a.getAttribute('title') || box.querySelector('h3')?.textContent.trim() || '';
    const href = a.getAttribute('href') || '';
    const img = box.querySelector('img');
    let imageUrl = img ? (img.getAttribute('data-src') || img.getAttribute('src') || '') : '';
    if (imageUrl.includes('empty.png')) {
      imageUrl = img.getAttribute('data-src') || '';
    }
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = 'https://www.esenyurt.edu.tr' + (imageUrl.startsWith('/') ? '' : '/') + imageUrl;
    }

    const dateEl = box.querySelector('span') || box.querySelector('.date');
    const date = dateEl ? dateEl.textContent.trim() : '22.07.2026';
    const paragraph = box.querySelector('p')?.textContent.trim() || '';

    if (title && title.length > 5 && !scrapedNews.some(n => n.title === title)) {
      scrapedNews.push({
        id: `news-main-${idx + 1}`,
        title: title,
        date: date || '22.07.2026',
        category: "Güncel Haber",
        description: paragraph || `${title} ile ilgili ayrıntılı bilgi İstanbul Esenyurt Üniversitesi duyuru platformunda yayına alınmıştır. Detaylar ve etkinlik takvimi için portalımızı takip edebilirsiniz.`,
        content: `${title}\n\nİstanbul Esenyurt Üniversitesi Kariyer Geliştirme Koordinatörlüğü tarafından hazırlanan bu haber kapsamında; üniversitemizin tüm akademik ve idari birimleriyle ortak yürütülen çalışmalar detaylandırılmıştır.\n\n${paragraph}\n\nÖğrencilerimiz ve mezunlarımız ilgili programa katılım sağlayabilir, detaylı bilgi için Kariyer Geliştirme Koordinatörlüğü ile iletişime geçebilirler.`,
        imageUrl: imageUrl || 'https://www.esenyurt.edu.tr/uploads/2026/07/4ul12yzssqgwd-ilk-5-tercihte.jpg',
        url: href.startsWith('http') ? href : ('https://www.esenyurt.edu.tr' + href)
      });
    }
  });

  // Parse Main Page Announcements
  const annElements = document.querySelectorAll('a[href*="/duyuru/"]');
  annElements.forEach((a, idx) => {
    const title = a.getAttribute('title') || a.querySelector('h3')?.textContent.trim() || '';
    const href = a.getAttribute('href') || '';
    const dateEl = a.querySelector('span');
    const date = dateEl ? dateEl.textContent.trim() : '24.07.2026';
    const desc = a.querySelector('p')?.textContent.trim() || '';

    if (title && !scrapedAnnouncements.some(ann => ann.title === title)) {
      scrapedAnnouncements.push({
        id: `ann-main-${idx + 1}`,
        title: title,
        date: date,
        category: "Duyuru",
        description: desc || `${title} duyurusu İstanbul Esenyurt Üniversitesi tarafından yayınlanmıştır.`,
        content: `${title}\n\n${desc}\n\nDetaylı bilgi ve başvuru koşulları için Öğrenci İşleri Daire Başkanlığı ve Kariyer Geliştirme Koordinatörlüğü resmi duyurularını takip ediniz.`,
        url: href.startsWith('http') ? href : ('https://www.esenyurt.edu.tr' + href)
      });
    }
  });

  console.log(`Extracted Main Page News: ${scrapedNews.length}, Announcements: ${scrapedAnnouncements.length}`);

  function updateLiveData(filePath) {
    if (!fs.existsSync(filePath)) return;
    let liveDataContent = fs.readFileSync(filePath, 'utf8');

    if (scrapedNews.length > 0) {
      liveDataContent = liveDataContent.replace(
        /export const liveNewsData = \[[^\]]*\];/s,
        `export const liveNewsData = ${JSON.stringify(scrapedNews, null, 2)};`
      );
    }
    if (scrapedAnnouncements.length > 0) {
      liveDataContent = liveDataContent.replace(
        /export const liveAnnouncementData = \[[^\]]*\];/s,
        `export const liveAnnouncementData = ${JSON.stringify(scrapedAnnouncements, null, 2)};`
      );
    }

    fs.writeFileSync(filePath, liveDataContent, 'utf8');
    console.log(`Updated liveData in ${filePath}`);
  }

  updateLiveData(liveDataPathActive);
  updateLiveData(liveDataPathClean);

} catch (e) {
  console.error("Error parsing main page content:", e);
}
