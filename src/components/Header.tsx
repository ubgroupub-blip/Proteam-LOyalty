import React from 'react';
import { Calculator, Users, BookOpen, Download } from 'lucide-react';
import { ProteamLogo } from './ProteamLogo';

interface HeaderProps {
  activeTab: 'calculator' | 'log' | 'instructions';
  setActiveTab: (tab: 'calculator' | 'log' | 'instructions') => void;
  customerCount: number;
  onExportExcel: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  customerCount,
  onExportExcel,
}) => {
  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/95 sticky top-0 z-30 backdrop-blur-md">
      {/* Subtle top athletic racing red brand accent line */}
      <div className="h-[2px] bg-gradient-to-r from-red-600 via-red-500 to-rose-600 w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Official Proteam Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('calculator')}
              className="flex items-center gap-2 group transition focus:outline-none"
              title="Proteam Fitness"
            >
              <ProteamLogo size="md" />
            </button>

            <div className="hidden sm:block h-6 w-px bg-zinc-800 mx-1" />

            <div className="hidden sm:flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-300">
                  Fitness Club
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.2 rounded bg-red-950/60 text-red-400 border border-red-800/40">
                  Promotion Calculator
                </span>
              </div>
              <span className="text-[10px] text-zinc-400">
                Гишүүнчлэлийн урамшуулал & үнийн систем
              </span>
            </div>
          </div>

          {/* Navigation Tabs styled in sleek Proteam Dark/Red Brand */}
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'calculator'
                  ? 'bg-zinc-800 text-white shadow-md border-b-2 border-red-500 ring-1 ring-zinc-700/50'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Calculator className={`w-4 h-4 ${activeTab === 'calculator' ? 'text-red-400' : 'text-zinc-400'}`} />
              <span>Pricing Calculator</span>
            </button>

            <button
              onClick={() => setActiveTab('log')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'log'
                  ? 'bg-zinc-800 text-white shadow-md border-b-2 border-red-500 ring-1 ring-zinc-700/50'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Users className={`w-4 h-4 ${activeTab === 'log' ? 'text-red-400' : 'text-zinc-400'}`} />
              <span className="hidden md:inline">Customer Pricing Log</span>
              <span className="md:hidden">Log</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'log'
                    ? 'bg-red-900/60 text-red-200 border border-red-700/50'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {customerCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('instructions')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'instructions'
                  ? 'bg-zinc-800 text-white shadow-md border-b-2 border-red-500 ring-1 ring-zinc-700/50'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <BookOpen className={`w-4 h-4 ${activeTab === 'instructions' ? 'text-red-400' : 'text-zinc-400'}`} />
              <span>Заавар</span>
            </button>

            <div className="h-6 w-px bg-zinc-800 mx-1 hidden sm:block" />

            <button
              onClick={onExportExcel}
              title="Download Excel Workbook (.xlsx)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-700/40 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Excel татах</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
