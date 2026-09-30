import { PackageDuration, PromotionTier, PricingCalculationResult, CustomerPricingEntry, PricingConfig } from '../types';

export const DEFAULT_CONFIG: PricingConfig = {
  basePrice: 400000,
  packageDiscounts: {
    1: 0.10,
    3: 0.15,
    6: 0.20,
    12: 0.25,
  },
  loyaltyDiscounts: {
    tier3_5: 0.05,
    tier6_11: 0.08,
    tier12_23: 0.12,
    tier24_plus: 0.15,
  },
  maxDiscountCap: 0.30,
};

export const DEFAULT_BASE_PRICE = 400000;
export const MAX_DISCOUNT_CAP = 0.30; // 30% discount cap

/**
 * Dynamic Package Extension Discount based on config:
 * - If months attended == 0: 0%
 * - Otherwise matches configured discount for 1, 3, 6, 12 months
 */
export function getPackageDiscount(
  packageMonths: PackageDuration,
  monthsAttended: number,
  config: PricingConfig = DEFAULT_CONFIG
): number {
  if (monthsAttended === 0) {
    return 0;
  }
  return config.packageDiscounts[packageMonths] ?? 0;
}

/**
 * Dynamic Loyalty Discount based on existing months attended & config:
 * - < 3 months: 0%
 * - 3 - 5 months (< 6): tier3_5
 * - 6 - 11 months (< 12): tier6_11
 * - 12 - 23 months (< 24): tier12_23
 * - 24+ months: tier24_plus
 */
export function getLoyaltyDiscount(
  monthsAttended: number,
  config: PricingConfig = DEFAULT_CONFIG
): number {
  if (monthsAttended < 3) {
    return 0.00;
  }
  if (monthsAttended < 6) {
    return config.loyaltyDiscounts.tier3_5;
  }
  if (monthsAttended < 12) {
    return config.loyaltyDiscounts.tier6_11;
  }
  if (monthsAttended < 24) {
    return config.loyaltyDiscounts.tier12_23;
  }
  return config.loyaltyDiscounts.tier24_plus;
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
  return config.maxDiscountCap;
}

/**
 * Perform complete pricing calculation connected to dynamic config
 */
export function calculatePricing(
  baseMonthlyPrice: number = DEFAULT_CONFIG.basePrice,
  monthsAttended: number = 0,
  packageMonths: PackageDuration = 3,
  config: PricingConfig = DEFAULT_CONFIG
): PricingCalculationResult {
  const safeBase = Math.max(0, baseMonthlyPrice);
  const safeMonths = Math.max(0, monthsAttended);

  const packageDiscount = getPackageDiscount(packageMonths, safeMonths, config);
  const loyaltyDiscount = getLoyaltyDiscount(safeMonths, config);
  const rawDiscount = packageDiscount + loyaltyDiscount;
  const appliedDiscount = Math.min(config.maxDiscountCap, rawDiscount);
  const isCapped = rawDiscount > config.maxDiscountCap;

  const totalExpectedMonths = safeMonths + packageMonths;
  const promotionTier = getPromotionTier(safeMonths);
  const { nextTier: nextTierName, monthsNeeded: monthsToNextTier } = getNextTierInfo(safeMonths);

  const promotionalMonthlyPrice = Math.round(safeBase * (1 - appliedDiscount));
  const totalPackagePrice = promotionalMonthlyPrice * packageMonths;
  const normalPackagePrice = safeBase * packageMonths;
  const currentPackageSavings = normalPackagePrice - totalPackagePrice;
  const savingsPercentage = normalPackagePrice > 0 
    ? Math.round((currentPackageSavings / normalPackagePrice) * 100) 
    : 0;

  const renewalDiscount = getRenewalDiscount(totalExpectedMonths, config);
  const renewalMonthlyPrice = Math.round(safeBase * (1 - Math.min(config.maxDiscountCap, renewalDiscount)));

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
  };
}

/**
 * Format currency with Tugrik symbol
 */
export function formatCurrency(amount: number): string {
  return `₮${Math.round(amount).toLocaleString('en-US')}`;
}

/**
 * Format percentage
 */
export function formatPercent(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

export const INITIAL_CUSTOMERS: CustomerPricingEntry[] = [
  {
    id: 'cust-101',
    customerId: '101',
    customerName: 'Odonchimeg',
    baseMonthlyPrice: 400000,
    monthsAttended: 13,
    packageMonths: 1,
    totalExpectedMonths: 14,
    packageDiscount: 0.10,
    loyaltyDiscount: 0.12,
    appliedDiscount: 0.22,
    rawDiscount: 0.22,
    isCapped: false,
    promoMonthlyPrice: 312000,
    packageTotal: 312000,
    normalPackagePrice: 400000,
    packageSavings: 88000,
    renewalMonthlyPrice: 340000,
    promotionTier: 'Long-Term',
    notes: 'Excel анхны өгөгдөл: 13 сар явсан, 1 сарын багц, 22% хөнгөлөлт',
    createdAt: '2026-09-02T10:00:00.000Z'
  },
  {
    id: 'cust-102',
    customerId: '102',
    customerName: 'Bat-Erdene',
    baseMonthlyPrice: 400000,
    monthsAttended: 24,
    packageMonths: 12,
    totalExpectedMonths: 36,
    packageDiscount: 0.25,
    loyaltyDiscount: 0.15,
    appliedDiscount: 0.30,
    rawDiscount: 0.40,
    isCapped: true,
    promoMonthlyPrice: 280000,
    packageTotal: 3360000,
    normalPackagePrice: 4800000,
    packageSavings: 1440000,
    renewalMonthlyPrice: 280000,
    promotionTier: 'Premium Loyal',
    notes: 'VIP гишүүн: 24+ сар, 12 сарын багц (30% дээд хязгаар)',
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
    loyaltyDiscount: 0.05,
    appliedDiscount: 0.25,
    rawDiscount: 0.25,
    isCapped: false,
    promoMonthlyPrice: 300000,
    packageTotal: 1800000,
    normalPackagePrice: 2400000,
    packageSavings: 600000,
    renewalMonthlyPrice: 360000,
    promotionTier: 'Growing',
    notes: '5 сар явсан, 6 сарын багц авсан',
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
    notes: 'Шинэ гишүүн - 0 сар явсан (3 сарын суурь үнээр)',
    createdAt: '2026-09-20T11:45:00.000Z'
  }
];

export const TIER_CONFIG = [
  { tier: 'Starter', minMonths: 0, maxMonths: 2, loyaltyDiscount: '0%', badgeColor: 'bg-slate-700 text-slate-200 border-slate-600', description: 'Шинэ гишүүн (0-2 сар)' },
  { tier: 'Growing', minMonths: 3, maxMonths: 5, loyaltyDiscount: '5%', badgeColor: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50', description: 'Идэвхжиж буй гишүүн (3-5 сар)' },
  { tier: 'Committed', minMonths: 6, maxMonths: 8, loyaltyDiscount: '8%', badgeColor: 'bg-cyan-900/60 text-cyan-300 border-cyan-700/50', description: 'Тууштай гишүүн (6-8 сар)' },
  { tier: 'Loyal', minMonths: 9, maxMonths: 11, loyaltyDiscount: '8%', badgeColor: 'bg-blue-900/60 text-blue-300 border-blue-700/50', description: 'Үнэнч гишүүн (9-11 сар)' },
  { tier: 'Long-Term', minMonths: 12, maxMonths: 17, loyaltyDiscount: '12%', badgeColor: 'bg-violet-900/60 text-violet-300 border-violet-700/50', description: 'Урт хугацааны гишүүн (12-17 сар)' },
  { tier: 'Premium Loyal', minMonths: 18, maxMonths: 999, loyaltyDiscount: '15%', badgeColor: 'bg-amber-900/60 text-amber-300 border-amber-700/50', description: 'Дээд зэрэглэлийн VIP гишүүн (18+ сар)' },
];
