import React, { useState } from 'react';
import { ShoppingBag, Coffee, Zap, UserCheck, Shield, Sparkles, Check, AlertCircle } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import Confetti from 'react-confetti';

export default function RewardStore() {
  const { userBP, purchaseItem, purchasedItems } = useAppStore();
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const storeItems = [
    {
      id: 'item_coffee',
      title: 'Starbucks Venti Kahve',
      desc: 'Kampüs Starbucks şubesinde geçerli bedava kahve kuponu.',
      icon: <Coffee size={24} className="text-amber-600" />,
      cost: 500,
      type: 'physical',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      iconBg: 'bg-amber-100'
    },
    {
      id: 'item_frame_neon',
      title: 'Neon Profil Çerçevesi',
      desc: 'Profil fotoğrafının etrafında havalı, dikkat çeken mavi neon bir çerçeve.',
      icon: <Zap size={24} className="text-blue-500" />,
      cost: 1000,
      type: 'frame',
      frameClass: 'ring-4 ring-blue-500 ring-offset-2',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      iconBg: 'bg-blue-100 dark:bg-blue-800'
    },
    {
      id: 'item_frame_gold',
      title: 'Elit Altın Çerçeve',
      desc: 'Şirketlerin gözdesi olduğunuzu belli eden prestijli altın çerçeve.',
      icon: <Sparkles size={24} className="text-yellow-500" />,
      cost: 2500,
      type: 'frame',
      frameClass: 'ring-4 ring-yellow-400 ring-offset-2 shadow-[0_0_15px_rgba(250,204,21,0.5)]',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      iconBg: 'bg-yellow-100 dark:bg-yellow-800'
    },
    {
      id: 'item_fasttrack',
      title: 'Fast-Track CV İncelemesi',
      desc: 'CV\'nizi kariyer merkezindeki uzmanların sırasını atlayarak en öne alın.',
      icon: <UserCheck size={24} className="text-emerald-600" />,
      cost: 3000,
      type: 'service',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      iconBg: 'bg-emerald-100 dark:bg-emerald-800'
    },
    {
      id: 'item_dekan_yemek',
      title: 'Dekanla Öğle Yemeği',
      desc: 'Fakülte dekanıyla vizyon açıcı özel 1\'e 1 öğle yemeği ve mentorluk.',
      icon: <Shield size={24} className="text-purple-600" />,
      cost: 10000,
      type: 'event',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      iconBg: 'bg-purple-100 dark:bg-purple-800'
    }
  ];

  const handlePurchase = (item) => {
    if (userBP >= item.cost && !purchasedItems.some(i => i.id === item.id)) {
      purchaseItem(item.cost, item);
      setActiveItem(item);
      setShowConfetti(true);
      if(window.toast) window.toast.success(`Tebrikler! ${item.title} satın alındı.`);
      setTimeout(() => setShowConfetti(false), 4000);
    } else if (purchasedItems.some(i => i.id === item.id)) {
      if(window.toast) window.toast.error(`Bu ödülü zaten aldınız.`);
    } else {
      if(window.toast) window.toast.error(`Yetersiz BP! ${item.cost - userBP} BP daha kazanmalısın.`);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 animate-fade-in relative pb-safe">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={200} />}
      
      <div className="mb-8 p-6 bg-gradient-to-r from-[#0A2342] to-[#163B65] rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
        
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="text-blue-300" size={28} />
            <h1 className="text-2xl md:text-3xl font-bold">Esenyurt Mağazası</h1>
          </div>
          <p className="text-blue-100 max-w-lg">
            Kazandığın BP (Başarı Puanı) değerlerini harca! Profilini özelleştir, kampüs avantajlarını yakala ve kariyer fırsatlarını hızlandır.
          </p>
        </div>
        
        <div className="relative z-10 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 flex flex-col items-center">
          <p className="text-sm text-blue-200 font-medium mb-1 uppercase tracking-wider">Mevcut Bakiye</p>
          <div className="flex items-center gap-2">
            <Sparkles size={24} className="text-yellow-400" />
            <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
              {userBP} <span className="text-lg">BP</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {storeItems.map((item) => {
          const isPurchased = purchasedItems?.some(i => i.id === item.id);
          const canAfford = userBP >= item.cost;
          
          return (
            <div key={item.id} className={`group relative rounded-2xl border-2 p-6 transition-all duration-300 flex flex-col h-full 
              ${isPurchased ? 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 opacity-70' : `${item.bgColor} ${item.borderColor} hover:shadow-lg`}`}>
              
              <div className="flex justify-between items-start mb-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${item.iconBg} shadow-sm group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                {!isPurchased && (
                  <div className={`px-3 py-1.5 rounded-full font-bold text-sm flex items-center gap-1.5 shadow-sm
                    \${canAfford ? 'bg-white text-gray-800' : 'bg-white/50 text-gray-500'}`}>
                    <Sparkles size={14} className={canAfford ? "text-yellow-500" : "text-gray-400"} />
                    {item.cost} BP
                  </div>
                )}
              </div>
              
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 flex-1">{item.desc}</p>
              
              <button 
                onClick={() => handlePurchase(item)}
                disabled={isPurchased}
                className={`w-full py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all duration-200
                  ${isPurchased 
                    ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed' 
                    : canAfford 
                      ? 'bg-[#0A2342] hover:bg-[#163B65] text-white shadow-md hover:shadow-xl hover:-translate-y-0.5' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                {isPurchased ? (
                  <><Check size={18} /> Sahipsin</>
                ) : canAfford ? (
                  'Satın Al'
                ) : (
                  <><AlertCircle size={18} /> Yetersiz BP</>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
