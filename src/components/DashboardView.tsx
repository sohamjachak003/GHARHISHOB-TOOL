import React from 'react';
import { Expense, Budget, ActiveTab } from '../types';
import { formatCurrency, formatDate, getCategoryBadge } from '../utils/format';

interface DashboardViewProps {
  expenses: Expense[];
  budgets: Budget[];
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenAddExpense: () => void;
  onOpenLogMaterial: () => void;
  onOpenPayoutLabour: () => void;
  onSelectExpense?: (expense: Expense) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  expenses,
  budgets,
  onNavigateTab,
  onOpenAddExpense,
  onOpenLogMaterial,
  onOpenPayoutLabour,
  onSelectExpense,
}) => {
  // Get top 6 recent transactions
  const recentTransactions = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Recent Transactions Table */}
      <div className="lg:col-span-8 bg-[#1e293b] rounded-2xl border border-slate-700 flex flex-col overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-800/30">
          <div>
            <h3 className="font-bold text-white text-base">Recent Transactions</h3>
            <p className="text-xs text-slate-400">Latest recorded site & construction bills</p>
          </div>
          <button
            id="view-all-history-btn"
            onClick={() => onNavigateTab('expenses')}
            className="text-xs text-emerald-400 font-bold hover:text-emerald-300 hover:underline transition-colors"
          >
            View All History &rarr;
          </button>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-900/50 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700/50">
              <tr>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Description</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/70">
              {recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                    No transactions recorded yet. Click "Add New Expense" to get started.
                  </td>
                </tr>
              ) : (
                recentTransactions.map((tx) => {
                  const badge = getCategoryBadge(tx.category);
                  return (
                    <tr
                      key={tx.id}
                      onClick={() => onSelectExpense && onSelectExpense(tx)}
                      className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                        {formatDate(tx.date)}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-white group-hover:text-emerald-300 transition-colors">
                        <div className="max-w-xs md:max-w-md truncate" title={tx.title}>
                          {tx.title}
                        </div>
                        {tx.paid_to && (
                          <div className="text-[11px] text-slate-400 truncate">
                            Paid to: {tx.paid_to}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold ${badge.bg}`}
                        >
                          <span>{badge.icon}</span>
                          <span>{tx.category}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-white whitespace-nowrap">
                        {formatCurrency(tx.amount)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Column: Budget Progress & Quick Actions */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        {/* Budget Progress Card */}
        <div className="bg-[#1e293b] rounded-2xl border border-slate-700 p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-white flex items-center gap-2 text-base">
              <span>🎯</span>
              <span>Budget Progress</span>
            </h3>
            <button
              onClick={() => onNavigateTab('budgets')}
              className="text-xs text-slate-400 hover:text-emerald-400 transition-colors font-medium"
            >
              Manage &rarr;
            </button>
          </div>

          <div className="space-y-4">
            {budgets.slice(0, 4).map((b) => {
              const percentage = Math.round((b.spent / b.total_amount) * 100);
              const isOver = b.spent > b.total_amount;
              const excess = b.spent - b.total_amount;

              let barColor = 'bg-emerald-500';
              if (isOver) {
                barColor = 'bg-rose-500';
              } else if (percentage > 75) {
                barColor = 'bg-amber-500';
              } else if (percentage > 40) {
                barColor = 'bg-blue-400';
              }

              return (
                <div key={b.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span className={isOver ? 'text-rose-400' : 'text-slate-200'}>
                      {b.name}
                    </span>
                    <span className={isOver ? 'text-rose-400' : 'text-slate-400'}>
                      {percentage}%
                    </span>
                  </div>

                  <div className="h-2 bg-slate-700/80 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor} transition-all duration-500`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>

                  {isOver && (
                    <p className="text-[10px] text-rose-400 font-medium">
                      Warning: Budget exceeded by {formatCurrency(excess)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-emerald-500 rounded-2xl p-5 flex flex-col gap-3 shadow-lg shadow-emerald-500/10">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
            <span>⚡</span>
            <span>Quick Actions</span>
          </h3>

          <button
            id="quick-action-add-expense"
            onClick={onOpenAddExpense}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-md active:scale-[0.98]"
          >
            <span>➕</span>
            <span>Add New Expense</span>
          </button>

          <button
            id="quick-action-log-material"
            onClick={onOpenLogMaterial}
            className="w-full py-3 bg-emerald-600 text-white border border-emerald-400 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-xs active:scale-[0.98]"
          >
            <span>📦</span>
            <span>Log Material Receipt</span>
          </button>

          <button
            id="quick-action-payout-labour"
            onClick={onOpenPayoutLabour}
            className="w-full py-3 bg-emerald-600 text-white border border-emerald-400 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-xs active:scale-[0.98]"
          >
            <span>👷</span>
            <span>Payout Labourers</span>
          </button>
        </div>
      </div>
    </div>
  );
};
