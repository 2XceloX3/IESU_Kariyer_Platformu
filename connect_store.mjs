import fs from 'fs';
import path from 'path';

const storePath = path.join(process.cwd(), 'src/store/useAppStore.js');

try {
  let c = fs.readFileSync(storePath, 'utf8');
  
  // Inject imports if not already there
  if (!c.includes('liveEventData')) {
    c = c.replace(
      /import \{[\s\S]*?\} from '\.\.\/utils\/mockData';/,
      (match) => match + `\nimport { liveEventData, liveAnnouncementData, liveNewsData } from '../utils/liveData';`
    );
  }

  // Map to live data
  c = c.replace(/news: initialNews/g, 'news: liveNewsData');
  c = c.replace(/events: initialEvents/g, 'events: liveEventData');
  c = c.replace(/announcements: initialAnnouncements/g, 'announcements: liveAnnouncementData');

  // Change persist name so it creates a fresh state store
  c = c.replace(/name: 'iesu-kariyer-storage-v10'/g, "name: 'iesu-kariyer-storage-v11'");

  fs.writeFileSync(storePath, c, 'utf8');
  console.log("Successfully connected useAppStore to live data and bumped store version");

} catch (e) {
  console.error("Error updating useAppStore.js:", e);
}
