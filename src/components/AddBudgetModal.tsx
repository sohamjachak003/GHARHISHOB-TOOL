import React, { useState } from 'react';
import { Budget } from '../types';
import { parseRupeesToPaisa } from '../utils/format';
import { X } from 'lucide-react';

interface AddBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (budget: Omit<Budget, 'id' | 'spent'>) => void;
}

const BUDGET_CATEGORIES = [
  'Overall Construction',
  'Foundation & Excavation',
  'RCC Slab & Beam Structure',
  'Brick Masonry',
  'Plumbing & Sanitation',
  'Electrical & Wiring',
  'Flooring & Tiles',
  'Plastering & POP',
  'Painting & Waterproofing',
  'Doors & Windows',
  'Labour Allocation',
  'Contingency',
];

export const AddBudgetModal: React.FC<AddBudgetModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(BUDGET_CATEGORIES[0]);
  const [budgetType, setBudgetType] = useState<'overall' | 'category'>('category');
  const [totalAmountRupees, setTotalAmountRupees] = useState('200000');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !totalAmountRupees) return;

    onSave({
      name: name.trim(),
      category,
      budget_type: budgetType,
      total_amount: parseRupeesToPaisa(totalAmountRupees),
    });

    setName('');
    setTotalAmountRupees('200000');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#1e293b] border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-800/40">
          <h3 className="font-bold text-white text-lg">Set Phase Budget Target</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Budget Target Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 2nd Floor Roofing & Slab Casting"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Category Scope *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {BUDGET_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Target Cap (Rs) *
              </label>
              <input
                type="number"
                required
                value={totalAmountRupees}
                onChange={(e) => setTotalAmountRupees(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-700 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm rounded-xl transition-colors shadow-md"
            >
              Set Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
