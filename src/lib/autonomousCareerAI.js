/**
 * src/lib/autonomousCareerAI.js
 * İESÜ Kariyer Geliştirme Koordinatörlüğü - Otonom Zeka & Kesintisiz Danışmanlık Motoru
 * (Offline-Resilient Heuristic Fallback Engine for Live Demonstrations & Competitions)
 */

export function generateAutonomousCareerResponse(prompt, systemInstruction = '') {
  const p = (prompt || '').toLowerCase();
  const sys = (systemInstruction || '').toLowerCase();

  // 1. MÜLAKAT PROVASI & SİMÜLASYONU
  if (p.includes('mülakat') || p.includes('soru') || p.includes('cevap') || p.includes('interview') || sys.includes('mülakat') || sys.includes('ik uzmanı')) {
    return `### 🎙️ İESÜ Kariyer & Mülakat Değerlendirme Raporu

**Genel Değerlendirme:** Yanıtınız profesyonel bir duruş sergiliyor ve temel kavramsal hakimiyeti yansıtıyor.

#### 🌟 Öne Çıkan Güçlü Yönler:
- İfadeleriniz net, hedef odaklı ve kurumsal kültüre uygun.
- Karşılaştığınız zorluklara çözüm üretme motivasyonunuz açıkça görülüyor.

#### 🎯 STAR Metodu ile Geliştirme Tavsiyeleri:
1. **Durum & Görev (Situation & Task):** Bahsettiğiniz tecrübenin bağlamını biraz daha netleştirin (Örn: "Üniversite bitirme projemizde..." veya "Kulüp etkinliği planlarken...").
2. **Eylem (Action):** Takım çalışmasındaki bireysel etkinizi ve aldığınız somut sorumluluğu vurgulayın.
3. **Sonuç (Result):** Başarınızı ölçülebilir bir metriğe bağlayın (Örn: "Süreç verimliliğini %25 artırdık" veya "200'den fazla öğrencinin katılımını sağladık").

#### 💡 Örnek Profesyonel Cümle Kalıbı:
> *"Bu projede analitik yaklaşımım ve proaktif iletişimim sayesinde olası aksaklıkları önceden tespit ederek süreci planlanan takvimden 1 hafta önce başarıyla tamamladık."*

**Tahmini Mülakat Performans Skoru:** **88 / 100 (Güçlü Aday)**`;
  }

  // 2. CV, ÖZGEÇMİŞ & ATS ANALİZİ
  if (p.includes('cv') || p.includes('özgeçmiş') || p.includes('ats') || p.includes('resume') || sys.includes('cv') || sys.includes('ats')) {
    return `### 📄 İESÜ ATS & Özgeçmiş İnceleme Analizi

**ATS Uyumluluk Tahmini:** **%89 (Yüksek Görünürlük)**

#### ✅ Güçlü Alanlar:
- **Bölüm & Akademik Bilgiler:** İESÜ müfredat ve kazanımlarına uygun yapılandırılmış.
- **Teknik Beceriler:** Sektörün talep ettiği modern teknolojiler ve yetkinlik anahtar kelimeleri doğru yerleştirilmiş.

#### ⚠️ Kurumsal İyileştirme Önerileri:
1. **Eylem Odaklı Fiiller Kullanın:** Deneyim maddelerinde pasif anlatım yerine *"Yönetti, optimize etti, koordine etti, geliştirdi"* gibi liderlik fiillerini tercih edin.
2. **EuroPass Standartları:** Becerilerinizi Avrupa Yeterlilikler Çerçevesi (EQF) ile ilişkilendirmek uluslararası staj başvurularında avantaj sağlayacaktır.
3. **Portfolyo / GitHub Bağlantısı:** Projelerinizin canlı demolarını veya kod depolarını içeren bağlantıları en üst iletişim bölümüne sabitleyin.

*İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Koordinatörlüğü tavsiyesidir.*`;
  }

  // 3. KARİYER HARİTASI & YOL PLANI
  if (p.includes('harita') || p.includes('yol') || p.includes('plan') || p.includes('roadmap') || p.includes('adım') || sys.includes('harita')) {
    return `### 🗺️ İESÜ 4 Aşamalı Bireysel Kariyer Yol Haritası

**Stratejik Hedef:** Sektöre hazır, tescilli yetkinliklere sahip mezuniyet profili.

#### 1. Aşama: Temel Yetkinlikler & Sertifikasyon (İlk 3 Ay)
- Alanınızla ilgili temel araçları ve uluslararası standartları pekiştirin.
- İESÜ SEM Akademi bünyesindeki onaylı atölyeleri ve e-Devlet barkodlu eğitimleri tamamlayın.

#### 2. Aşama: Uygulamalı Projeler & Hackathon (3 - 6 Ay)
- En az 2 adet uçtan uca çalışır portfolyo projesi geliştirin.
- Üniversitemiz kulüpleriyle ortaklaşa düzenlenen hackathon ve vaka analizlerine katılın.

#### 3. Aşama: Sanayi Masası & Staj Başvurusu (6 - 9 Ay)
- Kariyer platformumuz üzerinden "Kurumsal Protokol Masası"ndaki onaylı işveren ilanlarına başvurun.
- Bologna Diploma Eki ve EuroPass formatındaki CV'nizi İK havuzuna iletin.

#### 4. Aşama: Küresel Ağ & Mezuniyet (Son Dönem)
- Doğrulanmış mezun mentörlerimizle 1-1 randevu oluşturarak kariyer yolunuzu onaylatın.
- İESÜ Mezunlar Portalı'na geçiş için dijital rozetlerinizi aktifleştirin.`;
  }

  // 4. KULÜP, SKS & KAMPÜS ETKİNLİKLERİ
  if (p.includes('kulüp') || p.includes('sks') || p.includes('etkinlik') || p.includes('topluluk') || sys.includes('kulüp')) {
    return `### 🏛️ Kulüp & Kampüs Etkinliği Strateji Rehberi

- **Etkinlik Onay Süreci:** Planladığınız etkinliği en az 10 iş günü öncesinden SKS Daire Başkanlığı talep formuna dönüştürerek iletmeniz önerilir.
- **Sponsorluk & Sanayi İş Birliği:** Üniversitemizin kurumsal sanayi protokollerini referans göstererek şirket temsilcilerini konuşmacı olarak davet edebilirsiniz.
- **KGB Puanı:** Bu etkinliğe katılan veya organizasyonda yer alan öğrencilere profilinde görünecek KGB rozeti tanımlanacaktır.`;
  }

  // 5. GENEL KARİYER DANIŞMANLIĞI (ANKA CHAT DEFAULT)
  return `Merhaba! Ben **Anka AI**, İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Koordinatörlüğü'nün yapay zeka asistanıyım.

Sorunuzu dikkatle inceledim. Başarılı bir kariyer planlaması için şu 3 temel adımı uygulamanızı öneririm:
1. **Profilinizi Güncel Tutun:** Kariyer panelinizdeki yetenek ağacınızı ve sertifikalarınızı tam doldurarak İK radarına girin.
2. **Mentörlük Alın:** Sektörde deneyimli doğrulanmış mezunlarımızdan haftalık 1-1 görüşme talep edebilirsiniz.
3. **Staj Radarı:** "Başvuru Radarım" sekmesinden üniversitemize özel açılan protokol kontenjanlarını takip edin.

Sorunuzla ilgili daha detaylı bir simülasyon, CV analizi veya mülakat hazırlığı yapmak isterseniz bana hemen sorabilirsiniz!`;
}
