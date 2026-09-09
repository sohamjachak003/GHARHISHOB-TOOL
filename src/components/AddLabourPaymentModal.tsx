import React, { useState, useEffect } from 'react';
import { Labourer, LabourPayment } from '../types';
import { parseRupeesToPaisa, getTodayDate, formatCurrency } from '../utils/format';
import { X } from 'lucide-react';

interface AddLabourPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payment: Omit<LabourPayment, 'id'>) => void;
  labourers: Labourer[];
  defaultLabourer?: Labourer | null;
}

export const AddLabourPaymentModal: React.FC<AddLabourPaymentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  labourers,
  defaultLabourer,
}) => {
  const [selectedLabourerId, setSelectedLabourerId] = useState<number>(
    defaultLabourer ? defaultLabourer.id : labourers[0]?.id || 1
  );
  const [daysWorked, setDaysWorked] = useState('6');
  const [amountRupees, setAmountRupees] = useState('');
  const [date, setDate] = useState(getTodayDate());
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Bank Transfer'>('Cash');
  const [notes, setNotes] = useState('');

  // Selected labourer object
  const currentLabourer = labourers.find((l) => l.id === selectedLabourerId) || labourers[0];

  useEffect(() => {
    if (defaultLabourer) {
      setSelectedLabourerId(defaultLabourer.id);
    } else if (labourers.length > 0) {
      setSelectedLabourerId(labourers[0].id);
    }
  }, [defaultLabourer, labourers, isOpen]);

  // Recalculate amount when days worked or labourer changes
  useEffect(() => {
    if (currentLabourer && daysWorked) {
      const days = parseFloat(daysWorked) || 0;
      const totalPaisa = Math.round(days * currentLabourer.daily_wage);
      setAmountRupees((totalPaisa / 100).toString());
    }
  }, [selectedLabourerId, daysWorked, currentLabourer]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLabourer || !amountRupees) return;

    const paisa = parseRupeesToPaisa(amountRupees);
    if (paisa <= 0) return;

    onSave({
      labourer_id: currentLabourer.id,
      labourer_name: currentLabourer.name,
      amount: paisa,
      date,
      days_worked: parseFloat(daysWorked) || 1,
      payment_mode: paymentMode,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#1e293b] border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-800/40">
          <div>
            <h3 className="font-bold text-white text-lg">Record Wage Settlement</h3>
            <p className="text-xs text-slate-400">Payout wages to masons, helpers & contractors</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Select Worker / Team *
            </label>
            <select
              value={selectedLabourerId}
              onChange={(e) => setSelectedLabourerId(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-emerald-500"
            >
              {labourers.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.role}) - {formatCurrency(l.daily_wage)}/day
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Days Worked / Shifts *
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                required
                value={daysWorked}
                onChange={(e) => setDaysWorked(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Total Payout Amount (Rs) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  step="any"
                  required
                  value={amountRupees}
                  onChange={(e) => setAmountRupees(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Payout Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Payment Mode
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as 'Cash' | 'UPI' | 'Bank Transfer')}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Cash">Cash Handover</option>
                <option value="UPI">UPI / PhonePe / GPay</option>
                <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Remarks & Task Covered
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Slab casting, boundary brickwork, weekly clearance"
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
              Confirm Wage Payout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
