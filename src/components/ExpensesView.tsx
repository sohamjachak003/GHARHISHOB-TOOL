import React, { useState, useMemo } from 'react';
import { Expense, ExpenseType } from '../types';
import { formatCurrency, formatDate, getCategoryBadge } from '../utils/format';
import { Plus, Search, Filter, Trash2, Edit2, X, RefreshCw } from 'lucide-react';

interface ExpensesViewProps {
  expenses: Expense[];
  onAddExpense: () => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: number) => void;
  defaultTypeFilter?: ExpenseType | 'all';
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  expenses,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
  defaultTypeFilter = 'all',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<ExpenseType | 'all'>(defaultTypeFilter);
  const [paymentModeFilter, setPaymentModeFilter] = useState<string>('all');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(expenses.map((e) => e.category));
    return Array.from(set).sort();
  }, [expenses]);

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((e) => {
        // Type filter
        if (selectedType !== 'all' && e.expense_type !== selectedType) {
          return false;
        }
        // Category filter
        if (selectedCategory !== 'all' && e.category !== selectedCategory) {
          return false;
        }
        // Payment mode filter
        if (paymentModeFilter !== 'all' && e.payment_mode !== paymentModeFilter) {
          return false;
        }
        // Search term (title, category, bill number, paid_to, notes)
        if (searchTerm.trim() !== '') {
          const term = searchTerm.toLowerCase().trim();
          const matchesTitle = e.title.toLowerCase().includes(term);
          const matchesCategory = e.category.toLowerCase().includes(term);
          const matchesBill = (e.bill_number || '').toLowerCase().includes(term);
          const matchesPaidTo = (e.paid_to || '').toLowerCase().includes(term);
          const matchesNotes = (e.notes || '').toLowerCase().includes(term);
          if (!matchesTitle && !matchesCategory && !matchesBill && !matchesPaidTo && !matchesNotes) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, selectedType, selectedCategory, paymentModeFilter, searchTerm]);

  // Filtered Total
  const totalFilteredAmount = useMemo(() => {
    return filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [filteredExpenses]);

  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    selectedCategory !== 'all' ||
    selectedType !== defaultTypeFilter ||
    paymentModeFilter !== 'all';

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedType(defaultTypeFilter);
    setPaymentModeFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1e293b] p-5 rounded-2xl border border-slate-700">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Expense Ledger</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Showing {filteredExpenses.length} of {expenses.length} transactions totaling{' '}
            <span className="text-emerald-400 font-bold">{formatCurrency(totalFilteredAmount)}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="add-expense-btn"
            onClick={onAddExpense}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm rounded-xl transition-colors shadow-md active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#1e293b] p-4 rounded-2xl border border-slate-700 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Primary Search input for title, category, bill number */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="expense-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, category, bill no, or payee..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />
            {searchTerm && (
              <button
                id="clear-search-btn"
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-white rounded-md transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Type Toggle */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedType === 'all'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedType('construction')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedType === 'construction'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Construction
            </button>
            <button
              onClick={() => setSelectedType('home')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedType === 'home'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Home / Misc
            </button>
          </div>

          {/* Category Select */}
          <select
            id="category-filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Payment Mode Select */}
          <select
            id="payment-mode-filter-select"
            value={paymentModeFilter}
            onChange={(e) => setPaymentModeFilter(e.target.value)}
            className="bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">All Modes</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
          </select>

          {hasActiveFilters && (
            <button
              id="reset-filters-btn"
              onClick={resetAllFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Active search filter badge strip if filtering */}
        {searchTerm.trim() !== '' && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
            <span>Filtering transactions containing:</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium">
              "{searchTerm}"
              <button
                onClick={() => setSearchTerm('')}
                className="hover:text-white"
                title="Remove filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
            <span className="text-slate-500">({filteredExpenses.length} results)</span>
          </div>
        )}
      </div>

      {/* Expenses Table */}
      <div className="bg-[#1e293b] rounded-2xl border border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-900/70 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Date</th>
                <th className="px-5 py-3.5 font-semibold">Description</th>
                <th className="px-5 py-3.5 font-semibold">Category</th>
                <th className="px-5 py-3.5 font-semibold">Mode & Payee</th>
                <th className="px-5 py-3.5 font-semibold">Voucher / Bill</th>
                <th className="px-5 py-3.5 text-right font-semibold">Amount</th>
                <th className="px-5 py-3.5 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/70">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-14 text-center">
                    <div className="max-w-sm mx-auto flex flex-col items-center justify-center space-y-3">
                      <div className="p-3 bg-slate-800/80 rounded-full border border-slate-700 text-slate-400">
                        <Search className="w-6 h-6" />
                      </div>
                      <p className="text-base font-semibold text-slate-200">
                        No transactions found
                      </p>
                      <p className="text-xs text-slate-400 text-center">
                        {searchTerm
                          ? `No records matching "${searchTerm}" in title, category, or bill number.`
                          : 'No expenses matching the selected criteria.'}
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={resetAllFilters}
                          className="mt-2 px-4 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-600 rounded-lg transition-colors cursor-pointer"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => {
                  const badge = getCategoryBadge(exp.category);
                  return (
                    <tr
                      key={exp.id}
                      className="hover:bg-slate-800/50 transition-colors group"
                    >
                      <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                        {formatDate(exp.date)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-white group-hover:text-emerald-300 transition-colors">
                          {exp.title}
                        </div>
                        {exp.notes && (
                          <div className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-sm">
                            {exp.notes}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold ${badge.bg}`}
                        >
                          <span>{badge.icon}</span>
                          <span>{exp.category}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="text-slate-300 font-medium text-xs">
                          {exp.payment_mode}
                        </div>
                        {exp.paid_to && (
                          <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                            {exp.paid_to}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-xs text-slate-400">
                        {exp.bill_number ? (
                          <span className="font-mono bg-slate-900/60 px-2 py-0.5 rounded border border-slate-700/50 text-slate-300">
                            {exp.bill_number}
                          </span>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-white whitespace-nowrap text-base">
                        {formatCurrency(exp.amount)}
                      </td>
                      <td className="px-5 py-3.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => onEditExpense(exp)}
                            title="Edit"
                            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteExpense(exp.id)}
                            title="Delete"
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
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
      </div>
    </div>
  );
};
