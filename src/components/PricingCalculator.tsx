import React, { useState } from 'react';
import {
  PackageDuration,
  PricingCalculationResult,
  CustomerPricingEntry,
  PricingConfig,
} from '../types';
import {
  calculatePricing,
  formatCurrency,
  formatPercent,
  TIER_CONFIG,
} from '../utils/calculations';
import { ProteamLogo } from './ProteamLogo';
import {
  Calculator,
  Save,
  FileText,
  RotateCcw,
  Sliders,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Award,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
} from 'lucide-react';

interface PricingCalculatorProps {
  config: PricingConfig;
  onUpdateConfig: (newConfig: PricingConfig) => void;
  onResetConfig: () => void;
  onSaveToLog: (entry: Omit<CustomerPricingEntry, 'id' | 'createdAt'>) => void;
  onOpenQuote: (calc: PricingCalculationResult, name: string, id: string) => void;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({
  config,
  onUpdateConfig,
  onResetConfig,
  onSaveToLog,
  onOpenQuote,
}) => {
  // Input parameters (matching Excel sheet B3:B7)
  const [customerName, setCustomerName] = useState('Odonchimeg');
  const [customerId, setCustomerId] = useState('101');
  const [basePrice, setBasePrice] = useState<number>(config.basePrice);
  const [monthsAttended, setMonthsAttended] = useState<number>(24);
  const [packageMonths, setPackageMonths] = useState<PackageDuration>(3);
  const [notes, setNotes] = useState('');
  const [savedNotification, setSavedNotification] = useState(false);
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);

  // Sync internal base price with config
  const handleBasePriceChange = (val: number) => {
    const safe = Math.max(0, val);
    setBasePrice(safe);
    onUpdateConfig({ ...config, basePrice: safe });
  };

  // 100% PURE REAL-TIME FORMULA CALCULATION
  // Automatically recalculates when monthsAttended, packageMonths, basePrice, or config change!
  const calc = calculatePricing(basePrice, monthsAttended, packageMonths, config);
  const tierInfo = TIER_CONFIG.find((t) => t.tier === calc.promotionTier) || TIER_CONFIG[0];

  const handleSave = () => {
    onSaveToLog({
      customerId: customerId.trim() || 'N/A',
      customerName: customerName.trim() || 'Зочин гишүүн',
      baseMonthlyPrice: calc.baseMonthlyPrice,
      monthsAttended: calc.monthsAttended,
      packageMonths: calc.packageMonths,
      totalExpectedMonths: calc.totalExpectedMonths,
      packageDiscount: calc.packageDiscount,
      loyaltyDiscount: calc.loyaltyDiscount,
      appliedDiscount: calc.appliedDiscount,
      rawDiscount: calc.rawDiscount,
      isCapped: calc.isCapped,
      promoMonthlyPrice: calc.promotionalMonthlyPrice,
      packageTotal: calc.totalPackagePrice,
      normalPackagePrice: calc.normalPackagePrice,
      packageSavings: calc.currentPackageSavings,
      renewalMonthlyPrice: calc.renewalMonthlyPrice,
      promotionTier: calc.promotionTier,
      notes: notes.trim(),
    });

    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Main Pricing Calculation Container */}
      <div className="bg-slate-900 border-2 border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Title Bar */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-850 to-zinc-900 px-6 py-4 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-xl bg-zinc-950 border border-zinc-800 shadow-md">
              <ProteamLogo size="sm" showText={false} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white uppercase italic font-sans flex items-center gap-1.5">
                  <span>PROTEAM</span>
                  <span className="text-red-500">PRICING CALCULATOR</span>
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Excel Томьёо идэвхтэй
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Явсан сар болон Багцын хугацааг өөрчлөхөд бүх хөнгөлөлт, үнэ шууд тооцогдоно
              </p>
            </div>
          </div>

          {/* Config / Rate Tuning Toggle Button */}
          <button
            onClick={() => setShowConfigDrawer(!showConfigDrawer)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
              showConfigDrawer
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Томьёоны хувь тохируулах</span>
            {showConfigDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Dynamic Rate & Formula Tuning Drawer */}
        {showConfigDrawer && (
          <div className="p-5 bg-slate-950 border-b border-slate-800 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Sliders className="w-4 h-4" />
                <span>Энд томьёоны суурь хувийг өөрчилбөл доторх бүх тооцоолол шууд дагаж шинэчлэгдэнэ:</span>
              </div>
              <button
                onClick={onResetConfig}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 transition"
              >
                <RotateCcw className="w-3 h-3" />
                Анхны утгад буцаах
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Package Commitment Rates */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-blue-300 block">
                  1. Багцын хугацааны хөнгөлөлт (Package %)
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block">1 сар (1M):</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={Math.round(config.packageDiscounts[1] * 100)}
                        onChange={(e) =>
                          onUpdateConfig({
                            ...config,
                            packageDiscounts: {
                              ...config.packageDiscounts,
                              1: (Number(e.target.value) || 0) / 100,
                            },
                          })
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white font-mono text-xs pr-6"
                      />
                      <span className="absolute right-2 top-1 text-slate-400 text-xs">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block">3 сар (3M):</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={Math.round(config.packageDiscounts[3] * 100)}
                        onChange={(e) =>
                          onUpdateConfig({
                            ...config,
                            packageDiscounts: {
                              ...config.packageDiscounts,
                              3: (Number(e.target.value) || 0) / 100,
                            },
                          })
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white font-mono text-xs pr-6"
                      />
                      <span className="absolute right-2 top-1 text-slate-400 text-xs">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block">6 сар (6M):</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={Math.round(config.packageDiscounts[6] * 100)}
                        onChange={(e) =>
                          onUpdateConfig({
                            ...config,
                            packageDiscounts: {
                              ...config.packageDiscounts,
                              6: (Number(e.target.value) || 0) / 100,
                            },
                          })
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white font-mono text-xs pr-6"
                      />
                      <span className="absolute right-2 top-1 text-slate-400 text-xs">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block">12 сар (12M):</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={Math.round(config.packageDiscounts[12] * 100)}
                        onChange={(e) =>
                          onUpdateConfig({
                            ...config,
                            packageDiscounts: {
                              ...config.packageDiscounts,
                              12: (Number(e.target.value) || 0) / 100,
                            },
                          })
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white font-mono text-xs pr-6"
                      />
                      <span className="absolute right-2 top-1 text-slate-400 text-xs">%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loyalty Tenure Rates */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-emerald-300 block">
                  2. Лояалти хугацааны хөнгөлөлт (Loyalty %)
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block">3-5 сар:</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={Math.round(config.loyaltyDiscounts.tier3_5 * 100)}
                        onChange={(e) =>
                          onUpdateConfig({
                            ...config,
                            loyaltyDiscounts: {
                              ...config.loyaltyDiscounts,
                              tier3_5: (Number(e.target.value) || 0) / 100,
                            },
                          })
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white font-mono text-xs pr-6"
                      />
                      <span className="absolute right-2 top-1 text-slate-400 text-xs">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block">6-11 сар:</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={Math.round(config.loyaltyDiscounts.tier6_11 * 100)}
                        onChange={(e) =>
                          onUpdateConfig({
                            ...config,
                            loyaltyDiscounts: {
                              ...config.loyaltyDiscounts,
                              tier6_11: (Number(e.target.value) || 0) / 100,
                            },
                          })
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white font-mono text-xs pr-6"
                      />
                      <span className="absolute right-2 top-1 text-slate-400 text-xs">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block">12-23 сар:</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={Math.round(config.loyaltyDiscounts.tier12_23 * 100)}
                        onChange={(e) =>
                          onUpdateConfig({
                            ...config,
                            loyaltyDiscounts: {
                              ...config.loyaltyDiscounts,
                              tier12_23: (Number(e.target.value) || 0) / 100,
                            },
                          })
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white font-mono text-xs pr-6"
                      />
                      <span className="absolute right-2 top-1 text-slate-400 text-xs">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block">24+ сар:</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={Math.round(config.loyaltyDiscounts.tier24_plus * 100)}
                        onChange={(e) =>
                          onUpdateConfig({
                            ...config,
                            loyaltyDiscounts: {
                              ...config.loyaltyDiscounts,
                              tier24_plus: (Number(e.target.value) || 0) / 100,
                            },
                          })
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white font-mono text-xs pr-6"
                      />
                      <span className="absolute right-2 top-1 text-slate-400 text-xs">%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formula & Rule */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-300 block">
                  3. Нийт хөнгөлөлтийн томьёо (Total Discount)
                </span>
                <div className="text-xs text-slate-300 pt-1">
                  Excel томьёо: <code className="text-cyan-300 font-bold">=E4 + E5</code>
                </div>
                <div className="text-[11px] text-slate-400 pt-0.5 leading-relaxed">
                  Багцын хөнгөлөлт (Package %) дээр Лояалти хөнгөлөлт (Loyalty %)-ийг шууд нэмж <strong>Total Discount</strong> гарна.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Calculation Form & Results Layout */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/60">
          {/* Left Column: INPUTS (Excel Cols A, B, C) */}
          <div className="lg:col-span-5 bg-slate-850/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-750 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <h3 className="font-bold text-white text-sm uppercase tracking-wide">
                  Харилцагчийн Параметрүүд
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Оруулах утгууд</span>
            </div>

            {/* Row 3: Customer Name */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Customer Name (Харилцагчийн нэр)
                </label>
              </div>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Жишээ: Odonchimeg"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Row 4: Customer ID */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Customer ID (Харилцагчийн код)
                </label>
              </div>
              <input
                type="text"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="Жишээ: 101"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Row 5: Base Monthly Price */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Base Monthly Price (Сарын суурь үнэ)
                </label>
                <span className="text-[10px] text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/40">
                  Өөрчилж болно
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">₮</span>
                <input
                  type="number"
                  step="10000"
                  value={basePrice}
                  onChange={(e) => handleBasePriceChange(Number(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-4 py-2 text-sm font-bold text-white focus:outline-none focus:border-blue-500 font-mono transition"
                />
              </div>
            </div>

            {/* Row 6: Months Already Attended */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-750 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-200">
                  Months Already Attended (Явсан сарын тоо)
                </label>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                  Томьёо: +{formatPercent(calc.loyaltyDiscount)} Loyalty
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={monthsAttended}
                  onChange={(e) => setMonthsAttended(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-24 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm font-black text-white text-center font-mono focus:outline-none focus:border-blue-500 transition"
                />
                <input
                  type="range"
                  min="0"
                  max="36"
                  value={monthsAttended}
                  onChange={(e) => setMonthsAttended(parseInt(e.target.value) || 0)}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
              
              {/* Dynamic Formula Tracker for Loyalty */}
              <div className="pt-1.5 border-t border-slate-800 grid grid-cols-5 gap-1 text-[10px] text-center font-mono">
                <div className={`p-1 rounded border ${monthsAttended < 3 ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300 font-bold' : 'bg-slate-850 border-slate-800 text-slate-500'}`}>
                  &lt;3 сар<br/><span className="text-[11px]">0%</span>
                </div>
                <div className={`p-1 rounded border ${monthsAttended >= 3 && monthsAttended < 6 ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300 font-bold' : 'bg-slate-850 border-slate-800 text-slate-500'}`}>
                  3-5 сар<br/><span className="text-[11px]">{formatPercent(config.loyaltyDiscounts.tier3_5)}</span>
                </div>
                <div className={`p-1 rounded border ${monthsAttended >= 6 && monthsAttended < 12 ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300 font-bold' : 'bg-slate-850 border-slate-800 text-slate-500'}`}>
                  6-11 сар<br/><span className="text-[11px]">{formatPercent(config.loyaltyDiscounts.tier6_11)}</span>
                </div>
                <div className={`p-1 rounded border ${monthsAttended >= 12 && monthsAttended < 24 ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300 font-bold' : 'bg-slate-850 border-slate-800 text-slate-500'}`}>
                  12-23 сар<br/><span className="text-[11px]">{formatPercent(config.loyaltyDiscounts.tier12_23)}</span>
                </div>
                <div className={`p-1 rounded border ${monthsAttended >= 24 ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300 font-bold' : 'bg-slate-850 border-slate-800 text-slate-500'}`}>
                  24+ сар<br/><span className="text-[11px]">{formatPercent(config.loyaltyDiscounts.tier24_plus)}</span>
                </div>
              </div>
            </div>

            {/* Row 7: New Package (months) */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-750 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-200">
                  New Package (months) (Шинэ багц - сараар)
                </label>
                <span className="text-[10px] text-blue-400 font-bold bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/40">
                  Томьёо: +{formatPercent(calc.packageDiscount)} Package
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {([1, 3, 6, 12] as PackageDuration[]).map((pkg) => {
                  const isSelected = packageMonths === pkg;
                  const pkgRate = config.packageDiscounts[pkg];
                  return (
                    <button
                      key={pkg}
                      type="button"
                      onClick={() => setPackageMonths(pkg)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-red-950/40 border-red-500 text-white shadow-md ring-1 ring-red-500/50'
                          : 'bg-zinc-850 border-zinc-750 text-zinc-300 hover:border-zinc-650'
                      }`}
                    >
                      <div className="font-bold text-sm">{pkg} сар</div>
                      <div className={`text-[10px] font-semibold mt-0.5 ${isSelected ? 'text-red-300' : 'text-zinc-400'}`}>
                        {monthsAttended === 0 ? '0%' : `+${formatPercent(pkgRate)}`}
                      </div>
                    </button>
                  );
                })}
              </div>
              {monthsAttended === 0 && (
                <p className="text-[10px] text-amber-400 italic">
                  *Шинэ гишүүн (0 сар явсан) тул Excel томьёоны дагуу Багцын хөнгөлөлт 0% тооцогдоно.
                </p>
              )}
            </div>

            {/* Notes & Actions */}
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">
                Тэмдэглэл (Notes)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Тэмдэглэл..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-600/25 transition active:scale-[0.98]"
              >
                <Save className="w-4 h-4" />
                <span>Customer Log-д хадгалах</span>
              </button>
              <button
                onClick={() => onOpenQuote(calc, customerName, customerId)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition"
              >
                <FileText className="w-4 h-4" />
                <span>Үнийн санал</span>
              </button>
            </div>

            {savedNotification && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Customer Pricing Log хүснэгтэд амжилттай бүртгэгдлээ!</span>
              </div>
            )}
          </div>

          {/* Right Column: PRICING RESULT (Excel Cols D & E) */}
          <div className="lg:col-span-7 bg-slate-850/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-750 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <h3 className="font-extrabold text-white text-sm uppercase tracking-wide">
                  PRICING RESULT (ТООЦООЛЛЫН ҮР ДҮН)
                </h3>
              </div>
              <span className={`font-bold px-2.5 py-0.5 rounded-full border text-xs ${tierInfo.badgeColor}`}>
                {calc.promotionTier}
              </span>
            </div>

            {/* Excel Row-by-Row Result Table */}
            <div className="space-y-2 text-xs">
              {/* Row 4: Package Discount */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <span className="font-bold text-white block">Package Discount (Багцын хөнгөлөлт)</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    =IF(MonthsAttended=0, 0, PackageMatrix ({calc.packageMonths} сар))
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-blue-400 text-base">
                    {formatPercent(calc.packageDiscount)}
                  </span>
                </div>
              </div>

              {/* Row 5: Loyalty Discount */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <span className="font-bold text-white block">Loyalty Discount (Лояалти хөнгөлөлт)</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    =IF(MonthsAttended&lt;3, 0, LoyaltyMatrix ({calc.monthsAttended} сар явсан))
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-emerald-400 text-base">
                    {formatPercent(calc.loyaltyDiscount)}
                  </span>
                </div>
              </div>

              {/* Row 6: Total Discount */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-red-950/30 border border-red-600/40 shadow-sm">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-white text-sm">Total Discount (Нийт хөнгөлөлт)</span>
                  </div>
                  <span className="text-[10px] text-red-200/90 font-mono">
                    =E4 + E5 = Package ({formatPercent(calc.packageDiscount)}) + Loyalty ({formatPercent(calc.loyaltyDiscount)})
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-red-400 text-xl">
                    {formatPercent(calc.appliedDiscount)}
                  </span>
                </div>
              </div>

              {/* Row 7: Membership Score / Expected Months */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <span className="font-semibold text-slate-300 block">
                    Membership Score / Expected Months (Нийт хүлээгдэж буй сар)
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ={calc.monthsAttended} сар + {calc.packageMonths} сар
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-white text-sm">
                    {calc.totalExpectedMonths} сар
                  </span>
                </div>
              </div>

              {/* Row 8: Promotion Tier */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <span className="font-semibold text-slate-300 block">Promotion Tier (Урамшууллын зэрэглэл)</span>
                  <span className="text-[10px] text-slate-500 font-mono">Хугацааны үнэнч байдлын ангилал</span>
                </div>
                <div className="text-right">
                  <span className={`font-bold px-2.5 py-0.5 rounded-full border text-xs ${tierInfo.badgeColor}`}>
                    {calc.promotionTier}
                  </span>
                </div>
              </div>

              {/* Row 9: Promotional Monthly Price */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-700">
                <div>
                  <span className="font-bold text-slate-200 block text-sm">
                    Promotional Monthly Price (Урамшуулалт сарын үнэ)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    =BasePrice * (1 - TotalDiscount) = {formatCurrency(calc.baseMonthlyPrice)} * (1 - {formatPercent(calc.appliedDiscount)})
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-white text-lg">
                    {formatCurrency(calc.promotionalMonthlyPrice)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">/ сар</span>
                </div>
              </div>

              {/* Row 10: Total Current Package Price */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-850 border-2 border-red-500/60 shadow-xl shadow-red-950/20">
                <div>
                  <span className="font-black text-white block text-sm sm:text-base flex items-center gap-1.5">
                    <span>Total Current Package Price</span>
                    <span className="text-xs text-zinc-400 font-normal hidden sm:inline">(Нийт багцын төлөх дүн)</span>
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    =PromotionalMonthlyPrice * {calc.packageMonths} сар
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-white text-2xl sm:text-3xl tracking-tight">
                    {formatCurrency(calc.totalPackagePrice)}
                  </span>
                </div>
              </div>

              {/* Rows 11 & 12: Normal Package Price & Current Package Savings */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block font-medium">Normal Package Price:</span>
                  <span className="text-[10px] text-slate-500 font-mono block">=Base * Package</span>
                  <span className="font-mono font-bold text-slate-400 line-through text-sm mt-0.5 block">
                    {formatCurrency(calc.normalPackagePrice)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-700/50">
                  <span className="text-[11px] text-emerald-300 block font-bold">
                    Current Package Savings:
                  </span>
                  <span className="text-[10px] text-emerald-400/80 font-mono block">=Normal - Current</span>
                  <span className="font-mono font-black text-emerald-400 text-base mt-0.5 block">
                    {formatCurrency(calc.currentPackageSavings)} ({calc.savingsPercentage}%)
                  </span>
                </div>
              </div>

              {/* Row 13: Renewal Monthly Price* */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-indigo-700/40 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="font-bold text-indigo-200">Renewal Monthly Price* (Дараагийн сунгалтын үнэ)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Нийт {calc.totalExpectedMonths} сар хүрсний дараах сунгалтын үнийн таамаглал
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-indigo-300 text-base">
                    {formatCurrency(calc.renewalMonthlyPrice)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">/ сар</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
