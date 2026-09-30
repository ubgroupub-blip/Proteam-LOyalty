import React, { useState } from 'react';
import { CustomerPricingEntry, PromotionTier, PackageDuration } from '../types';
import {
  formatCurrency,
  formatPercent,
  TIER_CONFIG,
  calculatePricing,
} from '../utils/calculations';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  FileSpreadsheet,
  Download,
  Users,
  DollarSign,
  TrendingUp,
  Percent,
  Check,
  X,
  FileText,
} from 'lucide-react';

interface CustomerPricingLogProps {
  entries: CustomerPricingEntry[];
  onAddEntry: (entry: Omit<CustomerPricingEntry, 'id' | 'createdAt'>) => void;
  onUpdateEntry: (entry: CustomerPricingEntry) => void;
  onDeleteEntry: (id: string) => void;
  onExportExcel: () => void;
  onOpenQuote: (entry: CustomerPricingEntry) => void;
}

export const CustomerPricingLog: React.FC<CustomerPricingLogProps> = ({
  entries,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onExportExcel,
  onOpenQuote,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [selectedPackage, setSelectedPackage] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CustomerPricingEntry | null>(null);

  // New entry form state
  const [newCustId, setNewCustId] = useState('');
  const [newCustName, setNewCustName] = useState('');
  const [newBasePrice, setNewBasePrice] = useState(400000);
  const [newMonthsAttended, setNewMonthsAttended] = useState(0);
  const [newPackageMonths, setNewPackageMonths] = useState<PackageDuration>(3);
  const [newNotes, setNewNotes] = useState('');

  // Summary KPIs
  const totalRevenue = entries.reduce((acc, curr) => acc + curr.packageTotal, 0);
  const totalSavings = entries.reduce((acc, curr) => acc + curr.packageSavings, 0);
  const avgDiscount =
    entries.length > 0
      ? entries.reduce((acc, curr) => acc + curr.appliedDiscount, 0) / entries.length
      : 0;

  // Filtered entries
  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.notes.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTier = selectedTier === 'All' || entry.promotionTier === selectedTier;
    const matchesPkg =
      selectedPackage === 'All' || entry.packageMonths.toString() === selectedPackage;

    return matchesSearch && matchesTier && matchesPkg;
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) return;

    const calc = calculatePricing(newBasePrice, newMonthsAttended, newPackageMonths);
    onAddEntry({
      customerId: newCustId.trim() || `C-${Date.now().toString().slice(-4)}`,
      customerName: newCustName.trim(),
      baseMonthlyPrice: calc.baseMonthlyPrice,
      monthsAttended: calc.monthsAttended,
      packageMonths: calc.packageMonths,
      totalExpectedMonths: calc.totalExpectedMonths,
      packageDiscount: calc.packageDiscount,
      loyaltyDiscount: calc.loyaltyDiscount,
      appliedDiscount: calc.appliedDiscount,
      rawDiscount: calc.rawDiscount,
      isCapped: calc.isCapped,
      promoMonthlyPrice: calc.promotionalMonthlyPrice,
      packageTotal: calc.totalPackagePrice,
      normalPackagePrice: calc.normalPackagePrice,
      packageSavings: calc.currentPackageSavings,
      renewalMonthlyPrice: calc.renewalMonthlyPrice,
      promotionTier: calc.promotionTier,
      notes: newNotes.trim(),
    });

    // Reset form
    setNewCustId('');
    setNewCustName('');
    setNewBasePrice(400000);
    setNewMonthsAttended(0);
    setNewPackageMonths(3);
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  const handleUpdateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;

    const calc = calculatePricing(
      editingEntry.baseMonthlyPrice,
      editingEntry.monthsAttended,
      editingEntry.packageMonths
    );

    onUpdateEntry({
      ...editingEntry,
      totalExpectedMonths: calc.totalExpectedMonths,
      packageDiscount: calc.packageDiscount,
      loyaltyDiscount: calc.loyaltyDiscount,
      appliedDiscount: calc.appliedDiscount,
      rawDiscount: calc.rawDiscount,
      isCapped: calc.isCapped,
      promoMonthlyPrice: calc.promotionalMonthlyPrice,
      packageTotal: calc.totalPackagePrice,
      normalPackagePrice: calc.normalPackagePrice,
      packageSavings: calc.currentPackageSavings,
      renewalMonthlyPrice: calc.renewalMonthlyPrice,
      promotionTier: calc.promotionTier,
    });

    setEditingEntry(null);
  };

  return (
    <div className="space-y-6">
      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Logged Members</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{entries.length}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Active pricing quotes</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Projected Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {formatCurrency(totalRevenue)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">From logged packages</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Member Total Savings</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">
            {formatCurrency(totalSavings)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Loyalty promotion value</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Average Discount</span>
            <Percent className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            {formatPercent(avgDiscount)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Max capped at 30%</span>
        </div>
      </div>

      {/* Table Control Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name, ID, or notes..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Tiers</option>
              {TIER_CONFIG.map((t) => (
                <option key={t.tier} value={t.tier}>
                  {t.tier}
                </option>
              ))}
            </select>

            <select
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Packages</option>
              <option value="1">1 Month</option>
              <option value="3">3 Months</option>
              <option value="6">6 Months</option>
              <option value="12">12 Months</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>

          <button
            onClick={onExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-600/30 text-xs sm:text-sm font-medium transition"
            title="Download Excel Spreadsheet"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export .xlsx</span>
          </button>
        </div>
      </div>

      {/* Customer Log Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-900/70 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">ID</th>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-3">Base Price</th>
                <th className="py-3.5 px-3 text-center">Months Attended</th>
                <th className="py-3.5 px-3 text-center">Package</th>
                <th className="py-3.5 px-3 text-center">Exp. Total</th>
                <th className="py-3.5 px-3 text-center">Pkg Disc.</th>
                <th className="py-3.5 px-3 text-center">Loyalty Disc.</th>
                <th className="py-3.5 px-3 text-center">Total Disc.</th>
                <th className="py-3.5 px-3">Promo Monthly</th>
                <th className="py-3.5 px-3 font-bold text-white">Package Total</th>
                <th className="py-3.5 px-3">Renewal Mo.</th>
                <th className="py-3.5 px-3">Promotion Tier</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-300">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={14} className="py-12 text-center text-slate-500">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No customers found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((row) => {
                  const tierConfig =
                    TIER_CONFIG.find((t) => t.tier === row.promotionTier) || TIER_CONFIG[0];
                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-750/50 transition group"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-300">
                        {row.customerId}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{row.customerName}</div>
                        {row.notes && (
                          <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                            {row.notes}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-mono">
                        {formatCurrency(row.baseMonthlyPrice)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-semibold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                          {row.monthsAttended}M
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-bold px-2 py-0.5 rounded-md bg-blue-950/60 text-blue-300 border border-blue-800/40">
                          {row.packageMonths}M
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-medium text-slate-400">
                        {row.totalExpectedMonths}M
                      </td>
                      <td className="py-3 px-3 text-center text-slate-300">
                        {formatPercent(row.packageDiscount)}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-300">
                        {formatPercent(row.loyaltyDiscount)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                            row.isCapped
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-800/50'
                              : 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/40'
                          }`}
                        >
                          {formatPercent(row.appliedDiscount)}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-medium text-slate-200">
                        {formatCurrency(row.promoMonthlyPrice)}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                        {formatCurrency(row.packageTotal)}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-400">
                        {formatCurrency(row.renewalMonthlyPrice)}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${tierConfig.badgeColor}`}
                        >
                          {row.promotionTier}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100">
                          <button
                            onClick={() => onOpenQuote(row)}
                            title="Generate Quote / Receipt"
                            className="p-1 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingEntry(row)}
                            title="Edit customer entry"
                            className="p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-slate-700 transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteEntry(row.id)}
                            title="Delete customer entry"
                            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-slate-900/60 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing {filteredEntries.length} of {entries.length} members
          </span>
          <span className="italic">
            Formula: Promo Monthly = Base * (1 - Total Applied Discount capped at 30%)
          </span>
        </div>
      </div>

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-400" />
              Add Member to Pricing Log
            </h3>

            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Customer ID
                  </label>
                  <input
                    type="text"
                    value={newCustId}
                    onChange={(e) => setNewCustId(e.target.value)}
                    placeholder="e.g. 105"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    placeholder="Full name"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Base Monthly Price (₮)
                </label>
                <input
                  type="number"
                  value={newBasePrice}
                  onChange={(e) => setNewBasePrice(Number(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Months Already Attended
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newMonthsAttended}
                    onChange={(e) => setNewMonthsAttended(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Package Duration
                  </label>
                  <select
                    value={newPackageMonths}
                    onChange={(e) => setNewPackageMonths(Number(e.target.value) as PackageDuration)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value={1}>1 Month (+10%)</option>
                    <option value={3}>3 Months (+15%)</option>
                    <option value={6}>6 Months (+20%)</option>
                    <option value={12}>12 Months (+25%)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Notes, trainer, referral..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              {/* Calculated Preview Box */}
              {(() => {
                const preview = calculatePricing(newBasePrice, newMonthsAttended, newPackageMonths);
                return (
                  <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Applied Discount:</span>
                      <span className="font-bold text-emerald-400">
                        {formatPercent(preview.appliedDiscount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Promo Monthly Price:</span>
                      <span className="font-mono text-white">
                        {formatCurrency(preview.promotionalMonthlyPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Total Package Price:</span>
                      <span className="font-mono font-bold text-blue-400">
                        {formatCurrency(preview.totalPackagePrice)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Promotion Tier:</span>
                      <span className="font-semibold text-slate-300">
                        {preview.promotionTier}
                      </span>
                    </div>
                  </div>
                );
              })()}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
            <button
              onClick={() => setEditingEntry(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-cyan-400" />
              Edit Customer #{editingEntry.customerId}
            </h3>

            <form onSubmit={handleUpdateCustomer} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Customer ID
                  </label>
                  <input
                    type="text"
                    value={editingEntry.customerId}
                    onChange={(e) =>
                      setEditingEntry({ ...editingEntry, customerId: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEntry.customerName}
                    onChange={(e) =>
                      setEditingEntry({ ...editingEntry, customerName: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Base Monthly Price (₮)
                </label>
                <input
                  type="number"
                  value={editingEntry.baseMonthlyPrice}
                  onChange={(e) =>
                    setEditingEntry({
                      ...editingEntry,
                      baseMonthlyPrice: Number(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Months Already Attended
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingEntry.monthsAttended}
                    onChange={(e) =>
                      setEditingEntry({
                        ...editingEntry,
                        monthsAttended: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Package Duration
                  </label>
                  <select
                    value={editingEntry.packageMonths}
                    onChange={(e) =>
                      setEditingEntry({
                        ...editingEntry,
                        packageMonths: Number(e.target.value) as PackageDuration,
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value={1}>1 Month (+10%)</option>
                    <option value={3}>3 Months (+15%)</option>
                    <option value={6}>6 Months (+20%)</option>
                    <option value={12}>12 Months (+25%)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={editingEntry.notes}
                  onChange={(e) =>
                    setEditingEntry({ ...editingEntry, notes: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
