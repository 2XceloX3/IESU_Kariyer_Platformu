const fs = require('fs');
let code = fs.readFileSync('src/components/StudentFeed.jsx', 'utf8');

// Replace the main wrapper
const oldWrapper = '<div className="pt-24 max-w-2xl mx-auto px-4 flex flex-col justify-center gap-6 pb-32 relative">';
const newWrapper = 
      {/* Main Container - 3 Column Layout */}
      <div className="pt-24 max-w-[1400px] mx-auto px-4 flex justify-center gap-6 pb-32 relative">
        
        {/* LEFT PANEL: Club Radar & Profile Stats */}
        <div className="hidden xl:block w-[280px] shrink-0 space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-24">
            <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
              <Compass className="text-iesu-red" size={20} /> Trend Kulüpler
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 cursor-pointer transition">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold">Y</div>
                <div>
                  <h4 className="font-bold text-[14px] text-gray-900">Yazýlým Kulübü</h4>
                  <p className="text-[12px] text-gray-500 flex items-center gap-1"><UserCircle2 size={12}/> 342 Üye</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 cursor-pointer transition">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 font-bold">G</div>
                <div>
                  <h4 className="font-bold text-[14px] text-gray-900">Giriþimcilik</h4>
                  <p className="text-[12px] text-gray-500 flex items-center gap-1"><Star size={12}/> Onaylý Kulüp</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-bold transition">Tüm Kulüpleri Gör</button>
          </div>
        </div>

        {/* CENTER PANEL: Main Feed */}
        <div className="w-full max-w-2xl shrink-0 flex flex-col gap-6">
;

code = code.replace(oldWrapper, newWrapper);

// We need to close the left/center panels and add the right panel at the end of the main container.
// Wait, the main container ends right before "{/* FLOATING DOCK"
const endTarget = {/* FLOATING DOCK;
const rightPanel = 
        </div> {/* END CENTER PANEL */}

        {/* RIGHT PANEL: Career Shorts & Trending */}
        <div className="hidden lg:block w-[320px] shrink-0 space-y-6">
          <div className="bg-gradient-to-b from-gray-900 to-black rounded-3xl p-1 shadow-lg sticky top-24 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 z-10 flex justify-end w-full">
              <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-full animate-pulse">YENÝ</span>
            </div>
            <div className="bg-gray-900 rounded-3xl h-[420px] relative overflow-hidden flex items-end p-5 group cursor-pointer">
              {/* Dummy video background effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-0"></div>
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition duration-700" alt="Shorts" />
              
              <div className="relative z-10 w-full">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white"></div>
                  <span className="text-white font-bold text-sm">TechCorp A.Þ.</span>
                </div>
                <h3 className="text-white font-black text-lg leading-tight mb-2">"Yazýlým stajyerlerimiz bir gününü nasýl geçiriyor?"</h3>
                <p className="text-gray-300 text-xs mb-4 line-clamp-2">Ofis turu, günlük stand-up toplantýlarý ve kahve molalarý! Sen de ekibimize katýlmak istersen profili incele.</p>
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2">
                  <Wand2 size={16} /> Kariyer Shorts Ýzle
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* FLOATING DOCK;

code = code.replace('      </div>\n\n      {/* FLOATING DOCK', rightPanel);

fs.writeFileSync('src/components/StudentFeed.jsx', code);
console.log('StudentFeed layout updated (Phase 1)');
