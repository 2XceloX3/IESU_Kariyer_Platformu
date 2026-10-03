import re

with open('src/components/JobsAndInternships.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 3: Turkish characters
replacements = {
    'guncel firsat': 'güncel fýrsat',
    'Henuz ilan yok': 'Henüz ilan yok',
    'Yeni ilanlar eklendiginde burada gorunecek.': 'Yeni ilanlar eklendiðinde burada görünecek.',
    'Harikasin!': 'Harikasýn!',
    'Butun ilanlari inceledin.': 'Bütün ilanlarý inceledin.',
    'Basa Don': 'Baþa Dön',
    'Profil Eslesme': 'Profil Eþleþme',
    'eslesme': 'eþleþme',
    'Sola gec, saga basvur!': 'Sola geç, saða baþvur!',
    'Cumhurbaskanligi Insan Kaynaklari': 'Cumhurbaþkanlýðý Ýnsan Kaynaklarý',
    'e-Devlet sifrenizle sisteme giris yapin.': 'e-Devlet þifrenizle sisteme giriþ yapýn.',
    'Staj Basvurusu menuunden guncel yilin programina tiklayin.': 'Staj Baþvurusu menüsünden güncel yýlýn programýna týklayýn.',
    'Basvuru formunu eksiksiz doldurun.': 'Baþvuru formunu eksiksiz doldurun.',
    'Basvuru durumunuzu Kariyer Kapisi uzerinden takip edin.': 'Baþvuru durumunuzu Kariyer Kapýsý üzerinden takip edin.',
    'Ilgili Formlar': 'Ýlgili Formlar',
    'Mesleki Egitim Sozlesmesi': 'Mesleki Eðitim Sözleþmesi',
    'Is Sagligi ve Guvenligi': 'Ýþ Saðlýðý ve Güvenliði',
    'Ulusal Staj Basvuru Formu': 'Ulusal Staj Baþvuru Formu',
    'Istenilen evraklarin eksiksiz doldurulmasi zorunludur.': 'Ýstenilen evraklarýn eksiksiz doldurulmasý zorunludur.',
    'Basvuru Formunun Doldurulmasi': 'Baþvuru Formunun Doldurulmasý',
    'Uygulamali Egitim Basvuru Formu doldurulmalidir.': 'Uygulamalý Eðitim Baþvuru Formu doldurulmalýdýr.',
    'Ogrenci, kurum yetkilisi ve bolum staj sorumlusu tarafindan islak imzali olmalidir.': 'Öðrenci, kurum yetkilisi ve bölüm staj sorumlusu tarafýndan ýslak imzalý olmalýdýr.',
    'SGK Mustehaklik Belgesi': 'SGK Müstehaklýk Belgesi',
    'e-Devlet sistemi uzerinden barkodlu olarak guncel tarihli temin edilmelidir.': 'e-Devlet sistemi üzerinden barkodlu olarak güncel tarihli temin edilmelidir.',
    'Ogrencinin gecerli T.C. Kimlik Karti fotokopisi dosyaya eklenmelidir.': 'Öðrencinin geçerli T.C. Kimlik Kartý fotokopisi dosyaya eklenmelidir.',
    'Evrak Teslimi (3 Suret)': 'Evrak Teslimi (3 Suret)',
    'Tum belgeler 3 takim halinde hazirlanmalidir.': 'Tüm belgeler 3 takým halinde hazýrlanmalýdýr.',
    'Gorsel Kilavuz ve Formlar': 'Görsel Kýlavuz ve Formlar',
    'Tum Formlar Sayfasina Git': 'Tüm Formlar Sayfasýna Git',
    'Ilan Havuzu': 'Ýlan Havuzu',
    'Aktif Ilan': 'Aktif Ýlan',
    'Staj Firsati': 'Staj Fýrsatý',
    'Toplam Basvuru': 'Toplam Baþvuru',
    'Basvurularim': 'Baþvurularým',
    'Isveren Partnerler': 'Ýþveren Partnerler',
    'acik pozisyon': 'açýk pozisyon',
    'Hakkinda': 'Hakkýnda',
    'Yardim': 'Yardým',
    'Is Tanimi': 'Ýþ Tanýmý',
    'Is tanimi belirtilmemis.': 'Ýþ tanýmý belirtilmemiþ.'
}

for k, v in replacements.items():
    content = content.replace(k, v)

# Fix 4: States
state_str = r"const \[activeTab, setActiveTab\] = useState\('ilanlar'\);"
new_state = "const [searchQuery, setSearchQuery] = useState('');\n  const [filterType, setFilterType] = useState('all');\n  const [activeTab, setActiveTab] = useState('ilanlar');"
content = content.replace(state_str, new_state)

# Filter logic
filter_logic = '''
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
'''
active_jobs_def = r"const activeJobs = \(jobs\|\|\[\]\)\.filter\(j => j\.status === 'Aktif' \|\| !j\.status\);"
content = content.replace(active_jobs_def, active_jobs_def + "\n" + filter_logic)

# Replace mapping of activeJobs to filteredJobs in the list view (around line 408)
content = content.replace('activeJobs.map(job=>{', 'filteredJobs.map(job=>{')
content = content.replace('if(activeJobs.length===0)', 'if(filteredJobs.length===0)')


# Fix 4 UI
search_bar = '''
              {/* Arama ve Filtre Çubuðu */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Ýlan ara... (pozisyon, þirket, þehir)"
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
                  <option value="all">Tüm Ýlanlar</option>
                  <option value="staj">Staj</option>
                  <option value="tam_zamanli">Tam Zamanlý</option>
                  <option value="yari_zamanli">Yarý Zamanlý</option>
                  <option value="uzaktan">Uzaktan</option>
                </select>
              </div>
'''

content = content.replace('<div className="space-y-4 animate-fade-in">\n              <div className="flex items-center justify-between', '<div className="space-y-4 animate-fade-in">\n              ' + search_bar.strip() + '\n              <div className="flex items-center justify-between')

# Fix 5: Firestore import and logic
firestore_import = "import { collection, addDoc, serverTimestamp } from 'firebase/firestore';\nimport { db } from '../utils/firebase';\n"
content = firestore_import + content

firestore_logic = '''
    setApplications(prev => [...(prev || []), newApp]);
    try {
      addDoc(collection(db, 'applications'), {
        ...newApp,
        createdAt: serverTimestamp(),
        status: 'Onay Bekliyor',
      });
    } catch (e) {
      console.warn('Firestore baþvuru kaydý yapýlamadý:', e.message);
    }
'''
content = content.replace('setApplications(prev => [...(prev || []), newApp]);', firestore_logic)

with open('src/components/JobsAndInternships.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("JobsAndInternships.jsx fixed")
