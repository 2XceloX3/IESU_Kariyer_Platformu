import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Activity, Scale, Info, Sparkles, CheckCircle2, RotateCcw, ArrowDown, HeartPulse, Stethoscope } from 'lucide-react';
import useAppStore from '../store/useAppStore';

export default function BMICalculatorModal({ isOpen = true, onClose, setView }) {
  const addBmiRecord = useAppStore(state => state.addBmiRecord);
  const currentUser = useAppStore(state => state.currentUser) || {};
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [age, setAge] = useState(22);
  const [gender, setGender] = useState('female');
  const [activityLevel, setActivityLevel] = useState('1.375'); // Default: Hafif Hareketli (Haftada 1-3 gün spor)
  const [result, setResult] = useState(null);

  const handleClose = () => {
    if (typeof onClose === 'function') {
      onClose();
    } else if (typeof setView === 'function') {
      setView('feed');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCalculate = (e) => {
    if (e) e.preventDefault();
    const hInMeters = parseFloat(height) / 100;
    const wInKg = parseFloat(weight);
    const ageVal = parseInt(age, 10) || 22;
    const actMult = parseFloat(activityLevel) || 1.375;

    if (!hInMeters || !wInKg || hInMeters <= 0 || wInKg <= 0) return;

    const bmiVal = parseFloat((wInKg / (hInMeters * hInMeters)).toFixed(1));

    // Mifflin-St Jeor BMR Formula (Scientific accurate calculation with Age)
    // Male: 10*weight + 6.25*height - 5*age + 5
    // Female: 10*weight + 6.25*height - 5*age - 161
    const bmrVal = Math.round(
      10 * wInKg + 6.25 * parseFloat(height) - 5 * ageVal + (gender === 'male' ? 5 : -161)
    );

    // Total Daily Energy Expenditure (TDEE) based on Activity Multiplier
    const tdeeVal = Math.round(bmrVal * actMult);

    let category = '';
    let categoryKey = '';
    let color = '';
    let bgColor = '';
    let advice = '';

    if (bmiVal < 18.5) {
      category = 'Zayıf (Düşük Kilo)';
      categoryKey = 'underweight';
      color = 'text-blue-600 border-blue-200 bg-blue-50';
      bgColor = 'bg-blue-50/80 border-blue-200';
      advice = 'Vücut kitle indeksiniz standart değerlerin altındadır (Zayıf). Diyetisyen ve Beslenme Danışmanlığı birimimize başvurarak kişisel beslenme takviminizi oluşturabilirsiniz.';
    } else if (bmiVal >= 18.5 && bmiVal <= 24.9) {
      category = 'Normal (İdeal Kilo)';
      categoryKey = 'normal';
      color = 'text-emerald-600 border-emerald-200 bg-emerald-50';
      bgColor = 'bg-emerald-50/80 border-emerald-200';
      advice = 'Tebrikler! Vücut kitle indeksiniz ideal ve sağlıklı aralıktadır. Spor Birimi kampüs aktivitelerine katılım sağlayabilirsiniz.';
    } else if (bmiVal >= 25 && bmiVal <= 29.9) {
      category = 'Fazla Kilolu';
      categoryKey = 'overweight';
      color = 'text-amber-600 border-amber-200 bg-amber-50';
      bgColor = 'bg-amber-50/80 border-amber-200';
      advice = 'Vücut kitle indeksiniz standart değerlerin hafif üzerindedir (Fazla Kilolu). Sağlık Birimi rehberliğinde düzenli egzersiz programları uygulayabilirsiniz.';
    } else {
      category = 'Obez (Yüksek Risk)';
      categoryKey = 'obese';
      color = 'text-red-600 border-red-200 bg-red-50';
      bgColor = 'bg-red-50/80 border-red-200';
      advice = 'Vücut kitle indeksiniz yüksek aralıktadır (Obez). Sağlık Danışmanlığı birimi uzmanlarımızla görüşerek kişiye özel egzersiz ve beslenme programı oluşturmanız tavsiye edilir.';
    }

    // Ideal weight calculation
    const minIdeal = 18.5 * (hInMeters * hInMeters);
    const maxIdeal = 24.9 * (hInMeters * hInMeters);

    let weightDeltaMsg = '';
    if (bmiVal < 18.5) {
      const needed = (minIdeal - wInKg).toFixed(1);
      weightDeltaMsg = `+${needed} kg almanız önerilir`;
    } else if (bmiVal > 24.9) {
      const toLose = (wInKg - maxIdeal).toFixed(1);
      weightDeltaMsg = `-${toLose} kg vermeniz önerilir`;
    } else {
      weightDeltaMsg = 'İdeal kilodasınız';
    }

    // Spectrum Gauge Pointer percentage (0% to 100%) across 4 equal zones (25% each)
    let pointerPercent = 0;
    if (bmiVal < 18.5) {
      pointerPercent = Math.max(0, Math.min(25, (bmiVal / 18.5) * 25));
    } else if (bmiVal >= 18.5 && bmiVal <= 24.9) {
      pointerPercent = 25 + Math.min(25, Math.max(0, ((bmiVal - 18.5) / 6.4) * 25));
    } else if (bmiVal >= 25 && bmiVal <= 29.9) {
      pointerPercent = 50 + Math.min(25, Math.max(0, ((bmiVal - 25) / 4.9) * 25));
    } else {
      pointerPercent = 75 + Math.min(25, Math.max(0, ((bmiVal - 30) / 10) * 25));
    }

    const calculatedResult = {
      bmi: bmiVal.toFixed(1),
      bmiVal,
      age: ageVal,
      bmr: bmrVal,
      tdee: tdeeVal,
      category,
      categoryKey,
      color,
      bgColor,
      advice,
      minIdeal: minIdeal.toFixed(1),
      maxIdeal: maxIdeal.toFixed(1),
      weightDeltaMsg,
      pointerPercent
    };

    setResult(calculatedResult);

    // Save record to central store pool so admin can see real calculations
    if (addBmiRecord) {
      addBmiRecord({
        id: `BMI-${Date.now()}`,
        name: currentUser?.name || 'Öğrenci',
        role: currentUser?.role || 'Öğrenci',
        height: height,
        weight: weight,
        age: ageVal,
        gender: gender === 'male' ? 'Erkek' : 'Kadın',
        bmi: bmiVal,
        bmr: bmrVal,
        targetCal: tdeeVal,
        category: category,
        dietitianRequested: bmiVal > 25 || bmiVal < 18.5,
        date: new Date().toLocaleString('tr-TR')
      });
    }
  };

  const handleReset = () => {
    setHeight(170);
    setWeight(70);
    setAge(22);
    setResult(null);
  };

  const modalJSX = (
    <div 
      onClick={handleClose}
      className="fixed inset-0 z-[999999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh' }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 animate-slide-up relative my-auto max-h-[90vh] flex flex-col z-[1000000]"
      >
        {/* Modal Header - Google Stitch Crimson Theme */}
        <div className="bg-gradient-to-r from-[#990000] via-[#7A0000] to-[#5C0000] p-5 sm:p-6 text-white relative overflow-hidden shadow-md shrink-0">
          <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <button 
            onClick={handleClose} 
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition text-white cursor-pointer z-10"
            title="Kapat"
          >
            <X size={18} />
          </button>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-2.5">
            <HeartPulse size={24} className="text-amber-300" />
          </div>
          <span className="bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-amber-300/30">
            Öğrenci Sağlık & Yaşam Danışmanlığı
          </span>
          <h3 className="text-lg sm:text-xl font-black text-white mt-1">Kilo & Vücut Kitle İndeksi (VKİ) Ölçümü</h3>
          <p className="text-xs text-red-100 mt-1 font-medium leading-relaxed">
            Sağlıklı kampüs yaşamı ve kişisel gelişiminiz için kilonuzu ve vücut analizinizi anında değerlendirin.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {!result ? (
            <form onSubmit={handleCalculate} className="space-y-5">
              {/* Gender Selector */}
              <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${gender === 'female' ? 'bg-white text-[#990000] shadow-sm' : 'text-slate-500'}`}
                >
                  Kadın
                </button>
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${gender === 'male' ? 'bg-white text-[#990000] shadow-sm' : 'text-slate-500'}`}
                >
                  Erkek
                </button>
              </div>

              {/* Height Input & Slider */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Scale size={16} className="text-[#990000]" /> Boyunuz
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      required
                      min="100"
                      max="250"
                      value={height || ''}
                      onChange={(e) => setHeight(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                      className="w-20 px-2 py-1 bg-white border border-slate-300 rounded-xl text-sm font-black text-right text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-200"
                    />
                    <span className="text-xs font-bold text-slate-500">cm</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="100"
                  max="250"
                  value={height || 170}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full accent-[#990000] cursor-pointer"
                />
              </div>

              {/* Weight Input & Slider */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Activity size={16} className="text-[#990000]" /> Kilonuz
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      required
                      min="30"
                      max="250"
                      step="0.1"
                      value={weight || ''}
                      onChange={(e) => setWeight(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                      className="w-20 px-2 py-1 bg-white border border-slate-300 rounded-xl text-sm font-black text-right text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-200"
                    />
                    <span className="text-xs font-bold text-slate-500">kg</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="30"
                  max="250"
                  step="0.5"
                  value={weight || 70}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full accent-[#990000] cursor-pointer"
                />
              </div>

              {/* Age Input & Slider */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Info size={16} className="text-[#990000]" /> Yaşınız (BMR & Kalori İhtiyacı İçin)
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      required
                      min="14"
                      max="100"
                      value={age || ''}
                      onChange={(e) => setAge(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                      className="w-20 px-2 py-1 bg-white border border-slate-300 rounded-xl text-sm font-black text-right text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-200"
                    />
                    <span className="text-xs font-bold text-slate-500">yaş</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="16"
                  max="80"
                  value={age || 22}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full accent-[#990000] cursor-pointer"
                />
              </div>

              {/* Physical Activity Level Selector */}
              <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="text-xs font-bold text-slate-700 block">Günlük Fiziksel Aktivite Düzeyi</label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-200"
                >
                  <option value="1.2">Hareketsiz / Masa Başı (Spor Yok)</option>
                  <option value="1.375">Hafif Hareketli (Haftada 1-3 Gün Egzersiz)</option>
                  <option value="1.55">Orta Derece Hareketli (Haftada 3-5 Gün Egzersiz)</option>
                  <option value="1.725">Yüksek Hareketli (Haftada 6-7 Gün Ağır Spor)</option>
                  <option value="1.9">Profesyonel Sporcu / Yoğun Fiziksel İş</option>
                </select>
              </div>

              <button
                type="submit"
                onClick={handleCalculate}
                className="w-full py-3.5 bg-[#990000] hover:bg-red-800 text-white rounded-2xl font-black text-sm uppercase tracking-wider transition shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles size={16} /> Bilimsel VKİ & Kalori Hesabını Gör
              </button>
            </form>
          ) : (
            <div className="space-y-5 animate-fade-in">
              {/* BMI Result Summary */}
              <div className={`p-5 rounded-2xl border ${result.bgColor} text-center space-y-2`}>
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">Hesaplanan Vücut Kitle İndeksi ({result.age} Yaş)</p>
                <h4 className="text-4xl font-black text-slate-900">{result.bmi} <span className="text-sm font-bold text-slate-500">kg/m²</span></h4>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase border ${result.color} shadow-sm`}>
                  {result.category}
                </span>
              </div>

              {/* Spectrum Gauge with Dynamic Pointer */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-wider px-1">
                  <span>Zayıf (&lt;18.5)</span>
                  <span>Normal (18.5-24.9)</span>
                  <span>Kilolu (25-29.9)</span>
                  <span>Obez (&ge;30)</span>
                </div>
                <div className="relative pt-4 pb-1">
                  {/* Spectrum Bar */}
                  <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                    <div className="bg-blue-500 h-full" style={{ width: '25%' }} title="Zayıf (<18.5)"></div>
                    <div className="bg-emerald-500 h-full" style={{ width: '25%' }} title="Normal (18.5-24.9)"></div>
                    <div className="bg-amber-500 h-full" style={{ width: '25%' }} title="Fazla Kilolu (25-29.9)"></div>
                    <div className="bg-red-600 h-full" style={{ width: '25%' }} title="Obez (>=30)"></div>
                  </div>
                  {/* Dynamic Arrow Indicator */}
                  <div 
                    className="absolute top-0 -ml-2.5 transition-all duration-500 ease-out flex flex-col items-center pointer-events-none"
                    style={{ left: `${result.pointerPercent}%` }}
                  >
                    <ArrowDown size={18} className="text-slate-900 fill-slate-900 animate-bounce" />
                  </div>
                </div>
              </div>

              {/* Ideal Weight & Delta Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">İdeal Kilo Aralığınız</p>
                  <p className="text-sm font-black text-slate-800 mt-1">{result.minIdeal} - {result.maxIdeal} kg</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Hedef Değerlendirmesi</p>
                  <p className="text-sm font-black text-[#990000] mt-1">{result.weightDeltaMsg}</p>
                </div>
              </div>

              {/* BMR (Bazal Metabolizma) & TDEE (Günlük Kalori İhtiyacı) Calculation Block */}
              <div className="grid grid-cols-2 gap-3 bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-md">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-amber-400 block">Bazal Metabolizma Hızı (BMR)</span>
                  <p className="text-lg font-black text-white">{result.bmr} <span className="text-xs font-semibold text-slate-400">kcal/gün</span></p>
                  <p className="text-[10px] text-slate-400 leading-tight">Dinlenirken vücudun yaktığı minimum enerji</p>
                </div>
                <div className="space-y-1 border-l border-slate-800 pl-3">
                  <span className="text-[10px] font-black uppercase text-emerald-400 block">Günlük Kalori İhtiyacı (TDEE)</span>
                  <p className="text-lg font-black text-emerald-300">{result.tdee} <span className="text-xs font-semibold text-slate-400">kcal/gün</span></p>
                  <p className="text-[10px] text-slate-400 leading-tight">Kilonuzu korumak için gerekli toplam enerji</p>
                </div>
              </div>

              {/* General Health Advisory Output */}
              <div className="p-4 bg-red-50/60 rounded-2xl border border-red-200/80 space-y-2">
                <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Stethoscope size={16} className="text-[#990000]" />
                  T.C. İstanbul Esenyurt Üniversitesi Sağlık Kültür ve Spor Daire Başkanlığı Sağlıklı Yaşam Rehberi
                </h5>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {result.advice}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw size={14} /> Yeniden Hesapla
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3 bg-[#990000] hover:bg-red-800 text-white font-bold rounded-2xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <CheckCircle2 size={14} /> Tamam
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalJSX, document.body);
}
