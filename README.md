# Proteam Fitness - Loyalty & Pricing Calculator

A dedicated web application for Proteam Fitness Gym calculating promotional membership pricing, package extension discounts, loyalty reward tiers, and future renewal estimates.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ubgroupub-blip/Proteam-LOyalty)

## Features

- **Pricing Calculator (Нүүр)**:
  - Input: Customer Name, Customer ID, Base Monthly Price, Months Already Attended, New Package Duration.
  - Automatic Calculations:
    - Package Commitment Discounts: 1M (10%), 3M (15%), 6M (20%), 12M (25%).
    - Loyalty Tenure Discounts: 3-5M (5%), 6-11M (8%), 12-23M (12%), 24+M (15%).
    - 30% Maximum Discount Cap protection.
    - Promotional Monthly Price & Total Current Package Price.
    - Normal Package Price & Total Customer Savings.
    - Renewal Monthly Price forecast.
- **Customer Pricing Log**:
  - Full CRM table to log, edit, and delete customer records.
  - Search, filter by tier and package duration.
  - Printable official member quotation receipts.
  - Export to Excel (.xlsx).
- **System Rules & Instructions**:
  - Complete operating manual and member journey tiers.

## Technology Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Excel Export**: SheetJS (xlsx)
- **Deployment**: Vercel & Node.js 22

## Quick Start (Local Development)

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

## Production Build

```bash
npm run build
```

## Vercel Deployment

This project is configured with `vercel.json` and optimized for instant zero-configuration deployment on Vercel:

1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **"Add New..."** -> **"Project"**.
3. Select your GitHub repository: `ubgroupub-blip/Proteam-LOyalty`.
4. Click **Deploy**.
5. Your public website will be live at `https://proteam-loyalty.vercel.app` (or your custom domain) with **no login required**!
