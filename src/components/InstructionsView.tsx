import React from 'react';
import { BookOpen, CheckCircle, AlertTriangle, ShieldCheck, Dumbbell, Zap, TrendingUp } from 'lucide-react';

export const InstructionsView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/40 via-slate-850 to-slate-900 border border-blue-500/20 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-blue-600 text-white">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">System Guide & Operating Rules</h2>
            <p className="text-xs text-slate-400">
              Official operating manual for Proteam Gym Promotion & Loyalty Pricing System (Draft 0902).
            </p>
          </div>
        </div>
      </div>

      {/* Purpose */}
      <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-lg space-y-2">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-blue-400" />
          System Purpose
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          Calculate gym promotional pricing for <strong>1, 3, 6, and 12-month packages</strong> combining{' '}
          <span className="text-blue-400 font-semibold">package commitment</span> and{' '}
          <span className="text-emerald-400 font-semibold">existing customer loyalty</span>. This ensures fair,
          transparent, and highly motivating membership renewals while protecting club revenue margins.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1 */}
        <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700 space-y-2">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-blue-900/60 border border-blue-500 flex items-center justify-center text-xs text-white">
              1
            </span>
            Step 1: Input Customer Parameters
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Enter the customer’s Name and ID, verify base monthly price (default <strong>₮400,000</strong>, customizable),
            input the number of months the member has already attended, and choose the requested package duration.
          </p>
        </div>

        {/* Step 2 */}
        <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-emerald-900/60 border border-emerald-500 flex items-center justify-center text-xs text-white">
              2
            </span>
            Step 2: Automatic Discount Stacking
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The calculator combines two discount layers:
            <br />
            • <strong>Package Commitment</strong>: 1 mo (10%), 3 mo (15%), 6 mo (20%), 12 mo (25%).
            <br />
            • <strong>Loyalty Tenure</strong>: 3–5 mo (5%), 6–11 mo (8%), 12–23 mo (12%), 24+ mo (15%).
          </p>
        </div>

        {/* Step 3 */}
        <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-amber-900/60 border border-amber-500 flex items-center justify-center text-xs text-white">
              3
            </span>
            Step 3: 30% Maximum Discount Cap
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Total combined discount is strictly capped at <strong>30%</strong> (<code>MIN(30%, Package + Loyalty)</code>).
            If a long-term VIP member chooses an annual package (25% + 15% = 40%), the final rate is capped at 30% to safeguard operating costs.
          </p>
        </div>

        {/* Step 4 */}
        <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700 space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-purple-900/60 border border-purple-500 flex items-center justify-center text-xs text-white">
              4
            </span>
            Step 4: Renewal Monthly Price Forecast
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Renewal Monthly Price estimates the member’s price on their next renewal based on total accumulated duration
            (<code>Months Attended + New Package</code>), encouraging members to complete packages and unlock higher lifetime tiers.
          </p>
        </div>
      </div>

      {/* Member Journey Tier System */}
      <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-lg space-y-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          Member Loyalty Journey Tiers
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-xs pt-1">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700">
            <div className="font-bold text-slate-300">Starter</div>
            <div className="text-[10px] text-slate-500">0–2 Months</div>
            <div className="mt-1 text-slate-400 font-semibold">0% Loyalty</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40">
            <div className="font-bold text-emerald-300">Growing</div>
            <div className="text-[10px] text-emerald-500">3–5 Months</div>
            <div className="mt-1 text-emerald-400 font-semibold">5% Loyalty</div>
          </div>
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40">
            <div className="font-bold text-cyan-300">Committed</div>
            <div className="text-[10px] text-cyan-500">6–8 Months</div>
            <div className="mt-1 text-cyan-400 font-semibold">8% Loyalty</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40">
            <div className="font-bold text-blue-300">Loyal</div>
            <div className="text-[10px] text-blue-500">9–11 Months</div>
            <div className="mt-1 text-blue-400 font-semibold">8% Loyalty</div>
          </div>
          <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-800/40">
            <div className="font-bold text-violet-300">Long-Term</div>
            <div className="text-[10px] text-violet-500">12–17 Months</div>
            <div className="mt-1 text-violet-400 font-semibold">12% Loyalty</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/40">
            <div className="font-bold text-amber-300">Premium Loyal</div>
            <div className="text-[10px] text-amber-500">18+ Months</div>
            <div className="mt-1 text-amber-400 font-semibold">15% Loyalty</div>
          </div>
        </div>
      </div>
    </div>
  );
};
