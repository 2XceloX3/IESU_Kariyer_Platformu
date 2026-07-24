const https = require('https');
const fs = require('fs');
const path = require('path');

const baseHost = 'https://www.esenyurt.edu.tr';

const urlsToFetch = [
    { title: 'Main Page', url: 'https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu' },
    { title: 'Misyon & Vizyon', url: 'https://www.esenyurt.edu.tr/icerik/3222-hakkimizda-misyon-&-vizyon' },
    { title: 'Biz Kimiz', url: 'https://www.esenyurt.edu.tr/icerik/2356-kariyer-gelistirme-ofisi-koordinatorlugu-biz-kimiz' },
    { title: 'Ekip Üyeleri (Kadro)', url: 'https://www.esenyurt.edu.tr/kadro/kariyer-gelistirme-ofisi-kadro-1' },
    { title: 'Koordinatörün Mesajı', url: 'https://www.esenyurt.edu.tr/icerik/2357-kariyer-gelistirme-ofisi-koordinatorlugu-koordinatorun-mesaji' },
    { title: 'Kariyer Merkezi Yönergesi', url: 'https://www.esenyurt.edu.tr/icerik/3429-hakkimizda-kariyer-merkezi-yonergesi' },
    { title: 'Organizasyon Yapımız', url: 'https://www.esenyurt.edu.tr/icerik/3430-hakkimizda-organizasyon-yapimiz' },
    { title: 'İş Akış Şeması', url: 'https://www.esenyurt.edu.tr/icerik/3431-hakkimizda-is-akis-semasi' },
    { title: 'İletişim', url: 'https://www.esenyurt.edu.tr/icerik/3223-hakkimizda-iletisim' },
    { title: 'Organizasyon Şeması', url: 'https://www.esenyurt.edu.tr/icerik/3911-kariyer-gelistirme-ofisi-koordinatorlugu-organizasyon-semasi' },
    { title: 'CV Hazırlama Kılavuzu', url: 'https://www.esenyurt.edu.tr/icerik/2358-kariyer-gelistirme-ofisi-koordinatorlugu-cv-ornekleri' },
    { title: 'Özgeçmiş Nasıl Hazırlanmalıdır?', url: 'https://www.esenyurt.edu.tr/icerik/2359-kariyer-gelistirme-ofisi-koordinatorlugu-ozgecmis-nasil-hazirlanmalidir' },
    { title: 'Bireysel Görüşme Randevusu', url: 'https://www.esenyurt.edu.tr/icerik/3224-kariyer-danismanligi-bireysel-gorusme-randevusu' },
    { title: 'Online Danışmanlık', url: 'https://www.esenyurt.edu.tr/icerik/3226-kariyer-danismanligi-online-danismanlik' },
    { title: 'Öğrenci Beklenti Anketi', url: 'https://www.esenyurt.edu.tr/icerik/3227-kariyer-danismanligi-ogrenci-beklenti-anketi' },
    { title: 'Sıkça Sorulan Sorular', url: 'https://www.esenyurt.edu.tr/icerik/3229-kariyer-danismanligi-sikca-sorulan-sorular' },
    { title: 'Mülakat Öncesi Hazırlık', url: 'https://www.esenyurt.edu.tr/icerik/2360-kariyer-gelistirme-ofisi-koordinatorlugu-mulakat-oncesi-hazirlik' },
    { title: 'Mezun Başarı Hikayeleri', url: 'https://www.esenyurt.edu.tr/icerik/3233-mezunlar-mezun-basari-hikayeleri' },
    { title: 'Mentorluk Programı', url: 'https://www.esenyurt.edu.tr/icerik/3232-mezunlar-mentorluk-programi' },
    { title: 'Mezun Takip Sistemi', url: 'https://www.esenyurt.edu.tr/icerik/3235-mezunlar-mezun-takip-sistemi' },
    { title: 'Mezun Öğrenci Memnuniyet Anketi', url: 'https://www.esenyurt.edu.tr/icerik/3236-mezunlar-mezun-ogrenci-memnuniyet-anketi' },
    { title: 'İş İlanları', url: 'https://www.esenyurt.edu.tr/icerik/2361-kariyer-gelistirme-ofisi-koordinatorlugu-is-ilanlari' },
    { title: 'Staj İlanları', url: 'https://www.esenyurt.edu.tr/icerik/2362-kariyer-gelistirme-ofisi-koordinatorlugu-staj-ilanlari' },
    { title: 'T.C. Ulusal Staj Programı', url: 'https://www.esenyurt.edu.tr/icerik/3438-kariyer-gelistirme-ofisi-koordinatorlugu-tc-ulusal-staj-programi' },
    { title: 'Gönüllü Staj', url: 'https://www.esenyurt.edu.tr/icerik/3436-kariyer-gelistirme-ofisi-koordinatorlugu-gonullu-staj' },
    { title: 'Formlar ve Belgeler', url: 'https://www.esenyurt.edu.tr/icerik/4540-kariyer-gelistirme-ofisi-koordinatorlugu-formlar-ve-belgeler' },
    { title: 'Portal Giriş ve Kullanım Kılavuzu', url: 'https://www.esenyurt.edu.tr/icerik/3228-yetenek-kapisi-portal-giris-ve-kullanim-kilavuzu' },
    { title: 'Öğrenci, Mezun ve İşveren Soruları', url: 'https://www.esenyurt.edu.tr/icerik/3225-sikca-sorulan-sorulan-ogrenci-mezun-ve-isveren-sorulari' },
    { title: 'Çözüm Ortaklarımız', url: 'https://www.esenyurt.edu.tr/icerik/2363-kariyer-gelistirme-ofisi-koordinatorlugu-cozum-ortaklarimiz' },
    { title: 'Galerimiz', url: 'https://www.esenyurt.edu.tr/icerik/3204-kariyer-gelistirme-ofisi-koordinatorlugu-galerimiz' },
    { title: 'Haberler', url: 'https://www.esenyurt.edu.tr/icerik/haberler/2355-kariyer-gelistirme-ofisi-koordinatorlugu' },
    { title: 'Duyurular', url: 'https://www.esenyurt.edu.tr/icerik/duyurular/2355-kariyer-gelistirme-ofisi-koordinatorlugu' },
    { title: 'Etkinlikler', url: 'https://www.esenyurt.edu.tr/icerik/etkinlikler/2355-kariyer-gelistirme-ofisi-koordinatorlugu' }
];

function fetchUrl(targetUrl) {
    return new Promise((resolve) => {
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7'
            },
            rejectUnauthorized: false
        };

        https.get(encodeURI(targetUrl), options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data, url: targetUrl }));
        }).on('error', (err) => {
            resolve({ status: 500, error: err.message, url: targetUrl });
        });
    });
}

function cleanHtmlToText(html) {
    if (!html) return '';
    // Strip scripts & styles
    let text = html.replace(/<script[\s\S]*?<\/script>/gi, '');
    text = text.replace(/<style[\s\S]*?<\/style>/gi, '');
    // Replace breaks/paragraphs with newlines
    text = text.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/<\/p>/gi, '\n\n');
    text = text.replace(/<\/h[1-6]>/gi, '\n\n');
    text = text.replace(/<\/li>/gi, '\n');
    text = text.replace(/<\/tr>/gi, '\n');
    // Strip remaining tags
    text = text.replace(/<[^>]+>/g, '');
    // Decode HTML entities
    text = text.replace(/&nbsp;/g, ' ')
               .replace(/&amp;/g, '&')
               .replace(/&lt;/g, '<')
               .replace(/&gt;/g, '>')
               .replace(/&quot;/g, '"')
               .replace(/&#39;/g, "'");
    // Normalize space
    text = text.split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n');
    return text;
}

function extractImages(html) {
    const images = [];
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let m;
    while ((m = imgRegex.exec(html)) !== null) {
        let src = m[1];
        if (src.startsWith('/')) src = baseHost + src;
        const altMatch = m[0].match(/alt=["']([^"']*)["']/i);
        const alt = altMatch ? altMatch[1] : '';
        images.push({ src, alt });
    }
    return images;
}

function extractFiles(html) {
    const files = [];
    const fileRegex = /<a[^>]+href=["']([^"']+\.(pdf|docx?|xlsx?|zip))["'][^>]*>([\s\S]*?)<\/a>/gi;
    let m;
    while ((m = fileRegex.exec(html)) !== null) {
        let href = m[1];
        if (href.startsWith('/')) href = baseHost + href;
        const text = m[3].replace(/<[^>]+>/g, '').trim();
        files.push({ href, text });
    }
    return files;
}

async function run() {
    const results = [];
    console.log(`Starting crawl of ${urlsToFetch.length} pages...`);

    for (const item of urlsToFetch) {
        console.log(`Fetching: ${item.title} (${item.url})`);
        const res = await fetchUrl(item.url);
        if (res.status === 200) {
            const pageText = cleanHtmlToText(res.data);
            const images = extractImages(res.data);
            const files = extractFiles(res.data);
            results.push({
                category: item.title,
                url: item.url,
                status: res.status,
                textLength: pageText.length,
                text: pageText,
                images,
                files,
                rawHtmlLength: res.data.length
            });
        } else {
            console.log(`Failed ${item.title}: Status ${res.status}`);
            results.push({
                category: item.title,
                url: item.url,
                status: res.status,
                error: res.error || `HTTP ${res.status}`
            });
        }
    }

    fs.writeFileSync(path.join(__dirname, 'extracted_data.json'), JSON.stringify(results, null, 2), 'utf-8');
    console.log(`Crawl completed. Saved results to extracted_data.json`);
}

run();
