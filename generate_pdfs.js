const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'public', 'docs');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const createPdf = (filename, title, content) => {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(path.join(outDir, filename)));
  doc.fontSize(24).text(title, { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(content, { align: 'justify' });
  doc.end();
};

createPdf('mezuniyet_bulteni.pdf', 'Mezuniyet Toreni Basin Bulteni', 'Istanbul Esenyurt Universitesi 2025-2026 Akademik yili mezuniyet toreni buyuk bir coskuyla tamamlandi. Ogrencilerimize kariyerlerinde basarilar dileriz. Bu belge basin mensuplari icin hazirlanmistir.');

createPdf('yaz_okulu_kilavuz.pdf', 'Yaz Okulu Basvuru Kilavuzu', 'Yaz okulu basvurulari 24 Haziran 2026 tarihinde baslayacaktir. Ogrencilerimizin ders kayit islemlerini OBS uzerinden gerceklestirmeleri gerekmektedir. Kredilendirme ve ucret detaylari icin ogrenci isleri sayfalarimizi ziyaret ediniz.');

createPdf('lisansustu_sartlar.pdf', 'Lisansustu Egitim Basvuru Sartlari', 'Yuksek lisans ve doktora programlari icin ALES, YDS ve diploma notu kosullarini iceren detayli tablodur. Tum ogrenciler mulakata alinacaktir.');

createPdf('bahar_senligi_program.pdf', 'Bahar Senligi Etkinlik Programi', '11 Mayis: Konserler ve ogrenci klupleri aktiviteleri. 12 Mayis: Spor turnuvalari ve e-spor yarisma finalleri. 13 Mayis: Odul torenleri ve kapanis seremonisi.');

createPdf('hackathon_kurallari.pdf', 'Hackathon Kurallari ve Kriterleri', 'Hackathon 48 saat surecektir. Akilli sehirler konulu projeler gelistirilecek olup, projelerde acik kaynakli teknolojiler kullanilmalidir. Dereceye giren takimlara 50.000 TL yatirim destegi saglanacaktir.');
