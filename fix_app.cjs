const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

const notFoundComponent = `
const NotFound = ({ setView, currentUser }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-6">
    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
      <span className="text-5xl">404</span>
    </div>
    <h1 className="text-2xl font-black text-slate-900">Sayfa Bulunamadı</h1>
    <p className="text-slate-500 text-center max-w-sm">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
    <button
      onClick={() => setView(currentUser ? (currentUser.role || 'student') : 'landing')}
      className="bg-[#990000] text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition"
    >
      Ana Sayfaya Dön
    </button>
  </div>
);
`;

content = content.replace('const Spinner = () =>', notFoundComponent + '\nconst Spinner = () =>');

const targetStr = ': <LandingPage setView={setView} currentUser={null} userRole={userRole} setUserRole={setUserRole} />';
const replacementStr = `: (pathView === '' || pathView === 'landing') ? <LandingPage setView={setView} currentUser={null} userRole={userRole} setUserRole={setUserRole} />
          : <NotFound setView={setView} currentUser={currentUser} />`;

content = content.replace(targetStr, replacementStr);

fs.writeFileSync('src/App.jsx', content, 'utf8');
console.log('Fixed App.jsx');
