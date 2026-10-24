import React, { useState, useMemo } from 'react';
import {
  HeartHandshake, Award, ShieldCheck, Sparkles, Users, Coins,
  TrendingUp, CheckCircle2, Gift, Coffee, Laptop, GraduationCap,
  Globe2, X, AlertCircle
} from 'lucide-react';
import Logo from '../Logo';
import TopProfileMenu from '../TopProfileMenu';
import SubPanelFloatingDock from '../SubPanelFloatingDock';
import SafeAvatar from '../shared/SafeAvatar';
import useAppStore from '../../store/useAppStore';
import {
  getGivingCampaigns,
  processAlumniDonation,
  calculateDonationImpact,
  getDonorsHallOfHonor,
  getEndowmentAggregateMetrics,
  DONATION_TIERS
} from '../../services/alumniGivingWorkflow';

export default function AlumniEndowmentFund({
  currentUser,
  userRole = 'alumni',
  setView,
  setSelectedUserId,
  previousView = 'alumni'
}) {
  const storeCurrentUser = useAppStore(state => state.currentUser);
  const effectiveCurrentUser = currentUser || storeCurrentUser;

  const [activeTab, setActiveTab] = useState('campaigns'); // 'campaigns', 'honor_roll', 'impact'
  const [campaigns, setCampaigns] = useState(() => getGivingCampaigns());
  const [metrics, setMetrics] = useState(() => getEndowmentAggregateMetrics());
  const [honorRollFilter, setHonorRollFilter] = useState('all');

  // Donation Modal state
  const [selectedCampaignForDonation, setSelectedCampaignForDonation] = useState(null);
  const [donationAmount, setDonationAmount] = useState(500);
  const [donationFrequency, setDonationFrequency] = useState('one_time'); // 'one_time', 'monthly'
  const [dedicationMessage, setDedicationMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [donationSuccessResult, setDonationSuccessResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Refresh data
  const refreshAllData = () => {
    setCampaigns(getGivingCampaigns());
    setMetrics(getEndowmentAggregateMetrics());
  };

  const handleOpenDonation = (campaign) => {
    setSelectedCampaignForDonation(campaign);
    setDonationAmount(500);
    setDedicationMessage('');
    setIsAnonymous(false);
    setErrorMessage('');
    setDonationSuccessResult(null);
  };

  const handleCloseModal = () => {
    setSelectedCampaignForDonation(null);
    setDonationSuccessResult(null);
    setErrorMessage('');
  };

  const handleSubmitDonation = (e) => {
    e.preventDefault();
    if (!selectedCampaignForDonation) return;

    const res = processAlumniDonation({
      campaignId: selectedCampaignForDonation.id,
      amount: donationAmount,
      donorName: effectiveCurrentUser?.name || 'Mezun Bağışçı',
      donorGradYear: effectiveCurrentUser?.graduationYear || '2020',
      donorDept: effectiveCurrentUser?.department || 'Mühendislik Fakültesi',
      frequency: donationFrequency,
      dedicationMessage,
      isAnonymous,
      paymentMethod
    });

    if (res.success) {
      setDonationSuccessResult(res);
      refreshAllData();
    } else {
      setErrorMessage(res.error || 'Bağış işlemi sırasında bir hata oluştu.');
    }
  };

  const liveImpact = useMemo(() => {
    return calculateDonationImpact(donationAmount);
  }, [donationAmount]);

  const filteredDonors = useMemo(() => {
    return getDonorsHallOfHonor(honorRollFilter);
  }, [honorRollFilter]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col pb-28 text-slate-900">
      {/* Top Navbar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-emerald-900/10 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView ? setView(previousView || 'alumni') : null}
              className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
              title="Geri Dön"
            >
              <Logo color="emerald" className="h-9 w-auto" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black text-emerald-950 tracking-tight leading-none">
                  İstanbul Esenyurt Üniversitesi (İESÜ)
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Mezun Bağış Fonu
                </span>
              </div>
              <p className="text-[11px] font-bold text-emerald-700 mt-0.5">
                Kariyer Geliştirme Koordinatörlüğü & Rektörlük Ortak Fonu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <TopProfileMenu
              currentUser={effectiveCurrentUser}
              setView={setView}
              setSelectedUserId={setSelectedUserId}
            />
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white py-10 px-4 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <Sparkles size={14} /> Şeffaf, Denetimli & YÖK Uyumlu Burs Ekosistemi
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                İESÜ Mezunlar Portalı: Öğrencilerimize Gelecek Olun
              </h2>
              <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed">
                Dünya standartlarında mezun dayanışması: Mezunlarımızın katkılarıyla ihtiyaç sahibi öğrencilere yemek, barınma, Erasmus ve TEKNOFEST Ar-Ge donanım bursları sağlıyoruz. Her bağış, anlaşmalı sanayi ortakları tarafından 1:1 fon eşleştirmesi ile ikiye katlanır.
              </p>
            </div>

            {/* Overall Progress Box */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 min-w-[280px] shadow-inner space-y-3">
              <div className="flex items-center justify-between text-xs text-emerald-200">
                <span className="font-bold">Toplam Kampanya İlerlemesi</span>
                <span className="font-black">%{metrics.fundingProgressPercent}</span>
              </div>
              <div className="w-full bg-black/30 h-2.5 rounded-full overflow-hidden border border-white/10">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, metrics.fundingProgressPercent)}%` }}
                />
              </div>
              <div className="text-2xl font-black text-white">
                {(metrics.totalRaised || 0).toLocaleString('tr-TR')} ₺
                <span className="text-xs text-emerald-300/80 font-normal ml-2">
                  / {(metrics.totalTarget || 0).toLocaleString('tr-TR')} ₺
                </span>
              </div>
              <div className="text-[11px] text-emerald-200/80 flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                Vakıf & Sanayi Eşleşme Katkısı: +{(metrics.matchingContribution || 0).toLocaleString('tr-TR')} ₺
              </div>
            </div>
          </div>

          {/* Quick Metrics Deck */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8">
            <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold mb-1">
                <Coins size={16} /> Toplam Burs Fonu
              </div>
              <div className="text-lg sm:text-xl font-black">
                {(metrics.totalRaised || 0).toLocaleString('tr-TR')} ₺
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold mb-1">
                <Users size={16} /> Mezun Bağışçı
              </div>
              <div className="text-lg sm:text-xl font-black">
                {metrics.totalDonors} Kişi
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold mb-1">
                <GraduationCap size={16} /> Burs Alan Öğrenci
              </div>
              <div className="text-lg sm:text-xl font-black">
                {metrics.totalStudentsSupported}+ Bursiyer
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold mb-1">
                <Award size={16} /> Aktif Kampanya
              </div>
              <div className="text-lg sm:text-xl font-black">
                {metrics.activeCampaignsCount} Fon Kategorisi
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="max-w-7xl mx-auto px-4 mt-6 w-full">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'campaigns'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Gift size={16} /> Aktif Burs & Destek Fonları ({campaigns.length})
          </button>

          <button
            onClick={() => setActiveTab('honor_roll')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'honor_roll'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Award size={16} /> Şeref Kürsüsü (Hall of Honor)
          </button>

          <button
            onClick={() => setActiveTab('impact')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'impact'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <TrendingUp size={16} /> Sosyal Etki & Şeffaflık Raporu
          </button>
        </div>
      </div>

      {/* Tab 1: Campaigns Grid */}
      {activeTab === 'campaigns' && (
        <main className="max-w-7xl mx-auto px-4 mt-6 w-full flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {campaigns.map((camp) => {
              const progress = Math.min(100, Math.round((camp.currentAmount / camp.targetAmount) * 100));
              return (
                <div
                  key={camp.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {camp.category}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">
                        ⏳ {camp.daysLeft} gün kaldı
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 line-clamp-2">
                      {camp.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {camp.description}
                    </p>

                    {camp.corporateMatchingBy && (
                      <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50/70 p-2 rounded-lg border border-emerald-200/60 flex items-center gap-1.5">
                        <Sparkles size={13} className="text-emerald-600 shrink-0" />
                        {camp.corporateMatchingBy}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">
                        {camp.currentAmount.toLocaleString('tr-TR')} ₺
                      </span>
                      <span className="font-semibold text-slate-400">
                        Hedef: {camp.targetAmount.toLocaleString('tr-TR')} ₺
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>👥 {camp.donorCount} Bağışçı</span>
                      <span className="font-bold text-emerald-700">%{progress} Gerçekleşme</span>
                    </div>

                    <button
                      onClick={() => handleOpenDonation(camp)}
                      className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <HeartHandshake size={15} /> Bu Fona Burs Ver & Destek Ol
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* Tab 2: Hall of Honor (Şeref Kürsüsü) */}
      {activeTab === 'honor_roll' && (
        <main className="max-w-7xl mx-auto px-4 mt-6 w-full flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Award size={18} className="text-amber-500" />
                İESÜ Mezun Bağışçı Şeref Kürsüsü
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Öğrencilerimizin eğitimine güç katan saygıdeğer mezunlarımız ve kurumsal destekçilerimiz.
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setHonorRollFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  honorRollFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Tümü
              </button>
              <button
                onClick={() => setHonorRollFilter('PLATINUM')}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  honorRollFilter === 'PLATINUM' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-800'
                }`}
              >
                💎 Platin
              </button>
              <button
                onClick={() => setHonorRollFilter('GOLD')}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  honorRollFilter === 'GOLD' ? 'bg-yellow-500 text-white' : 'bg-yellow-50 text-yellow-800'
                }`}
              >
                🥇 Altın
              </button>
              <button
                onClick={() => setHonorRollFilter('SILVER')}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  honorRollFilter === 'SILVER' ? 'bg-slate-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                🥈 Gümüş
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDonors.map((donor) => {
              const tierInfo = DONATION_TIERS[donor.tier] || DONATION_TIERS.BRONZE;
              return (
                <div
                  key={donor.id}
                  className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <SafeAvatar
                      name={donor.donorName}
                      role="alumni"
                      size="md"
                      className="border-2 border-emerald-500/30 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">
                          {donor.donorName}
                        </h4>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {tierInfo.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {donor.donorDept} ({donor.donorGradYear} Mezunu)
                      </p>
                      <p className="text-xs text-slate-700 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">
                        "{donor.dedicationMessage}"
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-emerald-800 block">
                      {donor.amount.toLocaleString('tr-TR')} ₺
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block mt-1">
                      {donor.receiptNumber}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* Tab 3: Social Impact & Transparency */}
      {activeTab === 'impact' && (
        <main className="max-w-7xl mx-auto px-4 mt-6 w-full flex-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-700" />
                Burs ve Bağış Şeffaflık Matrisi & Harcama Denetimi
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Toplanan her kuruş İESÜ Vakfı ve YÖK Bağımsız Denetim İlkeleri doğrultusunda %100 şeffaflıkla öğrencilere tahsis edilir.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <Coffee size={24} className="text-emerald-700 mb-2" />
                <h4 className="text-xs font-bold text-slate-900">Askıda Yemekhane</h4>
                <div className="text-2xl font-black text-emerald-950 mt-1">
                  {Math.floor(metrics.totalRaised / 50).toLocaleString('tr-TR')} Öğün
                </div>
                <p className="text-[11px] text-slate-600 mt-1">Kampüs içi sağlıklı tabldot yemeği finanse edildi.</p>
              </div>

              <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100">
                <GraduationCap size={24} className="text-teal-700 mb-2" />
                <h4 className="text-xs font-bold text-slate-900">Tam Yaşam Bursu</h4>
                <div className="text-2xl font-black text-teal-950 mt-1">
                  {Math.floor(metrics.totalRaised / 3000).toLocaleString('tr-TR')} Ay
                </div>
                <p className="text-[11px] text-slate-600 mt-1">Aylık nakdi başarı ve barınma bursu sağlandı.</p>
              </div>

              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
                <Laptop size={24} className="text-blue-700 mb-2" />
                <h4 className="text-xs font-bold text-slate-900">Ar-Ge Donanımı</h4>
                <div className="text-2xl font-black text-blue-950 mt-1">
                  {Math.floor(metrics.totalRaised / 15000)} Cihaz
                </div>
                <p className="text-[11px] text-slate-600 mt-1">Yüksek performanslı dizüstü ve GPU kiti hibe edildi.</p>
              </div>

              <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
                <Globe2 size={24} className="text-purple-700 mb-2" />
                <h4 className="text-xs font-bold text-slate-900">Erasmus Seyahati</h4>
                <div className="text-2xl font-black text-purple-950 mt-1">
                  {Math.floor(metrics.totalRaised / 10000)} Seyahat
                </div>
                <p className="text-[11px] text-slate-600 mt-1">Yurt dışı vize ve seyahat harcırahı karşılandı.</p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Donation Form Modal */}
      {selectedCampaignForDonation && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
        >
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                  <Gift size={20} className="text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight">
                    Mezun Burs & Bağış Katkı Formu
                  </h3>
                  <p className="text-[11px] text-emerald-200">
                    {selectedCampaignForDonation.title}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-800">
              {donationSuccessResult ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-300">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900">
                      Bağışınız Başarıyla Alındı!
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Öğrencilerimiz adına en içten teşekkürlerimizi sunarız.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left font-mono space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Makbuz No:</span>
                      <span className="font-bold text-slate-900">{donationSuccessResult.donation.receiptNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Tutar:</span>
                      <span className="font-bold text-emerald-800">{donationSuccessResult.donation.amount.toLocaleString('tr-TR')} ₺</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Şeref Kürsüsü Rozeti:</span>
                      <span className="font-bold text-slate-900">{DONATION_TIERS[donationSuccessResult.donation.tier]?.badge}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Doğrulama Özeti:</span>
                      <span className="text-slate-400 text-[10px]">{donationSuccessResult.donation.verificationHash.slice(0, 16)}...</span>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-bold text-left border border-emerald-200">
                    🌱 Doğrudan Etki: {donationSuccessResult.impact.summary}
                  </div>

                  <button
                    onClick={handleCloseModal}
                    className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-black text-xs transition cursor-pointer"
                  >
                    Tamamla & Kapat
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitDonation} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 bg-red-50 text-red-900 rounded-lg border border-red-200 flex items-center gap-2">
                      <AlertCircle size={15} className="shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Amount Presets */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-2">
                      Bağış Tutarı (₺)
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {[100, 250, 500, 1000, 5000].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setDonationAmount(val)}
                          className={`py-2 rounded-lg font-bold border text-xs cursor-pointer ${
                            donationAmount === val
                              ? 'bg-emerald-800 text-white border-emerald-800'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {val} ₺
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      min="10"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Özel Tutar Girin"
                      className="w-full mt-2 p-2.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
                    />
                  </div>

                  {/* Impact preview */}
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                    <span className="font-bold block mb-0.5">🌱 Bu Bağışın Öğrenciye Etkisi:</span>
                    <span>{liveImpact.summary}</span>
                  </div>

                  {/* Frequency & Payment */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Periyot</label>
                      <select
                        value={donationFrequency}
                        onChange={(e) => setDonationFrequency(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                      >
                        <option value="one_time">Tek Seferlik Katkı</option>
                        <option value="monthly">Aylık Düzenli Burs</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Ödeme Yöntemi</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                      >
                        <option value="credit_card">Kredi Kartı (3D Secure)</option>
                        <option value="bank_transfer">Banka Havale / EFT</option>
                        <option value="alumni_points">İESÜ Mezun Puanı</option>
                      </select>
                    </div>
                  </div>

                  {/* Dedication message */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Öğrencilere İletilecek Mesajınız (Şeref Kürsüsünde Görünür)
                    </label>
                    <textarea
                      value={dedicationMessage}
                      onChange={(e) => setDedicationMessage(e.target.value)}
                      rows={2}
                      placeholder="Örn: Genç meslektaşlarıma başarılar dilerim..."
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  {/* Anonymous Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded text-emerald-700 focus:ring-emerald-600"
                    />
                    <span className="text-slate-600 text-xs">
                      İsmimi gizli tut (Şeref kürsüsünde "İsimsiz Mezun" olarak listelen)
                    </span>
                  </label>

                  {/* Modal Action Bar (Single primary action, no duplicate per AGENTS.md) */}
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition cursor-pointer"
                    >
                      Vazgeç
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-black shadow-xs transition cursor-pointer"
                    >
                      {(Number(donationAmount) || 0).toLocaleString('tr-TR')} ₺ Burs Bağışını Onayla
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Dock for Subpanels */}
      {setView && (
        <SubPanelFloatingDock
          currentUser={effectiveCurrentUser}
          setView={setView}
          setSelectedUserId={setSelectedUserId}
          userRole={userRole || 'alumni'}
        />
      )}
    </div>
  );
}
