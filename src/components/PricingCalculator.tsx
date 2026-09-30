import React, { useState } from 'react';
import {
  PackageDuration,
  PromotionTier,
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

  // Live calculation based on current inputs and dynamic config!
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
        <div className="bg-gradient-to-r from-slate-800 via-slate-850 to-slate-800 px-6 py-4 border-b border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white uppercase">
                  PRICING CALCULATOR
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/50">
                  Автомат тооцоолол
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Харилцагчийн мэдээлэл болон багцыг сонгоход үнэ шууд бодогдоно
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
            <span>Хөнгөлөлтийн хувь тохируулах</span>
            {showConfigDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Dynamic Rate & Formula Tuning Drawer */}
        {showConfigDrawer && (
          <div className="p-5 bg-slate-950 border-b border-slate-800 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Sliders className="w-4 h-4" />
                <span>Энд хувь, дүнг гараар өөрчилбөл доторх бүх томьёо шууд дагаж өөрчлөгдөнө:</span>
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

              {/* Cap & Defaults */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-300 block">
                  3. Хөнгөлөлтийн дээд хязгаар (Max Cap)
                </span>
                <div>
                  <label className="text-[10px] text-slate-400 block">Дээд хязгаар (Cap %):</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={Math.round(config.maxDiscountCap * 100)}
                      onChange={(e) =>
                        onUpdateConfig({
                          ...config,
                          maxDiscountCap: (Number(e.target.value) || 0) / 100,
                        })
                      }
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white font-mono text-xs pr-6"
                    />
                    <span className="absolute right-2 top-1 text-slate-400 text-xs">%</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 pt-1 leading-snug">
                  Excel томьёо: <code className="text-cyan-300">MIN({Math.round(config.maxDiscountCap * 100)}%, Package + Loyalty)</code>
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
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Months Already Attended (Явсан сарын тоо)
                </label>
                <span className="text-[10px] text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/40">
                  Өөрчилж болно
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={monthsAttended}
                  onChange={(e) => setMonthsAttended(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-white text-center font-mono focus:outline-none focus:border-blue-500 transition"
                />
                <input
                  type="range"
                  min="0"
                  max="36"
                  value={monthsAttended}
                  onChange={(e) => setMonthsAttended(parseInt(e.target.value) || 0)}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                <span>Хөнгөлөлтийн ангилал:</span>
                <span className={`font-bold px-2 py-0.5 rounded border text-[10px] ${tierInfo.badgeColor}`}>
                  {calc.promotionTier} ({formatPercent(calc.loyaltyDiscount)} лояалти)
                </span>
              </div>
            </div>

            {/* Row 7: New Package (months) */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  New Package (months) (Шинэ багц - сараар)
                </label>
                <span className="text-[10px] text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/40">
                  Өөрчилж болно
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
                          ? 'bg-blue-600/30 border-blue-400 text-white shadow-lg ring-1 ring-blue-400'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-bold text-sm">{pkg} сар</div>
                      <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                        +{formatPercent(pkgRate)}
                      </div>
                    </button>
                  );
                })}
              </div>
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
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition active:scale-[0.98]"
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
                  <span className="font-semibold text-slate-300 block">Package Discount (Багцын хөнгөлөлт)</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {calc.packageMonths} сарын амлалтын урамшуулал
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-blue-400 text-sm">
                    {formatPercent(calc.packageDiscount)}
                  </span>
                </div>
              </div>

              {/* Row 5: Loyalty Discount */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <span className="font-semibold text-slate-300 block">Loyalty Discount (Лояалти хөнгөлөлт)</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {calc.monthsAttended} сар хичээллэсэн гишүүнчлэл
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {formatPercent(calc.loyaltyDiscount)}
                  </span>
                </div>
              </div>

              {/* Row 6: Total Discount */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-950/30 border border-blue-600/40">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-sm">Total Discount (Нийт хөнгөлөлт)</span>
                    {calc.isCapped && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-700/50">
                        {Math.round(config.maxDiscountCap * 100)}% Cap!
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    =MIN({Math.round(config.maxDiscountCap * 100)}%, Package + Loyalty) • Бодит нийлбэр: {formatPercent(calc.rawDiscount)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-blue-300 text-lg">
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
                    {calc.monthsAttended} сар явсан + {calc.packageMonths} сарын шинэ багц
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
                  <span className="font-semibold text-slate-200 block text-sm">
                    Promotional Monthly Price (Урамшуулалт сарын үнэ)
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ={formatCurrency(calc.baseMonthlyPrice)} * (1 - {formatPercent(calc.appliedDiscount)})
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-white text-base">
                    {formatCurrency(calc.promotionalMonthlyPrice)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">/ сар</span>
                </div>
              </div>

              {/* Row 10: Total Current Package Price */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-blue-950/60 border border-emerald-500/40 shadow-inner">
                <div>
                  <span className="font-black text-emerald-200 block text-sm sm:text-base">
                    Total Current Package Price (Нийт багцын төлөх дүн)
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    ={formatCurrency(calc.promotionalMonthlyPrice)} * {calc.packageMonths} сар
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-emerald-300 text-xl sm:text-2xl">
                    {formatCurrency(calc.totalPackagePrice)}
                  </span>
                </div>
              </div>

              {/* Rows 11 & 12: Normal Package Price & Savings */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Ердийн хөнгөлөлтгүй дүн:</span>
                  <span className="font-mono font-semibold text-slate-300 line-through text-sm">
                    {formatCurrency(calc.normalPackagePrice)}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] text-emerald-400 block font-semibold">
                    Нийт хэмнэлтийн дүн:
                  </span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
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
