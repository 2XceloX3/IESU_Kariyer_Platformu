import re

with open('src/components/JobsAndInternships.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 3: Turkish characters
replacements = {
    'guncel firsat': 'g�ncel f�rsat',
    'Henuz ilan yok': 'Hen�z ilan yok',
    'Yeni ilanlar eklendiginde burada gorunecek.': 'Yeni ilanlar eklendi�inde burada g�r�necek.',
    'Harikasin!': 'Harikas�n!',
    'Butun ilanlari inceledin.': 'B�t�n ilanlar� inceledin.',
    'Basa Don': 'Ba�a D�n',
    'Profil Eslesme': 'Profil E�le�me',
    'eslesme': 'e�le�me',
    'Sola gec, saga basvur!': 'Sola ge�, sa�a ba�vur!',
    'Cumhurbaskanligi Insan Kaynaklari': 'Cumhurba�kanl��� �nsan Kaynaklar�',
    'e-Devlet sifrenizle sisteme giris yapin.': 'e-Devlet �ifrenizle sisteme giri� yap�n.',
    'Staj Basvurusu menuunden guncel yilin programina tiklayin.': 'Staj Ba�vurusu men�s�nden g�ncel y�l�n program�na t�klay�n.',
    'Basvuru formunu eksiksiz doldurun.': 'Ba�vuru formunu eksiksiz doldurun.',
    'Basvuru durumunuzu Kariyer Kapisi uzerinden takip edin.': 'Ba�vuru durumunuzu Kariyer Kap�s� �zerinden takip edin.',
    'Ilgili Formlar': '�lgili Formlar',
    'Mesleki Egitim Sozlesmesi': 'Mesleki E�itim S�zle�mesi',
    'Is Sagligi ve Guvenligi': '�� Sa�l��� ve G�venli�i',
    'Ulusal Staj Basvuru Formu': 'Ulusal Staj Ba�vuru Formu',
    'Istenilen evraklarin eksiksiz doldurulmasi zorunludur.': '�stenilen evraklar�n eksiksiz doldurulmas� zorunludur.',
    'Basvuru Formunun Doldurulmasi': 'Ba�vuru Formunun Doldurulmas�',
    'Uygulamali Egitim Basvuru Formu doldurulmalidir.': 'Uygulamal� E�itim Ba�vuru Formu doldurulmal�d�r.',
    'Ogrenci, kurum yetkilisi ve bolum staj sorumlusu tarafindan islak imzali olmalidir.': '��renci, kurum yetkilisi ve b�l�m staj sorumlusu taraf�ndan �slak imzal� olmal�d�r.',
    'SGK Mustehaklik Belgesi': 'SGK M�stehakl�k Belgesi',
    'e-Devlet sistemi uzerinden barkodlu olarak guncel tarihli temin edilmelidir.': 'e-Devlet sistemi �zerinden barkodlu olarak g�ncel tarihli temin edilmelidir.',
    'Ogrencinin gecerli T.C. Kimlik Karti fotokopisi dosyaya eklenmelidir.': '��rencinin ge�erli T.C. Kimlik Kart� fotokopisi dosyaya eklenmelidir.',
    'Evrak Teslimi (3 Suret)': 'Evrak Teslimi (3 Suret)',
    'Tum belgeler 3 takim halinde hazirlanmalidir.': 'T�m belgeler 3 tak�m halinde haz�rlanmal�d�r.',
    'Gorsel Kilavuz ve Formlar': 'G�rsel K�lavuz ve Formlar',
    'Tum Formlar Sayfasina Git': 'T�m Formlar Sayfas�na Git',
    'Ilan Havuzu': '�lan Havuzu',
    'Aktif Ilan': 'Aktif �lan',
    'Staj Firsati': 'Staj F�rsat�',
    'Toplam Basvuru': 'Toplam Ba�vuru',
    'Basvurularim': 'Ba�vurular�m',
    'Isveren Partnerler': '��veren Partnerler',
    'acik pozisyon': 'a��k pozisyon',
    'Hakkinda': 'Hakk�nda',
    'Yardim': 'Yard�m',
    'Is Tanimi': '�� Tan�m�',
    'Is tanimi belirtilmemis.': '�� tan�m� belirtilmemi�.'
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
              {/* Arama ve Filtre �ubu�u */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="�lan ara... (pozisyon, �irket, �ehir)"
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
                  <option value="all">T�m �lanlar</option>
                  <option value="staj">Staj</option>
                  <option value="tam_zamanli">Tam Zamanl�</option>
                  <option value="yari_zamanli">Yar� Zamanl�</option>
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
      console.warn('Firestore ba�vuru kayd� yap�lamad�:', e.message);
    }
'''
content = content.replace('setApplications(prev => [...(prev || []), newApp]);', firestore_logic)

with open('src/components/JobsAndInternships.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("JobsAndInternships.jsx fixed")
