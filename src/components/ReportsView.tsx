import React from 'react';
import { Expense } from '../types';
import { formatCurrency, getCategoryBadge } from '../utils/format';
import { BarChart3, PieChart, TrendingUp, DollarSign } from 'lucide-react';

interface ReportsViewProps {
  expenses: Expense[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ expenses }) => {
  const totalSpent = expenses.reduce((acc, e) => acc + e.amount, 0);

  // Group by category
  const categoryMap: { [cat: string]: number } = {};
  const paymentModeMap: { [mode: string]: number } = {};
  const payeeMap: { [payee: string]: number } = {};

  expenses.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    paymentModeMap[e.payment_mode] = (paymentModeMap[e.payment_mode] || 0) + e.amount;
    if (e.paid_to) {
      payeeMap[e.paid_to] = (payeeMap[e.paid_to] || 0) + e.amount;
    }
  });

  const sortedCategories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
  const sortedPaymentModes = Object.entries(paymentModeMap).sort((a, b) => b[1] - a[1]);
  const topPayees = Object.entries(payeeMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-700">
        <h2 className="text-xl font-bold text-white tracking-tight">Financial Reports & Site Analytics</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Consolidated cost distribution across {expenses.length} transactions &bull; Total expenditure{' '}
          <span className="text-emerald-400 font-bold">{formatCurrency(totalSpent)}</span>
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-[#1e293b] rounded-2xl border border-slate-700 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <PieChart className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Expenditure by Category</h3>
          </div>

          <div className="space-y-4">
            {sortedCategories.map(([category, amount]) => {
              const pct = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
              const badge = getCategoryBadge(category);

              return (
                <div key={category} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-slate-200">
                      <span>{badge.icon}</span>
                      <span>{category}</span>
                    </span>
                    <div className="text-right">
                      <span className="text-white font-bold mr-2">{formatCurrency(amount)}</span>
                      <span className="text-slate-400 text-[11px]">({pct}%)</span>
                    </div>
                  </div>

                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Modes & Top Payees */}
        <div className="space-y-6">
          {/* Payment Mode */}
          <div className="bg-[#1e293b] rounded-2xl border border-slate-700 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">Payment Method Distribution</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {sortedPaymentModes.map(([mode, amount]) => {
                const pct = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
                return (
                  <div
                    key={mode}
                    className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-center"
                  >
                    <span className="text-xs text-slate-400 font-semibold">{mode}</span>
                    <p className="text-sm font-bold text-white mt-1">{formatCurrency(amount)}</p>
                    <span className="text-[10px] text-emerald-400 font-bold">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Vendors / Recipients */}
          <div className="bg-[#1e293b] rounded-2xl border border-slate-700 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">Top Vendors & Contractors</h3>
            </div>

            <div className="space-y-3">
              {topPayees.map(([payee, amount], idx) => (
                <div
                  key={payee}
                  className="flex items-center justify-between p-2.5 bg-slate-900/40 rounded-xl border border-slate-800/80"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold font-mono">
                      #{idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-slate-200 truncate max-w-[200px] sm:max-w-xs">
                      {payee}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-emerald-400 whitespace-nowrap">
                    {formatCurrency(amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
