export type PackageDuration = 1 | 3 | 6 | 12;

export type PromotionTier = 
  | 'Starter'
  | 'Growing'
  | 'Committed'
  | 'Loyal'
  | 'Long-Term'
  | 'Premium Loyal';

export interface PricingConfig {
  basePrice: number;
  packageDiscounts: {
    1: number;
    3: number;
    6: number;
    12: number;
  };
  loyaltyDiscounts: {
    tier3_5: number;   // 3 - 5 months (default 0.05)
    tier6_11: number;  // 6 - 11 months (default 0.08)
    tier12_23: number; // 12 - 23 months (default 0.12)
    tier24_plus: number; // 24+ months (default 0.15)
  };
  maxDiscountCap: number; // default 0.30 (30%)
}

export interface CustomerPricingEntry {
  id: string;
  customerId: string;
  customerName: string;
  baseMonthlyPrice: number;
  monthsAttended: number;
  packageMonths: PackageDuration;
  totalExpectedMonths: number;
  packageDiscount: number;
  loyaltyDiscount: number;
  appliedDiscount: number;
  rawDiscount: number;
  isCapped: boolean;
  promoMonthlyPrice: number;
  packageTotal: number;
  normalPackagePrice: number;
  packageSavings: number;
  renewalMonthlyPrice: number;
  promotionTier: PromotionTier;
  notes: string;
  createdAt: string;
}

export interface PricingCalculationResult {
  baseMonthlyPrice: number;
  monthsAttended: number;
  packageMonths: PackageDuration;
  totalExpectedMonths: number;
  packageDiscount: number;
  loyaltyDiscount: number;
  rawDiscount: number;
  appliedDiscount: number;
  isCapped: boolean;
  promotionalMonthlyPrice: number;
  totalPackagePrice: number;
  normalPackagePrice: number;
  currentPackageSavings: number;
  savingsPercentage: number;
  renewalMonthlyPrice: number;
  renewalDiscount: number;
  promotionTier: PromotionTier;
  nextTierName: PromotionTier | null;
  monthsToNextTier: number | null;
  formulaLoyaltyDiscount: number;
  isLoyaltyOverridden: boolean;
}
