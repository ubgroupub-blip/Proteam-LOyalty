import React, { useState, useEffect } from 'react';
import { CustomerPricingEntry, PricingCalculationResult, PricingConfig } from './types';
import { INITIAL_CUSTOMERS, DEFAULT_CONFIG, calculatePricing } from './utils/calculations';
import { exportToExcel } from './utils/excelExport';
import { Header } from './components/Header';
import { PricingCalculator } from './components/PricingCalculator';
import { CustomerPricingLog } from './components/CustomerPricingLog';
import { InstructionsView } from './components/InstructionsView';
import { QuotationModal } from './components/QuotationModal';

const LOCAL_STORAGE_KEY_CUSTOMERS = 'proteam_gym_customers_v6';
const LOCAL_STORAGE_KEY_CONFIG = 'proteam_gym_pricing_config_v6';

export const App: React.FC = () => {
  // Tabs: Pricing Calculator (Нүүр), Customer Log, Заавар
  const [activeTab, setActiveTab] = useState<'calculator' | 'log' | 'instructions'>(
    'calculator'
  );

  // Dynamic pricing configuration (rates, base price, cap)
  const [config, setConfig] = useState<PricingConfig>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_CONFIG);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return DEFAULT_CONFIG;
  });

  // Save config to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CONFIG, JSON.stringify(config));
    } catch {
      // ignore
    }
  }, [config]);

  const handleResetConfig = () => {
    setConfig(DEFAULT_CONFIG);
  };

  // Load customer entries from localStorage or initial seed, ensuring 100% exact sum formula
  const [entries, setEntries] = useState<CustomerPricingEntry[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_CUSTOMERS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((e) => {
            const calc = calculatePricing(
              e.baseMonthlyPrice || 400000,
              e.monthsAttended || 0,
              e.packageMonths || 3,
              DEFAULT_CONFIG
            );
            const totalDisc = calc.packageDiscount + calc.loyaltyDiscount;
            return {
              ...e,
              packageDiscount: calc.packageDiscount,
              loyaltyDiscount: calc.loyaltyDiscount,
              appliedDiscount: totalDisc,
              rawDiscount: totalDisc,
              isCapped: false,
              promoMonthlyPrice: calc.promotionalMonthlyPrice,
              packageTotal: calc.totalPackagePrice,
              normalPackagePrice: calc.normalPackagePrice,
              packageSavings: calc.currentPackageSavings,
              renewalMonthlyPrice: calc.renewalMonthlyPrice,
              promotionTier: calc.promotionTier,
              totalExpectedMonths: calc.totalExpectedMonths,
            };
          });
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_CUSTOMERS;
  });

  // Save entries to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CUSTOMERS, JSON.stringify(entries));
    } catch {
      // ignore
    }
  }, [entries]);

  // Quotation modal state
  const [quoteModalData, setQuoteModalData] = useState<
    | { type: 'calc'; calc: PricingCalculationResult; name: string; id: string }
    | { type: 'entry'; entry: CustomerPricingEntry }
    | null
  >(null);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  const handleAddEntry = (newEntry: Omit<CustomerPricingEntry, 'id' | 'createdAt'>) => {
    const entry: CustomerPricingEntry = {
      ...newEntry,
      id: `cust-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => [entry, ...prev]);
  };

  const handleUpdateEntry = (updated: CustomerPricingEntry) => {
    setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('Харилцагчийн мэдээллийг устгах уу?')) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const handleOpenQuoteFromCalc = (
    calc: PricingCalculationResult,
    name: string,
    id: string
  ) => {
    setQuoteModalData({ type: 'calc', calc, name, id });
    setIsQuoteOpen(true);
  };

  const handleOpenQuoteFromEntry = (entry: CustomerPricingEntry) => {
    setQuoteModalData({ type: 'entry', entry });
    setIsQuoteOpen(true);
  };

  const handleExportExcel = () => {
    exportToExcel(entries);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Top Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        customerCount={entries.length}
        onExportExcel={handleExportExcel}
      />

      {/* Main Content Area: Only Pricing Calculator on Home */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-7">
        {activeTab === 'calculator' && (
          <PricingCalculator
            config={config}
            onUpdateConfig={setConfig}
            onResetConfig={handleResetConfig}
            onSaveToLog={handleAddEntry}
            onOpenQuote={handleOpenQuoteFromCalc}
          />
        )}

        {activeTab === 'log' && (
          <CustomerPricingLog
            entries={entries}
            config={config}
            onAddEntry={handleAddEntry}
            onUpdateEntry={handleUpdateEntry}
            onDeleteEntry={handleDeleteEntry}
            onExportExcel={handleExportExcel}
            onOpenQuote={handleOpenQuoteFromEntry}
          />
        )}

        {activeTab === 'instructions' && <InstructionsView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">PROTEAM FITNESS</span>
            <span>•</span>
            <span>Үнийн тооцоолуур</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Валют: ₮ (MNT)</span>
            <span>•</span>
            <span>Дээд хязгаар: {Math.round(config.maxDiscountCap * 100)}%</span>
          </div>
        </div>
      </footer>

      {/* Quotation Receipt Modal */}
      <QuotationModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        data={quoteModalData}
      />
    </div>
  );
};

export default App;
