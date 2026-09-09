import React, { useState } from 'react';
import { Labourer } from '../types';
import { parseRupeesToPaisa } from '../utils/format';
import { X } from 'lucide-react';

interface AddLabourerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (labourer: Omit<Labourer, 'id' | 'total_paid'>) => void;
}

const ROLES = [
  'Mason (Head)',
  'Mason (Assistant)',
  'Plumber',
  'Electrician',
  'Carpenter',
  'Painter',
  'Tile Layer',
  'Helper (General)',
  'Bar Bender / Steel Worker',
  'Supervisor / Mestri',
];

export const AddLabourerModal: React.FC<AddLabourerModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState(ROLES[0]);
  const [phone, setPhone] = useState('');
  const [dailyWageRupees, setDailyWageRupees] = useState('800');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dailyWageRupees) return;

    onSave({
      name: name.trim(),
      role,
      phone: phone.trim(),
      daily_wage: parseRupeesToPaisa(dailyWageRupees),
      notes: notes.trim() || undefined,
    });

    setName('');
    setPhone('');
    setDailyWageRupees('800');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#1e293b] border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-800/40">
          <h3 className="font-bold text-white text-lg">Add Worker / Contractor</h3>
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
              Worker Name / Team Leader *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Mestri"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Trade / Role *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Daily Wage (Rs) *
              </label>
              <input
                type="number"
                required
                value={dailyWageRupees}
                onChange={(e) => setDailyWageRupees(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="+91 98450 12345"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Specialization / Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. 10 years experience in RCC column casting"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
            />
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
              Add to Workforce
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
