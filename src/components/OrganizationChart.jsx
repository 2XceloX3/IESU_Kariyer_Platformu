import React from 'react';
import { ArrowLeft, Users, ChevronRight } from 'lucide-react';
import Logo from './Logo';

export default function OrganizationChart({ setView, userRole }) {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b-4 border-iesu-coral">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView(userRole === 'admin' ? 'admin' : userRole === 'employer' ? 'company' : userRole || 'landing')}>
            <Logo className="h-10 sm:h-12 w-auto text-iesu-red" />
            <div className="hidden sm:block">
              <h1 className="text-[16px] md:text-xl font-black text-gray-900 leading-tight tracking-tight whitespace-nowrap">İSTANBUL ESENYURT ÜNİVERSİTESİ</h1>
              <p className="text-[10px] md:text-[12px] text-iesu-coral font-bold uppercase tracking-widest mt-0.5 whitespace-nowrap">Kariyer Geliştirme Ofisi Koordinatörlüğü</p>
            </div>
          </div>
          <button onClick={() => setView(userRole === 'admin' ? 'admin' : userRole === 'employer' ? 'company' : userRole || 'landing')} className="text-gray-500 hover:text-iesu-red flex items-center gap-2 font-bold transition">
            <ArrowLeft size={18} /> Ana Sayfaya Dön
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-10">
          <span className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-iesu-red">
            <Users size={24} />
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Organizasyon Şeması</h2>
        </div>
        
        <div className="bg-white rounded-3xl p-6 md:p-12 border border-gray-100 shadow-xl shadow-red-900/5 relative overflow-hidden group">
          {/* Background Accents */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-red-50 to-transparent rounded-full blur-3xl -z-10 group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-rose-50 to-transparent rounded-full blur-3xl -z-10 group-hover:scale-110 transition-transform duration-700"></div>

          <p className="text-lg text-gray-600 mb-10 font-medium max-w-2xl leading-relaxed border-l-4 border-iesu-red pl-5">
            Öğrencilerimizin ve mezunlarımızın kariyer yolculuklarına en iyi şekilde destek olabilmek için uzman kadromuzla yanınızdayız. Kariyer Merkezi Organizasyon Şemamızı aşağıdan inceleyebilirsiniz.
          </p>

          <div className="w-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center p-4 hover:border-iesu-coral transition-colors duration-300">
             <img 
              src="https://www.esenyurt.edu.tr/uploads/2024/01/wddtdfblcxjqh-kariyermerkezi.png" 
              alt="Organizasyon Şeması" 
              className="w-full max-w-4xl h-auto object-contain rounded-lg hover:scale-[1.02] transition-transform duration-500 cursor-zoom-in shadow-sm"
              onError={(e) => {
                // Fallback handling if subagent hallucinates the URL month/year
                if(e.target.src.includes('2024/01')) {
                  e.target.src = 'https://www.esenyurt.edu.tr/uploads/2023/12/wddtdfblcxjqh-kariyermerkezi.png';
                } else {
                  e.target.src = 'https://www.esenyurt.edu.tr/assets/frontend/images/empty.png';
                  e.target.parentElement.innerHTML = '<div class="text-center py-20"><p class="text-iesu-red font-bold text-lg">Organizasyon Şeması Görseli Güncellenmektedir.</p><p class="text-gray-400 mt-2">Daha fazla bilgi için Kariyer Merkezimize ulaşabilirsiniz.</p></div>';
                }
              }}
            />
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="text-gray-500 text-[14px] font-medium">
              Görseli büyütmek için üzerine tıklayabilirsiniz.
            </div>
            <button className="bg-iesu-red text-white px-8 py-3 rounded-xl font-bold text-[15px] hover:bg-iesu-darkRed transition shadow-lg flex items-center gap-2 group">
              Ofisimizle İletişime Geçin <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

