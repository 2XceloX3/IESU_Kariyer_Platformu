import fs from 'fs';

const scrapedFile = 'scraped_full.json';
const liveDataFile = 'src/utils/liveData.js';
const mockDataFile = 'src/utils/mockData.js';
const storeFile = 'src/store/useAppStore.js';

const scraped = JSON.parse(fs.readFileSync(scrapedFile, 'utf8'));

function replaceArray(content, arrayName, newData) {
  const regex = new RegExp(`export const ${arrayName}\\s*=\\s*\\[[\\s\\S]*?\\];`, 'm');
  const replacement = `export const ${arrayName} = ${JSON.stringify(newData, null, 2)};`;
  return content.replace(regex, replacement);
}

// 1. Update liveData.js with liveAnnouncementsData
let liveData = fs.readFileSync(liveDataFile, 'utf8');

// The original liveAnnouncementsData is in liveData.js
// Map announcements to the required format
const announcementsForLive = scraped.announcements.slice(0, 10).map((ann, i) => ({
  id: `ann-${i + 1}`,
  title: ann.title,
  date: ann.date,
  category: "Duyuru",
  description: ann.description || "Detaylı bilgi için tıklayınız...",
  imageUrl: ann.imageUrl || "",
  url: ann.url || "https://www.esenyurt.edu.tr/duyurular"
}));

liveData = replaceArray(liveData, 'liveAnnouncementsData', announcementsForLive);
fs.writeFileSync(liveDataFile, liveData, 'utf8');
console.log('Updated liveData.js (liveAnnouncementsData).');

// 2. Update mockData.js with initialEvents, initialAnnouncements, initialNews
let mockData = fs.readFileSync(mockDataFile, 'utf8');

const initialEvents = scraped.events.slice(0, 15).map((evt, i) => ({
  id: `EVT-${(i + 1).toString().padStart(3, '0')}`,
  title: evt.title,
  description: evt.description || evt.title,
  date: evt.date,
  time: evt.time || "14:00",
  location: evt.location || "Kampüs",
  imageUrl: evt.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
  status: "Aktif",
  url: evt.url
}));

const initialAnnouncements = announcementsForLive.map(ann => ({
  id: ann.id,
  title: ann.title,
  date: ann.date,
  content: ann.description,
  isPremium: true
}));

const initialNews = scraped.news.slice(0, 15).map((n, i) => ({
  id: `NEWS-${(i + 1).toString().padStart(3, '0')}`,
  title: n.title,
  date: n.date,
  content: n.content || n.description,
  category: n.category || "Haber",
  imageUrl: n.imageUrl || "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800",
  url: n.url
}));

mockData = replaceArray(mockData, 'initialEvents', initialEvents);
mockData = replaceArray(mockData, 'initialAnnouncements', initialAnnouncements);
mockData = replaceArray(mockData, 'initialNews', initialNews);
fs.writeFileSync(mockDataFile, mockData, 'utf8');
console.log('Updated mockData.js (initialEvents, initialAnnouncements, initialNews).');

// 3. Clear store persistence key to force reload
let storeData = fs.readFileSync(storeFile, 'utf8');
storeData = storeData.replace(/name:\s*'iesu-career-store-v[0-9]+'/, "name: 'iesu-career-store-v9'");
fs.writeFileSync(storeFile, storeData, 'utf8');
console.log('Updated useAppStore.js version to v9.');
