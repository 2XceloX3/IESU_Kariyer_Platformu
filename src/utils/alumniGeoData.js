// Geolocation, Geocoding and Mapping utilities for IESU Global Alumni Ecosystem

export const SUPPORTED_COUNTRIES = [
  // Primary Diaspora Destinations
  { code: 'TR', name: 'Türkiye', flag: '🇹🇷', topoNames: ['Turkey'], center: [35.2433, 38.9637], zoom: 4.2, region: 'turkey' },
  { code: 'DE', name: 'Almanya', flag: '🇩🇪', topoNames: ['Germany'], center: [10.4515, 51.1657], zoom: 4.2, region: 'europe' },
  { code: 'US', name: 'Amerika Birleşik Devletleri', flag: '🇺🇸', topoNames: ['United States of America', 'United States', 'USA'], center: [-98.5795, 39.8283], zoom: 3, region: 'north_america' },
  { code: 'GB', name: 'Birleşik Krallık', flag: '🇬🇧', topoNames: ['United Kingdom'], center: [-3.4360, 55.3781], zoom: 4.5, region: 'europe' },
  { code: 'NL', name: 'Hollanda', flag: '🇳🇱', topoNames: ['Netherlands'], center: [5.2913, 52.1326], zoom: 5.2, region: 'europe' },
  { code: 'AE', name: 'Birleşik Arap Emirlikleri', flag: '🇦🇪', topoNames: ['United Arab Emirates', 'UAE'], center: [54.3773, 24.4539], zoom: 4.8, region: 'middle_east' },
  { code: 'JP', name: 'Japonya', flag: '🇯🇵', topoNames: ['Japan'], center: [138.2529, 36.2048], zoom: 4, region: 'asia' },
  { code: 'CH', name: 'İsviçre', flag: '🇨🇭', topoNames: ['Switzerland'], center: [8.2275, 46.8182], zoom: 5.2, region: 'europe' },
  { code: 'CA', name: 'Kanada', flag: '🇨🇦', topoNames: ['Canada'], center: [-106.3468, 56.1304], zoom: 3, region: 'north_america' },
  { code: 'FR', name: 'Fransa', flag: '🇫🇷', topoNames: ['France'], center: [2.2137, 46.2276], zoom: 4.5, region: 'europe' },
  { code: 'AU', name: 'Avustralya', flag: '🇦🇺', topoNames: ['Australia'], center: [133.7751, -25.2744], zoom: 3, region: 'asia' },
  { code: 'QA', name: 'Katar', flag: '🇶🇦', topoNames: ['Qatar'], center: [51.1839, 25.3548], zoom: 5.8, region: 'middle_east' },
  { code: 'SG', name: 'Singapur', flag: '🇸🇬', topoNames: ['Singapore'], center: [103.8198, 1.3521], zoom: 6, region: 'asia' },
  { code: 'SE', name: 'İsveç', flag: '🇸🇪', topoNames: ['Sweden'], center: [18.6435, 60.1282], zoom: 3.8, region: 'europe' },
  { code: 'BE', name: 'Belçika', flag: '🇧🇪', topoNames: ['Belgium'], center: [4.4699, 50.5039], zoom: 5.5, region: 'europe' },
  { code: 'IE', name: 'İrlanda', flag: '🇮🇪', topoNames: ['Ireland'], center: [-8.2439, 53.4129], zoom: 5, region: 'europe' },
  { code: 'PL', name: 'Polonya', flag: '🇵🇱', topoNames: ['Poland'], center: [19.1451, 51.9194], zoom: 4.5, region: 'europe' },
  { code: 'IT', name: 'İtalya', flag: '🇮🇹', topoNames: ['Italy'], center: [12.5674, 41.8719], zoom: 4.2, region: 'europe' },
  { code: 'ES', name: 'İspanya', flag: '🇪🇸', topoNames: ['Spain'], center: [-3.7492, 40.4637], zoom: 4.2, region: 'europe' },
  { code: 'AZ', name: 'Azerbaycan', flag: '🇦🇿', topoNames: ['Azerbaijan'], center: [47.5769, 40.1431], zoom: 4.5, region: 'middle_east' },

  // Europe & Mediterranean
  { code: 'AT', name: 'Avusturya', flag: '🇦🇹', topoNames: ['Austria'], center: [14.5501, 47.5162], zoom: 5, region: 'europe' },
  { code: 'NO', name: 'Norveç', flag: '🇳🇴', topoNames: ['Norway'], center: [8.4689, 60.4720], zoom: 3.8, region: 'europe' },
  { code: 'DK', name: 'Danimarka', flag: '🇩🇰', topoNames: ['Denmark'], center: [9.5018, 56.2639], zoom: 5, region: 'europe' },
  { code: 'FI', name: 'Finlandiya', flag: '🇫🇮', topoNames: ['Finland'], center: [25.7482, 61.9241], zoom: 3.8, region: 'europe' },
  { code: 'PT', name: 'Portekiz', flag: '🇵🇹', topoNames: ['Portugal'], center: [-8.2245, 39.3999], zoom: 4.8, region: 'europe' },
  { code: 'GR', name: 'Yunanistan', flag: '🇬🇷', topoNames: ['Greece'], center: [21.8243, 39.0742], zoom: 4.8, region: 'europe' },
  { code: 'CZ', name: 'Çekya', flag: '🇨🇿', topoNames: ['Czechia', 'Czech Rep.'], center: [15.4730, 49.8175], zoom: 5, region: 'europe' },
  { code: 'HU', name: 'Macaristan', flag: '🇭🇺', topoNames: ['Hungary'], center: [19.5033, 47.1625], zoom: 5, region: 'europe' },
  { code: 'RO', name: 'Romanya', flag: '🇷🇴', topoNames: ['Romania'], center: [24.9668, 45.9432], zoom: 4.5, region: 'europe' },
  { code: 'BG', name: 'Bulgaristan', flag: '🇧🇬', topoNames: ['Bulgaria'], center: [25.4858, 42.7339], zoom: 5, region: 'europe' },
  { code: 'HR', name: 'Hırvatistan', flag: '🇭🇷', topoNames: ['Croatia'], center: [15.2000, 45.1000], zoom: 5, region: 'europe' },
  { code: 'RS', name: 'Sırbistan', flag: '🇷🇸', topoNames: ['Serbia'], center: [21.0059, 44.0165], zoom: 5, region: 'europe' },
  { code: 'BA', name: 'Bosna-Hersek', flag: '🇧🇦', topoNames: ['Bosnia and Herz.', 'Bosnia'], center: [17.6791, 43.9159], zoom: 5.2, region: 'europe' },
  { code: 'MK', name: 'Kuzey Makedonya', flag: '🇲🇰', topoNames: ['North Macedonia', 'Macedonia'], center: [21.7453, 41.6086], zoom: 5.5, region: 'europe' },
  { code: 'AL', name: 'Arnavutluk', flag: '🇦🇱', topoNames: ['Albania'], center: [20.1683, 41.1533], zoom: 5.5, region: 'europe' },
  { code: 'ME', name: 'Karadağ', flag: '🇲🇪', topoNames: ['Montenegro'], center: [19.3744, 42.7087], zoom: 6, region: 'europe' },
  { code: 'XK', name: 'Kosova', flag: '🇽🇰', topoNames: ['Kosovo'], center: [20.9030, 42.6026], zoom: 6, region: 'europe' },
  { code: 'SI', name: 'Slovenya', flag: '🇸🇮', topoNames: ['Slovenia'], center: [14.9955, 46.1512], zoom: 5.5, region: 'europe' },
  { code: 'SK', name: 'Slovakya', flag: '🇸🇰', topoNames: ['Slovakia'], center: [19.6990, 48.6690], zoom: 5.2, region: 'europe' },
  { code: 'EE', name: 'Estonya', flag: '🇪🇪', topoNames: ['Estonia'], center: [25.0136, 58.5953], zoom: 5.5, region: 'europe' },
  { code: 'LV', name: 'Letonya', flag: '🇱🇻', topoNames: ['Latvia'], center: [24.6032, 56.8796], zoom: 5.5, region: 'europe' },
  { code: 'LT', name: 'Litvanya', flag: '🇱🇹', topoNames: ['Lithuania'], center: [23.8813, 55.1694], zoom: 5.5, region: 'europe' },
  { code: 'UA', name: 'Ukrayna', flag: '🇺🇦', topoNames: ['Ukraine'], center: [31.1656, 48.3794], zoom: 4, region: 'europe' },
  { code: 'RU', name: 'Rusya', flag: '🇷🇺', topoNames: ['Russia'], center: [105.3188, 61.5240], zoom: 2.2, region: 'europe' },
  { code: 'BY', name: 'Belarus', flag: '🇧🇾', topoNames: ['Belarus'], center: [27.9534, 53.7098], zoom: 4.8, region: 'europe' },
  { code: 'MD', name: 'Moldova', flag: '🇲🇩', topoNames: ['Moldova'], center: [28.3699, 47.4116], zoom: 5.5, region: 'europe' },
  { code: 'IS', name: 'İzlanda', flag: '🇮🇸', topoNames: ['Iceland'], center: [-19.0208, 64.9631], zoom: 4.5, region: 'europe' },
  { code: 'LU', name: 'Lüksemburg', flag: '🇱🇺', topoNames: ['Luxembourg'], center: [6.1296, 49.8153], zoom: 6.5, region: 'europe' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹', topoNames: ['Malta'], center: [14.3754, 35.9375], zoom: 7, region: 'europe' },
  { code: 'CY', name: 'Kıbrıs', flag: '🇨🇾', topoNames: ['Cyprus'], center: [33.4299, 35.1264], zoom: 6, region: 'europe' },

  // Caucasus & Central Asia
  { code: 'GE', name: 'Gürcistan', flag: '🇬🇪', topoNames: ['Georgia'], center: [43.3569, 42.3154], zoom: 5, region: 'middle_east' },
  { code: 'AM', name: 'Ermenistan', flag: '🇦🇲', topoNames: ['Armenia'], center: [45.0382, 40.0691], zoom: 5.5, region: 'middle_east' },
  { code: 'KZ', name: 'Kazakistan', flag: '🇰🇿', topoNames: ['Kazakhstan'], center: [66.9237, 48.0196], zoom: 3.2, region: 'asia' },
  { code: 'UZ', name: 'Özbekistan', flag: '🇺🇿', topoNames: ['Uzbekistan'], center: [64.5853, 41.3775], zoom: 4.2, region: 'asia' },
  { code: 'TM', name: 'Türkmenistan', flag: '🇹🇲', topoNames: ['Turkmenistan'], center: [59.5563, 38.9697], zoom: 4.5, region: 'asia' },
  { code: 'KG', name: 'Kırgızistan', flag: '🇰🇬', topoNames: ['Kyrgyzstan'], center: [74.7661, 41.2044], zoom: 4.8, region: 'asia' },
  { code: 'TJ', name: 'Tacikistan', flag: '🇹🇯', topoNames: ['Tajikistan'], center: [71.2761, 38.8610], zoom: 5, region: 'asia' },

  // Middle East & North Africa
  { code: 'SA', name: 'Suudi Arabistan', flag: '🇸🇦', topoNames: ['Saudi Arabia'], center: [45.0792, 23.8859], zoom: 3.8, region: 'middle_east' },
  { code: 'KW', name: 'Kuveyt', flag: '🇰🇼', topoNames: ['Kuwait'], center: [47.4818, 29.3117], zoom: 6, region: 'middle_east' },
  { code: 'BH', name: 'Bahreyn', flag: '🇧🇭', topoNames: ['Bahrain'], center: [50.5577, 26.0667], zoom: 7, region: 'middle_east' },
  { code: 'OM', name: 'Umman', flag: '🇴🇲', topoNames: ['Oman'], center: [55.9233, 21.4735], zoom: 4.5, region: 'middle_east' },
  { code: 'IL', name: 'İsrail', flag: '🇮🇱', topoNames: ['Israel'], center: [34.8516, 31.0461], zoom: 5.5, region: 'middle_east' },
  { code: 'JO', name: 'Ürdün', flag: '🇯🇴', topoNames: ['Jordan'], center: [36.2384, 30.5852], zoom: 5.5, region: 'middle_east' },
  { code: 'LB', name: 'Lübnan', flag: '🇱🇧', topoNames: ['Lebanon'], center: [35.8623, 33.8547], zoom: 6.5, region: 'middle_east' },
  { code: 'IQ', name: 'Irak', flag: '🇮🇶', topoNames: ['Iraq'], center: [43.6793, 33.2232], zoom: 4.5, region: 'middle_east' },
  { code: 'IR', name: 'İran', flag: '🇮🇷', topoNames: ['Iran'], center: [53.6880, 32.4279], zoom: 3.8, region: 'middle_east' },
  { code: 'EG', name: 'Mısır', flag: '🇪🇬', topoNames: ['Egypt'], center: [30.8025, 26.8206], zoom: 4.2, region: 'middle_east' },
  { code: 'MA', name: 'Fas', flag: '🇲🇦', topoNames: ['Morocco'], center: [-7.0926, 31.7917], zoom: 4.5, region: 'middle_east' },
  { code: 'TN', name: 'Tunus', flag: '🇹🇳', topoNames: ['Tunisia'], center: [9.5375, 33.8869], zoom: 5, region: 'middle_east' },
  { code: 'DZ', name: 'Cezayir', flag: '🇩🇿', topoNames: ['Algeria'], center: [1.6596, 28.0339], zoom: 3.5, region: 'middle_east' },
  { code: 'LY', name: 'Libya', flag: '🇱🇾', topoNames: ['Libya'], center: [17.2283, 26.3351], zoom: 3.8, region: 'middle_east' },

  // Asia & Pacific
  { code: 'KR', name: 'Güney Kore', flag: '🇰🇷', topoNames: ['South Korea', 'Korea, Republic of', 'Korea'], center: [127.7669, 35.9078], zoom: 5, region: 'asia' },
  { code: 'CN', name: 'Çin', flag: '🇨🇳', topoNames: ['China'], center: [104.1954, 35.8617], zoom: 3, region: 'asia' },
  { code: 'IN', name: 'Hindistan', flag: '🇮🇳', topoNames: ['India'], center: [78.9629, 20.5937], zoom: 3.5, region: 'asia' },
  { code: 'MY', name: 'Malezya', flag: '🇲🇾', topoNames: ['Malaysia'], center: [101.9758, 4.2105], zoom: 4.5, region: 'asia' },
  { code: 'ID', name: 'Endonezya', flag: '🇮🇩', topoNames: ['Indonesia'], center: [113.9213, -0.7893], zoom: 3.5, region: 'asia' },
  { code: 'TH', name: 'Tayland', flag: '🇹🇭', topoNames: ['Thailand'], center: [100.9925, 15.8700], zoom: 4.5, region: 'asia' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', topoNames: ['Vietnam'], center: [108.2772, 14.0583], zoom: 4.2, region: 'asia' },
  { code: 'PH', name: 'Filipinler', flag: '🇵🇭', topoNames: ['Philippines'], center: [121.7740, 12.8797], zoom: 4.2, region: 'asia' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', topoNames: ['Pakistan'], center: [69.3451, 30.3753], zoom: 4, region: 'asia' },
  { code: 'BD', name: 'Bangladeş', flag: '🇧🇩', topoNames: ['Bangladesh'], center: [90.3563, 23.6850], zoom: 5, region: 'asia' },
  { code: 'NZ', name: 'Yeni Zelanda', flag: '🇳🇿', topoNames: ['New Zealand'], center: [174.8860, -40.9006], zoom: 4, region: 'asia' },
  { code: 'TW', name: 'Tayvan', flag: '🇹🇼', topoNames: ['Taiwan'], center: [120.9605, 23.6978], zoom: 5.8, region: 'asia' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', topoNames: ['Sri Lanka'], center: [80.7718, 7.8731], zoom: 5.5, region: 'asia' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵', topoNames: ['Nepal'], center: [84.1240, 28.3949], zoom: 5, region: 'asia' },
  { code: 'MN', name: 'Moğolistan', flag: '🇲🇳', topoNames: ['Mongolia'], center: [103.8467, 46.8625], zoom: 3.5, region: 'asia' },

  // Americas
  { code: 'MX', name: 'Meksika', flag: '🇲🇽', topoNames: ['Mexico'], center: [-102.5528, 23.6345], zoom: 3.5, region: 'north_america' },
  { code: 'BR', name: 'Brezilya', flag: '🇧🇷', topoNames: ['Brazil'], center: [-51.9253, -14.2350], zoom: 3, region: 'north_america' },
  { code: 'AR', name: 'Arjantin', flag: '🇦🇷', topoNames: ['Argentina'], center: [-63.6167, -38.4161], zoom: 3.2, region: 'north_america' },
  { code: 'CL', name: 'Şili', flag: '🇨🇱', topoNames: ['Chile'], center: [-71.5430, -35.6751], zoom: 3.2, region: 'north_america' },
  { code: 'CO', name: 'Kolombiya', flag: '🇨🇴', topoNames: ['Colombia'], center: [-74.2973, 4.5709], zoom: 4, region: 'north_america' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', topoNames: ['Peru'], center: [-75.0152, -9.1900], zoom: 4, region: 'north_america' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾', topoNames: ['Uruguay'], center: [-55.7658, -32.5228], zoom: 5, region: 'north_america' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾', topoNames: ['Paraguay'], center: [-58.4438, -23.4425], zoom: 4.8, region: 'north_america' },
  { code: 'EC', name: 'Ekvador', flag: '🇪🇨', topoNames: ['Ecuador'], center: [-78.1834, -1.8312], zoom: 5, region: 'north_america' },
  { code: 'BO', name: 'Bolivya', flag: '🇧🇴', topoNames: ['Bolivia'], center: [-63.5887, -16.2902], zoom: 4.5, region: 'north_america' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', topoNames: ['Venezuela'], center: [-66.5897, 6.4238], zoom: 4.2, region: 'north_america' },
  { code: 'CR', name: 'Kosta Rika', flag: '🇨🇷', topoNames: ['Costa Rica'], center: [-83.7534, 9.7489], zoom: 5.8, region: 'north_america' },
  { code: 'PA', name: 'Panama', flag: '🇵🇦', topoNames: ['Panama'], center: [-80.7821, 8.5379], zoom: 5.8, region: 'north_america' },

  // Africa
  { code: 'ZA', name: 'Güney Afrika', flag: '🇿🇦', topoNames: ['South Africa'], center: [22.9375, -30.5595], zoom: 3.8, region: 'middle_east' },
  { code: 'NG', name: 'Nijerya', flag: '🇳🇬', topoNames: ['Nigeria'], center: [8.6753, 9.0820], zoom: 4.5, region: 'middle_east' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', topoNames: ['Kenya'], center: [37.9062, -0.0236], zoom: 5, region: 'middle_east' },
  { code: 'GH', name: 'Gana', flag: '🇬🇭', topoNames: ['Ghana'], center: [-1.0232, 7.9465], zoom: 5, region: 'middle_east' },
  { code: 'ET', name: 'Etiyopya', flag: '🇪🇹', topoNames: ['Ethiopia'], center: [40.4897, 9.1450], zoom: 4.5, region: 'middle_east' },
  { code: 'RW', name: 'Ruanda', flag: '🇷🇼', topoNames: ['Rwanda'], center: [29.8739, -1.9403], zoom: 6.5, region: 'middle_east' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', topoNames: ['Senegal'], center: [-14.4524, 14.4974], zoom: 5, region: 'middle_east' },
  { code: 'TZ', name: 'Tanzanya', flag: '🇹🇿', topoNames: ['Tanzania'], center: [34.8888, -6.3690], zoom: 4.5, region: 'middle_east' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', topoNames: ['Uganda'], center: [32.2903, 1.3733], zoom: 5.5, region: 'middle_east' }
];

export const CITY_COORDINATES = {
  // -------------------------------------------------------------
  // ALL 81 PROVINCES OF TÜRKİYE & PROMINENT DISTRICTS
  // -------------------------------------------------------------
  'adana': { coords: [35.3382, 36.9914], country: 'Türkiye', flag: '🇹🇷', city: 'Adana', specialty: 'Sanayi, Enerji & Tarım', tier: 1 },
  'adiyaman': { coords: [38.2763, 37.7636], country: 'Türkiye', flag: '🇹🇷', city: 'Adıyaman', specialty: 'Tarih, Kültür & Turizm' },
  'afyon': { coords: [30.5400, 38.7569], country: 'Türkiye', flag: '🇹🇷', city: 'Afyonkarahisar', specialty: 'Termal & Gıda' },
  'afyonkarahisar': { coords: [30.5400, 38.7569], country: 'Türkiye', flag: '🇹🇷', city: 'Afyonkarahisar', specialty: 'Termal & Gıda' },
  'agri': { coords: [43.0514, 39.7217], country: 'Türkiye', flag: '🇹🇷', city: 'Ağrı', specialty: 'Doğa & Lojistik' },
  'amasya': { coords: [35.8373, 40.6534], country: 'Türkiye', flag: '🇹🇷', city: 'Amasya', specialty: 'Kültür & Tarım' },
  'ankara': { coords: [32.8597, 39.9334], country: 'Türkiye', flag: '🇹🇷', city: 'Ankara', specialty: 'Savunma Sanayii, Kamu & Akademi', tier: 1 },
  'cankaya': { coords: [32.8540, 39.9000], country: 'Türkiye', flag: '🇹🇷', city: 'Ankara (Çankaya)', specialty: 'Diplomasi & Teknokent' },
  'yenimahalle': { coords: [32.8125, 39.9711], country: 'Türkiye', flag: '🇹🇷', city: 'Ankara (Yenimahalle)', specialty: 'OSTİM & Sanayi' },
  'antalya': { coords: [30.7133, 36.8969], country: 'Türkiye', flag: '🇹🇷', city: 'Antalya', specialty: 'Turizm, Bilişim & Havacılık', tier: 1 },
  'alanya': { coords: [32.0000, 36.5444], country: 'Türkiye', flag: '🇹🇷', city: 'Antalya (Alanya)', specialty: 'Uluslararası Turizm & Ticaret' },
  'artvin': { coords: [41.8183, 41.1828], country: 'Türkiye', flag: '🇹🇷', city: 'Artvin', specialty: 'Yenilenebilir Enerji' },
  'aydin': { coords: [27.8456, 37.8444], country: 'Türkiye', flag: '🇹🇷', city: 'Aydın', specialty: 'Jeotermal Enerji & Tarım' },
  'balikesir': { coords: [27.8860, 39.6484], country: 'Türkiye', flag: '🇹🇷', city: 'Balıkesir', specialty: 'Rüzgar Enerjisi & Gıda' },
  'bilecik': { coords: [29.9793, 40.1426], country: 'Türkiye', flag: '🇹🇷', city: 'Bilecik', specialty: 'Seramik & Mermer' },
  'bingol': { coords: [40.4983, 38.8853], country: 'Türkiye', flag: '🇹🇷', city: 'Bingöl', specialty: 'Tarım & Hayvancılık' },
  'bitlis': { coords: [42.1095, 38.4006], country: 'Türkiye', flag: '🇹🇷', city: 'Bitlis', specialty: 'Kültür & Turizm' },
  'bolu': { coords: [31.6089, 40.7358], country: 'Türkiye', flag: '🇹🇷', city: 'Bolu', specialty: 'Ekoturizm & Lojistik' },
  'burdur': { coords: [30.2889, 37.7203], country: 'Türkiye', flag: '🇹🇷', city: 'Burdur', specialty: 'Doğaltaş & Hayvancılık' },
  'bursa': { coords: [29.0610, 40.1885], country: 'Türkiye', flag: '🇹🇷', city: 'Bursa', specialty: 'Otomotiv, Tekstil & Robotik', tier: 1 },
  'inegol': { coords: [29.5089, 40.0781], country: 'Türkiye', flag: '🇹🇷', city: 'Bursa (İnegöl)', specialty: 'Mobilya & İhracat' },
  'canakkale': { coords: [26.4086, 40.1553], country: 'Türkiye', flag: '🇹🇷', city: 'Çanakkale', specialty: 'Denizcilik & Biyoteknoloji' },
  'cankiri': { coords: [33.6167, 40.6000], country: 'Türkiye', flag: '🇹🇷', city: 'Çankırı', specialty: 'Madencilik & Sanayi' },
  'corum': { coords: [34.9537, 40.5499], country: 'Türkiye', flag: '🇹🇷', city: 'Çorum', specialty: 'Makine İmalatı & Gıda' },
  'denizli': { coords: [29.0875, 37.7833], country: 'Türkiye', flag: '🇹🇷', city: 'Denizli', specialty: 'Tekstil, İhracat & Kablo' },
  'diyarbakir': { coords: [40.2306, 37.9144], country: 'Türkiye', flag: '🇹🇷', city: 'Diyarbakır', specialty: 'Girişimcilik & Ticaret', tier: 1 },
  'edirne': { coords: [26.5557, 41.6772], country: 'Türkiye', flag: '🇹🇷', city: 'Edirne', specialty: 'Sınır Ticareti & Lojistik' },
  'elazig': { coords: [39.2232, 38.6748], country: 'Türkiye', flag: '🇹🇷', city: 'Elazığ', specialty: 'Bilişim & Madencilik' },
  'erzincan': { coords: [39.4926, 39.7392], country: 'Türkiye', flag: '🇹🇷', city: 'Erzincan', specialty: 'Organik Tarım & Doğa Sporları' },
  'erzurum': { coords: [41.2769, 39.9086], country: 'Türkiye', flag: '🇹🇷', city: 'Erzurum', specialty: 'Kış Sporları & Teknokent' },
  'eskisehir': { coords: [30.5256, 39.7767], country: 'Türkiye', flag: '🇹🇷', city: 'Eskişehir', specialty: 'Havacılık, Raylı Sistemler & Yazılım', tier: 1 },
  'gaziantep': { coords: [37.3822, 37.0662], country: 'Türkiye', flag: '🇹🇷', city: 'Gaziantep', specialty: 'Sanayi, Gastronomi & İhracat', tier: 1 },
  'giresun': { coords: [38.3895, 40.9169], country: 'Türkiye', flag: '🇹🇷', city: 'Giresun', specialty: 'Fındık & Lojistik' },
  'gumushane': { coords: [39.4811, 40.4600], country: 'Türkiye', flag: '🇹🇷', city: 'Gümüşhane', specialty: 'Madencilik & Turizm' },
  'hakkari': { coords: [43.7408, 37.5744], country: 'Türkiye', flag: '🇹🇷', city: 'Hakkari', specialty: 'Doğa & Sınır Ticareti' },
  'hatay': { coords: [36.1667, 36.2000], country: 'Türkiye', flag: '🇹🇷', city: 'Hatay', specialty: 'Demir-Çelik & Lojistik' },
  'iskenderun': { coords: [36.1750, 36.5872], country: 'Türkiye', flag: '🇹🇷', city: 'Hatay (İskenderun)', specialty: 'Liman & Ağır Sanayi' },
  'isparta': { coords: [30.5537, 37.7648], country: 'Türkiye', flag: '🇹🇷', city: 'Isparta', specialty: 'Kozmetik & Havacılık Eğitimi' },
  'mersin': { coords: [34.6415, 36.8121], country: 'Türkiye', flag: '🇹🇷', city: 'Mersin', specialty: 'Uluslararası Liman & Dış Ticaret', tier: 1 },
  'tarsus': { coords: [34.8986, 36.9167], country: 'Türkiye', flag: '🇹🇷', city: 'Mersin (Tarsus)', specialty: 'Agrotech & Lojistik' },
  'istanbul': { coords: [28.9784, 41.0082], country: 'Türkiye', flag: '🇹🇷', city: 'İstanbul', specialty: 'Finans, Teknoloji, Start-up & Bilişim', tier: 1 },
  'esenyurt': { coords: [28.6792, 41.0342], country: 'Türkiye', flag: '🇹🇷', city: 'İstanbul (Esenyurt)', specialty: 'İESÜ Ana Kampüs & Sanayi Havzası' },
  'kadikoy': { coords: [29.0253, 40.9819], country: 'Türkiye', flag: '🇹🇷', city: 'İstanbul (Kadıköy)', specialty: 'Yaratıcı Endüstriler & Teknoloji' },
  'besiktas': { coords: [29.0069, 41.0428], country: 'Türkiye', flag: '🇹🇷', city: 'İstanbul (Beşiktaş)', specialty: 'Finans & İş Merkezleri' },
  'sariyer': { coords: [29.0558, 41.1667], country: 'Türkiye', flag: '🇹🇷', city: 'İstanbul (Sarıyer)', specialty: 'Ar-Ge & İleri Teknoloji' },
  'uskudar': { coords: [29.0234, 41.0267], country: 'Türkiye', flag: '🇹🇷', city: 'İstanbul (Üsküdar)', specialty: 'Kültür & Sağlık Bilişimi' },
  'izmir': { coords: [27.1428, 38.4237], country: 'Türkiye', flag: '🇹🇷', city: 'İzmir', specialty: 'Yazılım, Yenilenebilir Enerji & Liman', tier: 1 },
  'bornova': { coords: [27.2189, 38.4650], country: 'Türkiye', flag: '🇹🇷', city: 'İzmir (Bornova)', specialty: 'Bilişim Vadisi & Üniversite Havzası' },
  'kars': { coords: [43.0975, 40.6014], country: 'Türkiye', flag: '🇹🇷', city: 'Kars', specialty: 'Kafkas Lojistik & Kış Turizmi' },
  'kastamonu': { coords: [33.7765, 41.3781], country: 'Türkiye', flag: '🇹🇷', city: 'Kastamonu', specialty: 'Orman Endüstrisi & Doğa' },
  'kayseri': { coords: [35.4853, 38.7205], country: 'Türkiye', flag: '🇹🇷', city: 'Kayseri', specialty: 'Mobilya, Havacılık & Ticaret', tier: 1 },
  'kirklareli': { coords: [27.2244, 41.7351], country: 'Türkiye', flag: '🇹🇷', city: 'Kırklareli', specialty: 'Gıda & Sınır Ticareti' },
  'kirsehir': { coords: [34.1709, 39.1425], country: 'Türkiye', flag: '🇹🇷', city: 'Kırşehir', specialty: 'Jeotermal & Tarım' },
  'kocaeli': { coords: [29.8815, 40.8533], country: 'Türkiye', flag: '🇹🇷', city: 'Kocaeli', specialty: 'Kimya, Otomotiv & Bilişim Vadisi', tier: 1 },
  'izmit': { coords: [29.9167, 40.7667], country: 'Türkiye', flag: '🇹🇷', city: 'Kocaeli (İzmit)', specialty: 'Ağır Sanayi & Lojistik' },
  'gebze': { coords: [29.4306, 40.8028], country: 'Türkiye', flag: '🇹🇷', city: 'Kocaeli (Gebze)', specialty: 'Bilişim Vadisi & TÜBİTAK MAM' },
  'konya': { coords: [32.4932, 37.8746], country: 'Türkiye', flag: '🇹🇷', city: 'Konya', specialty: 'Makine Sanayii, Tarım Teknolojileri & Savunma', tier: 1 },
  'kutahya': { coords: [29.9833, 39.4167], country: 'Türkiye', flag: '🇹🇷', city: 'Kütahya', specialty: 'Porselen & Madencilik' },
  'malatya': { coords: [38.3167, 38.3552], country: 'Türkiye', flag: '🇹🇷', city: 'Malatya', specialty: 'Gıda & Biyomedikal' },
  'manisa': { coords: [27.4296, 38.6191], country: 'Türkiye', flag: '🇹🇷', city: 'Manisa', specialty: 'Elektronik & Beyaz Eşya Sanayii' },
  'kahramanmaras': { coords: [36.9371, 37.5858], country: 'Türkiye', flag: '🇹🇷', city: 'Kahramanmaraş', specialty: 'Tekstil, Metal Mutfak & Gıda' },
  'maras': { coords: [36.9371, 37.5858], country: 'Türkiye', flag: '🇹🇷', city: 'Kahramanmaraş', specialty: 'Tekstil & Sanayi' },
  'mardin': { coords: [40.7420, 37.3212], country: 'Türkiye', flag: '🇹🇷', city: 'Mardin', specialty: 'Kültür & Dış Ticaret' },
  'mugla': { coords: [28.3665, 37.2153], country: 'Türkiye', flag: '🇹🇷', city: 'Muğla', specialty: 'Yatçılık & Ekoturizm' },
  'bodrum': { coords: [27.4289, 37.0344], country: 'Türkiye', flag: '🇹🇷', city: 'Muğla (Bodrum)', specialty: 'Lüks Turizm & Yat İnşa' },
  'fethiye': { coords: [29.1164, 36.6217], country: 'Türkiye', flag: '🇹🇷', city: 'Muğla (Fethiye)', specialty: 'Yamaç Paraşütü & Turizm' },
  'marmaris': { coords: [28.2742, 36.8550], country: 'Türkiye', flag: '🇹🇷', city: 'Muğla (Marmaris)', specialty: 'Marina & Deniz Turizmi' },
  'mus': { coords: [41.4911, 38.7432], country: 'Türkiye', flag: '🇹🇷', city: 'Muş', specialty: 'Tarım & Hayvancılık' },
  'nevsehir': { coords: [34.7142, 38.6244], country: 'Türkiye', flag: '🇹🇷', city: 'Nevşehir', specialty: 'Kapadokya & Balonculuk' },
  'nigde': { coords: [34.6793, 37.9667], country: 'Türkiye', flag: '🇹🇷', city: 'Niğde', specialty: 'Tarım Bilişimi & Madencilik' },
  'ordu': { coords: [37.8797, 40.9839], country: 'Türkiye', flag: '🇹🇷', city: 'Ordu', specialty: 'Deniz Üstü Havacılık & Gıda' },
  'rize': { coords: [40.5217, 41.0201], country: 'Türkiye', flag: '🇹🇷', city: 'Rize', specialty: 'Çay Sanayii & Lojistik' },
  'sakarya': { coords: [30.4033, 40.7731], country: 'Türkiye', flag: '🇹🇷', city: 'Sakarya', specialty: 'Otomotiv & Savunma Sanayii' },
  'adapazari': { coords: [30.4033, 40.7731], country: 'Türkiye', flag: '🇹🇷', city: 'Sakarya (Adapazarı)', specialty: 'Otomotiv & Sanayi' },
  'samsun': { coords: [36.3361, 41.2867], country: 'Türkiye', flag: '🇹🇷', city: 'Samsun', specialty: 'Cerrahi Aletler & Karadeniz Lojistiği', tier: 1 },
  'siirt': { coords: [41.9420, 37.9333], country: 'Türkiye', flag: '🇹🇷', city: 'Siirt', specialty: 'Yenilenebilir Enerji & Tarım' },
  'sinop': { coords: [35.1539, 42.0231], country: 'Türkiye', flag: '🇹🇷', city: 'Sinop', specialty: 'Nükleer Enerji & Balıkçılık' },
  'sivas': { coords: [37.0145, 39.7477], country: 'Türkiye', flag: '🇹🇷', city: 'Sivas', specialty: 'Raylı Sistemler & Madencilik' },
  'tekirdag': { coords: [27.5111, 40.9833], country: 'Türkiye', flag: '🇹🇷', city: 'Tekirdağ', specialty: 'Liman, Kimya & Tarım' },
  'corlu': { coords: [27.8000, 41.1592], country: 'Türkiye', flag: '🇹🇷', city: 'Tekirdağ (Çorlu)', specialty: 'Havacılık & Tekstil Sanayii' },
  'tokat': { coords: [36.5544, 40.3167], country: 'Türkiye', flag: '🇹🇷', city: 'Tokat', specialty: 'Tarım Teknolojileri & Kültür' },
  'trabzon': { coords: [39.7168, 41.0027], country: 'Türkiye', flag: '🇹🇷', city: 'Trabzon', specialty: 'Bilişim, Denizcilik & Uluslararası Ticaret', tier: 1 },
  'tunceli': { coords: [39.5483, 39.1079], country: 'Türkiye', flag: '🇹🇷', city: 'Tunceli', specialty: 'Doğa Sporları & Organik Bal' },
  'sanliurfa': { coords: [38.7955, 37.1674], country: 'Türkiye', flag: '🇹🇷', city: 'Şanlıurfa', specialty: 'GAP Tarım Bilişimi & Arkeoloji' },
  'urfa': { coords: [38.7955, 37.1674], country: 'Türkiye', flag: '🇹🇷', city: 'Şanlıurfa', specialty: 'Tarım & Enerji' },
  'usak': { coords: [29.4058, 38.6823], country: 'Türkiye', flag: '🇹🇷', city: 'Uşak', specialty: 'Tekstil Geri Dönüşümü & Seramik' },
  'van': { coords: [43.3744, 38.4891], country: 'Türkiye', flag: '🇹🇷', city: 'Van', specialty: 'Güneş Enerjisi & Sınır Ticareti' },
  'yozgat': { coords: [34.8083, 39.8181], country: 'Türkiye', flag: '🇹🇷', city: 'Yozgat', specialty: 'Kenevir Biyomalzeme & Tarım' },
  'zonguldak': { coords: [31.7987, 41.4564], country: 'Türkiye', flag: '🇹🇷', city: 'Zonguldak', specialty: 'Doğalgaz & Çelik Sanayii' },
  'aksaray': { coords: [34.0254, 38.3687], country: 'Türkiye', flag: '🇹🇷', city: 'Aksaray', specialty: 'Otomotiv Yan Sanayi' },
  'bayburt': { coords: [40.2249, 40.2552], country: 'Türkiye', flag: '🇹🇷', city: 'Bayburt', specialty: 'Doğal Taş & Kültür' },
  'karaman': { coords: [33.2150, 37.1759], country: 'Türkiye', flag: '🇹🇷', city: 'Karaman', specialty: 'Bisküvi & Gıda Teknolojileri' },
  'kirikkale': { coords: [33.5062, 39.8468], country: 'Türkiye', flag: '🇹🇷', city: 'Kırıkkale', specialty: 'Savunma Sanayii & Mühimmat' },
  'batman': { coords: [41.1322, 37.8812], country: 'Türkiye', flag: '🇹🇷', city: 'Batman', specialty: 'Petrol & Petrokimya' },
  'sirnak': { coords: [42.4594, 37.5164], country: 'Türkiye', flag: '🇹🇷', city: 'Şırnak', specialty: 'Petrol Keşifleri & Lojistik' },
  'bartin': { coords: [32.3375, 41.6344], country: 'Türkiye', flag: '🇹🇷', city: 'Bartın', specialty: 'Denizcilik & Orman Ürünleri' },
  'ardahan': { coords: [42.7022, 41.1105], country: 'Türkiye', flag: '🇹🇷', city: 'Ardahan', specialty: 'Boru Hatları & Hayvancılık' },
  'igdir': { coords: [44.0450, 39.9196], country: 'Türkiye', flag: '🇹🇷', city: 'Iğdır', specialty: '3 Ülkeye Komşu Ticaret Kapısı' },
  'yalova': { coords: [29.2769, 40.6500], country: 'Türkiye', flag: '🇹🇷', city: 'Yalova', specialty: 'Gemi İnşa & Kimya Sanayii' },
  'karabuk': { coords: [32.6277, 41.2061], country: 'Türkiye', flag: '🇹🇷', city: 'Karabük', specialty: 'Demir & Çelik' },
  'kilis': { coords: [37.1150, 36.7184], country: 'Türkiye', flag: '🇹🇷', city: 'Kilis', specialty: 'Zeytincilik & Ticaret' },
  'osmaniye': { coords: [36.2467, 37.0742], country: 'Türkiye', flag: '🇹🇷', city: 'Osmaniye', specialty: 'Demir-Çelik & Rüzgar Enerjisi' },
  'duzce': { coords: [31.1626, 40.8387], country: 'Türkiye', flag: '🇹🇷', city: 'Düzce', region: 'Karadeniz / Marmara Geçişi', specialty: 'Orman Ürünleri, Makine & Sanayi', tier: 1 },
  'düzce': { coords: [31.1626, 40.8387], country: 'Türkiye', flag: '🇹🇷', city: 'Düzce', region: 'Karadeniz / Marmara Geçişi', specialty: 'Orman Ürünleri, Makine & Sanayi', tier: 1 },

  // -------------------------------------------------------------
  // GERMANY & DACH REGION (ALMANYA & DACH)
  // -------------------------------------------------------------
  'berlin': { coords: [13.4050, 52.5200], country: 'Almanya', flag: '🇩🇪', city: 'Berlin', specialty: 'Start-up Başkenti, AI & FinTech', tier: 1 },
  'munih': { coords: [11.5820, 48.1351], country: 'Almanya', flag: '🇩🇪', city: 'Münih', specialty: 'Otomotiv, Havacılık & Bilişim', tier: 1 },
  'munich': { coords: [11.5820, 48.1351], country: 'Almanya', flag: '🇩🇪', city: 'Münih', specialty: 'Otomotiv, Havacılık & Bilişim', tier: 1 },
  'münih': { coords: [11.5820, 48.1351], country: 'Almanya', flag: '🇩🇪', city: 'Münih', specialty: 'Otomotiv, Havacılık & Bilişim', tier: 1 },
  'frankfurt': { coords: [8.6821, 50.1109], country: 'Almanya', flag: '🇩🇪', city: 'Frankfurt', specialty: 'Avrupa Finans Merkezi, Veri Merkezleri', tier: 1 },
  'hamburg': { coords: [9.9937, 53.5511], country: 'Almanya', flag: '🇩🇪', city: 'Hamburg', specialty: 'Liman Lojistiği, Medya & Havacılık', tier: 1 },
  'koln': { coords: [6.9603, 50.9375], country: 'Almanya', flag: '🇩🇪', city: 'Köln', specialty: 'Medya, Telekom & Yazılım', tier: 1 },
  'köln': { coords: [6.9603, 50.9375], country: 'Almanya', flag: '🇩🇪', city: 'Köln', specialty: 'Medya, Telekom & Yazılım', tier: 1 },
  'cologne': { coords: [6.9603, 50.9375], country: 'Almanya', flag: '🇩🇪', city: 'Köln', specialty: 'Medya, Telekom & Yazılım', tier: 1 },
  'stuttgart': { coords: [9.1829, 48.7758], country: 'Almanya', flag: '🇩🇪', city: 'Stuttgart', specialty: 'İleri Mühendislik, Otomotiv (Porsche, Bosch)', tier: 1 },
  'dusseldorf': { coords: [6.7735, 51.2277], country: 'Almanya', flag: '🇩🇪', city: 'Düsseldorf', specialty: 'Telekomünikasyon & Moda', tier: 1 },
  'düsseldorf': { coords: [6.7735, 51.2277], country: 'Almanya', flag: '🇩🇪', city: 'Düsseldorf', specialty: 'Telekomünikasyon & Moda', tier: 1 },
  'leipzig': { coords: [12.3731, 51.3397], country: 'Almanya', flag: '🇩🇪', city: 'Leipzig', specialty: 'Lojistik Hub (DHL), Biyoteknoloji' },
  'dresden': { coords: [13.7373, 51.0504], country: 'Almanya', flag: '🇩🇪', city: 'Dresden', specialty: 'Silicon Saxony, Yarı İletkenler' },
  'hannover': { coords: [9.7320, 52.3759], country: 'Almanya', flag: '🇩🇪', city: 'Hannover', specialty: 'Endüstri Fuarları & Dijitalleşme' },
  'nurnberg': { coords: [11.0767, 49.4521], country: 'Almanya', flag: '🇩🇪', city: 'Nürnberg', specialty: 'Otomasyon, Medikal Teknoloji' },
  'nuremberg': { coords: [11.0767, 49.4521], country: 'Almanya', flag: '🇩🇪', city: 'Nürnberg', specialty: 'Otomasyon, Medikal Teknoloji' },
  'bonn': { coords: [7.0982, 50.7374], country: 'Almanya', flag: '🇩🇪', city: 'Bonn', specialty: 'Sürdürülebilirlik, Telekom (Telekom, Post)' },
  'aachen': { coords: [6.0839, 50.7753], country: 'Almanya', flag: '🇩🇪', city: 'Aachen', specialty: 'RWTH Aachen, Yapay Zeka & Robotik' },
  'karlsruhe': { coords: [8.4037, 49.0069], country: 'Almanya', flag: '🇩🇪', city: 'Karlsruhe', specialty: 'KIT, Bilgisayar Mühendisliği' },
  'dortmund': { coords: [7.4653, 51.5136], country: 'Almanya', flag: '🇩🇪', city: 'Dortmund', specialty: 'Bilişim & Lojistik Yazılımları' },
  'heidelberg': { coords: [8.6724, 49.3988], country: 'Almanya', flag: '🇩🇪', city: 'Heidelberg', specialty: 'Biyomedikal, Kanser Araştırmaları' },
  'bremen': { coords: [8.8017, 53.0793], country: 'Almanya', flag: '🇩🇪', city: 'Bremen', specialty: 'Uzay & Havacılık Sanayii' },
  'essen': { coords: [7.0116, 51.4556], country: 'Almanya', flag: '🇩🇪', city: 'Essen', specialty: 'Enerji Dönüşümü & Ağır Sanayi' },
  'mannheim': { coords: [8.4660, 49.4875], country: 'Almanya', flag: '🇩🇪', city: 'Mannheim', specialty: 'Girişimcilik & Endüstri Mühendisliği' },
  'freiburg': { coords: [7.8522, 47.9990], country: 'Almanya', flag: '🇩🇪', city: 'Freiburg', specialty: 'Güneş Enerjisi & Çevre Teknolojileri' },
  'munster': { coords: [7.6261, 51.9607], country: 'Almanya', flag: '🇩🇪', city: 'Münster', specialty: 'Batarya Teknolojileri & Nanoteknoloji' },
  'augsburg': { coords: [10.8978, 48.3705], country: 'Almanya', flag: '🇩🇪', city: 'Augsburg', specialty: 'Endüstriyel Robotik (KUKA)' },
  'erlangen': { coords: [11.0049, 49.5897], country: 'Almanya', flag: '🇩🇪', city: 'Erlangen', specialty: 'Tıbbi Görüntüleme (Siemens Healthineers)' },
  'gottingen': { coords: [9.9356, 51.5413], country: 'Almanya', flag: '🇩🇪', city: 'Göttingen', specialty: 'Teorik Fizik & Nobel Merkezi' },
  'ulm': { coords: [9.9876, 48.4011], country: 'Almanya', flag: '🇩🇪', city: 'Ulm', specialty: 'Otonom Sürüş & Kuantum Bilişim' },
  'darmstadt': { coords: [8.6537, 49.8728], country: 'Almanya', flag: '🇩🇪', city: 'Darmstadt', specialty: 'ESA Uzay Operasyonları & Bilişim Güvenliği' },
  'potsdam': { coords: [13.0645, 52.3906], country: 'Almanya', flag: '🇩🇪', city: 'Potsdam', specialty: 'Hasso Plattner Enstitüsü, Veri Bilimi' },

  // SWITZERLAND (İSVİÇRE)
  'zurih': { coords: [8.5417, 47.3769], country: 'İsviçre', flag: '🇨🇭', city: 'Zürih', specialty: 'ETH Zurich, FinTech & Google Araştırma Merkezi', tier: 1 },
  'zurich': { coords: [8.5417, 47.3769], country: 'İsviçre', flag: '🇨🇭', city: 'Zürih', specialty: 'ETH Zurich, FinTech & Google Araştırma Merkezi', tier: 1 },
  'zürih': { coords: [8.5417, 47.3769], country: 'İsviçre', flag: '🇨🇭', city: 'Zürih', specialty: 'ETH Zurich, FinTech & Google Araştırma Merkezi', tier: 1 },
  'cenevre': { coords: [6.1432, 46.2044], country: 'İsviçre', flag: '🇨🇭', city: 'Cenevre', specialty: 'CERN, Birleşmiş Milletler & Nükleer Fizik', tier: 1 },
  'geneva': { coords: [6.1432, 46.2044], country: 'İsviçre', flag: '🇨🇭', city: 'Cenevre', specialty: 'CERN, Birleşmiş Milletler & Nükleer Fizik', tier: 1 },
  'basel': { coords: [7.5886, 47.5596], country: 'İsviçre', flag: '🇨🇭', city: 'Basel', specialty: 'Biyofarma (Novartis, Roche)', tier: 1 },
  'bern': { coords: [7.4474, 46.9480], country: 'İsviçre', flag: '🇨🇭', city: 'Bern', specialty: 'Hükümet & İsviçre Kamu Teknolojileri' },
  'lausanne': { coords: [6.6323, 46.5197], country: 'İsviçre', flag: '🇨🇭', city: 'Lozan', specialty: 'EPFL, İleri Malzeme & Nöroteknoloji' },
  'lozan': { coords: [6.6323, 46.5197], country: 'İsviçre', flag: '🇨🇭', city: 'Lozan', specialty: 'EPFL, İleri Malzeme & Nöroteknoloji' },
  'lucerne': { coords: [8.3093, 47.0502], country: 'İsviçre', flag: '🇨🇭', city: 'Luzern', specialty: 'Bilişim & Lüks Turizm' },

  // AUSTRIA (AVUSTURYA)
  'viyana': { coords: [16.3738, 48.2082], country: 'Avusturya', flag: '🇦🇹', city: 'Viyana', specialty: 'Uluslararası Kurumlar (IAEA, OPEC), Yapay Zeka', tier: 1 },
  'vienna': { coords: [16.3738, 48.2082], country: 'Avusturya', flag: '🇦🇹', city: 'Viyana', specialty: 'Uluslararası Kurumlar (IAEA, OPEC), Yapay Zeka', tier: 1 },
  'graz': { coords: [15.4395, 47.0707], country: 'Avusturya', flag: '🇦🇹', city: 'Graz', specialty: 'TU Graz, Otomotiv Mühendisliği' },
  'linz': { coords: [14.2858, 48.3069], country: 'Avusturya', flag: '🇦🇹', city: 'Linz', specialty: 'Yapay Zeka (JKU), Çelik Teknolojileri' },
  'salzburg': { coords: [13.0550, 47.8095], country: 'Avusturya', flag: '🇦🇹', city: 'Salzburg', specialty: 'Biyoteknoloji & Kültür İnovasyonu' },
  'innsbruck': { coords: [11.4041, 47.2692], country: 'Avusturya', flag: '🇦🇹', city: 'Innsbruck', specialty: 'Kuantum Fiziği Araştırmaları' },

  // -------------------------------------------------------------
  // UNITED KINGDOM & IRELAND (BİRLEŞİK KRALLIK & İRLANDA)
  // -------------------------------------------------------------
  'londra': { coords: [-0.1276, 51.5072], country: 'Birleşik Krallık', flag: '🇬🇧', city: 'Londra', specialty: 'Küresel FinTech, DeepMind, AI & Hukuk', tier: 1 },
  'london': { coords: [-0.1276, 51.5072], country: 'Birleşik Krallık', flag: '🇬🇧', city: 'Londra', specialty: 'Küresel FinTech, DeepMind, AI & Hukuk', tier: 1 },
  'manchester': { coords: [-2.2426, 53.4808], country: 'Birleşik Krallık', flag: '🇬🇧', city: 'Manchester', specialty: 'Grafen Araştırmaları, E-Ticaret & Medya', tier: 1 },
  'cambridge': { coords: [0.1218, 52.2053], country: 'Birleşik Krallık', flag: '🇬🇧', city: 'Cambridge', specialty: 'Silicon Fen, ARM, Biyoteknoloji', tier: 1 },
  'oxford': { coords: [-1.2577, 51.7520], country: 'Birleşik Krallık', flag: '🇬🇧', city: 'Oxford', specialty: 'Aşı Teknolojisi, Kuantum & Robotik', tier: 1 },
  'edinburgh': { coords: [-3.1883, 55.9533], country: 'Birleşik Krallık', flag: '🇬🇧', city: 'Edinburgh', specialty: 'Informatics, Finans & Veri Bilimi', tier: 1 },
  'glasgow': { coords: [-4.2518, 55.8642], country: 'Birleşik Krallık', flag: '🇬🇧', city: 'Glasgow', specialty: 'Gemi İnşa, Uydu Teknolojisi' },
  'birmingham': { coords: [-1.8904, 52.4862], country: 'Birleşik Krallık', flag: '🇬🇧', city: 'Birmingham', specialty: 'İleri İmalat & HS2 Lojistiği' },
  'leeds': { coords: [-1.5491, 53.8008], country: 'Birleşik Krallık', flag: '🇬🇧', city: 'Leeds', specialty: 'Sağlık Bilişimi & Finansal Hizmetler' },
  'bristol': { coords: [-2.5879, 51.4545], country: 'Birleşik Krallık', flag: '🇬🇧', city: 'Bristol', specialty: 'Mikroelektronik, Havacılık (Airbus)' },
  'liverpool': { coords: [-2.9916, 53.4084], country: 'Birleşik Krallık', flag: '🇬🇧', city: 'Liverpool', specialty: 'Oyun Geliştirme & Biyomedikal' },
  'newcastle': { coords: [-1.6178, 54.9783], country: 'Birleşik Krallık', flag: '🇬🇧', city: 'Newcastle', specialty: 'Ulusal Yaşlanma & Veri İnovasyon Merkezi' },
  'belfast': { coords: [-5.9301, 54.5973], country: 'Birleşik Krallık', flag: '🇬🇧', city: 'Belfast', specialty: 'Siber Güvenlik Hub (CSIT)' },
  'cardiff': { coords: [-3.1791, 51.4816], country: 'Birleşik Krallık', flag: '🇬🇧', city: 'Cardiff', specialty: 'Yarı İletken İnovasyonu' },
  'dublin': { coords: [-6.2603, 53.3498], country: 'İrlanda', flag: '🇮🇪', city: 'Dublin', specialty: 'Avrupa Teknoloji Genel Merkezleri (Google, Meta)', tier: 1 },
  'cork': { coords: [-8.4756, 51.8985], country: 'İrlanda', flag: '🇮🇪', city: 'Cork', specialty: 'Apple Avrupa Kampüsü, Farmasötik' },
  'galway': { coords: [-9.0568, 53.2707], country: 'İrlanda', flag: '🇮🇪', city: 'Galway', specialty: 'MedTek (Tıbbi Cihazlar Hub)' },

  // -------------------------------------------------------------
  // UNITED STATES & CANADA (KUZEY AMERİKA)
  // -------------------------------------------------------------
  'san francisco': { coords: [-122.4194, 37.7749], country: 'Amerika Birleşik Devletleri', flag: '🇺🇸', city: 'San Francisco', specialty: 'Yapay Zeka, LLM, OpenAI, VC & Start-up', tier: 1 },
  'silicon valley': { coords: [-122.0842, 37.4220], country: 'Amerika Birleşik Devletleri', flag: '🇺🇸', city: 'Silicon Valley', specialty: 'Dünya Teknoloji İnovasyon Merkezi', tier: 1 },
  'san jose': { coords: [-121.8863, 37.3382], country: 'Amerika Birleşik Devletleri', flag: '🇺🇸', city: 'San Jose', specialty: 'Silikon Vadisi Başkenti, Donanım & Çip', tier: 1 },
  'palo alto': { coords: [-122.1430, 37.4419], country: 'Amerika Birleşik Devletleri', flag: '🇺🇸', city: 'Palo Alto', specialty: 'Stanford Üniversitesi, Girişim Sermayesi', tier: 1 },
  'mountain view': { coords: [-122.0839, 37.3861], country: 'Amerika Birleşik Devletleri', flag: '🇺🇸', city: 'Mountain View', specialty: 'Googleplex, Otonom Sistemler', tier: 1 },
  'cupertino': { coords: [-122.0322, 37.3230], country: 'Amerika Birleşik Devletleri', flag: '🇺🇸', city: 'Cupertino', specialty: 'Apple Park Genel Merkezi', tier: 1 },
  'new york': { coords: [-74.0060, 40.7128], country: 'Amerika Birleşik Devletleri', flag: '🇺🇸', city: 'New York', specialty: 'Wall Street, Medya, Reklam Teknolojileri', tier: 1 },
  'boston': { coords: [-71.0589, 42.3601], country: 'Amerika Birleşik Devletleri', flag: '🇺🇸', city: 'Boston', specialty: 'MIT, Harvard, Biyoteknoloji & Robotik', tier: 1 },
  'seattle': { coords: [-122.3321, 47.6062], country: 'Amerika Birleşik Devletleri', flag: '🇺🇸', city: 'Seattle', specialty: 'Bulut Bilişim (Amazon AWS, Microsoft)', tier: 1 },
  'chicago': { coords: [-87.6298, 41.8781], country: 'Amerika Birleşik Devletleri', flag: '🇺🇸', city: 'Chicago', specialty: 'Emtia Borsaları, Algoritmik Ticaret', tier: 1 },
  'austin': { coords: [-97.7431, 30.2672], country: 'Amerika Birleşik Devletleri', flag: '🇺🇸', city: 'Austin', specialty: 'Silicon Hills, Tesla Giga, Çip Tasarımı', tier: 1 },
  'los angeles': { coords: [-118.2437, 34.0522], country: 'Amerika Birleşik Devletleri', flag: '🇺🇸', city: 'Los Angeles', specialty: 'Silicon Beach, Medya & Uzay (SpaceX)', tier: 1 },
  'san diego': { coords: [-117.1611, 32.7157], country: 'Amerika Birleşik Devletleri', flag: '🇺🇸', city: 'San Diego', specialty: 'Kablosuz İletişim (Qualcomm), Genomik' },
  'dallas': { coords: [-96.7970, 32.7767], country: 'Amerika Birleşik Devletleri', flag: '🇺🇸', city: 'Dallas', specialty: 'Telekom, Savunma & Havacılık' },
  'houston': { coords: [-95.3698, 29.7604], country: 'Amerika Birleşik Devletleri', flag: '🇺🇸', city: 'Houston', specialty: 'NASA Johnson Space Center, Enerji' },
  'washington': { coords: [-77.0369, 38.9072], country: 'Amerika Birleşik Devletleri', flag: '🇺🇸', city: 'Washington', specialty: 'Federal Politika, Think-Tank, Savunma', tier: 1 },
  'atlanta': { coords: [-84.3880, 33.7490], country: 'Amerika Birleşik Devletleri', flag: '🇺🇸', city: 'Atlanta', specialty: 'FinTech, Georgia Tech Bilişim' },
  'denver': { coords: [-104.9903, 39.7392], country: 'Amerika Birleşik Devletleri', flag: '🇺🇸', city: 'Denver', specialty: 'Havacılık, Uydu & Yeşil Enerji' },
  'miami': { coords: [-80.1918, 25.7617], country: 'Amerika Birleşik Devletleri', flag: '🇺🇸', city: 'Miami', specialty: 'Kripto, Web3 & Latin Amerika Kapısı' },
  'philadelphia': { coords: [-75.1652, 39.9526], country: 'Amerika Birleşik Devletleri', flag: '🇺🇸', city: 'Philadelphia', specialty: 'Biyofarma, Hücre & Gen Terapileri' },
  'phoenix': { coords: [-112.0740, 33.4484], country: 'Amerika Birleşik Devletleri', flag: '🇺🇸', city: 'Phoenix', specialty: 'TSMC Yarı İletken Mega Fab' },
  'detroit': { coords: [-83.0458, 42.3314], country: 'Amerika Birleşik Devletleri', flag: '🇺🇸', city: 'Detroit', specialty: 'Elektrikli Araçlar & Otonom Mobilite', tier: 1 },
  'pittsburgh': { coords: [-79.9959, 40.4406], country: 'Amerika Birleşik Devletleri', flag: '🇺🇸', city: 'Pittsburgh', specialty: 'Carnegie Mellon, Otonom Sürüş & AI' },
  'portland': { coords: [-122.6784, 45.5152], country: 'Amerika Birleşik Devletleri', flag: '🇺🇸', city: 'Portland', specialty: 'Silicon Forest, Intel Çip Fabrikaları' },
  'raleigh': { coords: [-78.6382, 35.7796], country: 'Amerika Birleşik Devletleri', flag: '🇺🇸', city: 'Raleigh', specialty: 'Research Triangle Park (RTP)' },

  // CANADA (KANADA)
  'toronto': { coords: [-79.3832, 43.6532], country: 'Kanada', flag: '🇨🇦', city: 'Toronto', specialty: 'Vector Institute, FinTech & AI', tier: 1 },
  'vancouver': { coords: [-123.1207, 49.2827], country: 'Kanada', flag: '🇨🇦', city: 'Vancouver', specialty: 'Görsel Efekt, Oyun & Yeşil Bilişim', tier: 1 },
  'montreal': { coords: [-73.5673, 45.5017], country: 'Kanada', flag: '🇨🇦', city: 'Montreal', specialty: 'Mila AI Enstitüsü, Derin Öğrenme', tier: 1 },
  'ottawa': { coords: [-75.6972, 45.4215], country: 'Kanada', flag: '🇨🇦', city: 'Ottawa', specialty: 'Shopify Genel Merkezi, Kamu Bilişimi' },
  'calgary': { coords: [-114.0719, 51.0447], country: 'Kanada', flag: '🇨🇦', city: 'Calgary', specialty: 'Enerji Teknolojileri & Agrotech' },
  'waterloo': { coords: [-80.5204, 43.4643], country: 'Kanada', flag: '🇨🇦', city: 'Waterloo', specialty: 'Kuantum Hesaplama & Yazılım Mühendisliği', tier: 1 },

  // -------------------------------------------------------------
  // WESTERN & SOUTHERN EUROPE (BATI & GÜNEY AVRUPA)
  // -------------------------------------------------------------
  'amsterdam': { coords: [4.9041, 52.3676], country: 'Hollanda', flag: '🇳🇱', city: 'Amsterdam', specialty: 'Avrupa İnternet Düğümü (AMS-IX), FinTech', tier: 1 },
  'rotterdam': { coords: [4.4777, 51.9244], country: 'Hollanda', flag: '🇳🇱', city: 'Rotterdam', specialty: 'Avrupa En Büyük Limanı, Akıllı Lojistik', tier: 1 },
  'eindhoven': { coords: [5.4697, 51.4416], country: 'Hollanda', flag: '🇳🇱', city: 'Eindhoven', specialty: 'Brainport, ASML, Fotoniğin Kalbi', tier: 1 },
  'lahey': { coords: [4.3007, 52.0705], country: 'Hollanda', flag: '🇳🇱', city: 'Lahey', specialty: 'Uluslararası Adalet Divanı, Hukuk Bilişimi' },
  'the hague': { coords: [4.3007, 52.0705], country: 'Hollanda', flag: '🇳🇱', city: 'Lahey', specialty: 'Uluslararası Adalet Divanı, Hukuk Bilişimi' },
  'utrecht': { coords: [5.1214, 52.0907], country: 'Hollanda', flag: '🇳🇱', city: 'Utrecht', specialty: 'Yaşam Bilimleri & Oyun Tasarımı' },
  'delft': { coords: [4.3571, 52.0116], country: 'Hollanda', flag: '🇳🇱', city: 'Delft', specialty: 'TU Delft, Kuantum & Havacılık', tier: 1 },
  'groningen': { coords: [6.5665, 53.2194], country: 'Hollanda', flag: '🇳🇱', city: 'Groningen', specialty: 'Hidrojen Vadisi & Dijital İnovasyon' },
  'bruksel': { coords: [4.3517, 50.8503], country: 'Belçika', flag: '🇧🇪', city: 'Brüksel', specialty: 'AB Komisyonu, NATO, Uluslararası İlişkiler', tier: 1 },
  'brussels': { coords: [4.3517, 50.8503], country: 'Belçika', flag: '🇧🇪', city: 'Brüksel', specialty: 'AB Komisyonu, NATO, Uluslararası İlişkiler', tier: 1 },
  'antwerp': { coords: [4.4025, 51.2194], country: 'Belçika', flag: '🇧🇪', city: 'Antwerp', specialty: 'Kimya Kümesi & Uluslararası Liman' },
  'leuven': { coords: [4.7005, 50.8798], country: 'Belçika', flag: '🇧🇪', city: 'Leuven', specialty: 'imec Nanoelektronik, KU Leuven', tier: 1 },
  'paris': { coords: [2.3522, 48.8566], country: 'Fransa', flag: '🇫🇷', city: 'Paris', specialty: 'Station F, Yapay Zeka (Mistral), Lüks', tier: 1 },
  'lyon': { coords: [4.8357, 45.7640], country: 'Fransa', flag: '🇫🇷', city: 'Lyon', specialty: 'Biyoteknoloji & Sanayi Bilişimi', tier: 1 },
  'marseille': { coords: [5.3698, 43.2965], country: 'Fransa', flag: '🇫🇷', city: 'Marsilya', specialty: 'Akdeniz Veri Kablo Hubı, Liman' },
  'marsilya': { coords: [5.3698, 43.2965], country: 'Fransa', flag: '🇫🇷', city: 'Marsilya', specialty: 'Akdeniz Veri Kablo Hubı, Liman' },
  'toulouse': { coords: [1.4442, 43.6047], country: 'Fransa', flag: '🇫🇷', city: 'Toulouse', specialty: 'Airbus Başkenti, Havacılık & Uzay', tier: 1 },
  'nice': { coords: [7.2620, 43.7102], country: 'Fransa', flag: '🇫🇷', city: 'Nice', specialty: 'Sophia Antipolis Bilim Parkı' },
  'grenoble': { coords: [5.7245, 45.1885], country: 'Fransa', flag: '🇫🇷', city: 'Grenoble', specialty: 'Mikroelektronik & Nükleer Araştırmalar' },
  'roma': { coords: [12.4964, 41.9028], country: 'İtalya', flag: '🇮🇹', city: 'Roma', specialty: 'Kamu Bilişimi, Uzay (ESA ESRIN)', tier: 1 },
  'rome': { coords: [12.4964, 41.9028], country: 'İtalya', flag: '🇮🇹', city: 'Roma', specialty: 'Kamu Bilişimi, Uzay (ESA ESRIN)', tier: 1 },
  'milano': { coords: [9.1900, 45.4642], country: 'İtalya', flag: '🇮🇹', city: 'Milano', specialty: 'İtalya Finans & Tasarım Başkenti', tier: 1 },
  'milan': { coords: [9.1900, 45.4642], country: 'İtalya', flag: '🇮🇹', city: 'Milano', specialty: 'İtalya Finans & Tasarım Başkenti', tier: 1 },
  'torino': { coords: [7.6869, 45.0703], country: 'İtalya', flag: '🇮🇹', city: 'Torino', specialty: 'Otomotiv Mühendisliği & Robotik' },
  'bologna': { coords: [11.3426, 44.4949], country: 'İtalya', flag: '🇮🇹', city: 'Bologna', specialty: 'Süperbilgisayar CINECA, Motor Valley' },
  'floransa': { coords: [11.2558, 43.7696], country: 'İtalya', flag: '🇮🇹', city: 'Floransa', specialty: 'Yaratıcı Endüstriler & Dijital Sanat' },
  'madrid': { coords: [-3.7038, 40.4168], country: 'İspanya', flag: '🇪🇸', city: 'Madrid', specialty: 'İberya Finans & Telekom Hubı', tier: 1 },
  'barselona': { coords: [2.1734, 41.3851], country: 'İspanya', flag: '🇪🇸', city: 'Barselona', specialty: 'MWC, Mobil İnovasyon & 22@ Teknopark', tier: 1 },
  'barcelona': { coords: [2.1734, 41.3851], country: 'İspanya', flag: '🇪🇸', city: 'Barselona', specialty: 'MWC, Mobil İnovasyon & 22@ Teknopark', tier: 1 },
  'valensiya': { coords: [-0.3763, 39.4699], country: 'İspanya', flag: '🇪🇸', city: 'Valensiya', specialty: 'Start-up Limanı & Tasarım' },
  'malaga': { coords: [-4.4214, 36.7213], country: 'İspanya', flag: '🇪🇸', city: 'Málaga', specialty: 'Güney Avrupa Silikon Vadisi, Siber Güvenlik' },
  'bilbao': { coords: [-2.9350, 43.2630], country: 'İspanya', flag: '🇪🇸', city: 'Bilbao', specialty: 'Akıllı İmalat & İleri Malzeme' },
  'lizbon': { coords: [-9.1393, 38.7223], country: 'Portekiz', flag: '🇵🇹', city: 'Lizbon', specialty: 'Web Summit, Girişimcilik & Dijital Göçebeler', tier: 1 },
  'lisbon': { coords: [-9.1393, 38.7223], country: 'Portekiz', flag: '🇵🇹', city: 'Lizbon', specialty: 'Web Summit, Girişimcilik & Dijital Göçebeler', tier: 1 },
  'porto': { coords: [-8.6291, 41.1579], country: 'Portekiz', flag: '🇵🇹', city: 'Porto', specialty: 'Yazılım Mühendisliği & Sağlık Bilişimi' },

  // NORDICS & BALTICS
  'stockholm': { coords: [18.0686, 59.3293], country: 'İsveç', flag: '🇸🇪', city: 'Stockholm', specialty: 'Unicorn Fabrikası (Spotify, Klarna)', tier: 1 },
  'goteborg': { coords: [11.9746, 57.7089], country: 'İsveç', flag: '🇸🇪', city: 'Göteborg', specialty: 'Volvo Otonom Araçlar & Chalmers' },
  'gothenburg': { coords: [11.9746, 57.7089], country: 'İsveç', flag: '🇸🇪', city: 'Göteborg', specialty: 'Volvo Otonom Araçlar & Chalmers' },
  'malmo': { coords: [13.0038, 55.6050], country: 'İsveç', flag: '🇸🇪', city: 'Malmö', specialty: 'Oyun Geliştirme & Medicon Valley' },
  'oslo': { coords: [10.7522, 59.9139], country: 'Norveç', flag: '🇳🇴', city: 'Oslo', specialty: 'Yeşil Enerji, Elektrikli Araç Altyapısı', tier: 1 },
  'bergen': { coords: [5.3221, 60.3913], country: 'Norveç', flag: '🇳🇴', city: 'Bergen', specialty: 'Deniz Teknolojileri & İklim Bilişimi' },
  'trondheim': { coords: [10.3951, 63.4305], country: 'Norveç', flag: '🇳🇴', city: 'Trondheim', specialty: 'NTNU, Norveç Teknoloji Başkenti' },
  'kopenhag': { coords: [12.5683, 55.6761], country: 'Danimarka', flag: '🇩🇰', city: 'Kopenhag', specialty: 'Kuantum (Niels Bohr), Biyofarma', tier: 1 },
  'copenhagen': { coords: [12.5683, 55.6761], country: 'Danimarka', flag: '🇩🇰', city: 'Kopenhag', specialty: 'Kuantum (Niels Bohr), Biyofarma', tier: 1 },
  'helsinki': { coords: [24.9384, 60.1699], country: 'Finlandiya', flag: '🇫🇮', city: 'Helsinki', specialty: 'Slush, Mobil Oyun & 6G Telekomünikasyon', tier: 1 },
  'espoo': { coords: [24.6559, 60.2055], country: 'Finlandiya', flag: '🇫🇮', city: 'Espoo', specialty: 'Aalto Üniversitesi, Nokia Ar-Ge' },
  'tallinn': { coords: [24.7535, 59.4370], country: 'Estonya', flag: '🇪🇪', city: 'Tallinn', specialty: 'e-Residency, NATO Siber Savunma', tier: 1 },
  'riga': { coords: [24.1052, 56.9496], country: 'Letonya', flag: '🇱🇻', city: 'Riga', specialty: 'Baltık FinTech & Donanım İnovasyonu', tier: 1 },
  'vilnius': { coords: [25.2797, 54.6872], country: 'Litvanya', flag: '🇱🇹', city: 'Vilnius', specialty: 'Avrupa FinTech Lisans Merkezi', tier: 1 },

  // CENTRAL & EASTERN EUROPE & BALKANS
  'varsova': { coords: [21.0122, 52.2297], country: 'Polonya', flag: '🇵🇱', city: 'Varşova', specialty: 'Orta Avrupa Teknoloji ve Bankacılık Merkezi', tier: 1 },
  'warsaw': { coords: [21.0122, 52.2297], country: 'Polonya', flag: '🇵🇱', city: 'Varşova', specialty: 'Orta Avrupa Teknoloji ve Bankacılık Merkezi', tier: 1 },
  'krakow': { coords: [19.9450, 50.0647], country: 'Polonya', flag: '🇵🇱', city: 'Krakov', specialty: 'Yazılım Geliştirme & Küresel Servis Hubı' },
  'wroclaw': { coords: [17.0385, 51.1079], country: 'Polonya', flag: '🇵🇱', city: 'Wroclaw', specialty: 'Polonya Silikon Vadisi, Intel Fab' },
  'prag': { coords: [14.4378, 50.0755], country: 'Çekya', flag: '🇨🇿', city: 'Prag', specialty: 'Siber Güvenlik (Avast), AI Araştırmaları', tier: 1 },
  'prague': { coords: [14.4378, 50.0755], country: 'Çekya', flag: '🇨🇿', city: 'Prag', specialty: 'Siber Güvenlik (Avast), AI Araştırmaları', tier: 1 },
  'brno': { coords: [16.6068, 49.1951], country: 'Çekya', flag: '🇨🇿', city: 'Brno', specialty: 'Elektron Mikroskopi & Çek Teknoloji Merkezi' },
  'budapeste': { coords: [19.0402, 47.4979], country: 'Macaristan', flag: '🇭🇺', city: 'Budapeşte', specialty: 'Otonom Araç Testleri & Bilişim', tier: 1 },
  'budapest': { coords: [19.0402, 47.4979], country: 'Macaristan', flag: '🇭🇺', city: 'Budapeşte', specialty: 'Otonom Araç Testleri & Bilişim', tier: 1 },
  'bukres': { coords: [26.1025, 44.4268], country: 'Romanya', flag: '🇷🇴', city: 'Bükreş', specialty: 'UiPath Doğduğu Yer, Yüksek Hızlı İnternet', tier: 1 },
  'bucharest': { coords: [26.1025, 44.4268], country: 'Romanya', flag: '🇷🇴', city: 'Bükreş', specialty: 'UiPath Doğduğu Yer, Yüksek Hızlı İnternet', tier: 1 },
  'cluj': { coords: [23.6236, 46.7712], country: 'Romanya', flag: '🇷🇴', city: 'Cluj-Napoca', specialty: 'Transilvanya Silikon Vadisi' },
  'sofya': { coords: [23.3219, 42.6977], country: 'Bulgaristan', flag: '🇧🇬', city: 'Sofya', specialty: 'INSAIT AI Enstitüsü & Yazılım', tier: 1 },
  'sofia': { coords: [23.3219, 42.6977], country: 'Bulgaristan', flag: '🇧🇬', city: 'Sofya', specialty: 'INSAIT AI Enstitüsü & Yazılım', tier: 1 },
  'atina': { coords: [23.7275, 37.9838], country: 'Yunanistan', flag: '🇬🇷', city: 'Atina', specialty: 'Denizcilik Teknolojileri & Ar-Ge', tier: 1 },
  'athens': { coords: [23.7275, 37.9838], country: 'Yunanistan', flag: '🇬🇷', city: 'Atina', specialty: 'Denizcilik Teknolojileri & Ar-Ge', tier: 1 },
  'selanik': { coords: [22.9444, 40.6401], country: 'Yunanistan', flag: '🇬🇷', city: 'Selanik', specialty: 'Balkanlar İnovasyon Koridoru' },
  'belgrad': { coords: [20.4489, 44.7866], country: 'Sırbistan', flag: '🇷🇸', city: 'Belgrad', specialty: 'Bilişim İhracatı & Oyun Stüdyoları', tier: 1 },
  'belgrade': { coords: [20.4489, 44.7866], country: 'Sırbistan', flag: '🇷🇸', city: 'Belgrad', specialty: 'Bilişim İhracatı & Oyun Stüdyoları', tier: 1 },
  'zagreb': { coords: [15.9819, 45.8150], country: 'Hırvatistan', flag: '🇭🇷', city: 'Zagreb', specialty: 'Elektrikli Hiperaraç (Rimac), Infobip', tier: 1 },
  'saraybosna': { coords: [18.4131, 43.8563], country: 'Bosna-Hersek', flag: '🇧🇦', city: 'Saraybosna', specialty: 'Balkan Diaspora & Bilişim', tier: 1 },
  'sarajevo': { coords: [18.4131, 43.8563], country: 'Bosna-Hersek', flag: '🇧🇦', city: 'Saraybosna', specialty: 'Balkan Diaspora & Bilişim', tier: 1 },
  'uskup': { coords: [21.4280, 41.9973], country: 'Kuzey Makedonya', flag: '🇲🇰', city: 'Üsküp', specialty: 'Balkan Yazılım Vadisi', tier: 1 },
  'skopje': { coords: [21.4280, 41.9973], country: 'Kuzey Makedonya', flag: '🇲🇰', city: 'Üsküp', specialty: 'Balkan Yazılım Vadisi', tier: 1 },
  'tiran': { coords: [19.8187, 41.3275], country: 'Arnavutluk', flag: '🇦🇱', city: 'Tiran', specialty: 'Piramida Dijital İnovasyon Merkezi', tier: 1 },
  'tirana': { coords: [19.8187, 41.3275], country: 'Arnavutluk', flag: '🇦🇱', city: 'Tiran', specialty: 'Piramida Dijital İnovasyon Merkezi', tier: 1 },
  'pristine': { coords: [21.1655, 42.6629], country: 'Kosova', flag: '🇽🇰', city: 'Priştine', specialty: 'Genç Bilişim Nüfusu & Dış Kaynak', tier: 1 },
  'pristina': { coords: [21.1655, 42.6629], country: 'Kosova', flag: '🇽🇰', city: 'Priştine', specialty: 'Genç Bilişim Nüfusu & Dış Kaynak', tier: 1 },
  'kiev': { coords: [30.5234, 50.4501], country: 'Ukrayna', flag: '🇺🇦', city: 'Kiev', specialty: 'Savunma Teknolojileri (Brave1), Yazılım', tier: 1 },
  'kyiv': { coords: [30.5234, 50.4501], country: 'Ukrayna', flag: '🇺🇦', city: 'Kiev', specialty: 'Savunma Teknolojileri (Brave1), Yazılım', tier: 1 },
  'lviv': { coords: [24.0297, 49.8397], country: 'Ukrayna', flag: '🇺🇦', city: 'Lviv', specialty: 'Lviv IT Cluster' },
  'moskova': { coords: [37.6173, 55.7558], country: 'Rusya', flag: '🇷🇺', city: 'Moskova', specialty: 'Yandex, Skolkovo İnovasyon Merkezi', tier: 1 },
  'moscow': { coords: [37.6173, 55.7558], country: 'Rusya', flag: '🇷🇺', city: 'Moskova', specialty: 'Yandex, Skolkovo İnovasyon Merkezi', tier: 1 },
  'st petersburg': { coords: [30.3351, 59.9343], country: 'Rusya', flag: '🇷🇺', city: 'St. Petersburg', specialty: 'Algoritmik Programlama (ITMO)' },

  // CAUCASUS & CENTRAL ASIA (KAFKASYA & ORTA ASYA)
  'baku': { coords: [49.8671, 40.4093], country: 'Azerbaycan', flag: '🇦🇿', city: 'Bakü', specialty: 'Hazar İnovasyon Koridoru, Petrol Bilişimi', tier: 1 },
  'bakü': { coords: [49.8671, 40.4093], country: 'Azerbaycan', flag: '🇦🇿', city: 'Bakü', specialty: 'Hazar İnovasyon Koridoru, Petrol Bilişimi', tier: 1 },
  'gence': { coords: [46.3606, 40.6828], country: 'Azerbaycan', flag: '🇦🇿', city: 'Gence', specialty: 'Sanayi & Akademi' },
  'sumqayit': { coords: [49.6317, 40.5897], country: 'Azerbaycan', flag: '🇦🇿', city: 'Sumqayıt', specialty: 'Kimya Endüstri Parkı' },
  'tiflis': { coords: [44.8271, 41.7151], country: 'Gürcistan', flag: '🇬🇪', city: 'Tiflis', specialty: 'GITA İnovasyon Ajansı, Kripto Hub', tier: 1 },
  'tbilisi': { coords: [44.8271, 41.7151], country: 'Gürcistan', flag: '🇬🇪', city: 'Tiflis', specialty: 'GITA İnovasyon Ajansı, Kripto Hub', tier: 1 },
  'batum': { coords: [41.6168, 41.6168], country: 'Gürcistan', flag: '🇬🇪', city: 'Batum', specialty: 'Karadeniz Lojistiği & Turizm' },
  'almati': { coords: [76.8512, 43.2220], country: 'Kazakistan', flag: '🇰🇿', city: 'Almatı', specialty: 'FinTech (Kaspi), Girişimcilik', tier: 1 },
  'almaty': { coords: [76.8512, 43.2220], country: 'Kazakistan', flag: '🇰🇿', city: 'Almatı', specialty: 'FinTech (Kaspi), Girişimcilik', tier: 1 },
  'astana': { coords: [71.4491, 51.1694], country: 'Kazakistan', flag: '🇰🇿', city: 'Astana', specialty: 'Astana Hub, AIFC Uluslararası Finans Merkezi', tier: 1 },
  'taskent': { coords: [69.2401, 41.2995], country: 'Özbekistan', flag: '🇺🇿', city: 'Taşkent', specialty: 'IT Park Uzbekistan, BPO & Yazılım İhracatı', tier: 1 },
  'tashkent': { coords: [69.2401, 41.2995], country: 'Özbekistan', flag: '🇺🇿', city: 'Taşkent', specialty: 'IT Park Uzbekistan, BPO & Yazılım İhracatı', tier: 1 },
  'semerkant': { coords: [66.9597, 39.6270], country: 'Özbekistan', flag: '🇺🇿', city: 'Semerkant', specialty: 'İpek Yolu Turizm & Akıllı Şehir' },
  'biskek': { coords: [74.5698, 42.8746], country: 'Kırgızistan', flag: '🇰🇬', city: 'Bişkek', specialty: 'Yüksek Teknoloji Parkı (HTP)', tier: 1 },
  'askabat': { coords: [58.3261, 37.9601], country: 'Türkmenistan', flag: '🇹🇲', city: 'Aşkabat', specialty: 'Akıllı Şehir Teknolojileri', tier: 1 },
  'dusanbe': { coords: [68.7864, 38.5598], country: 'Tacikistan', flag: '🇹🇯', city: 'Duşanbe', specialty: 'Hidroelektrik Bilişim Sistemleri', tier: 1 },

  // MIDDLE EAST & GULF (ORTA DOĞU & KÖRFEZ)
  'dubai': { coords: [55.2708, 25.2048], country: 'Birleşik Arap Emirlikleri', flag: '🇦🇪', city: 'Dubai', specialty: 'DIFC FinTech, Web3, Geleceğin Şehri', tier: 1 },
  'abu dabi': { coords: [54.3773, 24.4539], country: 'Birleşik Arap Emirlikleri', flag: '🇦🇪', city: 'Abu Dabi', specialty: 'G42 AI, Hub71, Masdar CleanTech', tier: 1 },
  'abu dhabi': { coords: [54.3773, 24.4539], country: 'Birleşik Arap Emirlikleri', flag: '🇦🇪', city: 'Abu Dabi', specialty: 'G42 AI, Hub71, Masdar CleanTech', tier: 1 },
  'sarika': { coords: [55.4033, 25.3463], country: 'Birleşik Arap Emirlikleri', flag: '🇦🇪', city: 'Şarika', specialty: 'Araştırma & İnovasyon Parkı' },
  'sharjah': { coords: [55.4033, 25.3463], country: 'Birleşik Arap Emirlikleri', flag: '🇦🇪', city: 'Şarika', specialty: 'Araştırma & İnovasyon Parkı' },
  'doha': { coords: [51.5310, 25.2854], country: 'Katar', flag: '🇶🇦', city: 'Doha', specialty: 'Qatar Science & Technology Park (QSTP)', tier: 1 },
  'riyad': { coords: [46.6753, 24.7136], country: 'Suudi Arabistan', flag: '🇸🇦', city: 'Riyad', specialty: 'Vision 2030, LEAP Teknoloji Zirvesi, FinTech', tier: 1 },
  'riyadh': { coords: [46.6753, 24.7136], country: 'Suudi Arabistan', flag: '🇸🇦', city: 'Riyad', specialty: 'Vision 2030, LEAP Teknoloji Zirvesi, FinTech', tier: 1 },
  'cidde': { coords: [39.1925, 21.4858], country: 'Suudi Arabistan', flag: '🇸🇦', city: 'Cidde', specialty: 'Kızıldeniz Ticaret & Lojistik Hubı', tier: 1 },
  'jeddah': { coords: [39.1925, 21.4858], country: 'Suudi Arabistan', flag: '🇸🇦', city: 'Cidde', specialty: 'Kızıldeniz Ticaret & Lojistik Hubı', tier: 1 },
  'dammam': { coords: [50.1033, 26.4207], country: 'Suudi Arabistan', flag: '🇸🇦', city: 'Dammam', specialty: 'Aramco Enerji Teknolojileri & Dhahran' },
  'kuveyt': { coords: [47.9774, 29.3759], country: 'Kuveyt', flag: '🇰🇼', city: 'Kuveyt', specialty: 'Körfez Yatırım & Bilişim Fonları', tier: 1 },
  'kuwait': { coords: [47.9774, 29.3759], country: 'Kuveyt', flag: '🇰🇼', city: 'Kuveyt', specialty: 'Körfez Yatırım & Bilişim Fonları', tier: 1 },
  'manama': { coords: [50.5860, 26.2285], country: 'Bahreyn', flag: '🇧🇭', city: 'Manama', specialty: 'Bahrain FinTech Bay', tier: 1 },
  'maskat': { coords: [58.4059, 23.5859], country: 'Umman', flag: '🇴🇲', city: 'Maskat', specialty: 'Knowledge Oasis Muscat (KOM)', tier: 1 },
  'muscat': { coords: [58.4059, 23.5859], country: 'Umman', flag: '🇴🇲', city: 'Maskat', specialty: 'Knowledge Oasis Muscat (KOM)', tier: 1 },
  'tel aviv': { coords: [34.7818, 32.0853], country: 'İsrail', flag: '🇮🇱', city: 'Tel Aviv', specialty: 'Silicon Wadi, Siber Güvenlik, AI & VC', tier: 1 },
  'kudus': { coords: [35.2137, 31.7683], country: 'İsrail', flag: '🇮🇱', city: 'Kudüs', specialty: 'Otonom Araçlar (Mobileye), Biyomedikal' },
  'amman': { coords: [35.9284, 31.9454], country: 'Ürdün', flag: '🇯🇴', city: 'Amman', specialty: 'Orta Doğu Oyun & Web Geliştirme', tier: 1 },
  'beyrut': { coords: [35.5018, 33.8938], country: 'Lübnan', flag: '🇱🇧', city: 'Beyrut', specialty: 'Yaratıcı Endüstriler & Finansal Danışmanlık', tier: 1 },
  'bagdat': { coords: [44.3661, 33.3152], country: 'Irak', flag: '🇮🇶', city: 'Bağdat', specialty: 'Altyapı & Telekomünikasyon', tier: 1 },
  'erbil': { coords: [44.0092, 36.1911], country: 'Irak', flag: '🇮🇶', city: 'Erbil', specialty: 'Ticaret, İnşaat & Girişimcilik' },
  'kahire': { coords: [31.2357, 30.0444], country: 'Mısır', flag: '🇪🇬', city: 'Kahire', specialty: 'Kuzey Afrika Start-up Hubı, GrEEK Campus', tier: 1 },
  'cairo': { coords: [31.2357, 30.0444], country: 'Mısır', flag: '🇪🇬', city: 'Kahire', specialty: 'Kuzey Afrika Start-up Hubı, GrEEK Campus', tier: 1 },
  'kazablanka': { coords: [-7.5898, 33.5731], country: 'Fas', flag: '🇲🇦', city: 'Kazablanka', specialty: 'Casablanca Finance City, BPO', tier: 1 },
  'casablanca': { coords: [-7.5898, 33.5731], country: 'Fas', flag: '🇲🇦', city: 'Kazablanka', specialty: 'Casablanca Finance City, BPO', tier: 1 },

  // ASIA & PACIFIC (ASYA-PASİFİK)
  'tokyo': { coords: [139.6917, 35.6895], country: 'Japonya', flag: '🇯🇵', city: 'Tokyo', specialty: 'Robotik, İleri Donanım, AI & Oyun', tier: 1 },
  'osaka': { coords: [135.5023, 34.6937], country: 'Japonya', flag: '🇯🇵', city: 'Osaka', specialty: 'Elektronik & Biyomedikal İnovasyon', tier: 1 },
  'kyoto': { coords: [135.7681, 35.0116], country: 'Japonya', flag: '🇯🇵', city: 'Kyoto', specialty: 'Nintendo, Yarı İletken Malzeme Bilimi', tier: 1 },
  'yokohama': { coords: [139.6380, 35.4437], country: 'Japonya', flag: '🇯🇵', city: 'Yokohama', specialty: 'Otomotiv Bilişimi & Akıllı Şehir' },
  'tsukuba': { coords: [140.1065, 36.0835], country: 'Japonya', flag: '🇯🇵', city: 'Tsukuba', specialty: 'Japonya Bilim Şehri, JAXA Uzay Ajansı' },
  'seul': { coords: [126.9780, 37.5665], country: 'Güney Kore', flag: '🇰🇷', city: 'Seul', specialty: 'Samsung, 5G/6G, Yapay Zeka & K-Tech', tier: 1 },
  'seoul': { coords: [126.9780, 37.5665], country: 'Güney Kore', flag: '🇰🇷', city: 'Seul', specialty: 'Samsung, 5G/6G, Yapay Zeka & K-Tech', tier: 1 },
  'pangyo': { coords: [127.1115, 37.3948], country: 'Güney Kore', flag: '🇰🇷', city: 'Pangyo', specialty: 'Kore Silikon Vadisi (Kakao, Naver, NCSoft)' },
  'busan': { coords: [129.0756, 35.1796], country: 'Güney Kore', flag: '🇰🇷', city: 'Busan', specialty: 'Blockchain Serbest Bölgesi, Akıllı Liman' },
  'pekin': { coords: [116.4074, 39.9042], country: 'Çin', flag: '🇨🇳', city: 'Pekin', specialty: 'Zhongguancun, Baidu, Tsinghua AI Araştırmaları', tier: 1 },
  'beijing': { coords: [116.4074, 39.9042], country: 'Çin', flag: '🇨🇳', city: 'Pekin', specialty: 'Zhongguancun, Baidu, Tsinghua AI Araştırmaları', tier: 1 },
  'sanghay': { coords: [121.4737, 31.2304], country: 'Çin', flag: '🇨🇳', city: 'Şanghay', specialty: 'Zhangjiang Hi-Tech Park, Finans & Çip', tier: 1 },
  'shanghai': { coords: [121.4737, 31.2304], country: 'Çin', flag: '🇨🇳', city: 'Şanghay', specialty: 'Zhangjiang Hi-Tech Park, Finans & Çip', tier: 1 },
  'shenzhen': { coords: [114.0579, 22.5431], country: 'Çin', flag: '🇨🇳', city: 'Shenzhen', specialty: 'Dünya Donanım Başkenti (Tencent, Huawei, DJI)', tier: 1 },
  'guangzhou': { coords: [113.2644, 23.1291], country: 'Çin', flag: '🇨🇳', city: 'Guangzhou', specialty: 'Otonom Araçlar (Pony.ai), Küresel İhracat' },
  'hangzhou': { coords: [120.1551, 30.2741], country: 'Çin', flag: '🇨🇳', city: 'Hangzhou', specialty: 'Alibaba Genel Merkezi, E-Ticaret & Bulut' },
  'hong kong': { coords: [114.1694, 22.3193], country: 'Çin', flag: '🇨🇳', city: 'Hong Kong', specialty: 'Cyberport, FinTech & Uluslararası Sermaye', tier: 1 },
  'taipei': { coords: [121.5654, 25.0330], country: 'Tayvan', flag: '🇹🇼', city: 'Taipei', specialty: 'Donanım & Bilişim Ekosistemi (ASUS, Acer)', tier: 1 },
  'hsinchu': { coords: [120.9686, 24.8066], country: 'Tayvan', flag: '🇹🇼', city: 'Hsinchu', specialty: 'TSMC, Dünya Yarı İletken Kalbi' },
  'singapur': { coords: [103.8198, 1.3521], country: 'Singapur', flag: '🇸🇬', city: 'Singapur', specialty: 'Güneydoğu Asya FinTech & AI Merkezi', tier: 1 },
  'singapore': { coords: [103.8198, 1.3521], country: 'Singapur', flag: '🇸🇬', city: 'Singapur', specialty: 'Güneydoğu Asya FinTech & AI Merkezi', tier: 1 },
  'kuala lumpur': { coords: [101.6869, 3.1390], country: 'Malezya', flag: '🇲🇾', city: 'Kuala Lumpur', specialty: 'Cyberjaya, İslami FinTech Hubı', tier: 1 },
  'cyberjaya': { coords: [101.6558, 2.9213], country: 'Malezya', flag: '🇲🇾', city: 'Cyberjaya', specialty: 'Malezya Silikon Vadisi' },
  'jakarta': { coords: [106.8456, -6.2088], country: 'Endonezya', flag: '🇮🇩', city: 'Cakarta', specialty: 'Güneydoğu Asya Unicorn Merkezi (GoTo)', tier: 1 },
  'bali': { coords: [115.1889, -8.4095], country: 'Endonezya', flag: '🇮🇩', city: 'Bali', specialty: 'Küresel Dijital Göçebe & Web3 Hubı' },
  'bangkok': { coords: [100.5018, 13.7563], country: 'Tayland', flag: '🇹🇭', city: 'Bangkok', specialty: 'True Digital Park, E-Ticaret', tier: 1 },
  'hanoi': { coords: [105.8342, 21.0278], country: 'Vietnam', flag: '🇻🇳', city: 'Hanoi', specialty: 'Yazılım İhracatı (FPT), Donanım Montaj', tier: 1 },
  'ho chi minh': { coords: [106.6297, 10.8231], country: 'Vietnam', flag: '🇻🇳', city: 'Ho Chi Minh', specialty: 'Girişimcilik, Oyun Stüdyoları' },
  'manila': { coords: [120.9842, 14.5995], country: 'Filipinler', flag: '🇵🇭', city: 'Manila', specialty: 'BGC, Küresel BPO & BT Destek Hizmetleri', tier: 1 },
  'bengaluru': { coords: [77.5946, 12.9716], country: 'Hindistan', flag: '🇮🇳', city: 'Bengaluru', specialty: 'Hindistan Silikon Vadisi, Yazılım & SaaS', tier: 1 },
  'bangalore': { coords: [77.5946, 12.9716], country: 'Hindistan', flag: '🇮🇳', city: 'Bengaluru', specialty: 'Hindistan Silikon Vadisi, Yazılım & SaaS', tier: 1 },
  'mumbai': { coords: [72.8777, 19.0760], country: 'Hindistan', flag: '🇮🇳', city: 'Mumbai', specialty: 'Hindistan Finans & Medya Başkenti', tier: 1 },
  'yeni delhi': { coords: [77.2090, 28.6139], country: 'Hindistan', flag: '🇮🇳', city: 'Yeni Delhi', specialty: 'IIT Delhi, Hükümet Teknolojileri', tier: 1 },
  'new delhi': { coords: [77.2090, 28.6139], country: 'Hindistan', flag: '🇮🇳', city: 'Yeni Delhi', specialty: 'IIT Delhi, Hükümet Teknolojileri', tier: 1 },
  'hyderabad': { coords: [78.4867, 17.3850], country: 'Hindistan', flag: '🇮🇳', city: 'Haydarabad', specialty: 'HITEC City, Microsoft & Google Kampüsleri' },
  'pune': { coords: [73.8567, 18.5204], country: 'Hindistan', flag: '🇮🇳', city: 'Pune', specialty: 'Otomotiv Yazılımları & IT İhracatı' },
  'gurgaon': { coords: [77.0266, 28.4595], country: 'Hindistan', flag: '🇮🇳', city: 'Gurgaon', specialty: 'FinTech & Kurumsal Yazılım Merkezleri' },
  'islamabad': { coords: [73.0479, 33.6844], country: 'Pakistan', flag: '🇵🇰', city: 'İslamabad', specialty: 'Ulusal İnovasyon Merkezi (NIC)', tier: 1 },
  'dakka': { coords: [90.4125, 23.8103], country: 'Bangladeş', flag: '🇧🇩', city: 'Dakka', specialty: 'Mobil Bankacılık (bKash) & BPO', tier: 1 },
  'dhaka': { coords: [90.4125, 23.8103], country: 'Bangladeş', flag: '🇧🇩', city: 'Dakka', specialty: 'Mobil Bankacılık (bKash) & BPO', tier: 1 },

  // AUSTRALIA & OCEANIA (AVUSTRALYA & OKYANUSYA)
  'sidney': { coords: [151.2093, -33.8688], country: 'Avustralya', flag: '🇦🇺', city: 'Sidney', specialty: 'Atlassian, Canva, FinTech Hubı', tier: 1 },
  'sydney': { coords: [151.2093, -33.8688], country: 'Avustralya', flag: '🇦🇺', city: 'Sidney', specialty: 'Atlassian, Canva, FinTech Hubı', tier: 1 },
  'melbourne': { coords: [144.9631, -37.8136], country: 'Avustralya', flag: '🇦🇺', city: 'Melbourne', specialty: 'Biyomedikal, Oyun Tasarımı & Yapay Zeka', tier: 1 },
  'brisbane': { coords: [153.0251, -27.4698], country: 'Avustralya', flag: '🇦🇺', city: 'Brisbane', specialty: 'Havacılık Bilişimi & Biyoçeşitlilik' },
  'perth': { coords: [115.8605, -31.9505], country: 'Avustralya', flag: '🇦🇺', city: 'Perth', specialty: 'Madencilik Otomasyonu & Otonom Trenler' },
  'adelaide': { coords: [138.6007, -34.9285], country: 'Avustralya', flag: '🇦🇺', city: 'Adelaide', specialty: 'Lot Fourteen, Avustralya Uzay Ajansı' },
  'canberra': { coords: [149.1300, -35.2809], country: 'Avustralya', flag: '🇦🇺', city: 'Canberra', specialty: 'Siber Güvenlik & Hükümet Bilişimi' },
  'auckland': { coords: [174.7633, -36.8485], country: 'Yeni Zelanda', flag: '🇳🇿', city: 'Auckland', specialty: 'Rocket Lab Uzay Teknolojisi, SaaS', tier: 1 },
  'wellington': { coords: [174.7762, -41.2865], country: 'Yeni Zelanda', flag: '🇳🇿', city: 'Wellington', specialty: 'Wētā FX Dijital Efekt, GovTech' },

  // LATIN AMERICA & AFRICA (LATİN AMERİKA & AFRİKA)
  'sao paulo': { coords: [-46.6333, -23.5505], country: 'Brezilya', flag: '🇧🇷', city: 'Sao Paulo', specialty: 'Latin Amerika FinTech Başkenti (Nubank)', tier: 1 },
  'rio de janeiro': { coords: [-43.1729, -22.9068], country: 'Brezilya', flag: '🇧🇷', city: 'Rio de Janeiro', specialty: 'Petrobras Açık Deniz Bilişimi' },
  'buenos aires': { coords: [-58.3816, -34.6037], country: 'Arjantin', flag: '🇦🇷', city: 'Buenos Aires', specialty: 'MercadoLibre, Kripto Entegrasyonu', tier: 1 },
  'santiago': { coords: [-70.6693, -33.4489], country: 'Şili', flag: '🇨🇱', city: 'Santiago', specialty: 'Start-Up Chile, Lityum & Temiz Enerji', tier: 1 },
  'bogota': { coords: [-74.0721, 4.7110], country: 'Kolombiya', flag: '🇨🇴', city: 'Bogota', specialty: 'Rappi, BPO & Mobil Ticaret', tier: 1 },
  'lima': { coords: [-77.0428, -12.0464], country: 'Peru', flag: '🇵🇪', city: 'Lima', specialty: 'Madencilik Teknolojileri & FinTech', tier: 1 },
  'mexico city': { coords: [-99.1332, 19.4326], country: 'Meksika', flag: '🇲🇽', city: 'Meksiko', specialty: 'Latin Amerika En Büyük Girişim Pazarı', tier: 1 },
  'meksiko': { coords: [-99.1332, 19.4326], country: 'Meksika', flag: '🇲🇽', city: 'Meksiko', specialty: 'Latin Amerika En Büyük Girişim Pazarı', tier: 1 },
  'guadalajara': { coords: [-103.3496, 20.6597], country: 'Meksika', flag: '🇲🇽', city: 'Guadalajara', specialty: 'Meksika Silikon Vadisi, Donanım Üretimi' },
  'monterrey': { coords: [-100.3161, 25.6866], country: 'Meksika', flag: '🇲🇽', city: 'Monterrey', specialty: 'İleri İmalat & Yapay Zeka' },
  'johannesburg': { coords: [28.0473, -26.2041], country: 'Güney Afrika', flag: '🇿🇦', city: 'Johannesburg', specialty: 'Afrika Finans ve Madencilik Teknolojileri', tier: 1 },
  'cape town': { coords: [18.4241, -33.9249], country: 'Güney Afrika', flag: '🇿🇦', city: 'Cape Town', specialty: 'Silicon Cape, Yazılım Geliştirme' },
  'nairobi': { coords: [36.8219, -1.2921], country: 'Kenya', flag: '🇰🇪', city: 'Nairobi', specialty: 'Silicon Savannah, M-Pesa Mobil Ödeme', tier: 1 },
  'lagos': { coords: [3.3792, 6.5244], country: 'Nijerya', flag: '🇳🇬', city: 'Lagos', specialty: 'Yaba Teknoloji Kümesi, Afrika FinTech', tier: 1 },
  'kigali': { coords: [30.0619, -1.9441], country: 'Ruanda', flag: '🇷🇼', city: 'Kigali', specialty: 'Norrsken House, Akıllı Afrika Şehri', tier: 1 },
  'lefkosa': { coords: [33.3667, 35.1833], country: 'Kıbrıs', flag: '🇨🇾', city: 'Lefkoşa', specialty: 'Üniversiteler Adası, Bilişim & Finans', tier: 1 },
  'nicosia': { coords: [33.3667, 35.1833], country: 'Kıbrıs', flag: '🇨🇾', city: 'Lefkoşa', specialty: 'Üniversiteler Adası, Bilişim & Finans', tier: 1 },
  'girne': { coords: [33.3167, 35.3333], country: 'Kıbrıs', flag: '🇨🇾', city: 'Girne', specialty: 'Turizm, Denizcilik & Uluslararası Eğitim', tier: 2 },

  // BALKANS (BALKANLAR)
  'podgorica': { coords: [19.2595, 42.4411], country: 'Karadağ', flag: '🇲🇪', city: 'Podgorica', region: 'Balkanlar', specialty: 'Bilişim & Finans Merkezi', tier: 1 },
  'kotor': { coords: [18.7712, 42.4247], country: 'Karadağ', flag: '🇲🇪', city: 'Kotor', region: 'Balkanlar', specialty: 'Denizcilik & Akıllı Turizm', tier: 2 },
  'ljubljana': { coords: [14.5058, 46.0569], country: 'Slovenya', flag: '🇸🇮', city: 'Ljubljana', region: 'Orta Avrupa', specialty: 'Biyofarmasötik & Kripto Vadisi', tier: 1 },
  'maribor': { coords: [15.6467, 46.5547], country: 'Slovenya', flag: '🇸🇮', city: 'Maribor', region: 'Orta Avrupa', specialty: 'Robotik & Malzeme Bilimi', tier: 2 },
  'bratislava': { coords: [17.1077, 48.1486], country: 'Slovakya', flag: '🇸🇰', city: 'Bratislava', region: 'Orta Avrupa', specialty: 'Siber Güvenlik (ESET) & Otomotiv', tier: 1 },
  'kosice': { coords: [21.2611, 48.7164], country: 'Slovakya', flag: '🇸🇰', city: 'Košice', region: 'Orta Avrupa', specialty: 'Kosice IT Valley & Yazılım', tier: 2 },

  // EASTERN EUROPE & NORDICS
  'minsk': { coords: [27.5615, 53.9045], country: 'Belarus', flag: '🇧🇾', city: 'Minsk', region: 'Doğu Avrupa', specialty: 'Yüksek Teknoloji Parkı (HTP)', tier: 1 },
  'brest': { coords: [23.7618, 52.0976], country: 'Belarus', flag: '🇧🇾', city: 'Brest', region: 'Doğu Avrupa', specialty: 'Lojistik & Sınır Ticareti', tier: 2 },
  'kisinev': { coords: [28.8638, 47.0105], country: 'Moldova', flag: '🇲🇩', city: 'Kişinev', region: 'Doğu Avrupa', specialty: 'Moldova IT Park & BPO', tier: 1 },
  'chisinau': { coords: [28.8638, 47.0105], country: 'Moldova', flag: '🇲🇩', city: 'Kişinev', region: 'Doğu Avrupa', specialty: 'Moldova IT Park & BPO', tier: 1 },
  'reykjavik': { coords: [-21.9426, 64.1466], country: 'İzlanda', flag: '🇮🇸', city: 'Reykjavik', region: 'Kuzey Avrupa', specialty: 'Jeotermal Veri Merkezleri & Oyun', tier: 1 },
  'luksemburg': { coords: [6.1319, 49.6116], country: 'Lüksemburg', flag: '🇱🇺', city: 'Lüksemburg', region: 'Batı Avrupa', specialty: 'FinTech, Uzay Madenciliği & Yatırım', tier: 1 },
  'luxembourg': { coords: [6.1319, 49.6116], country: 'Lüksemburg', flag: '🇱🇺', city: 'Lüksemburg', region: 'Batı Avrupa', specialty: 'FinTech, Uzay Madenciliği & Yatırım', tier: 1 },
  'valletta': { coords: [14.5141, 35.8997], country: 'Malta', flag: '🇲🇹', city: 'Valletta', region: 'Güney Avrupa', specialty: 'iGaming, FinTech & Denizcilik', tier: 1 },

  // CAUCASUS & MIDDLE EAST
  'erivan': { coords: [44.5152, 40.1872], country: 'Ermenistan', flag: '🇦🇲', city: 'Erivan', region: 'Kafkasya', specialty: 'Mikroelektronik Tasarım & AI', tier: 1 },
  'yerevan': { coords: [44.5152, 40.1872], country: 'Ermenistan', flag: '🇦🇲', city: 'Erivan', region: 'Kafkasya', specialty: 'Mikroelektronik Tasarım & AI', tier: 1 },
  'tahran': { coords: [51.3890, 35.6892], country: 'İran', flag: '🇮🇷', city: 'Tahran', region: 'Orta Doğu', specialty: 'Yapay Zeka & Nanoteknoloji', tier: 1 },
  'tehran': { coords: [51.3890, 35.6892], country: 'İran', flag: '🇮🇷', city: 'Tahran', region: 'Orta Doğu', specialty: 'Yapay Zeka & Nanoteknoloji', tier: 1 },
  'isfahan': { coords: [51.6660, 32.6546], country: 'İran', flag: '🇮🇷', city: 'İsfahan', region: 'Orta Doğu', specialty: 'Çelik & İleri Malzeme', tier: 2 },
  'tebriz': { coords: [46.2919, 38.0962], country: 'İran', flag: '🇮🇷', city: 'Tebriz', region: 'Orta Doğu', specialty: 'Otomotiv Sanayi & Makine', tier: 2 },

  // NORTH AFRICA
  'tunus': { coords: [10.1815, 36.8065], country: 'Tunus', flag: '🇹🇳', city: 'Tunus', region: 'Kuzey Afrika', specialty: 'Elgazala Teknopark & Havacılık Bilişimi', tier: 1 },
  'sfaks': { coords: [10.7603, 34.7406], country: 'Tunus', flag: '🇹🇳', city: 'Sfaks', region: 'Kuzey Afrika', specialty: 'Bilişim & Enerji Teknolojileri', tier: 2 },
  'cezayir': { coords: [3.0588, 36.7538], country: 'Cezayir', flag: '🇩🇿', city: 'Cezayir', region: 'Kuzey Afrika', specialty: 'Sidi Abdellah Bilişim Vadisi', tier: 1 },
  'alger': { coords: [3.0588, 36.7538], country: 'Cezayir', flag: '🇩🇿', city: 'Cezayir', region: 'Kuzey Afrika', specialty: 'Sidi Abdellah Bilişim Vadisi', tier: 1 },
  'oran': { coords: [-0.6417, 35.6987], country: 'Cezayir', flag: '🇩🇿', city: 'Oran', region: 'Kuzey Afrika', specialty: 'Petrokimya & Akdeniz Lojistiği', tier: 2 },
  'trablus': { coords: [13.1913, 32.8872], country: 'Libya', flag: '🇱🇾', city: 'Trablus', region: 'Kuzey Afrika', specialty: 'Telekom & Enerji Ticareti', tier: 1 },
  'tripoli': { coords: [13.1913, 32.8872], country: 'Libya', flag: '🇱🇾', city: 'Trablus', region: 'Kuzey Afrika', specialty: 'Telekom & Enerji Ticareti', tier: 1 },
  'bingazi': { coords: [20.0667, 32.1167], country: 'Libya', flag: '🇱🇾', city: 'Bingazi', region: 'Kuzey Afrika', specialty: 'Liman & İnşaat Mühendisliği', tier: 2 },

  // SOUTH & EAST ASIA
  'kolombo': { coords: [79.8612, 6.9271], country: 'Sri Lanka', flag: '🇱🇰', city: 'Kolombo', region: 'Güney Asya', specialty: 'FinTech & Yazılım Dış Kaynak', tier: 1 },
  'colombo': { coords: [79.8612, 6.9271], country: 'Sri Lanka', flag: '🇱🇰', city: 'Kolombo', region: 'Güney Asya', specialty: 'FinTech & Yazılım Dış Kaynak', tier: 1 },
  'katmandu': { coords: [85.3240, 27.7172], country: 'Nepal', flag: '🇳🇵', city: 'Katmandu', region: 'Güney Asya', specialty: 'Coğrafi Bilgi Sistemleri & Yazılım', tier: 1 },
  'kathmandu': { coords: [85.3240, 27.7172], country: 'Nepal', flag: '🇳🇵', city: 'Katmandu', region: 'Güney Asya', specialty: 'Coğrafi Bilgi Sistemleri & Yazılım', tier: 1 },
  'ulan batur': { coords: [106.9057, 47.8864], country: 'Moğolistan', flag: '🇲🇳', city: 'Ulan Batur', region: 'Doğu Asya', specialty: 'Madencilik Otomasyonu & Uydu Ağı', tier: 1 },
  'ulaanbaatar': { coords: [106.9057, 47.8864], country: 'Moğolistan', flag: '🇲🇳', city: 'Ulan Batur', region: 'Doğu Asya', specialty: 'Madencilik Otomasyonu & Uydu Ağı', tier: 1 },

  // LATIN AMERICA
  'montevideo': { coords: [-56.1645, -34.9011], country: 'Uruguay', flag: '🇺🇾', city: 'Montevideo', region: 'Güney Amerika', specialty: 'Yazılım İhracatı, FinTech (dLocal)', tier: 1 },
  'asuncion': { coords: [-57.5759, -25.2637], country: 'Paraguay', flag: '🇵🇾', city: 'Asunción', region: 'Güney Amerika', specialty: 'Yeşil Hidroenerji & Bilişim', tier: 1 },
  'asunción': { coords: [-57.5759, -25.2637], country: 'Paraguay', flag: '🇵🇾', city: 'Asunción', region: 'Güney Amerika', specialty: 'Yeşil Hidroenerji & Bilişim', tier: 1 },
  'quito': { coords: [-78.4678, -0.1807], country: 'Ekvador', flag: '🇪🇨', city: 'Kito', region: 'Güney Amerika', specialty: 'Yachay Bilim Şehri, Biyoteknoloji', tier: 1 },
  'kito': { coords: [-78.4678, -0.1807], country: 'Ekvador', flag: '🇪🇨', city: 'Kito', region: 'Güney Amerika', specialty: 'Yachay Bilim Şehri, Biyoteknoloji', tier: 1 },
  'guayaquil': { coords: [-79.9224, -2.1894], country: 'Ekvador', flag: '🇪🇨', city: 'Guayaquil', region: 'Güney Amerika', specialty: 'Dış Ticaret & Liman Bilişimi', tier: 2 },
  'la paz': { coords: [-68.1193, -16.4897], country: 'Bolivya', flag: '🇧🇴', city: 'La Paz', region: 'Güney Amerika', specialty: 'Telekom & Yüksek İrtifa Teknolojileri', tier: 1 },
  'santa cruz': { coords: [-63.1812, -17.7863], country: 'Bolivya', flag: '🇧🇴', city: 'Santa Cruz', region: 'Güney Amerika', specialty: 'Agrotech & Enerji', tier: 2 },
  'karakas': { coords: [-66.9036, 10.4806], country: 'Venezuela', flag: '🇻🇪', city: 'Karakas', region: 'Güney Amerika', specialty: 'Petrol Mühendisliği & Ağ Altyapısı', tier: 1 },
  'caracas': { coords: [-66.9036, 10.4806], country: 'Venezuela', flag: '🇻🇪', city: 'Karakas', region: 'Güney Amerika', specialty: 'Petrol Mühendisliği & Ağ Altyapısı', tier: 1 },
  'san jose cr': { coords: [-84.0907, 9.9281], country: 'Kosta Rika', flag: '🇨🇷', city: 'San José', region: 'Orta Amerika', specialty: 'MedTek & Intel Yarı İletken Lab', tier: 1 },
  'san jose (kosta rika)': { coords: [-84.0907, 9.9281], country: 'Kosta Rika', flag: '🇨🇷', city: 'San José', region: 'Orta Amerika', specialty: 'MedTek & Intel Yarı İletken Lab', tier: 1 },
  'panama': { coords: [-79.5199, 8.9824], country: 'Panama', flag: '🇵🇦', city: 'Panama Şehri', region: 'Orta Amerika', specialty: 'Kanal Lojistiği & Uluslararası Finans', tier: 1 },
  'panama city': { coords: [-79.5199, 8.9824], country: 'Panama', flag: '🇵🇦', city: 'Panama Şehri', region: 'Orta Amerika', specialty: 'Kanal Lojistiği & Uluslararası Finans', tier: 1 },

  // SUB-SAHARAN AFRICA
  'akra': { coords: [-0.1870, 5.6037], country: 'Gana', flag: '🇬🇭', city: 'Akra', region: 'Batı Afrika', specialty: 'Google Afrika AI Araştırma Merkezi', tier: 1 },
  'accra': { coords: [-0.1870, 5.6037], country: 'Gana', flag: '🇬🇭', city: 'Akra', region: 'Batı Afrika', specialty: 'Google Afrika AI Araştırma Merkezi', tier: 1 },
  'addis ababa': { coords: [38.7578, 8.9806], country: 'Etiyopya', flag: '🇪🇹', city: 'Addis Ababa', region: 'Doğu Afrika', specialty: 'Afrika Birliği & Havacılık Akademisi', tier: 1 },
  'dakar': { coords: [-17.4677, 14.7167], country: 'Senegal', flag: '🇸🇳', city: 'Dakar', region: 'Batı Afrika', specialty: 'Dakar Dijital Şehri, Start-up Kümesi', tier: 1 },
  'darusselam': { coords: [39.2083, -6.7924], country: 'Tanzanya', flag: '🇹🇿', city: 'Darüsselam', region: 'Doğu Afrika', specialty: 'Liman Teknolojileri & Mobil Ödemeler', tier: 1 },
  'dar es salaam': { coords: [39.2083, -6.7924], country: 'Tanzanya', flag: '🇹🇿', city: 'Darüsselam', region: 'Doğu Afrika', specialty: 'Liman Teknolojileri & Mobil Ödemeler', tier: 1 },
  'dodoma': { coords: [35.7516, -6.1630], country: 'Tanzanya', flag: '🇹🇿', city: 'Dodoma', region: 'Doğu Afrika', specialty: 'Kamu Bilişimi & İdare', tier: 2 },
  'kampala': { coords: [32.5825, 0.3476], country: 'Uganda', flag: '🇺🇬', city: 'Kampala', region: 'Doğu Afrika', specialty: 'Makerere AI Lab & FinTech', tier: 1 }
};

export const BASE_ALUMNI_HUBS = [
  {
    id: 'hub_sf',
    name: 'San Francisco, ABD',
    city: 'San Francisco',
    country: 'Amerika Birleşik Devletleri',
    flag: '🇺🇸',
    coordinates: [-122.4194, 37.7749],
    baseCount: 120,
    topCompanies: ['Google', 'Apple', 'Meta', 'Stripe', 'OpenAI'],
    topRoles: ['Yazılım Mühendisi', 'Ürün Yöneticisi', 'AI Araştırmacısı'],
    region: 'north_america'
  },
  {
    id: 'hub_london',
    name: 'Londra, Birleşik Krallık',
    city: 'Londra',
    country: 'Birleşik Krallık',
    flag: '🇬🇧',
    coordinates: [-0.1276, 51.5072],
    baseCount: 85,
    topCompanies: ['Amazon', 'Revolut', 'Barclays', 'DeepMind'],
    topRoles: ['Finans Analisti', 'Veri Bilimcisi', 'Frontend Mimar'],
    region: 'europe'
  },
  {
    id: 'hub_berlin',
    name: 'Berlin, Almanya',
    city: 'Berlin',
    country: 'Almanya',
    flag: '🇩🇪',
    coordinates: [13.4050, 52.5200],
    baseCount: 150,
    topCompanies: ['Delivery Hero', 'Zalando', 'N26', 'Siemens'],
    topRoles: ['Backend Dev.', 'Mobil Geliştirici', 'Büyüme Pazarlaması'],
    region: 'europe'
  },
  {
    id: 'hub_dubai',
    name: 'Dubai, BAE',
    city: 'Dubai',
    country: 'Birleşik Arap Emirlikleri',
    flag: '🇦🇪',
    coordinates: [55.2708, 25.2048],
    baseCount: 45,
    topCompanies: ['Emirates', 'Careem', 'Noon', 'EMAAR'],
    topRoles: ['İş Geliştirme', 'Proje Yöneticisi', 'Mühendislik'],
    region: 'middle_east'
  },
  {
    id: 'hub_duzce',
    name: 'Düzce, Türkiye',
    city: 'Düzce',
    country: 'Türkiye',
    flag: '🇹🇷',
    coordinates: [31.1626, 40.8387],
    baseCount: 420,
    topCompanies: ['Standart Profil', 'Teknorot Otomotiv', 'Düzce Cam', 'Nobel İlaç', 'Divapan'],
    topRoles: ['Makine Mühendisi', 'Endüstri Mühendisi', 'Ar-Ge Mühendisi', 'Üretim Planlama'],
    region: 'turkey'
  },
  {
    id: 'hub_tokyo',
    name: 'Tokyo, Japonya',
    city: 'Tokyo',
    country: 'Japonya',
    flag: '🇯🇵',
    coordinates: [139.6917, 35.6895],
    baseCount: 12,
    topCompanies: ['Sony', 'Toyota', 'Rakuten', 'LINE'],
    topRoles: ['Ar-Ge Uzmanı', 'Gömülü Sistemler', 'Endüstriyel Tasarım'],
    region: 'asia'
  },
  {
    id: 'hub_istanbul',
    name: 'İstanbul, Türkiye',
    city: 'İstanbul',
    country: 'Türkiye',
    flag: '🇹🇷',
    coordinates: [28.9784, 41.0082],
    baseCount: 3400,
    topCompanies: ['Trendyol', 'Aselsan', 'Getir', 'Ford Otosan', 'Türk Hava Yolları'],
    topRoles: ['Yazılım Geliştirici', 'Endüstri Mühendisi', 'Pazarlama', 'Klinik Uzman'],
    region: 'turkey'
  },
  {
    id: 'hub_ankara',
    name: 'Ankara, Türkiye',
    city: 'Ankara',
    country: 'Türkiye',
    flag: '🇹🇷',
    coordinates: [32.8597, 39.9334],
    baseCount: 890,
    topCompanies: ['Aselsan', 'Havelsan', 'Roketsan', 'TUSAŞ', 'TÜBİTAK'],
    topRoles: ['Savunma Sistemleri', 'Gömülü Yazılım', 'Sistem Mühendisi'],
    region: 'turkey'
  },
  {
    id: 'hub_izmir',
    name: 'İzmir, Türkiye',
    city: 'İzmir',
    country: 'Türkiye',
    flag: '🇹🇷',
    coordinates: [27.1428, 38.4237],
    baseCount: 520,
    topCompanies: ['Vestel', 'CMS Jant', 'Schneider Electric', 'Hugo Boss'],
    topRoles: ['Yazılım Geliştirici', 'Endüstri Mühendisi', 'Yenilenebilir Enerji'],
    region: 'turkey'
  }
];

export const REGION_PRESETS = [
  { id: 'all', label: '🌍 Tüm Dünya', center: [20, 40], zoom: 1 },
  { id: 'duzce_corridor', label: '📍 Düzce Hattı (3.06z)', center: [10, 44], zoom: 3.06, origin: 'Düzce' },
  { id: 'turkey', label: '🇹🇷 Türkiye', center: [35.2, 39.0], zoom: 4.2 },
  { id: 'europe', label: '🇪🇺 Avrupa', center: [14.0, 52.0], zoom: 3.2 },
  { id: 'north_america', label: '🇺🇸 Kuzey Amerika', center: [-98.0, 40.0], zoom: 2.4 },
  { id: 'middle_east', label: '🇦🇪 Körfez & Orta Doğu', center: [52.0, 26.0], zoom: 3.2 },
  { id: 'asia', label: '🇯🇵 Asya-Pasifik', center: [125.0, 32.0], zoom: 2.4 }
];

export function normalizeStr(str = '') {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/i̇/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Returns all major cities recorded for a given country name or code
 */
export function getCitiesForCountry(countryNameOrCode = '') {
  if (!countryNameOrCode) return [];
  const normQuery = normalizeStr(countryNameOrCode);
  
  // Find matching country in SUPPORTED_COUNTRIES
  const matchedCountry = SUPPORTED_COUNTRIES.find(c => {
    return (
      normalizeStr(c.name) === normQuery ||
      c.code.toLowerCase() === normQuery ||
      c.topoNames.some(t => normalizeStr(t) === normQuery) ||
      (normQuery.length >= 4 && (normalizeStr(c.name).includes(normQuery) || normQuery.includes(normalizeStr(c.name))))
    );
  });

  const targetCountryName = matchedCountry ? matchedCountry.name : countryNameOrCode;
  const normTarget = normalizeStr(targetCountryName);

  const matchedCities = [];
  const seenCityNames = new Set();

  for (const [key, val] of Object.entries(CITY_COORDINATES)) {
    if (!val || !val.country) continue;
    const normCityCountry = normalizeStr(val.country);
    if (normCityCountry === normTarget || (matchedCountry && matchedCountry.topoNames.some(t => normalizeStr(t) === normCityCountry))) {
      const cityName = val.city || key;
      if (!seenCityNames.has(cityName)) {
        seenCityNames.add(cityName);
        matchedCities.push({
          key,
          city: cityName,
          country: val.country,
          flag: val.flag,
          coords: val.coords,
          specialty: val.specialty || 'Akademik & Kariyer Merkezi'
        });
      }
    }
  }

  return matchedCities;
}

export function geocodeLocation(country = '', city = '') {
  const normCity = normalizeStr(city);
  const normCountry = normalizeStr(country);

  // 1. Direct city lookup
  if (normCity) {
    // Exact key match
    if (CITY_COORDINATES[normCity]) {
      const match = CITY_COORDINATES[normCity];
      return {
        coordinates: match.coords,
        country: match.country,
        flag: match.flag,
        city: city ? city.trim() : match.city
      };
    }

    // Tokenized / Substring search in CITY_COORDINATES
    const sortedCityEntries = Object.entries(CITY_COORDINATES).sort((a, b) => b[0].length - a[0].length);

    for (const [key, val] of sortedCityEntries) {
      if (
        normCity === key || 
        normCity.startsWith(key + ' ') || 
        normCity.endsWith(' ' + key) || 
        normCity.includes(' ' + key + ' ') ||
        (key.length >= 4 && normCity.includes(key)) ||
        (normCity.length >= 4 && key.includes(normCity))
      ) {
        return {
          coordinates: val.coords,
          country: val.country,
          flag: val.flag,
          city: city ? city.trim() : val.city
        };
      }
    }
  }

  // 2. Country lookup if city was not found or empty
  if (normCountry) {
    const matchedCountry = SUPPORTED_COUNTRIES.find(c => {
      const cNorm = normalizeStr(c.name);
      return (
        normCountry === cNorm ||
        c.code.toLowerCase() === normCountry ||
        (cNorm.length >= 4 && (normCountry.includes(cNorm) || cNorm.includes(normCountry))) ||
        c.topoNames.some(t => {
          const tNorm = normalizeStr(t);
          return normCountry === tNorm || (tNorm.length >= 4 && (normCountry.includes(tNorm) || tNorm.includes(normCountry)));
        })
      );
    });

    if (matchedCountry) {
      return {
        coordinates: matchedCountry.center,
        country: matchedCountry.name,
        flag: matchedCountry.flag,
        city: city && city.trim() ? city.trim() : matchedCountry.name
      };
    }

    // What if country input actually contained a known city name? (e.g., country: 'Dubai' or 'Berlin')
    if (CITY_COORDINATES[normCountry]) {
      const match = CITY_COORDINATES[normCountry];
      return {
        coordinates: match.coords,
        country: match.country,
        flag: match.flag,
        city: city && city.trim() ? city.trim() : match.city
      };
    }
  }

  // 3. Fallback: check if the city string matches a country
  if (normCity) {
    const countryFromCity = SUPPORTED_COUNTRIES.find(c => {
      const cNorm = normalizeStr(c.name);
      return (
        normCity === cNorm ||
        (cNorm.length >= 4 && (normCity.includes(cNorm) || cNorm.includes(normCity))) ||
        c.topoNames.some(t => normalizeStr(t) === normCity)
      );
    });
    if (countryFromCity) {
      return {
        coordinates: countryFromCity.center,
        country: countryFromCity.name,
        flag: countryFromCity.flag,
        city: countryFromCity.name
      };
    }
  }

  // 4. Ultimate robust fallback: Istanbul, Turkey
  return {
    coordinates: [28.9784, 41.0082],
    country: 'Türkiye',
    flag: '🇹🇷',
    city: city && city.trim() ? city.trim() : 'İstanbul'
  };
}

export function matchCountryToTopo(topoName = '', countryQuery = '') {
  if (!topoName || !countryQuery || typeof topoName !== 'string' || typeof countryQuery !== 'string') return false;
  const normTopo = normalizeStr(topoName);
  const normQuery = normalizeStr(countryQuery);

  if (!normTopo || !normQuery) return false;
  if (normTopo === normQuery) return true;

  // Direct bidirectional string inclusion
  if (normTopo.length >= 4 && normQuery.length >= 4) {
    if (normTopo.includes(normQuery) || normQuery.includes(normTopo)) return true;
  }

  const found = SUPPORTED_COUNTRIES.find(c => {
    const cNorm = normalizeStr(c.name);
    return (
      cNorm === normQuery || 
      c.code.toLowerCase() === normQuery ||
      c.topoNames.some(t => normalizeStr(t) === normQuery) ||
      (cNorm.length >= 4 && (cNorm.includes(normQuery) || normQuery.includes(cNorm)))
    );
  });

  if (found) {
    return (
      found.topoNames.some(t => {
        const tNorm = normalizeStr(t);
        return tNorm === normTopo || (tNorm.length >= 4 && (tNorm.includes(normTopo) || normTopo.includes(tNorm)));
      }) || 
      normalizeStr(found.name) === normTopo
    );
  }

  // Check reverse mapping from Topo name
  const foundByTopo = SUPPORTED_COUNTRIES.find(c => {
    return (
      normalizeStr(c.name) === normTopo ||
      c.topoNames.some(t => {
        const tNorm = normalizeStr(t);
        return tNorm === normTopo || (tNorm.length >= 4 && (tNorm.includes(normTopo) || normTopo.includes(tNorm)));
      })
    );
  });

  if (foundByTopo) {
    const cNorm = normalizeStr(foundByTopo.name);
    return (
      cNorm === normQuery ||
      foundByTopo.topoNames.some(t => normalizeStr(t) === normQuery) ||
      (cNorm.length >= 4 && (cNorm.includes(normQuery) || normQuery.includes(cNorm)))
    );
  }

  return false;
}

export function aggregateAlumniHubs(alumniList = [], currentUser = null) {
  const hubsMap = new Map();
  BASE_ALUMNI_HUBS.forEach(h => {
    hubsMap.set(h.id, {
      ...h,
      count: h.baseCount,
      alumniList: [],
      topCompanies: Array.isArray(h.topCompanies) ? [...h.topCompanies] : [],
      topRoles: Array.isArray(h.topRoles) ? [...h.topRoles] : [],
      isUserHere: false
    });
  });

  const fullAlumni = Array.isArray(alumniList) ? [...alumniList.filter(Boolean)] : [];
  if (currentUser && typeof currentUser === 'object' && currentUser.showOnGlobalMap !== false) {
    const exists = fullAlumni.some(a => (a?.id && a.id === currentUser.id) || (a?.email && a.email === currentUser.email));
    if (!exists) {
      fullAlumni.unshift({
        ...currentUser,
        isCurrentUser: true
      });
    }
  }

  const activeCountries = new Set([
    'Turkey', 'Germany', 'United States of America', 'United Kingdom', 'United Arab Emirates', 'Japan'
  ]);

  fullAlumni.forEach(alumnus => {
    if (!alumnus || alumnus.showOnGlobalMap === false) return;

    const checkupAnswers = Array.isArray(alumnus.checkupAnswers) ? alumnus.checkupAnswers : [];
    const checkupLoc = typeof checkupAnswers[7] === 'string' ? checkupAnswers[7].split('/') : [];
    const rawCountry = alumnus.country || (checkupLoc[1] ? checkupLoc[1].trim() : '') || '';
    const rawCity = alumnus.city || alumnus.location || (checkupLoc[0] ? checkupLoc[0].trim() : '') || '';

    const geocoded = geocodeLocation(rawCountry, rawCity);
    const countryObj = SUPPORTED_COUNTRIES.find(c => normalizeStr(c.name) === normalizeStr(geocoded.country));
    if (countryObj && Array.isArray(countryObj.topoNames)) {
      countryObj.topoNames.forEach(tn => activeCountries.add(tn));
    }

    let matchedHub = null;
    const normCity = normalizeStr(rawCity || geocoded.city);

    for (const hub of hubsMap.values()) {
      const hNormCity = normalizeStr(hub.city);
      const hNormCountry = normalizeStr(hub.country);
      if (normCity && (normCity.includes(hNormCity) || hNormCity.includes(normCity))) {
        matchedHub = hub;
        break;
      }
      if (!normCity && normalizeStr(geocoded.country).includes(hNormCountry)) {
        matchedHub = hub;
        break;
      }
    }

    const isCurrent = Boolean(
      currentUser && 
      ((alumnus.id && alumnus.id === currentUser.id) || (alumnus.email && alumnus.email === currentUser.email))
    );

    if (matchedHub) {
      matchedHub.count += 1;
      matchedHub.alumniList.push(alumnus);
      if (isCurrent) matchedHub.isUserHere = true;
      if (alumnus.company && !matchedHub.topCompanies.includes(alumnus.company)) {
        matchedHub.topCompanies.unshift(alumnus.company);
      }
      if ((alumnus.title || alumnus.role) && !matchedHub.topRoles.includes(alumnus.title || alumnus.role)) {
        matchedHub.topRoles.unshift(alumnus.title || alumnus.role);
      }
    } else if (rawCity || rawCountry) {
      const safeCityName = geocoded.city || 'Merkez';
      const safeCountryName = geocoded.country || 'Türkiye';
      const hubId = ('dynamic_' + normalizeStr(safeCityName) + '_' + normalizeStr(safeCountryName)).replace(/\s+/g, '_');

      if (hubsMap.has(hubId)) {
        const existing = hubsMap.get(hubId);
        existing.count += 1;
        existing.alumniList.push(alumnus);
        if (isCurrent) existing.isUserHere = true;
        if (alumnus.company && !existing.topCompanies.includes(alumnus.company)) {
          existing.topCompanies.unshift(alumnus.company);
        }
      } else {
        const coords = Array.isArray(geocoded.coordinates) && 
          geocoded.coordinates.length >= 2 && 
          Number.isFinite(geocoded.coordinates[0]) && 
          Number.isFinite(geocoded.coordinates[1])
            ? geocoded.coordinates
            : [28.9784, 41.0082];

        hubsMap.set(hubId, {
          id: hubId,
          name: safeCityName + ', ' + safeCountryName,
          city: safeCityName,
          country: safeCountryName,
          flag: geocoded.flag || '📍',
          coordinates: coords,
          count: 1,
          alumniList: [alumnus],
          topCompanies: alumnus.company ? [alumnus.company] : ['Teknoloji & İnovasyon'],
          topRoles: [alumnus.title || alumnus.role || 'Mezun Uzman'],
          region: 'custom',
          isUserHere: isCurrent
        });
      }
    }
  });

  const hubsArray = Array.from(hubsMap.values());
  const totalAlumniCount = hubsArray.reduce((sum, h) => sum + (Number.isFinite(h?.count) ? h.count : 0), 0);

  return {
    hubs: hubsArray,
    totalCount: totalAlumniCount,
    activeCountries: Array.from(activeCountries)
  };
}

export const CAREER_ROUTES = [
  // Düzce Routes (Inspired by Google Maps Direction from Düzce [31.162609, 40.83872] to Europe/Atlantic)
  {
    id: 'route_duzce_stuttgart',
    fromCity: 'Düzce',
    fromCountry: 'Türkiye',
    fromCoords: [31.1626, 40.8387],
    toCity: 'Stuttgart',
    toCountry: 'Almanya',
    toCoords: [9.1829, 48.7758],
    field: 'Otomotiv Yan Sanayi & İleri İmalat',
    alumniCount: 120,
    corridor: 'Almanya Otomotiv & İleri İmalat Koridoru',
    originHub: 'Düzce',
    title: 'Düzce ➔ Stuttgart Otomotiv Koridoru',
    description: 'Düzce sanayi kümelenmesi ve otomotiv yan sanayi mühendislerinin Stuttgart merkezli küresel otomotiv devlerine (Porsche, Bosch, Mercedes) uzanan kariyer ve staj hattı.'
  },
  {
    id: 'route_duzce_munich',
    fromCity: 'Düzce',
    fromCountry: 'Türkiye',
    fromCoords: [31.1626, 40.8387],
    toCity: 'Münih',
    toCountry: 'Almanya',
    toCoords: [11.5820, 48.1351],
    field: 'Makine, Robotik & Endüstriyel Otomasyon',
    alumniCount: 95,
    corridor: 'Bavyera Yüksek Teknoloji Hattı',
    originHub: 'Düzce',
    title: 'Düzce ➔ Münih Robotik & Makine Hattı',
    description: 'Düzce Üniversitesi ve İESÜ mühendislik mezunlarının Bavyera endüstriyel otomasyon ve mekatronik ekosistemine transfer yolu.'
  },
  {
    id: 'route_duzce_london',
    fromCity: 'Düzce',
    fromCountry: 'Türkiye',
    fromCoords: [31.1626, 40.8387],
    toCity: 'Londra',
    toCountry: 'Birleşik Krallık',
    toCoords: [-0.1276, 51.5072],
    field: 'Uluslararası Ticaret, Lojistik & Tedarik Zinciri',
    alumniCount: 80,
    corridor: 'Atlantik Ticaret & Dağıtım Hattı',
    originHub: 'Düzce',
    title: 'Düzce ➔ Londra Ticaret & Lojistik Rotası',
    description: 'Düzce sanayi havzası ürünlerinin İngiltere ve Birleşik Krallık ticaret ve tedarik zinciri ağlarıyla entegrasyonu.'
  },
  {
    id: 'route_duzce_detroit',
    fromCity: 'Düzce',
    fromCountry: 'Türkiye',
    fromCoords: [31.1626, 40.8387],
    toCity: 'Detroit',
    toCountry: 'Amerika Birleşik Devletleri',
    toCoords: [-83.0458, 42.3314],
    field: 'Global Otomotiv & Otonom Mobilite',
    alumniCount: 45,
    corridor: 'Transatlantik Otomotiv Koridoru',
    originHub: 'Düzce',
    title: 'Düzce ➔ Detroit Otomotiv Aksı',
    description: 'Kuzey Amerika otomotiv merkezi Detroit ile Düzce otomotiv yan sanayii arasındaki mühendislik ve inovasyon köprüsü.'
  },
  {
    id: 'route_duzce_tokyo',
    fromCity: 'Düzce',
    fromCountry: 'Türkiye',
    fromCoords: [31.1626, 40.8387],
    toCity: 'Tokyo',
    toCountry: 'Japonya',
    toCoords: [139.6917, 35.6895],
    field: 'Hassas Makine, Kalıp & Malzeme Teknolojileri',
    alumniCount: 35,
    corridor: 'Asya İleri İmalat Yolu',
    originHub: 'Düzce',
    title: 'Düzce ➔ Tokyo Hassas İmalat Hattı',
    description: 'Japonya hassas mekanik üreticileri ile Düzce cam ve sanayi kuruluşları arasındaki mühendislik ortaklığı.'
  },
  // İstanbul Routes
  {
    id: 'route_ist_berlin',
    fromCity: 'İstanbul',
    fromCountry: 'Türkiye',
    fromCoords: [28.9784, 41.0082],
    toCity: 'Berlin',
    toCountry: 'Almanya',
    toCoords: [13.4050, 52.5200],
    field: 'Start-up, Yazılım & FinTech',
    alumniCount: 280,
    corridor: 'Berlin Teknoloji Köprüsü',
    originHub: 'İstanbul',
    title: 'İstanbul ➔ Berlin Start-up Köprüsü',
    description: 'İstanbul teknoparkları ile Berlin start-up ekosistemi arasındaki yoğun yazılımcı ve kurucu ağı.'
  },
  {
    id: 'route_ist_london',
    fromCity: 'İstanbul',
    fromCountry: 'Türkiye',
    fromCoords: [28.9784, 41.0082],
    toCity: 'Londra',
    toCountry: 'Birleşik Krallık',
    toCoords: [-0.1276, 51.5072],
    field: 'Finans, Danışmanlık & AI',
    alumniCount: 210,
    corridor: 'Küresel Finans Hattı',
    originHub: 'İstanbul',
    title: 'İstanbul ➔ Londra FinTech & Danışmanlık Aksı',
    description: 'Londra City ile İstanbul Finans Merkezi arasındaki küresel bankacılık ve veri bilimi köprüsü.'
  },
  {
    id: 'route_ist_sf',
    fromCity: 'İstanbul',
    fromCountry: 'Türkiye',
    fromCoords: [28.9784, 41.0082],
    toCity: 'San Francisco',
    toCountry: 'Amerika Birleşik Devletleri',
    toCoords: [-122.4194, 37.7749],
    field: 'Yapay Zeka, VC & Büyük Teknoloji',
    alumniCount: 165,
    corridor: 'Silikon Vadisi Derin Teknoloji Hattı',
    originHub: 'İstanbul',
    title: 'İstanbul ➔ San Francisco Silikon Vadisi Hattı',
    description: 'OpenAI, Google, Meta gibi devlerde görev alan mezunlarımızın ana kariyer güzergahı.'
  },
  {
    id: 'route_ist_ny',
    fromCity: 'İstanbul',
    fromCountry: 'Türkiye',
    fromCoords: [28.9784, 41.0082],
    toCity: 'New York',
    toCountry: 'Amerika Birleşik Devletleri',
    toCoords: [-74.0060, 40.7128],
    field: 'Wall Street Finans & Medya',
    alumniCount: 140,
    corridor: 'Doğu Yakası Ticaret Koridoru',
    originHub: 'İstanbul',
    title: 'İstanbul ➔ New York Küresel İş Koridoru',
    description: 'New York merkezli yatırım bankaları ve küresel danışmanlık şirketlerinde kariyer inşa eden mezunlar.'
  },
  {
    id: 'route_ist_dubai',
    fromCity: 'İstanbul',
    fromCountry: 'Türkiye',
    fromCoords: [28.9784, 41.0082],
    toCity: 'Dubai',
    toCountry: 'Birleşik Arap Emirlikleri',
    toCoords: [55.2708, 25.2048],
    field: 'Körfez Lojistik, E-Ticaret & Web3',
    alumniCount: 190,
    corridor: 'Orta Doğu İnovasyon Koridoru',
    originHub: 'İstanbul',
    title: 'İstanbul ➔ Dubai Körfez Bilişim Koridoru',
    description: 'DIFC ve Dubai Internet City ekseninde hızla büyüyen Türk teknoloji ve ticaret diasporası.'
  },
  {
    id: 'route_ist_amsterdam',
    fromCity: 'İstanbul',
    fromCountry: 'Türkiye',
    fromCoords: [28.9784, 41.0082],
    toCity: 'Amsterdam',
    toCountry: 'Hollanda',
    toCoords: [4.9041, 52.3676],
    field: 'Bulut Bilişim & Veri Merkezleri',
    alumniCount: 115,
    corridor: 'Kuzey Avrupa Ağ Geçidi',
    originHub: 'İstanbul',
    title: 'İstanbul ➔ Amsterdam Dijital Altyapı Hattı',
    description: 'Avrupa internet omurgası AMS-IX ve Booking/Uber teknoloji merkezlerine uzanan mezun rotası.'
  },
  {
    id: 'route_ist_singapore',
    fromCity: 'İstanbul',
    fromCountry: 'Türkiye',
    fromCoords: [28.9784, 41.0082],
    toCity: 'Singapur',
    toCountry: 'Singapur',
    toCoords: [103.8198, 1.3521],
    field: 'Güneydoğu Asya Ticaret & FinTech',
    alumniCount: 75,
    corridor: 'Asya-Pasifik Köprüsü',
    originHub: 'İstanbul',
    title: 'İstanbul ➔ Singapur Pasifik Ticaret Hattı',
    description: 'Asya finans ve lojistik merkezinde görev yapan mezunlarımızın stratejik rotası.'
  },
  // Ankara Routes
  {
    id: 'route_ankara_dc',
    fromCity: 'Ankara',
    fromCountry: 'Türkiye',
    fromCoords: [32.8597, 39.9334],
    toCity: 'Washington',
    toCountry: 'Amerika Birleşik Devletleri',
    toCoords: [-77.0369, 38.9072],
    field: 'Havacılık, Savunma & Kamu Politikaları',
    alumniCount: 90,
    corridor: 'Hükümet & Savunma Ağı',
    originHub: 'Ankara',
    title: 'Ankara ➔ Washington Stratejik Savunma Ağı',
    description: 'Savunma sanayii, havacılık ve uluslararası kuruluşlarda çalışan mezunlar.'
  },
  {
    id: 'route_ankara_zurich',
    fromCity: 'Ankara',
    fromCountry: 'Türkiye',
    fromCoords: [32.8597, 39.9334],
    toCity: 'Zürih',
    toCountry: 'İsviçre',
    toCoords: [8.5417, 47.3769],
    field: 'Kuantum, Mikroelektronik & Akademi',
    alumniCount: 65,
    corridor: 'İsviçre Araştırma & Ar-Ge Yolu',
    originHub: 'Ankara',
    title: 'Ankara ➔ Zürih Bilim & Araştırma Hattı',
    description: 'ETH Zürih, CERN ve IBM Araştırma laboratuvarlarında doktora ve post-doc araştırmacı ağı.'
  },
  {
    id: 'route_ankara_seoul',
    fromCity: 'Ankara',
    fromCountry: 'Türkiye',
    fromCoords: [32.8597, 39.9334],
    toCity: 'Seul',
    toCountry: 'Güney Kore',
    toCoords: [126.9780, 37.5665],
    field: 'Elektronik & Siber Güvenlik',
    alumniCount: 50,
    corridor: 'Doğu Asya İleri Teknoloji Hattı',
    originHub: 'Ankara',
    title: 'Ankara ➔ Seul Donanım & Çip Hattı',
    description: 'Güney Kore savunma ve telekomünikasyon sanayii ile Ankara Ar-Ge ortaklıkları.'
  },
  // İzmir Routes
  {
    id: 'route_izmir_eindhoven',
    fromCity: 'İzmir',
    fromCountry: 'Türkiye',
    fromCoords: [27.1428, 38.4237],
    toCity: 'Eindhoven',
    toCountry: 'Hollanda',
    toCoords: [5.4697, 51.4416],
    field: 'Yarı İletken, Fotonik & Donanım',
    alumniCount: 85,
    corridor: 'Brainport Yüksek Teknoloji Hattı',
    originHub: 'İzmir',
    title: 'İzmir ➔ Eindhoven Çip & Fotonik Yolu',
    description: 'ASML ve Brainport Eindhoven ekosisteminde çalışan İESÜ mühendislerinin yolu.'
  },
  {
    id: 'route_izmir_copenhagen',
    fromCity: 'İzmir',
    fromCountry: 'Türkiye',
    fromCoords: [27.1428, 38.4237],
    toCity: 'Kopenhag',
    toCountry: 'Danimarka',
    toCoords: [12.5683, 55.6761],
    field: 'Rüzgar/Yeşil Enerji & Biyoekonomi',
    alumniCount: 60,
    corridor: 'Nordik Yeşil İnovasyon Yolu',
    originHub: 'İzmir',
    title: 'İzmir ➔ Kopenhag Yeşil Enerji Hattı',
    description: 'İzmir rüzgar türbini ve yenilenebilir enerji kümelenmesinden Danimarka yeşil teknoloji üslerine köprü.'
  },
  {
    id: 'route_izmir_barcelona',
    fromCity: 'İzmir',
    fromCountry: 'Türkiye',
    fromCoords: [27.1428, 38.4237],
    toCity: 'Barselona',
    toCountry: 'İspanya',
    toCoords: [2.1734, 41.3851],
    field: 'Akdeniz Akıllı Şehir & Yazılım',
    alumniCount: 70,
    corridor: 'Güney Avrupa İnovasyon Kuşağı',
    originHub: 'İzmir',
    title: 'İzmir ➔ Barselona Akıllı Şehir Koridoru',
    description: 'Akdeniz liman ve yazılım kültürü ortaklığı ile İspanya teknoparklarına bağlanan kariyer rotası.'
  }
];

export function getCareerRoutes(filterOrigin = null) {
  if (!filterOrigin || filterOrigin === 'all') return CAREER_ROUTES;
  const norm = normalizeStr(filterOrigin);
  return CAREER_ROUTES.filter(r => 
    normalizeStr(r.originHub) === norm || 
    normalizeStr(r.fromCity) === norm || 
    normalizeStr(r.toCity) === norm ||
    normalizeStr(r.fromCountry) === norm ||
    normalizeStr(r.toCountry) === norm
  );
}

export function getCityListByZoom(zoom = 1, country = null) {
  if (zoom < 2.5) {
    return [];
  }

  const allCities = Object.entries(CITY_COORDINATES).map(([key, val]) => ({
    key,
    ...val
  }));

  if (country) {
    const normCountry = normalizeStr(country);
    const countryCities = allCities.filter(c => 
      normalizeStr(c.country) === normCountry || 
      (c.country && normalizeStr(c.country).includes(normCountry))
    );
    if (zoom < 4.5) {
      return countryCities.filter(c => c.tier === 1);
    }
    return countryCities;
  }

  if (zoom < 4.5) {
    return allCities.filter(c => c.tier === 1);
  }

  return allCities;
}

