import React, { useState } from 'react';
import { PackageDuration } from '../types';
import { formatCurrency, formatPercent, DEFAULT_BASE_PRICE, TIER_CONFIG } from '../utils/calculations';
import { Grid, Layers, ShieldCheck, Tag, ArrowRight, Zap, RefreshCw } from 'lucide-react';

export const PackageMatrixView: React.FC = () => {
  const [basePrice, setBasePrice] = useState<number>(DEFAULT_BASE_PRICE);

  // Standard packages ("odooo")
  const standardPackages = [
    { months: 1, standardTotal: 400000, monthlyRate: 400000, standardDiscount: '0%' },
    { months: 3, standardTotal: 1080000, monthlyRate: 360000, standardDiscount: '10%' },
    { months: 6, standardTotal: 1980000, monthlyRate: 330000, standardDiscount: '17.5%' },
    { months: 12, standardTotal: 3600000, monthlyRate: 300000, standardDiscount: '25%' },
  ];

  // Loyalty Cohorts for "shine" grid
  const cohorts = [
    { label: '3–5 months', loyaltyRate: 0.05, minMonths: 3 },
    { label: '6–11 months', loyaltyRate: 0.08, minMonths: 6 },
    { label: '12–23 months', loyaltyRate: 0.12, minMonths: 12 },
    { label: '24+ months', loyaltyRate: 0.15, minMonths: 24 },
  ];

  // Package extension discounts
  const packageDiscounts: { months: PackageDuration; pkgDiscount: number }[] = [
    { months: 1, pkgDiscount: 0.10 },
    { months: 3, pkgDiscount: 0.15 },
    { months: 6, pkgDiscount: 0.20 },
    { months: 12, pkgDiscount: 0.25 },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Grid className="w-5 h-5 text-indigo-400" />
            Proteam Package & Loyalty Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Official benchmark rates comparing standard legacy pricing (odooo) against loyalty-incentivized rates (shine).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Simulation Base Price:</span>
          <div className="relative">
            <span className="absolute left-2.5 top-1.5 text-xs text-slate-500 font-bold">₮</span>
            <input
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value) || 0)}
              className="w-36 bg-slate-850 border border-slate-700 rounded-lg pl-6 pr-2 py-1 text-xs font-mono font-bold text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          {basePrice !== DEFAULT_BASE_PRICE && (
            <button
              onClick={() => setBasePrice(DEFAULT_BASE_PRICE)}
              className="p-1 text-slate-400 hover:text-white"
              title="Reset to 400,000 ₮"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Old ("odooo") vs New ("shine") Comparison Matrix */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Standard Pricing (odooo) vs Promotional Pricing (shine)
            </h3>
            <p className="text-xs text-slate-400">
              Shows how promotional discount + member loyalty rewards calculate total package fees.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800/60">
            30% Maximum Cap Enforced
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-900/80 text-slate-400 font-semibold uppercase">
                <th className="py-3 px-3">Package</th>
                <th className="py-3 px-3 text-center bg-slate-900/40 text-slate-300">
                  Standard (odooo)
                </th>
                {cohorts.map((c) => (
                  <th key={c.label} className="py-3 px-3 text-center bg-blue-950/30 text-blue-200">
                    <div>{c.label}</div>
                    <div className="text-[10px] font-normal text-blue-400">
                      +{formatPercent(c.loyaltyRate)} loyalty
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-300">
              {packageDiscounts.map(({ months, pkgDiscount }) => {
                const stdPkg = standardPackages.find((s) => s.months === months);
                const oldTotal = stdPkg ? (basePrice / 400000) * stdPkg.standardTotal : basePrice * months;

                return (
                  <tr key={months} className="hover:bg-slate-750/30 transition">
                    <td className="py-3.5 px-3 font-semibold text-white">
                      <div className="text-sm">{months} {months === 1 ? 'Month' : 'Months'}</div>
                      <div className="text-[10px] text-slate-400">+{formatPercent(pkgDiscount)} package disc.</div>
                    </td>

                    {/* Standard Odooo column */}
                    <td className="py-3.5 px-3 text-center bg-slate-900/30 font-mono">
                      <div className="font-bold text-slate-200">{formatCurrency(oldTotal)}</div>
                      <div className="text-[10px] text-slate-400">
                        ({formatCurrency(oldTotal / months)}/mo)
                      </div>
                    </td>

                    {/* Shine cohorts columns */}
                    {cohorts.map((cohort) => {
                      const rawDiscount = pkgDiscount + cohort.loyaltyRate;
                      const appliedDiscount = Math.min(0.30, rawDiscount);
                      const isCapped = rawDiscount > 0.30;
                      const promoMonthly = Math.round(basePrice * (1 - appliedDiscount));
                      const promoTotal = promoMonthly * months;
                      const savings = oldTotal - promoTotal;

                      return (
                        <td key={cohort.label} className="py-3.5 px-3 text-center bg-blue-950/10 hover:bg-blue-950/20 font-mono">
                          <div className="font-bold text-white text-sm">
                            {formatCurrency(promoTotal)}
                          </div>
                          <div className="text-[11px] text-blue-300">
                            {formatCurrency(promoMonthly)}/mo
                          </div>
                          <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                            {formatPercent(appliedDiscount)} off {isCapped && '(Cap)'}
                          </div>
                          {savings > 0 && (
                            <div className="text-[9px] text-slate-400">
                              Save {formatCurrency(savings)}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3 Reference Grids from Workbook */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Table 1: Package Extension Discounts */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
            <Tag className="w-4 h-4 text-blue-400" />
            <h4 className="font-bold text-white text-sm">Package Commitment Discounts</h4>
          </div>
          <p className="text-xs text-slate-400">
            Discounts granted when extending by longer commitments.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="pb-2">Package</th>
                  <th className="pb-2 text-center">Discount</th>
                  <th className="pb-2 text-right">Monthly @ ₮400k</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="py-2 font-medium">1 Month</td>
                  <td className="py-2 text-center text-blue-400 font-bold">10%</td>
                  <td className="py-2 text-right font-mono">₮360,000</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">3 Months</td>
                  <td className="py-2 text-center text-blue-400 font-bold">15%</td>
                  <td className="py-2 text-right font-mono">₮340,000</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">6 Months</td>
                  <td className="py-2 text-center text-blue-400 font-bold">20%</td>
                  <td className="py-2 text-right font-mono">₮320,000</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">12 Months</td>
                  <td className="py-2 text-center text-blue-400 font-bold">25%</td>
                  <td className="py-2 text-right font-mono">₮300,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Loyalty Discounts */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h4 className="font-bold text-white text-sm">Loyalty Duration Discounts</h4>
          </div>
          <p className="text-xs text-slate-400">
            Automatic reward based on total months attended.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="pb-2">Months Attended</th>
                  <th className="pb-2 text-center">Discount</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="py-2 font-medium">0 – 2 Months</td>
                  <td className="py-2 text-center text-slate-400">0%</td>
                  <td className="py-2 text-right text-[11px] text-slate-400">Starter</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">3 – 5 Months</td>
                  <td className="py-2 text-center text-emerald-400 font-bold">5%</td>
                  <td className="py-2 text-right text-[11px] text-emerald-400">Growing</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">6 – 11 Months</td>
                  <td className="py-2 text-center text-cyan-400 font-bold">8%</td>
                  <td className="py-2 text-right text-[11px] text-cyan-400">Committed</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">12 – 23 Months</td>
                  <td className="py-2 text-center text-blue-400 font-bold">12%</td>
                  <td className="py-2 text-right text-[11px] text-blue-400">Long-Term</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">24+ Months</td>
                  <td className="py-2 text-center text-amber-400 font-bold">15%</td>
                  <td className="py-2 text-right text-[11px] text-amber-400">Premium Loyal</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 3: Duration & Renewal Tiers */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <h4 className="font-bold text-white text-sm">Membership Score Tiers</h4>
          </div>
          <p className="text-xs text-slate-400">
            Total expected duration = Attended + New Package.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="pb-2">Threshold</th>
                  <th className="pb-2">Tier Name</th>
                  <th className="pb-2 text-right">Renewal Disc.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {TIER_CONFIG.map((t) => (
                  <tr key={t.tier}>
                    <td className="py-1.5 font-medium">{t.minMonths}M+</td>
                    <td className="py-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] border ${t.badgeColor}`}>
                        {t.tier}
                      </span>
                    </td>
                    <td className="py-1.5 text-right font-bold text-slate-300">
                      {t.loyaltyDiscount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
