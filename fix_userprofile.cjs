const fs = require('fs');
let code = fs.readFileSync('src/components/UserProfile.jsx', 'utf8');

const target1 = onClick={handleConnect} className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-5 py-2.5 bg-iesu-red hover:bg-red-700 text-white rounded-xl font-bold text-sm transition shadow-sm";
const replacement1 = onClick={userRole === 'academic' ? () => alert('Akademik inceleme notu eklendi') : handleConnect} className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-5 py-2.5 bg-iesu-red hover:bg-red-700 text-white rounded-xl font-bold text-sm transition shadow-sm";

const target2 = <UserPlus size={16} /> Ba;
// Wait, the string is <UserPlus size={16} /> Ba\u011Flant\u0131 Kur but due to encoding it's tricky. Let's just use regex.

code = code.replace(/<UserPlus size=\{16\} \/> Ba[\\s\\S]*?lant[\\s\\S]*? Kur/g, "{userRole === 'academic' ? <><FileText size={16} /> Akademik \u0130nceleme</> : <><UserPlus size={16} /> Ba\u011Flant\u0131 Kur</>}");

fs.writeFileSync('src/components/UserProfile.jsx', code);
console.log('UserProfile action buttons updated');
