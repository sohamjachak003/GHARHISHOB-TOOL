import React, { useState, useEffect } from 'react';
import { Material, MaterialPurchase } from '../types';
import { parseRupeesToPaisa, getTodayDate, formatCurrency } from '../utils/format';
import { X } from 'lucide-react';

interface AddMaterialPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (purchase: Omit<MaterialPurchase, 'id'>) => void;
  materials: Material[];
  defaultMaterial?: Material | null;
}

export const AddMaterialPurchaseModal: React.FC<AddMaterialPurchaseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  materials,
  defaultMaterial,
}) => {
  const [selectedMaterialId, setSelectedMaterialId] = useState<number>(
    defaultMaterial ? defaultMaterial.id : materials[0]?.id || 1
  );
  const [quantity, setQuantity] = useState('100');
  const [rateRupees, setRateRupees] = useState('370');
  const [supplier, setSupplier] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [date, setDate] = useState(getTodayDate());
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque'>('Bank Transfer');
  const [notes, setNotes] = useState('');

  const currentMaterial = materials.find((m) => m.id === selectedMaterialId) || materials[0];

  useEffect(() => {
    if (defaultMaterial) {
      setSelectedMaterialId(defaultMaterial.id);
    } else if (materials.length > 0) {
      setSelectedMaterialId(materials[0].id);
    }
  }, [defaultMaterial, materials, isOpen]);

  if (!isOpen) return null;

  const totalCalculatedRupees = (parseFloat(quantity) || 0) * (parseFloat(rateRupees) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMaterial || !quantity || !rateRupees || !supplier.trim()) return;

    const ratePaisa = parseRupeesToPaisa(rateRupees);
    const totalPaisa = Math.round((parseFloat(quantity) || 0) * ratePaisa);

    onSave({
      material_id: currentMaterial.id,
      material_name: currentMaterial.name,
      category: currentMaterial.category,
      quantity: parseFloat(quantity) || 0,
      unit: currentMaterial.unit,
      rate_per_unit: ratePaisa,
      total_amount: totalPaisa,
      supplier: supplier.trim(),
      bill_number: billNumber.trim() || undefined,
      date,
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
            <h3 className="font-bold text-white text-lg">Log Material Receipt / Inward</h3>
            <p className="text-xs text-slate-400">Record site delivery of cement, steel, bricks, sand</p>
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
              Select Material Item *
            </label>
            <select
              value={selectedMaterialId}
              onChange={(e) => setSelectedMaterialId(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-emerald-500"
            >
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.category}) - Unit: {m.unit}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Quantity ({currentMaterial?.unit || 'Units'}) *
              </label>
              <input
                type="number"
                step="any"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Rate per {currentMaterial?.unit || 'Unit'} (Rs) *
              </label>
              <input
                type="number"
                step="any"
                required
                value={rateRupees}
                onChange={(e) => setRateRupees(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Total Preview */}
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Invoice Value:</span>
            <span className="text-base font-bold text-emerald-400">
              {formatCurrency(totalCalculatedRupees * 100)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Supplier / Dealer *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sri Lakshmi Cement Traders"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Invoice / Challan No.
              </label>
              <input
                type="text"
                placeholder="e.g. CHL-9012"
                value={billNumber}
                onChange={(e) => setBillNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Delivery Date *
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
                onChange={(e) =>
                  setPaymentMode(e.target.value as 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque')
                }
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                <option value="UPI">UPI</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Remarks
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Unloaded near North gate, 43 Grade tested"
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
              Log Receipt & Update Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
