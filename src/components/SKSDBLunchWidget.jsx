import React, { useState } from 'react';
import { 
  Activity, Flame, ArrowLeft, Droplets, Dumbbell, Scale, Sparkles, 
  AlertCircle, CheckCircle2, HeartPulse, CalendarCheck, ArrowUpRight, 
  Award, UserCheck, Utensils, Calendar, Clock, MapPin, Leaf, CreditCard, ChevronRight
} from 'lucide-react';
import TopProfileMenu from './TopProfileMenu';
import SubPanelFloatingDock from './SubPanelFloatingDock';
import useAppStore from '../store/useAppStore';

const WEEKLY_MENU = {
  pazartesi: {
    dayName: 'Pazartesi',
    dateStr: 'Günün Menüsü',
    totalCalories: 875,
    protein: '36g',
    carbs: '108g',
    fat: '28g',
    dishes: [
      { name: 'Süzme Kırmızı Mercimek Çorbası', type: 'Çorba', cal: '160 kcal', tag: 'Geleneksel' },
      { name: 'Kekikli Orman Kebabı (Dana Eti & Taze Sebzeler)', type: 'Ana Yemek', cal: '380 kcal', tag: 'Yüksek Protein' },
      { name: 'Şehriyeli Baldo Pirinç Pilavı', type: 'Yardımcı Yemek', cal: '220 kcal', tag: 'Tam Kıvamında' },
      { name: 'Taze Çoban Salata & Sızma Zeytinyağı', type: 'Tamamlayıcı', cal: '115 kcal', tag: 'Vitamin Deposu' }
    ],
    veganAlternative: 'Zeytinyağlı Enginar & Fırınlanmış Patates (320 kcal)',
    bread: 'Tam Buğday veya Kepekli Rol Ekmek'
  },
  sali: {
    dayName: 'Salı',
    dateStr: 'Günün Menüsü',
    totalCalories: 920,
    protein: '42g',
    carbs: '112g',
    fat: '26g',
    dishes: [
      { name: 'Naneli & Tereyağlı Yayla Çorbası', type: 'Çorba', cal: '170 kcal', tag: 'Probiyotik' },
      { name: 'Fırınlanmış Soslu Tavuk But & Köz Biber', type: 'Ana Yemek', cal: '410 kcal', tag: 'Fit Lezzet' },
      { name: 'Meyhane Usulü Sebzeli Bulgur Pilavı', type: 'Yardımcı Yemek', cal: '210 kcal', tag: 'Yüksek Lif' },
      { name: 'Geleneksel Fırın Sütlaç', type: 'Tatlı', cal: '130 kcal', tag: 'Hafif Tatlı' }
    ],
    veganAlternative: 'Nohutlu Ispanak Kökü Kavurması & Mısırlı Roka (290 kcal)',
    bread: 'Tam Buğday veya Kepekli Rol Ekmek'
  },
  carsamba: {
    dayName: 'Çarşamba',
    dateStr: 'Günün Menüsü',
    totalCalories: 890,
    protein: '38g',
    carbs: '104g',
    fat: '30g',
    dishes: [
      { name: 'Ezogelin Çorbası (Kavrulmuş Nane ile)', type: 'Çorba', cal: '165 kcal', tag: 'Bağışıklık Güçlendirici' },
      { name: 'Fırında İzmir Köfte (Patates & Biber Garnitürlü)', type: 'Ana Yemek', cal: '420 kcal', tag: 'Klasik Lezzet' },
      { name: 'Fesleğenli & Domates Soslu Burgu Makarna', type: 'Yardımcı Yemek', cal: '235 kcal', tag: 'Enerji Deposu' },
      { name: 'Köy Tipi Doğal Ayran & Mevsim Meyvesi', type: 'İçecek & Meyve', cal: '70 kcal', tag: 'Kalsiyum' }
    ],
    veganAlternative: 'Fırında Sebzeli Ratatouille & Yeşil Mercimek (310 kcal)',
    bread: 'Tam Buğday veya Kepekli Rol Ekmek'
  },
  persembe: {
    dayName: 'Perşembe',
    dateStr: 'Günün Menüsü',
    totalCalories: 860,
    protein: '35g',
    carbs: '102g',
    fat: '27g',
    dishes: [
      { name: 'Közlenmiş Domates Çorbası & Kaşar Rendesi', type: 'Çorba', cal: '155 kcal', tag: 'Antioksidan' },
      { name: 'Kıymalı Taze Bezelye Yemeği & Havuç', type: 'Ana Yemek', cal: '360 kcal', tag: 'Dengeli Protein' },
      { name: 'Tereyağlı Şehriye Pilavı', type: 'Yardımcı Yemek', cal: '225 kcal', tag: 'Garnitür' },
      { name: 'Bitter Çikolatalı Ev Yapımı Supangle', type: 'Tatlı', cal: '120 kcal', tag: 'Tatlı Keyfi' }
    ],
    veganAlternative: 'Zeytinyağlı Kereviz & Havuç Yahnisi (280 kcal)',
    bread: 'Tam Buğday veya Kepekli Rol Ekmek'
  },
  cuma: {
    dayName: 'Cuma',
    dateStr: 'Günün Menüsü',
    totalCalories: 940,
    protein: '40g',
    carbs: '115g',
    fat: '29g',
    dishes: [
      { name: 'Uşak Usulü Geleneksel Tarhana Çorbası', type: 'Çorba', cal: '150 kcal', tag: 'Köy Tipi' },
      { name: 'Etli Güveç Kuru Fasulye', type: 'Ana Yemek', cal: '430 kcal', tag: 'Öğrenci Klasiği' },
      { name: 'Tereyağlı Tane Baldo Pirinç Pilavı', type: 'Yardımcı Yemek', cal: '230 kcal', tag: 'Doyurucu' },
      { name: 'Karışık Ev Turşusu & Taze Amasya Elması', type: 'Garnitür', cal: '130 kcal', tag: 'C Vitamini' }
    ],
    veganAlternative: 'Etiketsiz Mantarlı Nohut Güveç (330 kcal)',
    bread: 'Tam Buğday veya Kepekli Rol Ekmek'
  }
};

export default function SKSDBLunchWidget({ setView, currentUser, userRole = 'student', setSelectedUserId, previousView = 'student' }) {
  const addBmiRecord = useAppStore(state => state.addBmiRecord);

  // Tabs: 'lunch' (Günün Yemekhanesi) | 'bmi' (Vücut Kitle İndeksi & Sağlık)
  const [activeMainTab, setActiveMainTab] = useState('lunch');
  const [selectedDay, setSelectedDay] = useState('pazartesi');

  // BMI & Health Calculator State
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);
  const [age, setAge] = useState(21);
  const [gender, setGender] = useState('male');
  const [activity, setActivity] = useState(1.375); // Light activity
  const [dietitianBooked, setDietitianBooked] = useState(false);

  // BMI Calculation
  const heightM = height / 100;
  const bmiVal = (weight / (heightM * heightM));
  const bmi = bmiVal.toFixed(1);

  // Ideal Weight Range (BMI 18.5 - 24.9)
  const minIdeal = (18.5 * heightM * heightM).toFixed(1);
  const maxIdeal = (24.9 * heightM * heightM).toFixed(1);

  // Weight Target Delta
  let weightDeltaText = '';
  let weightDeltaColor = '';
  if (weight > maxIdeal) {
    const diff = (weight - maxIdeal).toFixed(1);
    weightDeltaText = `İdeal kilonuzun ${diff} kg üzerindesiniz`;
    weightDeltaColor = 'text-amber-500';
  } else if (weight < minIdeal) {
    const diff = (minIdeal - weight).toFixed(1);
    weightDeltaText = `İdeal kilonuzun ${diff} kg altındasınız`;
    weightDeltaColor = 'text-indigo-500';
  } else {
    weightDeltaText = 'Mükemmel! İdeal kilo aralığındasınız';
    weightDeltaColor = 'text-emerald-500';
  }

  // BMR Calculation (Mifflin-St Jeor)
  const bmr = gender === 'male' 
    ? Math.round(10 * weight + 6.25 * height - 5 * age + 5)
    : Math.round(10 * weight + 6.25 * height - 5 * age - 161);

  const dailyCalories = Math.round(bmr * activity);
  const idealWater = (weight * 0.035).toFixed(1);
  const idealProtein = Math.round(weight * 1.4);

  const getBmiCategory = (val) => {
    if (val < 18.5) return { label: 'Zayıf', color: 'text-indigo-600 bg-indigo-50 border-indigo-200', desc: 'İdeal kilonuzun altındasınız. Sağlıklı kilo alımı için beslenme uzmanımızla görüşebilirsiniz.' };
    if (val <= 24.9) return { label: 'İdeal / Sağlıklı Kilo', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', desc: 'Tebrikler! Vücut kitle indeksiniz dengede. Formunuzu koruyun.' };
    if (val <= 29.9) return { label: 'Fazla Kilolu', color: 'text-amber-600 bg-amber-50 border-amber-200', desc: 'İdeal kilonuzun hafif üzerindesiniz. Düzenli yürüyüş ve dengeli beslenme önerilir.' };
    return { label: 'Yüksek Kilo (Obez)', color: 'text-rose-600 bg-rose-50 border-rose-200', desc: 'Sağlıklı yaşam ve beslenme programı için Mediko-Sosyal Diyetisyenimizden randevu alabilirsiniz.' };
  };

  const bmiStatus = getBmiCategory(parseFloat(bmi));

  const handleBookDietitian = () => {
    if (!dietitianBooked) {
      setDietitianBooked(true);
      addBmiRecord({
        id: `BMI-${Math.floor(100 + Math.random() * 900)}`,
        name: currentUser?.name || 'Öğrenci',
        role: userRole || 'Öğrenci',
        height,
        weight,
        bmi,
        bmr,
        targetCal: dailyCalories,
        category: bmiStatus.label,
        dietitianRequested: true,
        date: new Date().toISOString().replace('T', ' ').slice(0, 16)
      });
      window.toast && window.toast.success("Mediko-Sosyal Diyetisyen randevu talebiniz alındı. Öğrenci E-postanıza onay iletildi.");
    }
  };

  const currentMenu = WEEKLY_MENU[selectedDay] || WEEKLY_MENU.pazartesi;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans pb-32">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setView(previousView || (userRole === 'admin' ? 'admin' : 'student'))} 
            className="w-10 h-10 rounded-full bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 flex items-center justify-center text-slate-700 hover:text-[#990000] transition cursor-pointer shadow-2xs shrink-0"
            title="Geri Dön"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-[#990000]">
              <Utensils size={20} />
            </div>
            <div>
              <h1 className="font-black text-slate-900 text-base sm:text-lg tracking-tight">SKSDB Yemekhane Menüsü & Öğrenci Sağlık Merkezi</h1>
            </div>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      {/* Main Tabs Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-[1240px] mx-auto px-4 lg:px-8 flex items-center gap-4">
          <button
            onClick={() => setActiveMainTab('lunch')}
            className={`py-4 px-2 font-black text-xs sm:text-sm border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeMainTab === 'lunch'
                ? 'border-[#990000] text-[#990000]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Utensils size={16} /> Günün Yemekhane Menüsü (Haftalık Tabldot)
          </button>
          <button
            onClick={() => setActiveMainTab('bmi')}
            className={`py-4 px-2 font-black text-xs sm:text-sm border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeMainTab === 'bmi'
                ? 'border-[#990000] text-[#990000]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale size={16} /> Beslenme & Vücut İndeksi (BMI) Merkezi
          </button>
        </div>
      </div>

      <main className="flex-1 w-full max-w-[1240px] mx-auto p-4 lg:p-8 flex flex-col gap-8">
        
        {/* TAB 1: YEMEKHANE MENÜSÜ */}
        {activeMainTab === 'lunch' && (
          <div className="space-y-8 animate-fade-in">
            {/* Hero Card */}
            <div className="bg-gradient-to-r from-red-950 via-[#990000] to-rose-900 text-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-red-700/50 relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="max-w-2xl space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-white bg-white/20 px-3.5 py-1.5 rounded-full border border-white/30 inline-block">
                  SKSDB Beslenme Hizmetleri Şube Müdürlüğü
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Öğrenci Tabldot Menüsü & Besin Değerleri
                </h2>
                <p className="text-red-100 text-xs sm:text-sm font-medium leading-relaxed">
                  İstanbul Esenyurt Üniversitesi yemekhanelerinde sunulan tüm yemekler gıda mühendisleri ve diyetisyenler denetiminde günlük taze malzemelerle hazırlanmaktadır.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl shrink-0 flex flex-col items-center justify-center text-center">
                <span className="text-[11px] font-bold text-red-200 uppercase tracking-wider">Tabldot Ücreti</span>
                <span className="text-3xl font-black text-white mt-1">25.00 ₺</span>
                <span className="text-[10px] text-red-100 mt-1 flex items-center gap-1 font-semibold">
                  <CreditCard size={12} /> Öğrenci Kimlik Kartı & Cüzdan
                </span>
              </div>
            </div>

            {/* Days Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {Object.keys(WEEKLY_MENU).map((key) => {
                const item = WEEKLY_MENU[key];
                const isSelected = selectedDay === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDay(key)}
                    className={`px-5 py-3 rounded-2xl font-black text-xs transition cursor-pointer shrink-0 flex items-center gap-2 border ${
                      isSelected
                        ? 'bg-[#990000] text-white border-[#990000] shadow-md'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-red-200 hover:bg-red-50/50'
                    }`}
                  >
                    <Calendar size={14} />
                    <span>{item.dayName}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Menu Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Dishes List (7 Cols) */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{currentMenu.dayName} Tabldot Menüsü</h3>
                    <p className="text-xs text-slate-500 font-medium">4 Kap Seçmeli Doyurucu Öğrenci Menüsü</p>
                  </div>
                  <span className="px-3 py-1 bg-red-50 text-[#990000] border border-red-200 text-xs font-black rounded-full">
                    {currentMenu.totalCalories} kcal
                  </span>
                </div>

                <div className="space-y-4">
                  {currentMenu.dishes.map((dish, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-slate-100/80 transition">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded">
                            {dish.type}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {dish.tag}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900">{dish.name}</h4>
                      </div>
                      <span className="text-xs font-black text-slate-700 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shrink-0">
                        {dish.cal}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Vegan Alternative */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Leaf size={18} />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-emerald-950 uppercase tracking-wider">Vegan & Vejetaryen Alternatifi</h5>
                    <p className="text-xs font-bold text-emerald-800 mt-0.5">{currentMenu.veganAlternative}</p>
                    <span className="text-[10px] text-emerald-600 block mt-1 font-semibold">Ana yemek yerine yemekhane bankosundan talep edilebilir.</span>
                  </div>
                </div>
              </div>

              {/* Service Details & Macros Sidebar (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Nutrition Card */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Flame className="text-[#990000]" size={16} /> Günlük Makro Dağılımı
                  </h4>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-rose-50 p-3.5 rounded-2xl border border-rose-100">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Protein</span>
                      <strong className="text-base font-black text-rose-700">{currentMenu.protein}</strong>
                    </div>
                    <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-100">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Karbonhidrat</span>
                      <strong className="text-base font-black text-amber-700">{currentMenu.carbs}</strong>
                    </div>
                    <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-100">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Sağlıklı Yağ</span>
                      <strong className="text-base font-black text-blue-700">{currentMenu.fat}</strong>
                    </div>
                  </div>
                </div>

                {/* Service Hours & Locations */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="text-[#990000]" size={16} /> Servis Saatleri & Noktaları
                  </h4>

                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Clock size={16} className="text-[#990000]" />
                        <span className="text-xs font-bold text-slate-700">Öğle Yemeği Servisi</span>
                      </div>
                      <span className="text-xs font-black text-slate-900">11:30 — 14:00</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Clock size={16} className="text-[#990000]" />
                        <span className="text-xs font-bold text-slate-700">Akşam Yemeği Servisi</span>
                      </div>
                      <span className="text-xs font-black text-slate-900">17:00 — 19:00</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <MapPin size={16} className="text-[#990000]" />
                        <span className="text-xs font-bold text-slate-700">Merkez Kampüs Yemekhanesi</span>
                      </div>
                      <span className="text-xs font-bold text-slate-500">A Blok -2. Kat</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* TAB 2: VÜCUT KİTLE İNDEKSİ & MEDİKO SAĞLIK */}
        {activeMainTab === 'bmi' && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Hero Banner */}
            <div className="bg-gradient-to-r from-red-800 via-[#990000] to-rose-900 text-white rounded-3xl p-8 md:p-10 shadow-xl border border-red-700/50 relative overflow-hidden">
              <div className="max-w-2xl">
                <span className="text-[10px] font-black uppercase tracking-widest text-white bg-white/15 px-3.5 py-1.5 rounded-full border border-white/20 inline-block mb-3">
                  SKSDB Mediko-Sosyal Sağlık Rehberi
                </span>
                <h2 className="text-2xl md:text-3xl font-black mb-3 tracking-tight">
                  Öğrenci Vücut Kitle İndeksi (BMI) & İdeal Kilo Analizi
                </h2>
                <p className="text-red-100 text-xs md:text-sm font-medium leading-relaxed">
                  Boy ve kilonuzu girin, vücut kitle indeksinizi, ideal kilo aralığınızı, günlük metabolizma kalori ihtiyacınızı ve Mediko-Sosyal sağlık tavsiyelerini objektif verilerle görüntüleyin.
                </p>
              </div>
            </div>

            {/* Main Grid: Calculator & Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left: Interactive Calculator Form (5 cols) */}
              <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Scale className="text-[#990000]" size={20} /> Ölçüm Formu
                  </h3>
                  <span className="text-[10px] font-black uppercase text-[#990000] bg-red-50 px-2.5 py-1 rounded-md">Anlık Analiz</span>
                </div>

                {/* Gender Toggle */}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-3 rounded-2xl font-black text-xs transition border cursor-pointer ${gender === 'male' ? 'bg-[#990000] text-white border-[#990000] shadow-md' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                  >
                    Erkek
                  </button>
                  <button 
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-3 rounded-2xl font-black text-xs transition border cursor-pointer ${gender === 'female' ? 'bg-[#990000] text-white border-[#990000] shadow-md' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                  >
                    Kadın
                  </button>
                </div>

                {/* Sliders / Inputs */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-black text-slate-600 uppercase">Boy</label>
                      <span className="text-sm font-black text-[#990000]">{height} cm</span>
                    </div>
                    <input 
                      type="range" 
                      min="130" 
                      max="220" 
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full accent-[#990000] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-black text-slate-600 uppercase">Kilo</label>
                      <span className="text-sm font-black text-[#990000]">{weight} kg</span>
                    </div>
                    <input 
                      type="range" 
                      min="35" 
                      max="160" 
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="w-full accent-[#990000] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-black text-slate-600 uppercase">Yaş</label>
                      <span className="text-sm font-black text-[#990000]">{age} Yaş</span>
                    </div>
                    <input 
                      type="range" 
                      min="15" 
                      max="80" 
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full accent-[#990000] cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-600 uppercase block mb-1.5">Fiziksel Aktivite Seviyesi</label>
                    <select 
                      value={activity}
                      onChange={(e) => setActivity(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#990000]"
                    >
                      <option value={1.2}>Masa Başı / Sedanter (Spor Yapmıyor)</option>
                      <option value={1.375}>Hafif Aktif (Haftada 1-3 Gün Yürüyüş/Egzersiz)</option>
                      <option value={1.55}>Orta Aktif (Haftada 3-5 Gün Spor)</option>
                      <option value={1.725}>Çok Aktif (Haftada 6-7 Gün Yoğun Antrenman)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right: Results & Ideal Weight Goal Panel (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* BMI Score Card */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Vücut Kitle İndeksiniz (BMI)</span>
                      <h3 className="text-4xl font-black text-slate-900 mt-1">{bmi} <span className="text-sm font-bold text-slate-500">kg/m²</span></h3>
                    </div>
                    <div className={`px-4 py-2 rounded-2xl border font-black text-xs ${bmiStatus.color}`}>
                      {bmiStatus.label}
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed">
                    {bmiStatus.desc}
                  </p>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100 text-center">
                      <Flame className="text-[#990000] mx-auto mb-1" size={20} />
                      <span className="text-[10px] font-bold text-slate-600 uppercase block">Günlük Kalori İhtiyacı</span>
                      <h4 className="font-black text-slate-900 text-base">{dailyCalories} <span className="text-[10px]">kcal</span></h4>
                    </div>

                    <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 text-center">
                      <Droplets className="text-emerald-600 mx-auto mb-1" size={20} />
                      <span className="text-[10px] font-bold text-slate-600 uppercase block">Su İhtiyacı</span>
                      <h4 className="font-black text-slate-900 text-base">{idealWater} <span className="text-[10px]">Litre</span></h4>
                    </div>

                    <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 text-center">
                      <Dumbbell className="text-amber-600 mx-auto mb-1" size={20} />
                      <span className="text-[10px] font-bold text-slate-600 uppercase block">Protein Hedefi</span>
                      <h4 className="font-black text-slate-900 text-base">{idealProtein} <span className="text-[10px]">Gram</span></h4>
                    </div>
                  </div>
                </div>

                {/* Ideal Weight Goal & Mediko-Sosyal Dietitian Appointment Panel */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">İdeal Kilo & Hedef Analizi</span>
                        <h4 className="text-lg sm:text-xl font-black mt-2 text-slate-900 flex items-center gap-2">
                          <Award size={20} className="text-amber-500" /> İdeal Kilo Aralığınız: {minIdeal} - {maxIdeal} kg
                        </h4>
                      </div>
                      <span className={`text-xs font-black px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 ${weightDeltaColor}`}>
                        {weightDeltaText}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <HeartPulse className="text-emerald-600 shrink-0" size={16} /> 
                        <span>SKSDB Mediko-Sosyal birimi öğrencilerimize ücretsiz beslenme danışmanlığı sağlamaktadır.</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <UserCheck className="text-[#990000] shrink-0" size={16} /> 
                        <span>Uzman diyetisyenlerimizle birebir görüşmek için randevu talebi oluşturun.</span>
                      </div>
                    </div>

                    <button
                      onClick={handleBookDietitian}
                      disabled={dietitianBooked}
                      className={`w-full mt-5 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                        dietitianBooked
                          ? 'bg-emerald-600 text-white cursor-not-allowed'
                          : 'bg-gradient-to-r from-red-900 via-[#990000] to-rose-700 hover:from-red-950 hover:to-rose-800 text-white shadow-red-900/20'
                      }`}
                    >
                      {dietitianBooked ? (
                        <>
                          <CheckCircle2 size={16} /> Randevu Talebiniz Alındı
                        </>
                      ) : (
                        <>
                          <CalendarCheck size={16} /> Diyetisyen Randevusu Talep Et
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Dock */}
      {setView && (
        <SubPanelFloatingDock 
          currentUser={currentUser} 
          setView={setView} 
          setSelectedUserId={setSelectedUserId}
          userRole={userRole || 'student'}
          activeTab="health"
        />
      )}
    </div>
  );
}
