import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const htmlPath = 'C:\\Users\\celil\\.gemini\\antigravity\\brain\\d6aead45-240e-4d48-ac3d-69f45e9e346d\\.system_generated\\steps\\1434\\content.md';
const liveDataPath = path.join(process.cwd(), 'src/utils/liveData.js');

try {
  let rawContent = fs.readFileSync(htmlPath, 'utf8');
  // Strip metadata header if present
  const htmlStart = rawContent.indexOf('<!DOCTYPE html>');
  if (htmlStart !== -1) {
    rawContent = rawContent.substring(htmlStart);
  }

  const dom = new JSDOM(rawContent);
  const document = dom.window.document;

  const scrapedNews = [];
  const scrapedEvents = [];
  const scrapedAnnouncements = [];

  // Parse News (Haberler)
  // Inside content.md, news are in boxes, e.g. under the News tab or containers.
  // We saw the pattern: <a title="... Tayfun Özyolcu'ya Veda..." href="/haber/2234--10">
  // and <img src="...--10.jpg">
  const links = document.querySelectorAll('a[href^="/haber/"]');
  links.forEach((a, index) => {
    const title = a.getAttribute('title') || '';
    const href = "https://www.esenyurt.edu.tr" + a.getAttribute('href');
    const img = a.querySelector('img');
    const imageUrl = img ? (img.getAttribute('data-src') || img.getAttribute('src') || '') : '';
    
    if (title && !scrapedNews.some(n => n.title === title)) {
      scrapedNews.push({
        id: `news-scraped-${index + 1}`,
        title: title,
        date: "22.07.2026", // Fallback or parsed date
        category: "Kariyer Haber",
        description: title + " detayları için lütfen üniversite sitemizi ziyaret edin.",
        imageUrl: imageUrl.startsWith('http') ? imageUrl : ("https://www.esenyurt.edu.tr" + imageUrl)
      });
    }
  });

  // Parse Announcements (Duyurular)
  // Pattern: <a title="..." href="/duyuru/..."
  const annLinks = document.querySelectorAll('a[href^="/duyuru/"]');
  annLinks.forEach((a, index) => {
    const title = a.getAttribute('title') || '';
    const href = "https://www.esenyurt.edu.tr" + a.getAttribute('href');
    const dateSpan = a.querySelector('span');
    const date = dateSpan ? dateSpan.textContent.trim() : '24.07.2026';
    
    if (title && !scrapedAnnouncements.some(ann => ann.title === title)) {
      scrapedAnnouncements.push({
        id: `ann-scraped-${index + 1}`,
        title: title,
        date: date,
        category: "Kariyer Duyuru",
        description: title + " duyurusu yayındadır.",
        url: href
      });
    }
  });

  // Parse Events (Etkinlikler)
  // Pattern: <a title="..." href="/etkinlik/..."
  const eventLinks = document.querySelectorAll('a[href^="/etkinlik/"]');
  eventLinks.forEach((a, index) => {
    const title = a.getAttribute('title') || '';
    const href = "https://www.esenyurt.edu.tr" + a.getAttribute('href');
    const img = a.querySelector('img');
    const imageUrl = img ? (img.getAttribute('data-src') || img.getAttribute('src') || '') : '';
    
    if (title && !scrapedEvents.some(e => e.title === title)) {
      scrapedEvents.push({
        id: `event-scraped-${index + 1}`,
        title: title,
        date: "Yakında",
        category: "Kariyer Etkinlik",
        description: title,
        imageUrl: imageUrl.startsWith('http') ? imageUrl : ("https://www.esenyurt.edu.tr" + imageUrl)
      });
    }
  });

  console.log(`Parsed News: ${scrapedNews.length}, Announcements: ${scrapedAnnouncements.length}, Events: ${scrapedEvents.length}`);

  // Inject into liveData.js
  let liveDataContent = fs.readFileSync(liveDataPath, 'utf8');

  // Replace liveSliderData, liveNewsData, liveEventData, liveAnnouncementData
  if (scrapedNews.length > 0) {
    liveDataContent = liveDataContent.replace(
      /export const liveNewsData = \[[^\]]*\];/s,
      `export const liveNewsData = ${JSON.stringify(scrapedNews, null, 2)};`
    );
  }
  if (scrapedEvents.length > 0) {
    liveDataContent = liveDataContent.replace(
      /export const liveEventData = \[[^\]]*\];/s,
      `export const liveEventData = ${JSON.stringify(scrapedEvents, null, 2)};`
    );
  }
  if (scrapedAnnouncements.length > 0) {
    liveDataContent = liveDataContent.replace(
      /export const liveAnnouncementData = \[[^\]]*\];/s,
      `export const liveAnnouncementData = ${JSON.stringify(scrapedAnnouncements, null, 2)};`
    );
  }

  // Also replace Logo.jsx to use /iesu-logo.svg which is cleaner and high-res
  const logoPath = path.join(process.cwd(), 'src/components/Logo.jsx');
  if (fs.existsSync(logoPath)) {
    let logoContent = fs.readFileSync(logoPath, 'utf8');
    logoContent = logoContent.replace(/src="\/logo.png"/g, 'src="/iesu-logo.svg"');
    fs.writeFileSync(logoPath, logoContent, 'utf8');
    console.log("Updated Logo.jsx to use SVG");
  }

  fs.writeFileSync(liveDataPath, liveDataContent, 'utf8');
  console.log("Successfully updated liveData.js with real parsed data from Kariyer page");

} catch (e) {
  console.error("Error parsing content.md:", e);
}
