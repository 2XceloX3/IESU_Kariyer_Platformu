const fs = require('fs');

let content = fs.readFileSync('src/components/JobsAndInternships.jsx', 'utf8');

const replacements = {
    'guncel firsat': 'güncel fırsat',
    'Henuz ilan yok': 'Henüz ilan yok',
    'Yeni ilanlar eklendiginde burada gorunecek.': 'Yeni ilanlar eklendiğinde burada görünecek.',
    'Harikasin!': 'Harikasın!',
    'Butun ilanlari inceledin.': 'Bütün ilanları inceledin.',
    'Basa Don': 'Başa Dön',
    'Profil Eslesme': 'Profil Eşleşme',
    'eslesme': 'eşleşme',
    'Sola gec, saga basvur!': 'Sola geç, sağa başvur!',
    'Cumhurbaskanligi Insan Kaynaklari': 'Cumhurbaşkanlığı İnsan Kaynakları',
    'e-Devlet sifrenizle sisteme giris yapin.': 'e-Devlet şifrenizle sisteme giriş yapın.',
    'Staj Basvurusu menuunden guncel yilin programina tiklayin.': 'Staj Başvurusu menüsünden güncel yılın programına tıklayın.',
    'Basvuru formunu eksiksiz doldurun.': 'Başvuru formunu eksiksiz doldurun.',
    'Basvuru durumunuzu Kariyer Kapisi uzerinden takip edin.': 'Başvuru durumunuzu Kariyer Kapısı üzerinden takip edin.',
    'Ilgili Formlar': 'İlgili Formlar',
    'Mesleki Egitim Sozlesmesi': 'Mesleki Eğitim Sözleşmesi',
    'Is Sagligi ve Guvenligi': 'İş Sağlığı ve Güvenliği',
    'Ulusal Staj Basvuru Formu': 'Ulusal Staj Başvuru Formu',
    'Istenilen evraklarin eksiksiz doldurulmasi zorunludur.': 'İstenilen evrakların eksiksiz doldurulması zorunludur.',
    'Basvuru Formunun Doldurulmasi': 'Başvuru Formunun Doldurulması',
    'Uygulamali Egitim Basvuru Formu doldurulmalidir.': 'Uygulamalı Eğitim Başvuru Formu doldurulmalıdır.',
    'Ogrenci, kurum yetkilisi ve bolum staj sorumlusu tarafindan islak imzali olmalidir.': 'Öğrenci, kurum yetkilisi ve bölüm staj sorumlusu tarafından ıslak imzalı olmalıdır.',
    'SGK Mustehaklik Belgesi': 'SGK Müstehaklık Belgesi',
    'e-Devlet sistemi uzerinden barkodlu olarak guncel tarihli temin edilmelidir.': 'e-Devlet sistemi üzerinden barkodlu olarak güncel tarihli temin edilmelidir.',
    'Ogrencinin gecerli T.C. Kimlik Karti fotokopisi dosyaya eklenmelidir.': 'Öğrencinin geçerli T.C. Kimlik Kartı fotokopisi dosyaya eklenmelidir.',
    'Evrak Teslimi (3 Suret)': 'Evrak Teslimi (3 Suret)',
    'Tum belgeler 3 takim halinde hazirlanmalidir.': 'Tüm belgeler 3 takım halinde hazırlanmalıdır.',
    'Gorsel Kilavuz ve Formlar': 'Görsel Kılavuz ve Formlar',
    'Tum Formlar Sayfasina Git': 'Tüm Formlar Sayfasına Git',
    'Ilan Havuzu': 'İlan Havuzu',
    'Aktif Ilan': 'Aktif İlan',
    'Staj Firsati': 'Staj Fırsatı',
    'Toplam Basvuru': 'Toplam Başvuru',
    'Basvurularim': 'Başvurularım',
    'Isveren Partnerler': 'İşveren Partnerler',
    'acik pozisyon': 'açık pozisyon',
    'Hakkinda': 'Hakkında',
    'Yardim': 'Yardım',
    'Is Tanimi': 'İş Tanımı',
    'Is tanimi belirtilmemis.': 'İş tanımı belirtilmemiş.'
};

for (const [k, v] of Object.entries(replacements)) {
    content = content.split(k).join(v);
}

const stateStr = "const [activeTab, setActiveTab] = useState('ilanlar');";
const newState = "const [searchQuery, setSearchQuery] = useState('');\\n  const [filterType, setFilterType] = useState('all');\\n  const [activeTab, setActiveTab] = useState('ilanlar');";
content = content.replace(stateStr, newState);

const filterLogic = \
  const filteredJobs = (activeJobs || []).filter(job => {
    const q = searchQuery.toLocaleLowerCase('tr-TR');
    const matchesSearch = !q || 
      (job.title || '').toLocaleLowerCase('tr-TR').includes(q) ||
      (job.company || job.companyName || '').toLocaleLowerCase('tr-TR').includes(q) ||
      (job.location || job.city || '').toLocaleLowerCase('tr-TR').includes(q);
    const matchesType = filterType === 'all' || 
      (job.type || job.jobType || '').toLocaleLowerCase('tr-TR').includes(filterType);
    return matchesSearch && matchesType;
  });
\;

const activeJobsDef = "const activeJobs = (jobs||[]).filter(j => j.status === 'Aktif' || !j.status);";
content = content.replace(activeJobsDef, activeJobsDef + "\\n" + filterLogic);

content = content.replace('activeJobs.map(job=>{', 'filteredJobs.map(job=>{');
content = content.replace('if(activeJobs.length===0)', 'if(filteredJobs.length===0)');

const searchBar = \
              {/* Arama ve Filtre Çubuğu */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="İlan ara... (pozisyon, şirket, şehir)"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#990000]/20"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none bg-white"
                >
                  <option value="all">Tüm İlanlar</option>
                  <option value="staj">Staj</option>
                  <option value="tam_zamanli">Tam Zamanlı</option>
                  <option value="yari_zamanli">Yarı Zamanlı</option>
                  <option value="uzaktan">Uzaktan</option>
                </select>
              </div>
\;

content = content.replace(
  '<div className="space-y-4 animate-fade-in">\\n              <div className="flex items-center justify-between',
  '<div className="space-y-4 animate-fade-in">\\n' + searchBar + '\\n              <div className="flex items-center justify-between'
);

const firestoreImport = "import { collection, addDoc, serverTimestamp } from 'firebase/firestore';\\nimport { db } from '../utils/firebase';\\n";
content = firestoreImport + content;

const firestoreLogic = \
    setApplications(prev => [...(prev || []), newApp]);
    try {
      addDoc(collection(db, 'applications'), {
        ...newApp,
        createdAt: serverTimestamp(),
        status: 'Onay Bekliyor',
      });
    } catch (e) {
      console.warn('Firestore başvuru kaydı yapılamadı:', e.message);
    }
\;

content = content.replace('setApplications(prev => [...(prev || []), newApp]);', firestoreLogic);

fs.writeFileSync('src/components/JobsAndInternships.jsx', content, 'utf8');
console.log('Fixed JobsAndInternships.jsx');
