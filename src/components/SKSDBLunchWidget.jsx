import React, { useState } from 'react';
import { Activity, Flame, ChevronLeft, Droplets, Dumbbell, Scale, Sparkles, AlertCircle, CheckCircle2, HeartPulse, CalendarCheck, ArrowUpRight, Award, UserCheck } from 'lucide-react';
import TopProfileMenu from './TopProfileMenu';

import useAppStore from '../store/useAppStore';

export default function SKSDBLunchWidget({ setView, currentUser, userRole, setSelectedUserId }) {
  const addBmiRecord = useAppStore(state => state.addBmiRecord);
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
    weightDeltaColor = 'text-amber-400';
  } else if (weight < minIdeal) {
    const diff = (minIdeal - weight).toFixed(1);
    weightDeltaText = `İdeal kilonuzun ${diff} kg altındasınız`;
    weightDeltaColor = 'text-indigo-400';
  } else {
    weightDeltaText = 'Mükemmel! İdeal kilo aralığındasınız';
    weightDeltaColor = 'text-emerald-400';
  }

  // BMR Calculation (Mifflin-St Jeor)
  const bmr = gender === 'male' 
    ? Math.round(10 * weight + 6.25 * height - 5 * age + 5)
    : Math.round(10 * weight + 6.25 * height - 5 * age - 161);

  const dailyCalories = Math.round(bmr * activity);
  const idealWater = (weight * 0.035).toFixed(1);
  const idealProtein = Math.round(weight * 1.4);

  const getBmiCategory = (val) => {
    if (val < 18.5) return { label: 'Zayıf', color: 'text-red-600 bg-indigo-50 border-indigo-200', desc: 'İdeal kilonuzun altındasınız. Sağlıklı kilo alımı için beslenme uzmanımızla görüşebilirsiniz.' };
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-red-900 flex flex-col font-sans">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView((currentUser && currentUser.id) ? (userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : userRole === 'admin' ? 'admin' : 'student') : 'landing')} 
            className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Activity className="text-emerald-600" size={24} />
            <h1 className="font-black text-gray-900 tracking-tight">SKSDB Öğrenci Sağlık & Vücut İndeksi (BMI) Merkezi</h1>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      <main className="flex-1 w-full max-w-[1150px] mx-auto p-4 lg:p-8 flex flex-col gap-8">
        
        {/* Top Hero Banner */}
        <div className="bg-gradient-to-r from-red-800 via-[#990000] to-rose-900 text-white rounded-3xl p-8 md:p-10 shadow-xl border border-red-700/50 relative overflow-hidden">
          <div className="max-w-2xl">
            <span className="text-[10px] font-black uppercase tracking-widest text-white bg-white/15 px-3.5 py-1.5 rounded-full border border-white/20">
              SKSDB Mediko-Sosyal Sağlık Rehberi
            </span>
            <h2 className="text-2xl md:text-3xl font-black mt-3 mb-3 tracking-tight">
              Öğrenci Vücut Kitle İndeksi (BMI) & İdeal Kilo Analizi
            </h2>
            <p className="text-red-100 text-xs md:text-sm font-semibold leading-relaxed">
              Boy ve kilonuzu girin, vücut kitle indeksinizi, ideal kilo aralığınızı, günlük metabolizma kalori ihtiyacınızı ve Mediko-Sosyal sağlık tavsiyelerini objektif verilerle görüntüleyin.
            </p>
          </div>
        </div>

        {/* Main Grid: Calculator & Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Interactive Calculator Form (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Scale className="text-red-600" size={20} /> Ölçüm Formu
              </h3>
              <span className="text-[10px] font-black uppercase text-red-600 bg-red-50 px-2.5 py-1 rounded-md">Anlık Analiz</span>
            </div>

            {/* Gender Toggle */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => setGender('male')}
                className={`py-3 rounded-2xl font-black text-xs transition border ${gender === 'male' ? 'bg-red-600 text-white border-red-600 shadow-md' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
              >
                Erkek
              </button>
              <button 
                type="button"
                onClick={() => setGender('female')}
                className={`py-3 rounded-2xl font-black text-xs transition border ${gender === 'female' ? 'bg-red-600 text-white border-red-600 shadow-md' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
              >
                Kadın
              </button>
            </div>

            {/* Sliders / Inputs */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-black text-slate-600 uppercase">Boy</label>
                  <span className="text-sm font-black text-red-600">{height} cm</span>
                </div>
                <input 
                  type="range" 
                  min="130" 
                  max="220" 
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-black text-slate-600 uppercase">Kilo</label>
                  <span className="text-sm font-black text-red-600">{weight} kg</span>
                </div>
                <input 
                  type="range" 
                  min="35" 
                  max="160" 
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-black text-slate-600 uppercase">Yaş</label>
                  <span className="text-sm font-black text-red-600">{age} Yaş</span>
                </div>
                <input 
                  type="range" 
                  min="15" 
                  max="80" 
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-600 uppercase block mb-1.5">Fiziksel Aktivite Seviyesi</label>
                <select 
                  value={activity}
                  onChange={(e) => setActivity(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-red-500"
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
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">Vücut Kitle İndeksiniz (BMI)</span>
                  <h3 className="text-4xl font-black text-gray-900 mt-1">{bmi} <span className="text-sm font-bold text-slate-600">kg/m²</span></h3>
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
                  <Flame className="text-red-600 mx-auto mb-1" size={20} />
                  <span className="text-[10px] font-bold text-slate-700 uppercase block">Günlük İdeal Kalori</span>
                  <h4 className="font-black text-gray-900 text-base">{dailyCalories} <span className="text-[10px]">kcal</span></h4>
                </div>

                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 text-center">
                  <Droplets className="text-emerald-600 mx-auto mb-1" size={20} />
                  <span className="text-[10px] font-bold text-slate-700 uppercase block">Su İhtiyacı</span>
                  <h4 className="font-black text-gray-900 text-base">{idealWater} <span className="text-[10px]">Litre</span></h4>
                </div>

                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 text-center">
                  <Dumbbell className="text-amber-600 mx-auto mb-1" size={20} />
                  <span className="text-[10px] font-bold text-slate-700 uppercase block">Protein Hedefi</span>
                  <h4 className="font-black text-gray-900 text-base">{idealProtein} <span className="text-[10px]">Gram</span></h4>
                </div>
              </div>
            </div>

            {/* Ideal Weight Goal & Mediko-Sosyal Dietitian Appointment Panel */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">İdeal Kilo & Hedef Analizi</span>
                    <h4 className="text-xl font-black mt-2 text-gray-900 flex items-center gap-2">
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
                    <UserCheck className="text-red-700 shrink-0" size={16} /> 
                    <span>Uzman diyetisyenlerimizle birebir yüz yüze görüşmek için randevu talebi oluşturun.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
