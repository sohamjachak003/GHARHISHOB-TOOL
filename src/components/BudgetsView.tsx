import React from 'react';
import { Budget } from '../types';
import { formatCurrency } from '../utils/format';
import { Plus, Target, AlertTriangle, CheckCircle } from 'lucide-react';

interface BudgetsViewProps {
  budgets: Budget[];
  onAddBudget: () => void;
  onDeleteBudget: (id: number) => void;
}

export const BudgetsView: React.FC<BudgetsViewProps> = ({
  budgets,
  onAddBudget,
  onDeleteBudget,
}) => {
  const totalPlanned = budgets.reduce((acc, b) => acc + b.total_amount, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const totalRemaining = totalPlanned - totalSpent;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1e293b] p-5 rounded-2xl border border-slate-700">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Phase & Category Budgets</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Planned Total: <span className="text-white font-bold">{formatCurrency(totalPlanned)}</span> &bull;
            Spent: <span className="text-slate-200 font-bold">{formatCurrency(totalSpent)}</span> &bull;
            Remaining: <span className="text-emerald-400 font-bold">{formatCurrency(totalRemaining)}</span>
          </p>
        </div>

        <button
          onClick={onAddBudget}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm rounded-xl transition-colors shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Set Phase Budget</span>
        </button>
      </div>

      {/* Budget Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {budgets.map((b) => {
          const pct = Math.round((b.spent / b.total_amount) * 100);
          const isOver = b.spent > b.total_amount;
          const remaining = b.total_amount - b.spent;

          let barColor = 'bg-emerald-500';
          let badge = (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <CheckCircle className="w-3 h-3" /> On Track
            </span>
          );

          if (isOver) {
            barColor = 'bg-rose-500';
            badge = (
              <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                <AlertTriangle className="w-3 h-3" /> Over Budget
              </span>
            );
          } else if (pct > 80) {
            barColor = 'bg-amber-500';
            badge = (
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                <AlertTriangle className="w-3 h-3" /> Nearing Limit
              </span>
            );
          }

          return (
            <div
              key={b.id}
              className="bg-[#1e293b] rounded-2xl border border-slate-700 p-6 flex flex-col justify-between shadow-sm hover:border-slate-600 transition-all"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white text-lg">{b.name}</h3>
                    <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
                      {b.category}
                    </span>
                  </div>
                  {badge}
                </div>

                <div className="mt-5 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400 uppercase">Utilization</span>
                    <span className={isOver ? 'text-rose-400 font-bold' : 'text-white'}>
                      {pct}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor} transition-all duration-500`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-5 p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 text-center">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Allocated</div>
                    <div className="text-xs sm:text-sm font-bold text-white mt-0.5">
                      {formatCurrency(b.total_amount)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Spent</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-300 mt-0.5">
                      {formatCurrency(b.spent)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">
                      {isOver ? 'Excess' : 'Balance'}
                    </div>
                    <div
                      className={`text-xs sm:text-sm font-bold mt-0.5 ${
                        isOver ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {formatCurrency(Math.abs(remaining))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-700/80 flex justify-end">
                <button
                  onClick={() => onDeleteBudget(b.id)}
                  className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
                >
                  Delete Budget
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
