/**
 * src/components/global/GlobalCareerCostCalculator.jsx
 * İstanbul Esenyurt Üniversitesi (İESÜ) Küresel Kariyer & Satın Alma Gücü (PPP) Yaşam Maliyeti Hesaplayıcı
 *
 * Kurumsal Kurallar (AGENTS.md):
 * - Resmi Kurum Adı: İstanbul Esenyurt Üniversitesi (İESÜ)
 * - Koordinatörlük: Kariyer Geliştirme Koordinatörlüğü
 * - Mükerrer Buton Yasağı: Tüm kontroller tek akış içinde
 */

import React, { useState, useMemo } from 'react';
import { 
  Calculator, DollarSign, TrendingUp, Home, ArrowRight, ShieldCheck, 
  HelpCircle, PieChart, Sparkles, Building2, MapPin, CheckCircle2, X 
} from 'lucide-react';
import { useTranslation } from '../../i18n';

export const GLOBAL_CITIES_PARITY_DATA = {
  istanbul: {
    city: 'İstanbul',
    country: 'Türkiye',
    flag: '🇹🇷',
    currency: 'TRY',
    symbol: '₺',
    fxToTry: 1.0,
    defaultSalary: 75000,
    taxRate: 0.27,
    coli: 100, // baseline
    housing: {
      center1BR: 28000,
      suburbs: 18000,
      shared: 10000
    },
    expenses: {
      groceries: 14000,
      transit: 1750,
      utilities: 3500,
      leisure: 8000
    },
    gradAvgSalary: 45000
  },
  berlin: {
    city: 'Berlin',
    country: 'Germany',
    countryTr: 'Almanya',
    flag: '🇩🇪',
    currency: 'EUR',
    symbol: '€',
    fxToTry: 36.5,
    defaultSalary: 4500,
    taxRate: 0.38,
    coli: 155,
    housing: {
      center1BR: 1250,
      suburbs: 850,
      shared: 550
    },
    expenses: {
      groceries: 380,
      transit: 49,
      utilities: 240,
      leisure: 350
    },
    gradAvgSalary: 4200
  },
  amsterdam: {
    city: 'Amsterdam',
    country: 'Netherlands',
    countryTr: 'Hollanda',
    flag: '🇳🇱',
    currency: 'EUR',
    symbol: '€',
    fxToTry: 36.5,
    defaultSalary: 5000,
    taxRate: 0.37,
    coli: 185,
    housing: {
      center1BR: 1750,
      suburbs: 1200,
      shared: 800
    },
    expenses: {
      groceries: 420,
      transit: 120,
      utilities: 260,
      leisure: 450
    },
    gradAvgSalary: 4600
  },
  london: {
    city: 'London',
    country: 'United Kingdom',
    countryTr: 'Birleşik Krallık',
    flag: '🇬🇧',
    currency: 'GBP',
    symbol: '£',
    fxToTry: 43.0,
    defaultSalary: 4500,
    taxRate: 0.28,
    coli: 195,
    housing: {
      center1BR: 1800,
      suburbs: 1250,
      shared: 850
    },
    expenses: {
      groceries: 350,
      transit: 160,
      utilities: 240,
      leisure: 450
    },
    gradAvgSalary: 3800
  },
  dublin: {
    city: 'Dublin',
    country: 'Ireland',
    countryTr: 'İrlanda',
    flag: '🇮🇪',
    currency: 'EUR',
    symbol: '€',
    fxToTry: 36.5,
    defaultSalary: 4800,
    taxRate: 0.32,
    coli: 180,
    housing: {
      center1BR: 1850,
      suburbs: 1300,
      shared: 850
    },
    expenses: {
      groceries: 400,
      transit: 110,
      utilities: 250,
      leisure: 400
    },
    gradAvgSalary: 4200
  },
  zurich: {
    city: 'Zürich',
    country: 'Switzerland',
    countryTr: 'İsviçre',
    flag: '🇨🇭',
    currency: 'CHF',
    symbol: 'CHF',
    fxToTry: 39.0,
    defaultSalary: 8500,
    taxRate: 0.18,
    coli: 230,
    housing: {
      center1BR: 2400,
      suburbs: 1700,
      shared: 1100
    },
    expenses: {
      groceries: 650,
      transit: 180,
      utilities: 280,
      leisure: 700
    },
    gradAvgSalary: 7500
  },
  munich: {
    city: 'München',
    country: 'Germany',
    countryTr: 'Almanya',
    flag: '🇩🇪',
    currency: 'EUR',
    symbol: '€',
    fxToTry: 36.5,
    defaultSalary: 4800,
    taxRate: 0.39,
    coli: 168,
    housing: {
      center1BR: 1450,
      suburbs: 1050,
      shared: 650
    },
    expenses: {
      groceries: 400,
      transit: 49,
      utilities: 250,
      leisure: 380
    },
    gradAvgSalary: 4500
  },
  new_york: {
    city: 'New York',
    country: 'United States',
    countryTr: 'ABD',
    flag: '🇺🇸',
    currency: 'USD',
    symbol: '$',
    fxToTry: 34.5,
    defaultSalary: 7500,
    taxRate: 0.28,
    coli: 220,
    housing: {
      center1BR: 3200,
      suburbs: 2100,
      shared: 1400
    },
    expenses: {
      groceries: 550,
      transit: 132,
      utilities: 220,
      leisure: 600
    },
    gradAvgSalary: 6500
  },
  tokyo: {
    city: 'Tokyo',
    country: 'Japan',
    countryTr: 'Japonya',
    flag: '🇯🇵',
    currency: 'JPY',
    symbol: '¥',
    fxToTry: 0.23,
    defaultSalary: 480000,
    taxRate: 0.22,
    coli: 135,
    housing: {
      center1BR: 130000,
      suburbs: 85000,
      shared: 55000
    },
    expenses: {
      groceries: 50000,
      transit: 15000,
      utilities: 22000,
      leisure: 45000
    },
    gradAvgSalary: 380000
  },
  dubai: {
    city: 'Dubai',
    country: 'UAE',
    countryTr: 'BAE',
    flag: '🇦🇪',
    currency: 'AED',
    symbol: 'AED',
    fxToTry: 9.4,
    defaultSalary: 18000,
    taxRate: 0.00, // Tax-Free
    coli: 145,
    housing: {
      center1BR: 6500,
      suburbs: 4200,
      shared: 2800
    },
    expenses: {
      groceries: 1800,
      transit: 600,
      utilities: 900,
      leisure: 2200
    },
    gradAvgSalary: 15000
  },
  warsaw: {
    city: 'Warsaw',
    country: 'Poland',
    countryTr: 'Polonya',
    flag: '🇵🇱',
    currency: 'PLN',
    symbol: 'zł',
    fxToTry: 8.6,
    defaultSalary: 14000,
    taxRate: 0.26,
    coli: 118,
    housing: {
      center1BR: 3800,
      suburbs: 2600,
      shared: 1700
    },
    expenses: {
      groceries: 1400,
      transit: 120,
      utilities: 800,
      leisure: 1200
    },
    gradAvgSalary: 10500
  },
  singapore: {
    city: 'Singapore',
    country: 'Singapore',
    countryTr: 'Singapur',
    flag: '🇸🇬',
    currency: 'SGD',
    symbol: 'S$',
    fxToTry: 26.0,
    defaultSalary: 6500,
    taxRate: 0.12,
    coli: 190,
    housing: {
      center1BR: 2800,
      suburbs: 1800,
      shared: 1100
    },
    expenses: {
      groceries: 600,
      transit: 150,
      utilities: 250,
      leisure: 650
    },
    gradAvgSalary: 5200
  }
};

export const calculateLivingParity = ({
  targetCityKey = 'berlin',
  salaryInput = null,
  isGross = true,
  housingType = 'center1BR', // 'center1BR' | 'suburbs' | 'shared'
  lifestyle = 'balanced' // 'frugal' | 'balanced' | 'premium'
}) => {
  const target = GLOBAL_CITIES_PARITY_DATA[targetCityKey] || GLOBAL_CITIES_PARITY_DATA.berlin;
  const istanbul = GLOBAL_CITIES_PARITY_DATA.istanbul;

  const enteredSalary = Number(salaryInput) > 0 ? Number(salaryInput) : target.defaultSalary;
  
  // Tax & Social Security Deduction
  const netSalary = isGross 
    ? enteredSalary * (1 - target.taxRate)
    : enteredSalary;

  // Lifestyle Multipliers
  const lifestyleMultiplier = lifestyle === 'frugal' ? 0.8 : lifestyle === 'premium' ? 1.35 : 1.0;

  // Monthly Expenses in Target City
  const rentCost = target.housing[housingType] || target.housing.center1BR;
  const groceriesCost = target.expenses.groceries * lifestyleMultiplier;
  const transitCost = target.expenses.transit;
  const utilitiesCost = target.expenses.utilities;
  const leisureCost = target.expenses.leisure * lifestyleMultiplier;

  const totalMonthlyExpenses = rentCost + groceriesCost + transitCost + utilitiesCost + leisureCost;
  const netMonthlySavings = netSalary - totalMonthlyExpenses;
  const savingsRate = netSalary > 0 ? Math.max(0, (netMonthlySavings / netSalary) * 100) : 0;

  // Conversion to TRY equivalent
  const netSalaryInTry = netSalary * target.fxToTry;
  const netSavingsInTry = netMonthlySavings * target.fxToTry;

  // Purchasing Power Parity (PPP) Benchmark vs Istanbul
  // How much TRY would an Istanbul resident need to maintain the identical basket of goods & savings?
  const istanbulEquivalentExpenses = (totalMonthlyExpenses * target.fxToTry) * (istanbul.coli / target.coli);
  const equivalentIstanbulNetSalary = Math.round(istanbulEquivalentExpenses + Math.max(0, netSavingsInTry));

  // Purchasing power factor
  const purchasingPowerFactor = (netSalaryInTry / (equivalentIstanbulNetSalary || 1)).toFixed(2);

  return {
    target,
    enteredSalary,
    netSalary: Math.round(netSalary),
    totalMonthlyExpenses: Math.round(totalMonthlyExpenses),
    netMonthlySavings: Math.round(netMonthlySavings),
    netSavingsInTry: Math.round(netSavingsInTry),
    savingsRate: Math.round(savingsRate),
    netSalaryInTry: Math.round(netSalaryInTry),
    equivalentIstanbulNetSalary,
    purchasingPowerFactor,
    expensesBreakdown: {
      rent: Math.round(rentCost),
      groceries: Math.round(groceriesCost),
      transit: Math.round(transitCost),
      utilities: Math.round(utilitiesCost),
      leisure: Math.round(leisureCost)
    }
  };
};

export default function GlobalCareerCostCalculator({
  initialCityKey = 'berlin',
  isOpen = true,
  onClose = null,
  isModal = false
}) {
  const { t, isEn } = useTranslation();
  const [selectedCityKey, setSelectedCityKey] = useState(initialCityKey);
  const [salary, setSalary] = useState('');
  const [isGross, setIsGross] = useState(true);
  const [housingType, setHousingType] = useState('center1BR');
  const [lifestyle, setLifestyle] = useState('balanced');

  const currentCityData = GLOBAL_CITIES_PARITY_DATA[selectedCityKey] || GLOBAL_CITIES_PARITY_DATA.berlin;

  const results = useMemo(() => {
    return calculateLivingParity({
      targetCityKey: selectedCityKey,
      salaryInput: salary,
      isGross,
      housingType,
      lifestyle
    });
  }, [selectedCityKey, salary, isGross, housingType, lifestyle]);

  const content = (
    <div className="bg-slate-900 text-slate-100 rounded-3xl border border-cyan-500/30 p-6 sm:p-8 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-black text-cyan-300 uppercase tracking-widest mb-1.5">
            <Sparkles size={12} /> {t('costCalc.title')}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>{currentCityData.flag}</span>
            <span>{currentCityData.city} {t('costCalc.vsIstanbul')}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {t('costCalc.subtitle')}
          </p>
        </div>

        {isModal && onClose && (
          <button
            onClick={onClose}
            aria-label="Kapat"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition self-end sm:self-center"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Controls Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* City Selector */}
        <div>
          <label className="text-xs font-bold text-slate-300 mb-1.5 block">
            {t('costCalc.targetCityLabel')}
          </label>
          <select
            data-testid="target-city-select"
            value={selectedCityKey}
            onChange={(e) => setSelectedCityKey(e.target.value)}
            className="w-full bg-slate-800 border border-white/15 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-400 transition"
          >
            {Object.entries(GLOBAL_CITIES_PARITY_DATA).map(([key, data]) => (
              <option key={key} value={key}>
                {data.flag} {data.city} ({data.country}) [{data.currency}]
              </option>
            ))}
          </select>
        </div>

        {/* Salary Input */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-bold text-slate-300">
              {t('costCalc.currentSalaryLabel')}
            </label>
            <button
              type="button"
              onClick={() => setIsGross(!isGross)}
              className="text-[10px] font-mono text-cyan-400 hover:underline"
            >
              {isGross ? 'Brüt (Gross)' : 'Net'}
            </button>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-xs">
              {currentCityData.symbol}
            </span>
            <input
              type="number"
              placeholder={String(currentCityData.defaultSalary)}
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full bg-slate-800 border border-white/15 rounded-xl pl-8 pr-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-cyan-400 transition"
            />
          </div>
        </div>

        {/* Housing Type */}
        <div>
          <label className="text-xs font-bold text-slate-300 mb-1.5 block">
            {t('costCalc.housingLabel')}
          </label>
          <select
            data-testid="housing-type-select"
            value={housingType}
            onChange={(e) => setHousingType(e.target.value)}
            className="w-full bg-slate-800 border border-white/15 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-400 transition"
          >
            <option value="center1BR">{t('costCalc.housingCenter1BR')}</option>
            <option value="suburbs">{t('costCalc.housingSuburbs')}</option>
            <option value="shared">{t('costCalc.housingShared')}</option>
          </select>
        </div>

        {/* Lifestyle */}
        <div>
          <label className="text-xs font-bold text-slate-300 mb-1.5 block">
            {t('costCalc.lifestyleLabel')}
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-800 p-1 rounded-xl border border-white/10 text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setLifestyle('frugal')}
              className={`py-1.5 rounded-lg transition ${lifestyle === 'frugal' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-300'}`}
            >
              {t('costCalc.lifestyleFrugal')}
            </button>
            <button
              type="button"
              onClick={() => setLifestyle('balanced')}
              className={`py-1.5 rounded-lg transition ${lifestyle === 'balanced' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-300'}`}
            >
              {t('costCalc.lifestyleBalanced')}
            </button>
            <button
              type="button"
              onClick={() => setLifestyle('premium')}
              className={`py-1.5 rounded-lg transition ${lifestyle === 'premium' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-300'}`}
            >
              {t('costCalc.lifestylePremium')}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Disposable */}
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-white/10 shadow-inner">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
            {t('costCalc.netDisposableIncome')}
          </span>
          <div className="text-2xl font-black text-cyan-300 font-mono">
            {results.target.symbol} {results.netSalary.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            ~₺ {results.netSalaryInTry.toLocaleString()} / ay
          </span>
        </div>

        {/* Living Expenses */}
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-white/10 shadow-inner">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
            {t('costCalc.monthlyLivingCost')}
          </span>
          <div className="text-2xl font-black text-rose-300 font-mono">
            {results.target.symbol} {results.totalMonthlyExpenses.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {isEn ? 'Rent' : 'Kira'} ({results.target.symbol}{results.expensesBreakdown.rent}) + {isEn ? 'Living' : 'Yaşam'}
          </span>
        </div>

        {/* Net Savings */}
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-emerald-500/30 shadow-inner">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block mb-1">
            {t('costCalc.monthlySavings')}
          </span>
          <div className="text-2xl font-black text-emerald-300 font-mono">
            {results.target.symbol} {results.netMonthlySavings.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-200/80 mt-1 block font-bold">
            {isEn ? 'Savings Rate:' : 'Tasarruf Oranı:'} %{results.savingsRate} (~₺{results.netSavingsInTry.toLocaleString()})
          </span>
        </div>

        {/* Istanbul Parity Equivalent */}
        <div className="bg-gradient-to-br from-amber-500/20 to-red-500/20 p-4 rounded-2xl border border-amber-500/40 shadow-inner">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block mb-1">
            {t('costCalc.equivalentIstanbulSalary')}
          </span>
          <div className="text-2xl font-black text-white font-mono">
            ₺ {results.equivalentIstanbulNetSalary.toLocaleString()}
          </div>
          <span className="text-[10px] text-amber-200 mt-1 block font-bold">
            {t('costCalc.neededSalaryInIstanbul')}
          </span>
        </div>
      </div>

      {/* Expense Breakdown Progress Bars */}
      <div className="bg-slate-800/60 p-5 rounded-2xl border border-white/10 space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <PieChart size={14} className="text-cyan-400" />
          {t('costCalc.livingBreakdownTitle')} ({currentCityData.city})
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-white/5">
            <span className="text-slate-400 text-[10px] block">{t('costCalc.rent')}</span>
            <span className="font-mono font-bold text-white">{currentCityData.symbol} {results.expensesBreakdown.rent}</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-white/5">
            <span className="text-slate-400 text-[10px] block">{t('costCalc.groceries')}</span>
            <span className="font-mono font-bold text-white">{currentCityData.symbol} {results.expensesBreakdown.groceries}</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-white/5">
            <span className="text-slate-400 text-[10px] block">{t('costCalc.transit')}</span>
            <span className="font-mono font-bold text-white">{currentCityData.symbol} {results.expensesBreakdown.transit}</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-white/5">
            <span className="text-slate-400 text-[10px] block">{t('costCalc.utilities')}</span>
            <span className="font-mono font-bold text-white">{currentCityData.symbol} {results.expensesBreakdown.utilities}</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-white/5">
            <span className="text-slate-400 text-[10px] block">{t('costCalc.leisure')}</span>
            <span className="font-mono font-bold text-white">{currentCityData.symbol} {results.expensesBreakdown.leisure}</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
        <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
