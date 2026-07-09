const fs = require('fs');
const files = ['AlumniFeed.jsx', 'StudentFeed.jsx', 'CompanyFeed.jsx', 'AcademicStaffFeed.jsx'];

const emptyState = `<div className="p-10 text-center bg-white rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
  <div className="w-16 h-16 bg-red-50 text-iesu-red rounded-2xl flex items-center justify-center mb-6 shadow-sm"><FileText size={32} /></div>
  <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2">Henüz görüntülenecek yayın bulunmuyor.</h3>
  <p className="text-sm text-gray-500 font-medium max-w-sm leading-relaxed">Duyuru, etkinlik, staj ve mentorluk içerikleri yayınlandığında burada görünecek.</p>
</div>`;

files.forEach(f => {
  const p = 'C:\\Users\\celil\\.gemini\\antigravity\\scratch\\IesuKariyer\\src\\components\\' + f;
  if (fs.existsSync(p)) {
    let c = fs.readFileSync(p, 'utf8');
    const regex = /<div className="p-8 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">[\s\S]*?<\/div>/g;
    c = c.replace(regex, emptyState);
    fs.writeFileSync(p, c);
    console.log('Patched Empty State in', f);
  }
});
