const fs = require('fs');
let code = fs.readFileSync('src/components/JobsAndInternships.jsx', 'utf8');

// 1. Replace Baþvur button with Academic specific button
const btnOld = 
                          <button 
                            onClick={() => handleApply(job)}
                            disabled={hasApplied}
                            className={\px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 transition \\}
                          >
                            {hasApplied ? <><CheckCircle2 size={14} /> Bavuruldu</> : 'Hzl Bavur'}
                          </button>;
const btnNew = 
                          {userRole === 'academic' ? (
                            <button 
                              onClick={() => alert("Bu ilan Yrencilerinize nerildi!")}
                              className="px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 transition bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white"
                            >
                              <CheckCircle2 size={14} /> -Yrenciye ner
                            </button>
                          ) : (
                          <button 
                            onClick={() => handleApply(job)}
                            disabled={hasApplied}
                            className={\px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 transition \\}
                          >
                            {hasApplied ? <><CheckCircle2 size={14} /> Bavuruldu</> : 'Hzl Bavur'}
                          </button>
                          )};
code = code.replace(btnOld, btnNew);

// 2. Add Academic UI Header hint
const titleOld = <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Y ve Staj Olanaklar</h2>;
const titleNew = <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                {userRole === 'academic' ? 'Y ve Staj Olanaklar (Akademik Gzlem)' : 'Y ve Staj Olanaklar'}
              </h2>;
code = code.replace(titleOld, titleNew);

fs.writeFileSync('src/components/JobsAndInternships.jsx', code);
console.log('Jobs updated UI for Academic');
