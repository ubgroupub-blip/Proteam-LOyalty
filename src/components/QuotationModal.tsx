import React from 'react';
import { CustomerPricingEntry, PricingCalculationResult } from '../types';
import { formatCurrency, formatPercent, TIER_CONFIG } from '../utils/calculations';
import { ProteamLogo } from './ProteamLogo';
import { X, Printer, Award, Calendar, CheckCircle2 } from 'lucide-react';

interface QuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  data:
    | { type: 'calc'; calc: PricingCalculationResult; name: string; id: string }
    | { type: 'entry'; entry: CustomerPricingEntry }
    | null;
}

export const QuotationModal: React.FC<QuotationModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const isEntry = data.type === 'entry';
  const name = isEntry ? data.entry.customerName : data.name || 'Valued Member';
  const id = isEntry ? data.entry.customerId : data.id || 'N/A';
  const basePrice = isEntry ? data.entry.baseMonthlyPrice : data.calc.baseMonthlyPrice;
  const monthsAttended = isEntry ? data.entry.monthsAttended : data.calc.monthsAttended;
  const packageMonths = isEntry ? data.entry.packageMonths : data.calc.packageMonths;
  const totalExpectedMonths = isEntry ? data.entry.totalExpectedMonths : data.calc.totalExpectedMonths;
  const packageDiscount = isEntry ? data.entry.packageDiscount : data.calc.packageDiscount;
  const loyaltyDiscount = isEntry ? data.entry.loyaltyDiscount : data.calc.loyaltyDiscount;
  const appliedDiscount = isEntry ? data.entry.appliedDiscount : data.calc.appliedDiscount;
  const promoMonthlyPrice = isEntry ? data.entry.promoMonthlyPrice : data.calc.promotionalMonthlyPrice;
  const totalPackagePrice = isEntry ? data.entry.packageTotal : data.calc.totalPackagePrice;
  const normalPackagePrice = isEntry ? data.entry.normalPackagePrice : data.calc.normalPackagePrice;
  const packageSavings = isEntry ? data.entry.packageSavings : data.calc.currentPackageSavings;
  const renewalMonthlyPrice = isEntry ? data.entry.renewalMonthlyPrice : data.calc.renewalMonthlyPrice;
  const promotionTier = isEntry ? data.entry.promotionTier : data.calc.promotionTier;
  const isCapped = isEntry ? data.entry.isCapped : data.calc.isCapped;

  const tierInfo = TIER_CONFIG.find((t) => t.tier === promotionTier) || TIER_CONFIG[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden relative my-8">
        {/* Modal Controls */}
        <div className="flex items-center justify-between p-4 bg-slate-800/80 border-b border-slate-700 print:hidden">
          <span className="text-xs font-semibold text-slate-300">
            Official Member Pricing Quotation
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Quote</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Quotation Sheet */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-100 bg-slate-900" id="quotation-print-area">
          {/* Gym Branding Header */}
          <div className="flex items-start justify-between border-b border-slate-700 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ProteamLogo size="md" />
              </div>
              <p className="text-xs text-slate-400">
                Premium Fitness Club & Member Loyalty Program
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                QUOTATION
              </span>
              <span className="font-mono text-sm font-bold text-blue-400">
                #PT-{id || 'PROMO'}
              </span>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Date: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Member Profile */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Member Name</span>
              <span className="font-bold text-white text-sm">{name}</span>
              <span className="text-[11px] text-slate-400 block mt-1">
                Customer ID: <span className="font-mono font-semibold">{id}</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[11px]">Current Tier</span>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border mt-0.5 ${tierInfo.badgeColor}`}>
                {promotionTier}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">
                Attended: <strong>{monthsAttended} Months</strong>
              </span>
            </div>
          </div>

          {/* Package Details */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Selected Package & Discount Breakdown
            </h4>
            <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
              <div className="flex justify-between p-3 bg-slate-800/40 border-b border-slate-800">
                <span className="text-slate-300">Package Duration</span>
                <span className="font-bold text-white">
                  {packageMonths} {packageMonths === 1 ? 'Month' : 'Months'}
                </span>
              </div>
              <div className="flex justify-between p-3 border-b border-slate-800">
                <span className="text-slate-300">Standard Base Monthly Price</span>
                <span className="font-mono">{formatCurrency(basePrice)}</span>
              </div>
              <div className="flex justify-between p-3 border-b border-slate-800">
                <span className="text-slate-300">Package Commitment Discount</span>
                <span className="text-blue-400 font-semibold">
                  +{formatPercent(packageDiscount)}
                </span>
              </div>
              <div className="flex justify-between p-3 border-b border-slate-800">
                <span className="text-slate-300">Loyalty Duration Discount</span>
                <span className="text-emerald-400 font-semibold">
                  +{formatPercent(loyaltyDiscount)}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-blue-950/20 border-b border-blue-900/30">
                <span className="font-semibold text-blue-200">
                  Total Applied Discount {isCapped && '(30% Max Cap Enforced)'}
                </span>
                <span className="font-bold text-blue-300 text-sm">
                  {formatPercent(appliedDiscount)} OFF
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Totals Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-850 border border-slate-700 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Standard Non-Promotional Total:</span>
              <span className="line-through">{formatCurrency(normalPackagePrice)}</span>
            </div>
            <div className="flex justify-between text-xs text-emerald-400 font-semibold">
              <span>Total Member Promotion Savings:</span>
              <span>- {formatCurrency(packageSavings)}</span>
            </div>
            <div className="border-t border-slate-700/80 pt-2 flex justify-between items-baseline">
              <div>
                <span className="text-xs text-slate-300 font-medium block">
                  Promotional Monthly Rate
                </span>
                <span className="text-sm font-semibold text-slate-200 font-mono">
                  {formatCurrency(promoMonthlyPrice)} / month
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-medium block">
                  Total Payable Package Fee
                </span>
                <span className="text-2xl font-black text-white font-mono tracking-tight text-blue-400">
                  {formatCurrency(totalPackagePrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Future Renewal Incentive Note */}
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
            <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">Continuous Loyalty Incentive:</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Upon completing this {packageMonths}-month package, your expected total duration will reach{' '}
                <strong>{totalExpectedMonths} Months</strong>, unlocking an estimated renewal monthly price of{' '}
                <strong className="text-emerald-400">{formatCurrency(renewalMonthlyPrice)}/mo</strong>.
              </p>
            </div>
          </div>

          {/* Terms Footer */}
          <div className="border-t border-slate-800 pt-4 text-[10px] text-slate-500 space-y-1">
            <p>• Promotional quote valid for 7 days from issue date.</p>
            <p>• Non-transferable; applies exclusively to member {name} (ID: {id}).</p>
            <p>• Proteam Fitness Club reserves all rights regarding membership terms & facility usage.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
