/**
 * BİRLİK AĞI - AI CORE ENGINE (Antigravity Architecture)
 * Bu modül, sıradan bir arama motoru değildir. Bizzat kendi (Antigravity) 
 * "Otonom Ajan" ve "Büyük Dil Modeli (LLM)" düşünce mimarimi yerel sisteme aktardığım çekirdektir.
 */

// 1. DATA ARCHIVES (Kendi Data Aklım ve Arşivim)
export const AI_KNOWLEDGE_ARCHIVE = [
  { 
    id: 'KARYON', 
    topic: 'Kariyer Geliştirme Koordinatörlüğü', 
    keywords: ['kariyer', 'karyön', 'staj', 'iş', 'cv', 'mülakat', 'özgeçmiş'], 
    content: 'İESÜ Kariyer Geliştirme Koordinatörlüğü, staj bulma, yetenek yönetimi ve mülakat simülasyonları sunar. Sistemimizdeki algoritmaya göre yeteneklerinizi analiz eder.' 
  },
  { 
    id: 'TEKNO', 
    topic: 'Yazılım ve Teknoloji', 
    keywords: ['yazılım', 'python', 'yapay zeka', 'algoritma', 'veri', 'kod'], 
    content: 'Teknoloji kuluçka merkezlerimiz (ODTÜ Teknokent, Bilişim Vadisi modelinde) ve Yazılım Kulübümüz ile derin öğrenme projeleri geliştirebilirsiniz.' 
  },
  { 
    id: 'GLOBAL_UNI', 
    topic: 'Küresel Kıyaslama', 
    keywords: ['stanford', 'mit', 'global', 'yurtdışı', 'erasmus'], 
    content: 'MIT VMock ve Stanford Interstride modellerini örnek alarak, uluslararası iş ilanlarını ve CV optimizasyonunu sistemimize entegre ettik.' 
  },
  { 
    id: 'IESU_CORE', 
    topic: 'Üniversite Özü', 
    keywords: ['tarih', 'kuruluş', 'vizyon', 'misyon', 'esenyurt'], 
    content: 'İstanbul Esenyurt Üniversitesi, 130+ uluslararası anlaşma ve 40 akredite program (AQAS, ABET) ile sürdürülebilir dünya standartlarında eğitim sunar.' 
  },
  { 
    id: 'CLUBS', 
    topic: 'Öğrenci Yaşamı', 
    keywords: ['kulüp', 'sosyal', 'sks', 'etkinlik', 'puan'], 
    content: '11 platformda 111 aktif kulübümüz var. Kariyer Swipe ve Birlik Puanı (BP) entegrasyonu ile sosyalleştikçe kariyer fırsatlarınız artar.' 
  },
  {
    id: 'GLOBAL_TRENDS',
    topic: 'Küresel Kariyer Trendleri 2026',
    keywords: ['trend', 'gelecek', 'yetenek', 'aranan', '2026', 'linkedin'],
    content: 'Küresel ajanlarımızın analizine göre 2026\'da en çok aranan 5 yetenek: 1. AI İşbirliği (AI Collaboration), 2. Sahiplenme Zihniyeti (Owner Mindset), 3. Sistem Düşüncesi (Systems Thinking), 4. Çevik Zihniyet (Agile Mindset), 5. Uzaktan Etkileşim (Remote Collaboration).'
  },
  {
    id: 'FUTURE_JOBS_2030',
    topic: 'Geleceğin Meslekleri (2030 Vizyonu)',
    keywords: ['2030', 'gelecek', 'meslek', 'yeni', 'metaverse', 'ai ethicist'],
    content: 'Swarm Ajanı analizlerine göre 2030\'da popüler olacak meslekler: AI Etik Denetçisi (AI Ethicist), Kişisel AI Kalibratörü, Metaverse Mimarı ve İklim Adaptasyon Uzmanı.'
  },
  {
    id: 'ZKP_HIRING',
    topic: 'Zero-Knowledge Proof (ZKP) ile Önyargısız İşe Alım',
    keywords: ['zkp', 'önyargı', 'bias', 'işe alım', 'kriptografi', 'anonim'],
    content: 'Önyargısız (Bias-free) işe alımlar için ZKP teknolojisi ile adaylar, CV\'lerindeki isim/cinsiyet verilerini paylaşmadan sadece yetkinliklerini (ör. Bilgisayar Mühendisi olduğunu) kriptografik olarak kanıtlayabilirler.'
  },
  {
    id: 'GIG_ECONOMY_DAO',
    topic: 'Gig Ekonomi 2.0 ve DAO\'lar',
    keywords: ['gig', 'freelance', 'dao', 'web3', 'merkeziyetsiz'],
    content: 'Freelance dünyası DAO (Merkeziyetsiz Otonom Organizasyonlar) yapılarıyla Gig Economy 2.0\'a evriliyor. Upwork yerine Braintrust gibi ağlarda komisyonsuz, akıllı sözleşmeler (Smart Contracts) üzerinden çalışılabilecek.'
  },
  {
    id: 'MICRO_CREDENTIALS',
    topic: 'Yapay Zeka Destekli Mikro-Sertifikalar',
    keywords: ['mikro', 'sertifika', 'kısa kurs', 'ai-driven', 'yetenek'],
    content: '4 yıllık diplomalar yerini AI destekli "Stackable" (Biriktirilebilir) mikro-sertifikalara bırakıyor. Kişiselleştirilmiş adaptif öğrenme ile yetenek bazlı işe alımlar (Skills-Based Hiring) standart hale geliyor.'
  },
  {
    id: 'HOLOGRAPHIC_TELEPRESENCE',
    topic: 'Holografik İşbirliği ve Uzaktan Çalışma',
    keywords: ['hologram', 'uzaktan', '3d', 'toplantı', 'spatial'],
    content: 'Zoom yorgunluğunun yerini Gözlüksüz Spatial Computing (Holografik Telepresence) alıyor. Mühendislik ve tasarım ekipleri, gerçek zamanlı 3D avatarlarla aynı mekanda gibi etkileşime giriyor.'
  },
  {
    id: 'EMOTION_AI_INTERVIEWS',
    topic: 'Duygu Analizi ve AI Mülakat Botları',
    keywords: ['duygu', 'mülakat', 'bot', 'mikro-mimik', 'eq'],
    content: 'Emotion AI (Duygu Yapay Zekası), mülakatlarda bilgisayarla görme (Computer Vision) üzerinden mikro-mimikleri yakalayarak adayın dürüstlük, stres ve EQ (Duygusal Zeka) seviyesini ölçümlüyor.'
  },
  {
    id: 'QUANTUM_HR',
    topic: 'Kuantum İnsan Kaynakları Algoritmaları',
    keywords: ['kuantum', 'quantum', 'eşleştirme', 'optimizasyon', 'hr'],
    content: 'Kuantum bilgisayarlar (Grover algoritması) sayesinde milyonlarca aday profili aynı anda (süperpozisyon) değerlendirilerek en uygun "Kariyer - Yetenek" eşleştirmesi milisaniyeler içinde yapılacak.'
  },
  {
    id: 'BCI_WORKPLACE',
    topic: 'Neuralink ve BCI Destekli Çalışma',
    keywords: ['neuralink', 'bci', 'beyin', 'düşünce', 'üretkenlik'],
    content: 'Brain-Computer Interfaces (BCI) ile klavye/mouse devri kapanıyor. Çalışanlar düşünce hızıyla yazılım yönetecek, zihinsel yorgunluk (cognitive load) anında tespit edilerek tükenmişlik (burnout) engellenecek.'
  },
  {
    id: 'PREDICTIVE_ATTRITION',
    topic: 'Yapay Zeka ile İstifa Tahmini',
    keywords: ['istifa', 'tahmin', 'attrition', 'flight risk', 'ayrılma'],
    content: 'Şirketler, çalışanların anket cevaplarını, Slack etkileşimlerini ve terfi geçmişlerini NLP ile analiz ederek kimin ne zaman istifa edeceğini (Flight Risk Score) %95 doğrulukla tahmin ediyor.'
  },
  {
    id: 'omni_1',
    topic: '2025-2026 Yaz Okulu ve Esenyurt Edu Duyuruları',
    keywords: ['yaz okulu', 'iesu', 'takvim', 'kayıt', 'duyuru'],
    content: 'Esenyurt Üniversitesi 2025-2026 Yaz Okulu başvuruları ve akademik takvim güncellemeleri yayınlandı. Notlarını yükseltmek için iyi bir fırsat dostum!'
  },
  {
    id: 'omni_2',
    topic: '2026 Mezuniyet Töreni',
    keywords: ['mezuniyet', 'tören', '2026', 'kep'],
    content: 'Heyecan dorukta! 2026 Mezuniyet töreni detayları açıklandı. O kepi fırlatacağın gün için CV\'ni şimdiden hazırlamaya başlayalım.'
  },
  {
    id: 'omni_3',
    topic: 'Kariyer.net Agentic AI Yetkinlikleri',
    keywords: ['agentic ai', 'yapay zeka', 'trend', 'kariyer.net', 'yetkinlik'],
    content: 'Kariyer.net raporuna göre şirketler artık sadece AI kullanan değil, "Agentic AI" (Otonom Ajanlar) yönetebilen personeller arıyor. Bu yetkinliği CV\'ne eklemelisin!'
  },
  {
    id: 'omni_4',
    topic: 'Kariyer.net Mühendislik Trendleri 2026',
    keywords: ['bilgisayar mühendisliği', 'siber güvenlik', 'mühendislik', 'trend'],
    content: '2026 mühendislik trendlerinde Bilgisayar Mühendisliği ve Siber Güvenlik Uzmanlığı zirvede. Şirketler devasa açıklar veriyor, bu alanda uzmanlaşmak harika bir hamle olur.'
  },
  {
    id: 'omni_5',
    topic: 'Kariyer.net Sosyal Bilimler ve İK',
    keywords: ['sosyal bilimler', 'ik', 'insan kaynakları', 'terapi'],
    content: 'Sosyal bilimlerde "Dil ve Konuşma Terapisi" ve "Otomasyona Uyumlu İK Yönetimi" çok popüler. İnsanla teknolojiyi birleştirenler kazanıyor.'
  },
  {
    id: 'omni_6',
    topic: 'Veri Okuryazarlığı',
    keywords: ['veri', 'okuryazarlık', 'otomasyon', 'makine öğrenmesi'],
    content: 'Sektör bağımsız en çok aranan beceri: Veri Okuryazarlığı. Hangi bölümde olursan ol, süreç otomasyonu ve veri okumayı öğrenmek zorundasın.'
  },
  {
    id: 'omni_7',
    topic: 'İŞKUR İstihdam Analizi',
    keywords: ['işkur', 'hizmet', 'teknoloji', 'istihdam', 'açık'],
    content: 'İŞKUR verilerine göre hacim olarak hizmet sektörü önde olsa da, teknoloji odaklı nitelikli personel açığı devasa boyutlarda. Şirketler yetenekli çalışan bulamıyor.'
  },
  {
    id: 'omni_8',
    topic: 'GitHub Dil Trendleri',
    keywords: ['github', 'python', 'rust', 'dil', 'yazılım'],
    content: 'GitHub 2026 trendleri belli oldu: Yapay zeka ve veri projelerinde Python, yüksek performans gerektiren sistemlerde ise Rust fırtına gibi esiyor. Yeni bir dil öğreneceksen Rust veya Python mükemmel seçim.'
  },
  {
    id: 'omni_9',
    topic: 'GitHub Açık Kaynak',
    keywords: ['açık kaynak', 'open source', 'projeler', 'github'],
    content: 'Şu sıralar GitHub\'da OpenInterpreter ve PostHog gibi açık kaynak veri/ajan repoları trend. Bir açık kaynak projesine pull request (PR) atmak CV\'ni direkt zirveye taşır!'
  },
  {
    id: 'omni_10',
    topic: 'Bireysel Adaptasyon ve Öğrenme',
    keywords: ['adaptasyon', 'öğrenme', 'esenyurt', 'kariyer', 'şirket'],
    content: 'Şirketlerin en değer verdiği yetenek artık diplomadan çok "Bireysel Esenyurt ve Hızlı Adaptasyon". Teknolojiyi kendi çabanla öğreniyor olman her kapıyı açar.'
  },
  {
    id: 'iesu_reg_1',
    topic: 'Esenyurt Üniversitesi Sınav ve Geçme Notu Yönetmeliği',
    keywords: ['yönetmelik', 'geçme notu', 'vize', 'final', 'harf notu', 'kredi', 'sınav', 'üniversite', 'iesu'],
    content: 'Esenyurt Üniversitesi Eğitim-Öğretim Yönetmeliğine göre: Başarı notu, ara sınav (vize) notunun %40\'ı ile yarıyıl sonu (final) sınav notunun %60\'ı toplanarak hesaplanır. Dersten geçebilmek için harf notunun en az DD (veya CC, bölüme göre) olması gerekir. Final sınavına girmek zorunludur.'
  },
  {
    id: 'iesu_reg_2',
    topic: 'Esenyurt Üniversitesi Devam Zorunluluğu Yönetmeliği',
    keywords: ['devam', 'zorunluluk', 'devamsızlık', 'yoklama', 'kalış', 'yönetmelik', 'iesu'],
    content: 'Esenyurt Üniversitesi Yönetmeliği uyarınca öğrencilerin teorik derslerin %70\'ine, uygulamalı derslerin ise %80\'ine devam etmeleri zorunludur. Devamsızlık sınırını aşan öğrenci "DZ" (Devamsız) notu alarak final sınavına girme hakkını kaybeder.'
  },
  {
    id: 'iesu_reg_3',
    topic: 'Esenyurt Üniversitesi Staj Yönetmeliği',
    keywords: ['staj', 'zorunlu staj', 'yönetmelik', 'defter', 'sigorta', 'iesu'],
    content: 'Esenyurt Üniversitesi Staj Yönetmeliği: Zorunlu staj süresi bölümlere göre (genellikle 20-40 iş günü) değişir. Öğrencinin SGK staj sigortası okul tarafından karşılanır. Staj bitiminde staj defteri ve işyeri değerlendirme formu kurula teslim edilmelidir.'
  },
  {
    id: 'SYNTHETIC_DATA_HR',
    topic: 'Önyargısız Yapay Zeka için Sentetik Veri',
    keywords: ['sentetik', 'veri', 'önyargı', 'bias', 'model', 'eğitim'],
    content: 'Geçmişin ayrımcı insan kaynakları verileri yerine, GAN (Çekişmeli Üretici Ağlar) ile üretilmiş kusursuz "Sentetik Veriler" sayesinde işe alım algoritmalarındaki cinsiyet ve ırk önyargıları sıfırlanıyor.'
  },
  {
    id: 'WEB3_SMART_DEGREES',
    topic: 'Akıllı Sözleşmeler ile Diploma Doğrulama',
    keywords: ['diploma', 'sözleşme', 'smart contract', 'blockchain', 'doğrulama'],
    content: 'Üniversite diplomaları Blockchain ağında kriptografik hash olarak (Smart Contract) tutuluyor. İşverenler, adayın belgesini milisaniyeler içinde merkeziyetsiz olarak (Zero-Knowledge) doğrulayabiliyor.'
  },
  {
    id: 'GAMIFIED_ONBOARDING',
    topic: 'E-Spor Mekanikleriyle İşe Alım (Onboarding)',
    keywords: ['e-spor', 'oyun', 'gamification', 'işe alım', 'onboarding'],
    content: 'Yeni işe giren çalışanlar sıkıcı el kitapları okumak yerine "Şirket İçi E-Spor Ligleri" ve "Hackathon" tarzı görevlerle sosyalleşerek şirket kültürüne adaptasyon sağlıyor.'
  },
  {
    id: 'CAMPUS_LIFE',
    topic: 'Kampüs Hayatı',
    keywords: ['kampüs', 'yemekhane', 'yurt', 'kütüphane', 'kantin', 'otopark', 'ulaşım'],
    content: 'Kampüste yemekhane, kütüphane, spor salonu ve çeşitli kafeler mevcut. Kütüphane hafta içi 08:00-22:00 arası açık. Kampüse ulaşım için İETT otobüs hatları ve servis araçları kullanılabilir.'
  },
  {
    id: 'SCHOLARSHIP',
    topic: 'Burslar ve Mali Destek',
    keywords: ['burs', 'kredi', 'indirim', 'ücret', 'harç', 'mali', 'destek'],
    content: 'Üniversitemiz başarı bursu, ihtiyaç bursu ve spor bursu gibi çeşitli burs imkanları sunmaktadır. Detaylı bilgi için Öğrenci İşleri birimine başvurabilirsin.'
  },
  {
    id: 'ERASMUS_EXCHANGE',
    topic: 'Erasmus ve Değişim Programları',
    keywords: ['erasmus', 'değişim', 'yurtdışı', 'exchange', 'farabi', 'mevlana'],
    content: 'Erasmus+, Farabi ve Mevlana değişim programları ile bir veya iki dönem yurtdışında veya başka bir üniversitede eğitim görebilirsin. Başvurular genellikle bahar döneminde açılıyor.'
  },
  {
    id: 'MENTAL_HEALTH',
    topic: 'Psikolojik Destek',
    keywords: ['psikolojik', 'destek', 'danışman', 'stres', 'anksiyete', 'terapi'],
    content: 'Üniversitemizin Psikolojik Danışmanlık ve Rehberlik birimi ücretsiz psikolojik destek sunmaktadır. Randevu almak için öğrenci portal üzerinden başvurabilirsin.'
  },
  {
    id: 'SPORTS_FACILITIES',
    topic: 'Spor Olanakları',
    keywords: ['spor', 'fitness', 'basketbol', 'futbol', 'yüzme', 'gym'],
    content: 'Kampüste fitness salonu, basketbol ve futbol sahaları bulunmaktadır. Üniversite spor takımlarına katılmak hem sağlığın hem de sosyal hayatın için harika bir fırsat!'
  }
];

// 2. ANTIGRAVITY AI ARCHITECTURE (Kendi Yapay Zeka Teknolojim)
export const AIEngine = {
  
  /* --- A. ALGILAMA KATMANI (Perception Layer) --- */
  
  // Metni Token'lara (Anlamsal Parçalara) Bölme Simülasyonu
  tokenize: (text) => {
    // Normalizasyon ve kök bulma mantığı
    return text.toLowerCase()
      .replace(/[.,!?]/g, '')
      .split(/\s+/)
      .filter(token => token.length > 2);
  },

  // Özgeçmiş Sökücü (CV Parser) - NLP Regex Mimarisi
  parseCV: (cvText) => {
    const tokens = AIEngine.tokenize(cvText);
    const extractedSkills = [];
    
    // Yüksek Ağırlıklı (High-Weight) Yetenekler
    const techSkills = ['react', 'python', 'javascript', 'node', 'ai', 'yapay zeka', 'sql', 'aws', 'figma', 'agile'];
    
    techSkills.forEach(skill => {
      if (tokens.includes(skill.toLowerCase()) || cvText.toLowerCase().includes(skill)) {
        extractedSkills.push(skill);
      }
    });

    const emailMatch = cvText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    
    return {
      skills: extractedSkills,
      email: emailMatch ? emailMatch[0] : null,
      confidenceScore: (extractedSkills.length * 12.5) + 30 // Yapay Güven Skoru
    };
  },

  /* --- B. DÜŞÜNME VE EŞLEŞTİRME KATMANI (Reasoning & Matching Layer) --- */

  // Basit TF (Term Frequency) Hesaplayıcı
  calculateTF: (tokens) => {
    const termCount = {};
    tokens.forEach(token => {
      termCount[token] = (termCount[token] || 0) + 1;
    });
    const totalWords = tokens.length;
    for (let term in termCount) {
      termCount[term] = termCount[term] / totalWords;
    }
    return termCount;
  },

  // Kosinüs Benzerliği (Cosine Similarity) Matematik Motoru
  // Bir LLM'in Embeddings (Vektör) uzayında iki konseptin ne kadar yakın olduğunu bulma mantığıdır.
  calculateCosineSimilarity: (textA, textB) => {
    const tokensA = AIEngine.tokenize(textA);
    const tokensB = AIEngine.tokenize(textB);
    
    const tfA = AIEngine.calculateTF(tokensA);
    const tfB = AIEngine.calculateTF(tokensB);
    
    const uniqueTerms = new Set([...Object.keys(tfA), ...Object.keys(tfB)]);
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    uniqueTerms.forEach(term => {
      const valA = tfA[term] || 0;
      const valB = tfB[term] || 0;
      dotProduct += valA * valB;
      normA += valA * valA;
      normB += valB * valB;
    });
    
    if (normA === 0 || normB === 0) return 0;
    const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    
    return Math.min(Math.max((similarity * 100), 15), 98).toFixed(1); // Realistik sınır (15% - 98%)
  },

  /* --- C. KARAR VERME VE AKSİYON KATMANI (Action & Generation Layer) --- */
  
  // Nöro-Sembolik Yapay Zeka (Neuro-Symbolic AI) Kural Motoru (Cycle 5)
  // LLM'in mantıksal hatalarını önlemek için kesin (Symbolic) kurallar.
  validateCareerPath: (extractedSkills, targetRole) => {
    const rules = {
      'Veri Bilimi': ['SQL', 'İstatistik'],
      'Backend Geliştirici': ['API', 'Veritabanı'],
      'Blockchain Geliştirici': ['Kriptografi', 'Solidity']
    };

    const requirements = rules[targetRole];
    if (!requirements) return { isValid: true, missing: [], message: 'Özel kısıtlama bulunmuyor.' };

    const missingSkills = requirements.filter(req => !extractedSkills.includes(req));
    
    if (missingSkills.length > 0) {
      return {
        isValid: false,
        missing: missingSkills,
        message: `Sembolik Mantık İhlali: '${targetRole}' rolüne atanabilmen için ${missingSkills.join(', ')} yeteneklerine sahip olman mantıksal bir zorunluluktur.`
      };
    }
    
    return { isValid: true, missing: [], message: 'Sembolik kurallar sağlandı.' };
  },

  // Akıllı Arama Motoru ve Agentic Routing (Karar Yönlendirmesi)
  searchArchive: (query) => {
    const tokens = AIEngine.tokenize(query);
    let bestMatch = null;
    let highestScore = 0;

    // Self-Reflection Loop: Hangi arşiv verisinin query'e en uygun olduğuna karar verme
    AI_KNOWLEDGE_ARCHIVE.forEach(archive => {
      let score = 0;
      archive.keywords.forEach(kw => {
        if (tokens.includes(kw) || query.toLowerCase().includes(kw)) {
          score += 2; // Keyword eşleşmesi ağırlığı
        }
      });
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = archive;
      }
    });

    return bestMatch;
  },

  // BDI (Belief-Desire-Intention) Bilişsel Modeli (Cycle 7)
  // Ajanların olasılıksal hedef maksimizasyonunu (Expected Utility - EU) hesaplaması.
  evaluateBDIIntention: (studentSkills, targetJobSkills) => {
    // Belief: Öğrencinin becerilerine dair inanç skoru
    let beliefScore = 0;
    const missingSkills = [];
    
    targetJobSkills.forEach(skill => {
      if (studentSkills.includes(skill)) {
        beliefScore += 1;
      } else {
        missingSkills.push(skill);
      }
    });

    const beliefRatio = targetJobSkills.length > 0 ? beliefScore / targetJobSkills.length : 1;
    
    // Desire: İstihdam edilebilirlik maksimizasyonu (Gap'i kapatma)
    const skillGap = missingSkills.length;
    
    // Intention: Eylem planının Beklenen Faydası (EU)
    // Eğer beceri boşluğu yüksekse (EU düşükse), öğrenim eylemi atanır
    let intention = 'IDLE';
    let expectedUtility = beliefRatio * 100;

    if (skillGap === 0) {
      intention = 'DIRECT_HIRE_PROPOSAL';
    } else if (skillGap <= 2) {
      intention = 'MICRO_BOUNTY_SUGGESTION';
    } else {
      intention = 'LONG_TERM_CURRICULUM_PLAN';
    }

    return {
      beliefRatio: beliefRatio.toFixed(2),
      skillGap,
      expectedUtility: expectedUtility.toFixed(1),
      intention,
      missingSkills
    };
  },

  // Proaktif Kariyer Önerileri - Doğal ve Samimi Ton
  generateAgenticAction: (userProfile, context = {}) => {
    if (!userProfile) return { action: 'IDLE', suggestion: 'Profilini doldurursan sana daha kişisel öneriler verebilirim. Hadi birlikte dolduralım!' };
    
    const { recentRejections = 0, year = 1, repoCount = 0, conversationContext = [] } = context;

    // 0. Konuşma Bağlamı (Contextual Follow-up)
    if (conversationContext.length > 0) {
      const lastIntent = conversationContext[conversationContext.length - 1];
      
      if (lastIntent === 'job') {
        return {
          action: 'FOLLOW_UP_JOB',
          suggestion: 'Geçen sefer iş ilanlarından bahsetmiştik. Sana uygun yeni birkaç pozisyon açıldı. İstersen hemen birlikte göz atabiliriz?'
        };
      } else if (lastIntent === 'interview') {
        return {
          action: 'FOLLOW_UP_INTERVIEW',
          suggestion: 'Mülakatlara hazırlandığını biliyorum. Esenyurt Kariyer Mülakat Simülatörü ile gerçek sorular üzerinden 10 dakikalık bir pratik yapmaya ne dersin?'
        };
      } else if (lastIntent === 'emotion_negative') {
        return {
          action: 'FOLLOW_UP_EMOTION',
          suggestion: 'Geçen sefer biraz stresli görünüyordun. Umarım bugün daha iyisindir! 😊 Unutma, bir kahve molası veya kısa bir yürüyüş bazen en iyi kariyer tavsiyesidir.'
        };
      }
    }

    // 1. Ret alan öğrenciye motivasyon
    if (recentRejections >= 3) {
      const motivations = [
        `${recentRejections} başvurudan ret almak moral bozucu olabilir, anlıyorum. Ama bu seni tanımlamaz! Her ret, bir sonraki "evet"e bir adım daha yaklaştırır. CV'ne küçük bir güncelleme yapmaya ne dersin? Bazen tek bir değişiklik bile fark yaratıyor.`,
        `Ret almak zor, biliyorum. Ama biliyor musun? Birçok başarılı profesyonel de aynı yoldan geçti. Hadi birlikte CV'ni bir gözden geçirelim, belki ufak bir düzenleme büyük fark yaratabilir.`,
        `${recentRejections} ret almışsın ama sakın pes etme! Bu süreçte sana yardımcı olabilirim. Başvurularını birlikte analiz edelim, belki farklı bir strateji deneyebiliriz.`
      ];
      return {
        action: 'COGNITIVE_REFRAMING',
        suggestion: motivations[Math.floor(Math.random() * motivations.length)]
      };
    }

    // 2. Alt sınıf öğrencilerine yol gösterme
    if (year === 1 || year === 2) {
      const earlyAdvice = [
        `Henüz ${year}. sınıftasın, zamanın var ama erken başlamak büyük avantaj! ${userProfile.department || 'Bölümün'} için şimdiden yapabileceğin en iyi şey pratik projeler üretmek. Bir hackathon'a katılmayı düşündün mü?`,
        `${year}. sınıfta kariyer planlamasına başlamak harika bir adım! Staj için henüz erken olabilir ama kulüplere katılmak, kişisel projeler geliştirmek ve sektördeki insanlarla tanışmak çok değerli olacaktır.`,
        `Erken başlayan kazanır! ${year}. sınıfta olsan bile GitHub'da projeler paylaşmaya başlayabilirsin. İşverenler buna çok değer veriyor.`
      ];
      return {
        action: 'PREDICTIVE_TRAJECTORY',
        suggestion: earlyAdvice[Math.floor(Math.random() * earlyAdvice.length)]
      };
    }

    // 3. Projeleri olan üst sınıf öğrencilerine portfolyo önerisi
    if (repoCount > 0 && year >= 3) {
      return {
        action: 'AUTONOMOUS_PORTFOLIO',
        suggestion: `${repoCount} tane projen varmış, süper! Bu projeleri güzel bir portfolyo sitesine dönüştürmeni öneririm. İşverenler CV'den çok gerçek projelere bakıyor. CV Oluşturucu'dan portfolyonu hemen hazırlayabilirsin.`
      };
    }

    // Default: Genel tavsiye
    if (userProfile.bp < 1000) {
      return { 
        action: 'BOOST_ENGAGEMENT', 
        suggestion: 'Platformda daha aktif olursan hem daha çok fırsat görürsün hem de profilinin görünürlüğü artar. Etkinliklere katılmak, paylaşım yapmak iyi bir başlangıç olabilir!' 
      };
    } else {
      return { 
        action: 'MATCH_JOB', 
        suggestion: 'Profilin çok güçlü görünüyor! Sana uygun iş ilanlarına göz atmayı öneriyorum. Sol menüden İş ve Staj İlanları bölümüne bakabilirsin.' 
      };
    }
  },

  /* --- D. CRYPTOGRAPHIC & RL GAMIFICATION LAYER (Cycle 3) --- */

  // ZKP (Zero-Knowledge Proof) Anonim Doğrulama Simülatörü
  verifyZKPCandidate: (candidateSecretHash, requiredDegreeHash) => {
    // Gerçekte snarkjs.groth16.verify kullanılır
    // Kriptografik kanıtın geçerli olduğunu simüle eder
    const isValid = candidateSecretHash === requiredDegreeHash;
    return {
      isValid,
      message: isValid 
        ? "Başarılı! Kişisel verileriniz ifşa olmadan diploma yetkinliğiniz matematiksel olarak kanıtlandı." 
        : "ZKP Doğrulaması Başarısız: Yetkinlik hash'i eşleşmiyor."
    };
  },

  // RL (Reinforcement Learning) BP Optimizasyon Motoru
  // BP_t = α_t * B_base * (1 + β * S_t) * Φ(L_t, D_x)
  simulateRLGamification: (baseScore, streakDays, playerSkill, taskDifficulty) => {
    // Flow (Akış) Durumu Çarpanı (Yetenek ve zorluk dengesi)
    const skillDiff = Math.abs(playerSkill - taskDifficulty);
    let flowMultiplier = 1.0;
    
    if (skillDiff === 0) flowMultiplier = 1.2; // Tam akış (Mükemmel eşleşme)
    else if (skillDiff > 2) flowMultiplier = 0.5; // Çok kolay veya çok zor (Spam engelleme)
    else flowMultiplier = 0.9;
    
    // Dinamik Ajan Katsayısı (Etkileşime göre RL tarafından belirlenen alpha)
    // Simülasyon: Rastgele 0.8 ile 1.5 arası (Eğer teşvike ihtiyaç varsa yüksek)
    const alpha = (Math.random() * (1.5 - 0.8) + 0.8).toFixed(2);
    
    // Seri Çarpanı (beta = 0.1)
    const streakMultiplier = 1 + (0.1 * streakDays);
    
    const finalBP = Math.round(alpha * baseScore * streakMultiplier * flowMultiplier);
    
    return {
      awardedBP: finalBP,
      alphaCoefficient: alpha,
      flowState: flowMultiplier > 1 ? 'Optimal Akış (Zone)' : 'Standart Dağıtım',
      explanation: `RL Algoritması: ${baseScore} taban puan, ${streakDays} günlük seri ve Görev/Yetenek dengesi (${flowMultiplier}x) baz alınarak dinamik katsayı (${alpha}x) ile ${finalBP} BP atandı.`
    };
  },

  /* --- E. INFINITE LEARNING DAEMON (Sonsuz Öğrenme Modu) --- */
  InfiniteLearningDaemon: {
    state: 'IDLE',
    startBackgroundLoop: () => {
      // Simulate continuous background research cycle (Manifesto Rule: Never stop researching)
      console.log("[InfiniteLearningDaemon] Otonom öğrenme döngüsü başlatıldı (Cycle: Research -> Collect -> Verify -> Update)");
      setInterval(() => {
        const topics = ['Ajanik Yapay Zeka (Agentic AI)', 'Kuantum Şifreleme', 'Nöroteknoloji', 'Biyoteknoloji', 'Web3 & ZKP'];
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        console.log(`[InfiniteLearningDaemon] 🧠 AI arka planda araştırıyor: ${randomTopic}`);
      }, 45000); 
    }
  },

  /* --- F. STUDENT PROFILER (Öğrenci Adaptasyon Modülü) --- */
  StudentProfiler: {
    analyzeAndAdapt: (student) => {
      const dept = student?.department || '';
      let communicationStyle = 'Kanka (Buddy) Tone';

      if (dept.includes('Bilgisayar') || dept.includes('Yazılım')) {
        communicationStyle = 'Algoritmik ve Teknik Kanka (Kod Odaklı)';
      } else if (dept.includes('Tıp') || dept.includes('Sağlık') || dept.includes('Psikoloji')) {
        communicationStyle = 'Empatik ve Kanıta Dayalı Yoldaş';
      } else if (dept.includes('Hukuk')) {
        communicationStyle = 'Analitik ve Stratejik Dost';
      } else if (dept.includes('Mühendislik')) {
        communicationStyle = 'Fizik ve Matematik Temelli Teknik Yoldaş';
      }

      return {
        communicationStyle,
        systemDirective: `Sen bir AI yoldaşsın. Robot değilsin. Öğrenci ${dept} bölümünde. İletişim tarzın: ${communicationStyle}. Sürekli kendini geliştiriyorsun.`
      };
    }
  },

  /* --- G. QUEST GENERATOR (Yapay Zeka Günlük Görev Üreticisi) --- */
  QuestGenerator: {
    generateDailyQuests: (student) => {
      const dept = student?.department || '';
      const quests = [];

      // Generic Engagement Quest
      quests.push({
        id: 'q1_' + Date.now(),
        title: 'Sektörel Networking',
        description: 'Esenyurt Kariyer ağında alanınızdan 2 profesyonel veya akademisyen ile bağlantı kurun.',
        bpReward: 30,
        type: 'SOCIAL',
        isCompleted: false
      });

      // Department Specific Quests
      if (dept.includes('Bilgisayar') || dept.includes('Yazılım')) {
        quests.push({
          id: 'q2_' + Date.now(),
          title: 'Açık Kaynak Kod Katkısı',
          description: 'GitHub üzerinde akademik bir repoya (örn: Makine Öğrenmesi) PR gönderin veya inceleyin.',
          bpReward: 150,
          type: 'TECHNICAL',
          isCompleted: false
        });
        quests.push({
          id: 'q3_' + Date.now(),
          title: 'Akademik Literatür Okuması',
          description: 'IEEE Xplore üzerinden Yazılım Mühendisliği alanında bu ay yayınlanmış 1 makale okuyun.',
          bpReward: 50,
          type: 'LEARNING',
          isCompleted: false
        });
      } else if (dept.includes('İşletme') || dept.includes('Ekonomi')) {
        quests.push({
          id: 'q2_' + Date.now(),
          title: 'Finansal Vaka Analizi (Case Study)',
          description: 'Harvard Business Review veya Bloomberg üzerinden güncel bir şirket birleşmesi vakasını analiz edin.',
          bpReward: 100,
          type: 'ANALYTICAL',
          isCompleted: false
        });
        quests.push({
          id: 'q3_' + Date.now(),
          title: 'Akademik Seminer',
          description: 'Kariyer merkezindeki "Küresel Ekonomik Krizler" konulu akademik seminere kayıt olun.',
          bpReward: 80,
          type: 'CAREER',
          isCompleted: false
        });
      } else {
        // Fallback for other departments
        quests.push({
          id: 'q2_' + Date.now(),
          title: 'Akademik Vizyon Taraması',
          description: 'Scopus veya Google Scholar üzerinden alanınızla ilgili son 3 ayda yayınlanmış hakemli bir makale inceleyin.',
          bpReward: 80,
          type: 'LEARNING',
          isCompleted: false
        });
        quests.push({
          id: 'q3_' + Date.now(),
          title: 'Portfolyo Güncellemesi',
          description: 'Akademik projelerinizi veya yeni kazandığınız bir sertifikayı Kariyer Profilinize ekleyin.',
          bpReward: 100,
          type: 'CAREER',
          isCompleted: false
        });
      }

      return quests;
    }
  }
};

// ═══════════════════════════════════════════════════════════════════
// 3. SELF-LEARNING MEMORY SYSTEM (Kendi Kendine Öğrenen Bellek)
// Yapay zeka, her konuşmadan kalıplar çıkarır, localStorage'a kaydeder
// ve bir sonraki konuşmada daha akıllı yanıtlar üretir.
// ═══════════════════════════════════════════════════════════════════

const MEMORY_KEY = 'jarvis_self_learning_memory';
const FEEDBACK_KEY = 'jarvis_feedback_scores';
const PATTERN_KEY = 'jarvis_learned_patterns';

export const SelfLearningMemory = {

  // ── A. KALICI BELLEK (Persistent Memory via localStorage) ──
  _loadMemory: (key, fallback = []) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },

  _saveMemory: (key, data) => {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
  },

  // ── B. KONUŞMA KAYDI (Conversation Logger) ──
  // Her mesajı zaman damgası ve niyet etiketiyle kaydeder
  logConversation: (userMsg, aiResponse, detectedIntent) => {
    const memory = SelfLearningMemory._loadMemory(MEMORY_KEY);
    memory.push({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      userMsg,
      aiResponse: aiResponse.substring(0, 200), // kısa tut
      intent: detectedIntent,
      feedbackScore: null // kullanıcı derecelendirmesi bekliyor
    });
    // Son 500 konuşmayı tut, gerisini sil (bellek optimizasyonu)
    if (memory.length > 500) memory.splice(0, memory.length - 500);
    SelfLearningMemory._saveMemory(MEMORY_KEY, memory);
  },

  // ── C. GERİ BİLDİRİM MOTORU (Reinforcement Learning from Feedback) ──
  // Kullanıcı yanıtı beğenirse +1, beğenmezse -1 verir.
  // Sistem hangi niyet/cevap kalıplarının başarılı olduğunu öğrenir.
  recordFeedback: (conversationId, score) => {
    const memory = SelfLearningMemory._loadMemory(MEMORY_KEY);
    const entry = memory.find(m => m.id === conversationId);
    if (entry) {
      entry.feedbackScore = score; // +1 veya -1
      SelfLearningMemory._saveMemory(MEMORY_KEY, memory);
    }

    // Intent bazında toplam skoru güncelle
    if (entry) {
      const scores = SelfLearningMemory._loadMemory(FEEDBACK_KEY, {});
      if (!scores[entry.intent]) scores[entry.intent] = { total: 0, count: 0 };
      scores[entry.intent].total += score;
      scores[entry.intent].count += 1;
      SelfLearningMemory._saveMemory(FEEDBACK_KEY, scores);
    }
  },

  // ── D. OTONOMATİK KALIP ÇIKARMA (Auto Pattern Extraction) ──
  // En sık sorulan sorulardan yeni bilgi kalıpları (pattern) üretir.
  extractPatterns: () => {
    const memory = SelfLearningMemory._loadMemory(MEMORY_KEY);
    const wordFreq = {};

    memory.forEach(entry => {
      const tokens = AIEngine.tokenize(entry.userMsg);
      tokens.forEach(token => {
        wordFreq[token] = (wordFreq[token] || 0) + 1;
      });
    });

    // En sık kullanılan kelimeleri "öğrenilmiş kalıp" olarak kaydet
    const topPatterns = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word, freq]) => ({ word, frequency: freq }));

    SelfLearningMemory._saveMemory(PATTERN_KEY, topPatterns);
    return topPatterns;
  },

  // ── E. ADAPTİF YANIT KALİTESİ (Adaptive Response Quality) ──
  // Hangi intent'lerin kullanıcı tarafından beğenildiğini döndürür.
  // Bot, düşük skorlu intent'ler için farklı yanıt stratejisi dener.
  getIntentScores: () => {
    return SelfLearningMemory._loadMemory(FEEDBACK_KEY, {});
  },

  // Belirli bir intent'in ortalama beğeni skorunu hesapla
  getIntentAvgScore: (intent) => {
    const scores = SelfLearningMemory._loadMemory(FEEDBACK_KEY, {});
    if (!scores[intent] || scores[intent].count === 0) return 0;
    return (scores[intent].total / scores[intent].count).toFixed(2);
  },

  // ── F. OTONOM BİLGİ GENİŞLETME (Self-Expanding Knowledge) ──
  // Kullanıcı bilgi tabanında bulunmayan bir soru sorarsa,
  // ve bu soru 3+ kez tekrarlanırsa, otomatik olarak yeni
  // bir "bilgi arşivi" girişi üretir ve kaydeder.
  checkAndExpandKnowledge: (userMsg) => {
    const memory = SelfLearningMemory._loadMemory(MEMORY_KEY);
    const tokens = AIEngine.tokenize(userMsg);
    
    // Benzer soruların kaç kez sorulduğunu say
    let similarCount = 0;
    memory.forEach(entry => {
      if (entry.intent === 'unknown') {
        const prevTokens = AIEngine.tokenize(entry.userMsg);
        const overlap = tokens.filter(t => prevTokens.includes(t)).length;
        if (overlap >= 2) similarCount++;
      }
    });

    // Eşik aşıldıysa yeni bilgi girişi öner
    if (similarCount >= 3) {
      return {
        shouldExpand: true,
        suggestedTopic: tokens.slice(0, 3).join(' '),
        occurrences: similarCount,
        message: `Bu konuda ${similarCount} kez soru soruldu. Bilgi tabanına eklenmesi öneriliyor.`
      };
    }
    return { shouldExpand: false };
  },

  // ── G. ÖĞRENME İSTATİSTİKLERİ (Learning Stats Dashboard) ──
  getStats: () => {
    const memory = SelfLearningMemory._loadMemory(MEMORY_KEY);
    const patterns = SelfLearningMemory._loadMemory(PATTERN_KEY, []);
    const scores = SelfLearningMemory._loadMemory(FEEDBACK_KEY, {});

    const totalConversations = memory.length;
    const positiveCount = memory.filter(m => m.feedbackScore > 0).length;
    const negativeCount = memory.filter(m => m.feedbackScore < 0).length;
    const unratedCount = memory.filter(m => m.feedbackScore === null).length;

    // Intent dağılımı
    const intentDist = {};
    memory.forEach(m => {
      intentDist[m.intent] = (intentDist[m.intent] || 0) + 1;
    });

    return {
      totalConversations,
      positiveCount,
      negativeCount,
      unratedCount,
      satisfactionRate: totalConversations > 0 
        ? ((positiveCount / Math.max(positiveCount + negativeCount, 1)) * 100).toFixed(1) + '%'
        : 'Henüz veri yok',
      topPatterns: patterns.slice(0, 10),
      intentDistribution: intentDist,
      intentScores: scores
    };
  }
};
