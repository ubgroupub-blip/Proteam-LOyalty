import { PackageDuration, PromotionTier, PricingCalculationResult, CustomerPricingEntry, PricingConfig } from '../types';

export const DEFAULT_CONFIG: PricingConfig = {
  basePrice: 400000,
  packageDiscounts: {
    1: 0.10, // 10%
    3: 0.15, // 15%
    6: 0.20, // 20%
    12: 0.25, // 25%
  },
  loyaltyDiscounts: {
    tier3_5: 0.03,   // 3% (Excel Instructions!C10)
    tier6_11: 0.08,  // 8% (Excel Instructions!D10)
    tier12_23: 0.10, // 10% (Excel Instructions!E10)
    tier24_plus: 0.12, // 12% (Excel Instructions!F10)
  },
  maxDiscountCap: 1.0, // Excel Sheet 1 formula for E6 is E4+E5 direct sum
};

export const DEFAULT_BASE_PRICE = 400000;
export const MAX_DISCOUNT_CAP = 1.0;

/**
 * Excel Formula for Package Discount (Sheet 1 cell E4):
 * =IF(MonthsAttended=0, 0, IF(Package=1, 10%, IF(Package=3, 15%, IF(Package=6, 20%, IF(Package=12, 25%, 0)))))
 */
export function getPackageDiscount(
  packageMonths: PackageDuration,
  monthsAttended: number,
  config: PricingConfig = DEFAULT_CONFIG
): number {
  if (monthsAttended === 0) {
    return 0.00;
  }
  return config.packageDiscounts[packageMonths] ?? 0.00;
}

/**
 * Excel Formula for Loyalty Discount (Sheet 1 cell E5):
 * =IF(B6<3, 0, IF(B6<6, Instructions!C10, IF(B6<12, Instructions!D10, IF(B6<24, Instructions!E10, Instructions!F10))))
 * Instructions!C10 = 3% (0.03)
 * Instructions!D10 = 8% (0.08)
 * Instructions!E10 = 10% (0.10)
 * Instructions!F10 = 12% (0.12)
 */
export function getLoyaltyDiscount(
  monthsAttended: number,
  config: PricingConfig = DEFAULT_CONFIG
): number {
  if (monthsAttended < 3) {
    return 0.00;
  }
  if (monthsAttended < 6) {
    return config.loyaltyDiscounts.tier3_5; // 3%
  }
  if (monthsAttended < 12) {
    return config.loyaltyDiscounts.tier6_11; // 8%
  }
  if (monthsAttended < 24) {
    return config.loyaltyDiscounts.tier12_23; // 10%
  }
  return config.loyaltyDiscounts.tier24_plus; // 12%
}

/**
 * Promotion Tier based on months attended (Excel formula):
 * < 3: Starter
 * < 6: Growing
 * < 9: Committed
 * < 12: Loyal
 * < 18: Long-Term
 * 18+: Premium Loyal
 */
export function getPromotionTier(monthsAttended: number): PromotionTier {
  if (monthsAttended < 3) return 'Starter';
  if (monthsAttended < 6) return 'Growing';
  if (monthsAttended < 9) return 'Committed';
  if (monthsAttended < 12) return 'Loyal';
  if (monthsAttended < 18) return 'Long-Term';
  return 'Premium Loyal';
}

export function getNextTierInfo(monthsAttended: number): { nextTier: PromotionTier | null; monthsNeeded: number | null } {
  if (monthsAttended < 3) return { nextTier: 'Growing', monthsNeeded: 3 - monthsAttended };
  if (monthsAttended < 6) return { nextTier: 'Committed', monthsNeeded: 6 - monthsAttended };
  if (monthsAttended < 9) return { nextTier: 'Loyal', monthsNeeded: 9 - monthsAttended };
  if (monthsAttended < 12) return { nextTier: 'Long-Term', monthsNeeded: 12 - monthsAttended };
  if (monthsAttended < 18) return { nextTier: 'Premium Loyal', monthsNeeded: 18 - monthsAttended };
  return { nextTier: null, monthsNeeded: null };
}

/**
 * Dynamic Renewal Discount based on total accumulated expected months:
 */
export function getRenewalDiscount(
  totalExpectedMonths: number,
  config: PricingConfig = DEFAULT_CONFIG
): number {
  if (totalExpectedMonths < 3) return 0.00;
  if (totalExpectedMonths < 6) return Math.min(config.maxDiscountCap, 0.03);
  if (totalExpectedMonths < 9) return Math.min(config.maxDiscountCap, 0.07);
  if (totalExpectedMonths < 12) return Math.min(config.maxDiscountCap, 0.10);
  if (totalExpectedMonths < 18) return Math.min(config.maxDiscountCap, 0.15);
  if (totalExpectedMonths < 24) return Math.min(config.maxDiscountCap, 0.20);
  if (totalExpectedMonths < 36) return Math.min(config.maxDiscountCap, 0.25);
  return Math.min(config.maxDiscountCap, 0.30);
}

/**
 * Perform complete pricing calculation connected to dynamic config and exact Excel formulas:
 * 1. Package Discount (E4) = IF(B6=0, 0, PackageDiscount)
 * 2. Loyalty Discount (E5) = IF(B6<3, 0, IF(B6<6, 3%, IF(B6<12, 8%, IF(B6<24, 10%, 12%))))
 * 3. Total Discount (E6) = E4 + E5 (Exact sum: Package Discount + Loyalty Discount)
 * 4. Promotional Monthly Price (E9) = Base Monthly Price * (1 - Total Discount)
 * 5. Total Current Package Price (E10) = Promotional Monthly Price * New Package Months
 * 6. Normal Package Price (E11) = Base Monthly Price * New Package Months
 * 7. Current Package Savings (E12) = Normal Package Price - Total Current Package Price
 */
export function calculatePricing(
  baseMonthlyPrice: number = DEFAULT_CONFIG.basePrice,
  monthsAttended: number = 0,
  packageMonths: PackageDuration = 3,
  config: PricingConfig = DEFAULT_CONFIG
): PricingCalculationResult {
  const safeBase = Math.max(0, baseMonthlyPrice);
  const safeMonths = Math.max(0, monthsAttended);

  // 1. Package Discount (E4)
  const packageDiscount = getPackageDiscount(packageMonths, safeMonths, config);

  // 2. Loyalty Discount (E5)
  const loyaltyDiscount = getLoyaltyDiscount(safeMonths, config);

  // 3. Total Discount (E6) = E4 + E5 (Exact direct sum)
  const rawDiscount = packageDiscount + loyaltyDiscount;
  const appliedDiscount = rawDiscount;
  const isCapped = false;

  // 4. Expected Total Months (E7) = B6 + B7
  const totalExpectedMonths = safeMonths + packageMonths;

  // 5. Promotion Tier (E8)
  const promotionTier = getPromotionTier(safeMonths);
  const { nextTier: nextTierName, monthsNeeded: monthsToNextTier } = getNextTierInfo(safeMonths);

  // 6. Promotional Monthly Price (E9) = B5 * (1 - E6)
  const promotionalMonthlyPrice = Math.round(safeBase * (1 - appliedDiscount));

  // 7. Total Current Package Price (E10) = E9 * B7
  const totalPackagePrice = promotionalMonthlyPrice * packageMonths;

  // 8. Normal Package Price (E11) = B5 * B7
  const normalPackagePrice = safeBase * packageMonths;

  // 9. Current Package Savings (E12) = E11 - E10
  const currentPackageSavings = normalPackagePrice - totalPackagePrice;
  const savingsPercentage = normalPackagePrice > 0 
    ? Math.round((currentPackageSavings / normalPackagePrice) * 100) 
    : 0;

  // 10. Renewal Monthly Price* (E13)
  const renewalDiscount = getRenewalDiscount(totalExpectedMonths, config);
  const renewalMonthlyPrice = Math.round(safeBase * (1 - renewalDiscount));

  return {
    baseMonthlyPrice: safeBase,
    monthsAttended: safeMonths,
    packageMonths,
    totalExpectedMonths,
    packageDiscount,
    loyaltyDiscount,
    rawDiscount,
    appliedDiscount,
    isCapped,
    promotionalMonthlyPrice,
    totalPackagePrice,
    normalPackagePrice,
    currentPackageSavings,
    savingsPercentage,
    renewalMonthlyPrice,
    renewalDiscount,
    promotionTier,
    nextTierName,
    monthsToNextTier,
    formulaLoyaltyDiscount: loyaltyDiscount,
    isLoyaltyOverridden: false,
  };
}

/**
 * Format currency with Tugrik symbol
 */
export function formatCurrency(amount: number): string {
  return `${Math.round(amount).toLocaleString('en-US')} ₮`;
}

/**
 * Format percentage with 1 decimal place (matching Excel e.g. 15.0%, 10.0%, 12.0%, 25.0%, 27.0%)
 */
export function formatPercent(rate: number): string {
  const pct = rate * 100;
  return Number.isInteger(pct) ? `${pct}.0%` : `${pct.toFixed(1)}%`;
}

export const INITIAL_CUSTOMERS: CustomerPricingEntry[] = [
  {
    id: 'cust-101',
    customerId: '101',
    customerName: 'Odonchimeg',
    baseMonthlyPrice: 400000,
    monthsAttended: 24,
    packageMonths: 3,
    totalExpectedMonths: 27,
    packageDiscount: 0.15,
    loyaltyDiscount: 0.12,
    appliedDiscount: 0.27,
    rawDiscount: 0.27,
    isCapped: false,
    promoMonthlyPrice: 292000,
    packageTotal: 876000,
    normalPackagePrice: 1200000,
    packageSavings: 324000,
    renewalMonthlyPrice: 400000,
    promotionTier: 'Premium Loyal',
    notes: 'Excel Sheet 1 жишээ: 24 сар явсан, 3 сарын багц, 27.0% нийт хөнгөлөлт',
    createdAt: '2026-09-02T10:00:00.000Z'
  },
  {
    id: 'cust-102',
    customerId: '102',
    customerName: 'Bat-Erdene',
    baseMonthlyPrice: 400000,
    monthsAttended: 12,
    packageMonths: 3,
    totalExpectedMonths: 15,
    packageDiscount: 0.15,
    loyaltyDiscount: 0.10,
    appliedDiscount: 0.25,
    rawDiscount: 0.25,
    isCapped: false,
    promoMonthlyPrice: 300000,
    packageTotal: 900000,
    normalPackagePrice: 1200000,
    packageSavings: 300000,
    renewalMonthlyPrice: 340000,
    promotionTier: 'Long-Term',
    notes: '12 сар явсан, 3 сарын багц, 25.0% нийт хөнгөлөлт',
    createdAt: '2026-09-10T14:30:00.000Z'
  },
  {
    id: 'cust-103',
    customerId: '103',
    customerName: 'Anu-Ujin',
    baseMonthlyPrice: 400000,
    monthsAttended: 5,
    packageMonths: 6,
    totalExpectedMonths: 11,
    packageDiscount: 0.20,
    loyaltyDiscount: 0.03,
    appliedDiscount: 0.23,
    rawDiscount: 0.23,
    isCapped: false,
    promoMonthlyPrice: 308000,
    packageTotal: 1848000,
    normalPackagePrice: 2400000,
    packageSavings: 552000,
    renewalMonthlyPrice: 360000,
    promotionTier: 'Growing',
    notes: '5 сар явсан, 6 сарын багц, 23.0% нийт хөнгөлөлт',
    createdAt: '2026-09-15T09:15:00.000Z'
  },
  {
    id: 'cust-104',
    customerId: '104',
    customerName: 'Temuulen',
    baseMonthlyPrice: 400000,
    monthsAttended: 0,
    packageMonths: 3,
    totalExpectedMonths: 3,
    packageDiscount: 0.00,
    loyaltyDiscount: 0.00,
    appliedDiscount: 0.00,
    rawDiscount: 0.00,
    isCapped: false,
    promoMonthlyPrice: 400000,
    packageTotal: 1200000,
    normalPackagePrice: 1200000,
    packageSavings: 0,
    renewalMonthlyPrice: 388000,
    promotionTier: 'Starter',
    notes: 'Шинэ гишүүн - 0 сар',
    createdAt: '2026-09-20T11:45:00.000Z'
  }
];

export const TIER_CONFIG = [
  { tier: 'Starter', minMonths: 0, maxMonths: 2, loyaltyDiscount: '0.0%', badgeColor: 'bg-slate-700 text-slate-200 border-slate-600', description: 'Шинэ гишүүн (0-2 сар)' },
  { tier: 'Growing', minMonths: 3, maxMonths: 5, loyaltyDiscount: '3.0%', badgeColor: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50', description: 'Идэвхжиж буй гишүүн (3-5 сар)' },
  { tier: 'Committed', minMonths: 6, maxMonths: 8, loyaltyDiscount: '8.0%', badgeColor: 'bg-cyan-900/60 text-cyan-300 border-cyan-700/50', description: 'Тууштай гишүүн (6-8 сар)' },
  { tier: 'Loyal', minMonths: 9, maxMonths: 11, loyaltyDiscount: '8.0%', badgeColor: 'bg-blue-900/60 text-blue-300 border-blue-700/50', description: 'Үнэнч гишүүн (9-11 сар)' },
  { tier: 'Long-Term', minMonths: 12, maxMonths: 17, loyaltyDiscount: '10.0%', badgeColor: 'bg-violet-900/60 text-violet-300 border-violet-700/50', description: 'Урт хугацааны гишүүн (12-17 сар)' },
  { tier: 'Premium Loyal', minMonths: 18, maxMonths: 999, loyaltyDiscount: '12.0%', badgeColor: 'bg-amber-900/60 text-amber-300 border-amber-700/50', description: 'Дээд зэрэглэлийн VIP гишүүн (18+ сар)' },
];
