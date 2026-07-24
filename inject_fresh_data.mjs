import fs from 'fs';
import path from 'path';

const freshDataPath = path.join(process.cwd(), 'esenyurt_main_page_fresh.json');
const liveDataPath = path.join(process.cwd(), 'src/utils/liveData.js');

try {
  const freshData = JSON.parse(fs.readFileSync(freshDataPath, 'utf8'));

  // Prepare new slider data
  const newSliders = freshData.sliders.map(s => ({
    badge: "Esenyurt Duyuru",
    title: s.title,
    image: s.image_url,
    actionLink: s.link_url
  }));

  // Ensure we have at least 3 sliders (fallback to banners if needed)
  if (newSliders.length < 3 && freshData.banners) {
    freshData.banners.slice(0, 3 - newSliders.length).forEach(b => {
      newSliders.push({
        badge: "Öğrenci Portalı",
        title: b.title,
        image: b.image_url,
        actionLink: b.link_url
      });
    });
  }

  const slidersCode = `export const liveSliderData = ${JSON.stringify(newSliders, null, 2)};`;

  // Prepare new news data
  const newNews = freshData.news.map((n, idx) => ({
    id: `news-${idx + 1}`,
    title: n.title,
    date: n.date,
    category: "Güncel Haber",
    description: n.description,
    imageUrl: n.image_url
  }));

  const newsCode = `export const liveNewsData = ${JSON.stringify(newNews, null, 2)};`;

  // Read existing liveData.js
  let liveDataContent = fs.readFileSync(liveDataPath, 'utf8');

  // Replace sliders
  liveDataContent = liveDataContent.replace(
    /export const liveSliderData = \[[^\]]*\];/s,
    slidersCode
  );

  // Replace news
  liveDataContent = liveDataContent.replace(
    /export const liveNewsData = \[[^\]]*\];/s,
    newsCode
  );

  fs.writeFileSync(liveDataPath, liveDataContent, 'utf8');
  console.log("Successfully injected fresh scraped data into liveData.js");

} catch (e) {
  console.error("Error updating liveData.js:", e);
}
