import fs from 'fs';
import path from 'path';

const liveDataPathActive = 'C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IESU_Kariyer_Platformu_Active\\src\\utils\\liveData.js';
const liveDataPathClean = 'C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IESU_Kariyer_Platformu_Clean\\src\\utils\\liveData.js';

const freshSliders = [
  {
    badge: "Esenyurt Duyuru",
    title: "İlk 5 Tercihte İndirim",
    image: "https://www.esenyurt.edu.tr/uploads/2026/07/4ul12yzssqgwd-ilk-5-tercihte.jpg",
    actionLink: "https://aday.esenyurt.edu.tr/kontenjanlar-ve-ucretler"
  },
  {
    badge: "Kampüs Yaşamı",
    title: "İstanbul Esenyurt Üniversitesi Yerleşkesi",
    image: "https://www.esenyurt.edu.tr/uploads/2024/07/3vfnvwenukjgg-esenyurt-universitesi-cover.png",
    actionLink: "https://www.esenyurt.edu.tr/"
  },
  {
    badge: "Akademik Programlar",
    title: "Geleceğin Meslekleri ve Eğitim Olanakları",
    image: "https://www.esenyurt.edu.tr/uploads/2024/07/i75hk57842lu1-img-01.jpg",
    actionLink: "https://aday.esenyurt.edu.tr/"
  },
  {
    badge: "Sosyal Yaşam",
    title: "Öğrenci Kulüpleri ve Etkinlikler",
    image: "https://www.esenyurt.edu.tr/uploads/2024/07/gyz4xw9ie7yy3-img-02.jpg",
    actionLink: "https://www.esenyurt.edu.tr/"
  },
  {
    badge: "Kütüphane & Araştırma",
    title: "Prof. Dr. Aziz Sancar Kütüphanesi",
    image: "https://www.esenyurt.edu.tr/uploads/2024/07/i7kltkuczyfcg-img-03.jpg",
    actionLink: "https://www.esenyurt.edu.tr/"
  }
];

function updateFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  const slidersCode = `export const liveSliderData = ${JSON.stringify(freshSliders, null, 2)};`;
  content = content.replace(/export const liveSliderData = \[[^\]]*\];/s, slidersCode);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated liveSliderData in ${filePath}`);
}

updateFile(liveDataPathActive);
updateFile(liveDataPathClean);
