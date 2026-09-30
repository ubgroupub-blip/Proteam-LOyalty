import * as XLSX from 'xlsx';
import { CustomerPricingEntry } from '../types';

export function exportToExcel(entries: CustomerPricingEntry[]) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Customer Pricing Log
  const logRows = entries.map((e) => ({
    'Customer ID': e.customerId,
    'Customer Name': e.customerName,
    'Base Monthly Price': e.baseMonthlyPrice,
    'Months Attended': e.monthsAttended,
    'Package Months': e.packageMonths,
    'Total Expected Months': e.totalExpectedMonths,
    'Package Discount': `${Math.round(e.packageDiscount * 100)}%`,
    'Loyalty Discount': `${Math.round(e.loyaltyDiscount * 100)}%`,
    'Applied Discount': `${Math.round(e.appliedDiscount * 100)}%`,
    'Promo Monthly Price': e.promoMonthlyPrice,
    'Package Total': e.packageTotal,
    'Renewal Monthly Price': e.renewalMonthlyPrice,
    'Promotion Tier': e.promotionTier,
    'Notes': e.notes,
  }));
  const wsLog = XLSX.utils.json_to_sheet(logRows);
  XLSX.utils.book_append_sheet(wb, wsLog, 'Customer Pricing Log');

  // Sheet 2: Package Matrix
  const matrixData = [
    ['PACKAGE COMMITMENT DISCOUNTS'],
    ['Package (Months)', 'Discount %', 'Monthly Price @ 400,000 MNT', 'Total Price'],
    [1, '10%', 360000, 360000],
    [3, '15%', 340000, 1020000],
    [6, '20%', 320000, 1920000],
    [12, '25%', 300000, 3600000],
    [],
    ['LOYALTY DURATION DISCOUNTS'],
    ['Existing Months Attended', 'Discount %', 'Tier Name'],
    ['0 - 2 months', '0%', 'Starter'],
    ['3 - 5 months', '5%', 'Growing'],
    ['6 - 11 months', '8%', 'Committed'],
    ['12 - 23 months', '12%', 'Long-Term'],
    ['24+ months', '15%', 'Premium Loyal'],
    [],
    ['STANDARD (odooo) VS PROMOTIONAL (shine) PRICING MATRIX'],
    ['Package', 'Standard Rate', '3-5 Months (5%)', '6-11 Months (8%)', '12-23 Months (12%)', '24+ Months (15%)'],
    ['1 Month', 400000, 340000, 328000, 312000, 300000],
    ['3 Months', 1080000, 960000, 924000, 876000, 840000],
    ['6 Months', 1980000, 1800000, 1728000, 1632000, 1560000],
    ['12 Months', 3600000, 3360000, 3216000, 3024000, 2880000],
  ];
  const wsMatrix = XLSX.utils.aoa_to_sheet(matrixData);
  XLSX.utils.book_append_sheet(wb, wsMatrix, 'Package Matrix');

  // Sheet 3: Instructions & Rules
  const instructionsData = [
    ['PROTEAM GYM PROMOTION PRICING CALCULATOR - OPERATING GUIDE'],
    [],
    ['Purpose', 'Calculate gym promotional pricing for 1, 3, 6, and 12-month packages using package commitment and customer loyalty.'],
    ['Step 1', 'Enter customer name/ID, base monthly price, months already attended, and the new package length.'],
    ['Step 2', 'The system automatically stacks package extension discounts and loyalty tenure discounts.'],
    ['Step 3', 'Total discount is strictly capped at 30% to protect gym operating margins.'],
    ['Step 4', 'Renewal Monthly Price estimates the next renewal rate based on total accumulated membership duration.'],
  ];
  const wsInstructions = XLSX.utils.aoa_to_sheet(instructionsData);
  XLSX.utils.book_append_sheet(wb, wsInstructions, 'Instructions');

  // Write and trigger download
  XLSX.writeFile(wb, 'Proteam_Gym_Promotion_Pricing_Calculator.xlsx');
}
