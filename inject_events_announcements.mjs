import fs from 'fs';
import path from 'path';

const liveDataPath = path.join(process.cwd(), 'src/utils/liveData.js');
const freshDataPath = path.join(process.cwd(), 'esenyurt_main_page_fresh.json');

try {
  const freshData = JSON.parse(fs.readFileSync(freshDataPath, 'utf8'));
  
  // Extract real events and announcements from fresh data
  const realEvents = freshData.events.map((e, idx) => ({
    id: `event-${idx + 1}`,
    title: e.title,
    date: e.date || 'Yakında',
    category: "Etkinlik",
    description: e.description || e.title,
    imageUrl: e.image_url || 'https://www.esenyurt.edu.tr/kariyer_logo.png' // Fallback
  }));

  const realAnnouncements = freshData.banners.map((b, idx) => ({
    id: `ann-${idx + 1}`,
    title: b.title,
    date: b.date || 'Sürekli',
    category: "Duyuru",
    description: b.description || b.title,
    url: b.link_url
  }));

  const eventsCode = `export const liveEventData = ${JSON.stringify(realEvents, null, 2)};`;
  const announcementsCode = `export const liveAnnouncementData = ${JSON.stringify(realAnnouncements, null, 2)};`;

  // Read existing liveData.js
  let liveDataContent = fs.readFileSync(liveDataPath, 'utf8');

  // If liveEventData exists, replace it, otherwise append
  if (liveDataContent.includes('export const liveEventData')) {
    liveDataContent = liveDataContent.replace(/export const liveEventData = \[[\s\S]*?\];/g, eventsCode);
  } else {
    liveDataContent += `\n\n${eventsCode}`;
  }

  // If liveAnnouncementData exists, replace it, otherwise append
  if (liveDataContent.includes('export const liveAnnouncementData')) {
    liveDataContent = liveDataContent.replace(/export const liveAnnouncementData = \[[\s\S]*?\];/g, announcementsCode);
  } else {
    liveDataContent += `\n\n${announcementsCode}`;
  }

  fs.writeFileSync(liveDataPath, liveDataContent, 'utf8');
  console.log("Successfully injected actual Esenyurt events and announcements into liveData.js");

} catch (e) {
  console.error("Error updating liveData.js:", e);
}
