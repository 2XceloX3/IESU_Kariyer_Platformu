import fs from 'fs';
import path from 'path';

const activeFile = 'C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IESU_Kariyer_Platformu_Active\\src\\utils\\innerPagesData.js';
const cleanFile = 'C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IESU_Kariyer_Platformu_Clean\\src\\utils\\innerPagesData.js';

export const cleanInnerPagesData = `export const innerPagesData = {
  hakkimizda: {
    title: "Hakkımızda",
    subtitle: "İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Koordinatörlüğü",
    heroImage: "https://www.esenyurt.edu.tr/uploads/2026/07/hzzl9zmqxgrc0--20.jpg",
    sections: [
      {
        id: "misyon",
        title: "Misyonumuz",
        content: "Öğrenci ve mezunlarımızın, küresel ölçekte rekabet edebilir, yenilikçi ve etik değerlere sahip profesyoneller olarak iş dünyasına hazırlanmalarını sağlamak; onların potansiyellerini en üst düzeye çıkaracak kariyer planlama ve geliştirme hizmetleri sunmaktır.",
        icon: "Target"
      },
      {
        id: "vizyon",
        title: "Vizyonumuz",
        content: "Ulusal ve uluslararası düzeyde iş dünyası ile güçlü entegrasyon kuran, öğrenci ve mezunlarının kariyer yolculuklarında referans alınan, öncü bir kariyer koordinatörlüğü olmak.",
        icon: "TrendingUp"
      }
    ],
    contactInfo: {
      email: "kariyer@esenyurt.edu.tr",
      phone: "444 9 123 / 0 (212) 422 70 00",
      office: "Kariyer Geliştirme Koordinatörlüğü / Rektörlük Binası"
    }
  },
  hizmetlerimiz: {
    title: "Hizmetlerimizi İnceleyin",
    subtitle: "Kariyer Geliştirme Koordinatörlüğü Olarak Sizin İçin Neler Yapıyoruz?",
    heroImage: "https://www.esenyurt.edu.tr/uploads/2026/07/hzzl9zmqxgrc0--20.jpg",
    sections: [
      {
        id: "kariyer-danismanligi",
        title: "Kariyer Danışmanlığı",
        content: "Öğrenci ve mezunlarımızın kariyer hedeflerine ulaşmalarına yardımcı olmak amacıyla profesyonel kariyer danışmanlığı hizmetleri sunulmaktadır. Birebir görüşmeler, atölye çalışmaları ve etkinlikler aracılığıyla güçlü yönlerinizi keşfetmeniz ve doğru kariyer planı oluşturmanız desteklenmektedir.",
        target: "Öğrenciler ve Mezunlar",
        icon: "TrendingUp"
      },
      {
        id: "ozgecmis-danismanligi",
        title: "Özgeçmiş (CV) Rehberliği",
        content: "Kişisel, eğitim ve mesleki bilgileri içeren kritik bir belge olan özgeçmişin oluşturulması, ATS uyumlu format düzenlemeleri ve ön yazı (Cover Letter) hazırlama konusunda birebir rehberlik sağlanır.",
        target: "Öğrenciler ve Mezunlar",
        icon: "FileText"
      },
      {
        id: "staj-ve-istihdam",
        title: "Staj ve İstihdam Fırsatları",
        content: "Sektör lideri firmalarla yapılan kurumsal iş birlikleri ve Yetenek Kapısı / Cumhurbaşkanlığı İnsan Kaynakları Ofisi entegrasyonu ile zorunlu ve gönüllü staj başvuruları yönetilmektedir.",
        target: "Öğrenciler ve Mezunlar",
        icon: "Briefcase"
      },
      {
        id: "kariyer-fuarı",
        title: "Kariyer Günleri & Sektör Buluşmaları",
        content: "Her akademik yılda düzenlenen Kariyer Günleri, mülakat simülasyonları ve teknik geziler ile öğrenciler iş dünyasının lider temsilcileriyle doğrudan bir araya getirilmektedir.",
        target: "Tüm İESU Öğrencileri",
        icon: "Award"
      }
    ]
  },
  sss: {
    title: "Sıkça Sorulan Sorular",
    subtitle: "Kariyer Geliştirme Koordinatörlüğü Hakkında Merak Edilenler",
    faqs: [
      {
        q: "Kariyer Danışmanlığı randevusunu nasıl alabilirim?",
        a: "Öğrenci Girişi yaparak 'Randevu Al' sekmesinden dilediğiniz gün ve saat için Kariyer Danışmanımızdan birebir randevu oluşturabilirsiniz."
      },
      {
        q: "Staj yeri bulma konusunda Koordinatörlükten destek alabilir miyim?",
        a: "Evet! Koordinatörlüğümüz Yetenek Kapısı portalı ve anlaşmalı kurumlarımız üzerinden öğrencilerimize staj ilanları sunmakta ve başvuru süreçlerini desteklemektedir."
      },
      {
        q: "Özgeçmişimi (CV) kontrol ettirmek için ne yapmalıyım?",
        a: "Hazırladığınız CV'nizi kariyer@esenyurt.edu.tr adresine gönderebilir veya randevu alarak Koordinatörlüğümüzde yüz yüze inceletebilirsiniz."
      },
      {
        q: "Mezun olduktan sonra da hizmetlerden yararlanabilir miyim?",
        a: "Kesinlikle! İstanbul Esenyurt Üniversitesi mezunları tüm kariyer etkinliklerine, danışmanlık hizmetlerine ve iş ilanlarına ömür boyu erişim hakkına sahiptir."
      }
    ]
  }
};
`;

fs.writeFileSync(activeFile, cleanInnerPagesData, 'utf8');
fs.writeFileSync(cleanFile, cleanInnerPagesData, 'utf8');
console.log('Fixed UTF-8 encoding and populated clean innerPagesData.js in both projects!');
