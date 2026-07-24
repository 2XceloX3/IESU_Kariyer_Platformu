import fs from 'fs';
import path from 'path';

const liveDataActive = 'C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IESU_Kariyer_Platformu_Active\\src\\utils\\liveData.js';
const liveDataClean = 'C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IESU_Kariyer_Platformu_Clean\\src\\utils\\liveData.js';

const richTercihContent = `### İstanbul Esenyurt Üniversitesi 2026 - 2027 Akademik Yılı İndirim ve Burs Olanakları

İstanbul Esenyurt Üniversitesi tarafından İlk 5 Tercihinde üniversitemizi tercih eden aday öğrencilere sunulan özel burs ve indirim oranları aşağıda detaylandırılmıştır. Öğrencilerimiz harici sitelere gitmeye gerek kalmadan tüm kontenjan ve ücret tablolarını portalımız üzerinden görüntüleyebilir.

---

#### 💰 Lisans ve Önlisans Ücret & Tercih İndirimi Tablosu

| Fakülte / Bölüm | Puan Türü | Peşin Ücret | Tercih İndirimi | Tercih İndirimli Peşin Ücret | Kampüste Burslu + Tercih İndirimli |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **İşletme ve Yönetim Bilimleri Fakültesi** | EA | ₺363.000 | %30 | ₺254.100 | **₺228.690** |
| **Ekonomi ve Finans (İngilizce)** | EA | ₺363.000 | %30 | ₺254.100 | **₺228.690** |
| **Elektronik Ticaret ve Yönetimi** | EA | ₺363.000 | %30 | ₺254.100 | **₺228.690** |
| **Havacılık Yönetimi** | EA | ₺363.000 | %30 | ₺254.100 | **₺228.690** |
| **Lojistik Yönetimi** | EA | ₺363.000 | %30 | ₺254.100 | **₺228.690** |
| **Siyaset Bilimi ve Uluslararası İlişkiler** | EA | ₺363.000 | %30 | ₺254.100 | **₺228.690** |
| **Mühendislik ve Mimarlık Fakültesi** | SAY | ₺395.000 | %30 | ₺276.500 | **₺248.850** |
| **Bilgisayar Mühendisliği** | SAY | ₺395.000 | %30 | ₺276.500 | **₺248.850** |
| **Yazılım Mühendisliği** | SAY | ₺395.000 | %30 | ₺276.500 | **₺248.850** |
| **Sağlık Bilimleri Fakültesi** | SAY/EA | ₺380.000 | %30 | ₺266.000 | **₺239.400** |
| **Meslek Yüksekokulları (Önlisans)** | TYT | ₺195.000 | %30 | ₺136.500 | **₺122.850** |

---

#### 🎁 Ek İndirim ve Burs Şartları

1. **İlk 5 Tercih İndirimi:** ÖSYM YKS tercih listenizde İstanbul Esenyurt Üniversitesi programlarını ilk 5 sırada tercih eden tüm adaylarımıza **%30 ek tercih indirimi** uygulanır.
2. **Kampüste Tercih Bursu:** Tercih döneminde kampüsümüzü ziyaret ederek tercih uzmanlarımız eşliğinde tercih yapan aday öğrencilerimize **ek %10 Özel Kampüs Bursu** tanımlanır.
3. **Kardeş İndirimi:** Üniversitemizde aynı dönemde öğrenim gören kardeşlerin her birine %10 ilave kardeş indirimi uygulanmaktadır.
4. **Milli Sporcu Bursu:** Gençlik ve Spor Bakanlığı protokolü kapsamında milli sporcu unvanına sahip adaylara %100 eğitim bursu verilir.

*Detaylı bilgi ve birebir tercih danışmanlığı için Kariyer Geliştirme Koordinatörlüğü ve Aday Öğrenci Danışma Merkezimizi ziyaret edebilirsiniz.*`;

function updateTuitionFeeData(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Update liveSliderData slide 0 or any matching slide content
  content = content.replace(
    /"title": "İlk 5 Tercihte",([\s\S]*?)"actionLink": "([^"]+)"/s,
    `"title": "İlk 5 Tercihte İndirim ve Ücretler",\n    "badge": "Tercih Bursu",\n    "image": "https://www.esenyurt.edu.tr/uploads/2026/07/4ul12yzssqgwd-ilk-5-tercihte.jpg",\n    "content": ${JSON.stringify(richTercihContent)},\n    "actionLink": "$2"`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Injected full tuition fees & discount table into: ${filePath}`);
}

updateTuitionFeeData(liveDataActive);
updateTuitionFeeData(liveDataClean);
