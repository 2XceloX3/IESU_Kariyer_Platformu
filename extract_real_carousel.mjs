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

  const carouselItems = document.querySelectorAll('.carousel-item');
  const realSlides = [];

  carouselItems.forEach((item, idx) => {
    const a = item.querySelector('a');
    const img = item.querySelector('img.d-none.d-lg-block') || item.querySelector('img');
    if (!img) return;

    let imageUrl = img.getAttribute('data-src') || img.getAttribute('src') || '';
    if (imageUrl.includes('empty.png')) {
      imageUrl = img.getAttribute('data-src') || '';
    }
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = 'https://www.esenyurt.edu.tr/' + imageUrl.replace(/^\//, '');
    }

    const title = a ? (a.getAttribute('title') || `Slide ${idx + 1}`) : `Slide ${idx + 1}`;
    const linkUrl = a ? (a.getAttribute('href') || '#') : '#';

    if (imageUrl && imageUrl.endsWith('.png') || imageUrl.endsWith('.jpg') || imageUrl.endsWith('.jpeg')) {
      realSlides.push({
        badge: "İESÜ Duyuru",
        title: title,
        image: imageUrl,
        actionLink: linkUrl.startsWith('http') ? linkUrl : ('https://www.esenyurt.edu.tr' + linkUrl)
      });
    }
  });

  console.log(`Extracted Real Carousel Slides: ${realSlides.length}`);
  console.log(realSlides);

  function updateLiveData(filePath) {
    if (!fs.existsSync(filePath)) return;
    let liveDataContent = fs.readFileSync(filePath, 'utf8');
    const slidersCode = `export const liveSliderData = ${JSON.stringify(realSlides, null, 2)};`;
    liveDataContent = liveDataContent.replace(/export const liveSliderData = \[[^\]]*\];/s, slidersCode);
    fs.writeFileSync(filePath, liveDataContent, 'utf8');
    console.log(`Updated liveSliderData in ${filePath}`);
  }

  if (realSlides.length > 0) {
    updateLiveData(liveDataPathActive);
    updateLiveData(liveDataPathClean);
  }

} catch (e) {
  console.error("Error extracting carousel items:", e);
}
