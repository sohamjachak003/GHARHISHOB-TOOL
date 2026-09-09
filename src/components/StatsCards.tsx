import React from 'react';
import { formatCurrency } from '../utils/format';

interface StatsCardsProps {
  constructionSpent: number;
  labourSpent: number;
  materialsSpent: number;
  remainingBudget: number;
  onCardClick?: (type: string) => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  constructionSpent,
  labourSpent,
  materialsSpent,
  remainingBudget,
  onCardClick,
}) => {
  const cards = [
    {
      id: 'stat-construction',
      label: 'Construction',
      amount: constructionSpent,
      color: 'text-white',
      filterType: 'construction',
      tag: 'Total Civil',
    },
    {
      id: 'stat-labour',
      label: 'Labour & Wages',
      amount: labourSpent,
      color: 'text-white',
      filterType: 'labour',
      tag: 'Active Workforce',
    },
    {
      id: 'stat-materials',
      label: 'Materials',
      amount: materialsSpent,
      color: 'text-white',
      filterType: 'materials',
      tag: 'Stock & Invoices',
    },
    {
      id: 'stat-remaining-budget',
      label: 'Remaining Budget',
      amount: remainingBudget,
      color: 'text-emerald-400',
      filterType: 'budgets',
      tag: 'From Target Cap',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div
          key={c.id}
          id={c.id}
          onClick={() => onCardClick && onCardClick(c.filterType)}
          className="bg-[#1e293b] rounded-2xl p-4 sm:p-5 border border-slate-700 flex flex-col justify-between hover:border-slate-600 transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              {c.label}
            </span>
            <span className="text-[10px] text-slate-500 font-medium group-hover:text-slate-400 transition-colors">
              {c.tag}
            </span>
          </div>
          <span className={`text-xl sm:text-2xl font-bold mt-2 truncate ${c.color}`}>
            {formatCurrency(c.amount)}
          </span>
        </div>
      ))}
    </div>
  );
};
