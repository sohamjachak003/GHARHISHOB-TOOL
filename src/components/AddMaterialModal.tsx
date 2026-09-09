import React, { useState } from 'react';
import { Material } from '../types';
import { X } from 'lucide-react';

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (material: Omit<Material, 'id' | 'current_stock' | 'total_purchased' | 'total_spent'>) => void;
}

const MATERIAL_CATEGORIES = [
  'Cement',
  'Steel',
  'Sand',
  'Bricks',
  'Aggregates',
  'Plumbing',
  'Electrical',
  'Tiles',
  'Wood',
  'Painting',
  'Glass & Aluminum',
  'Hardware',
];

const COMMON_UNITS = ['Bags', 'Tons', 'Kg', 'Trucks', 'Brass', 'Units', 'Sq.Ft', 'Liters', 'Meters', 'Pieces'];

export const AddMaterialModal: React.FC<AddMaterialModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(MATERIAL_CATEGORIES[0]);
  const [unit, setUnit] = useState(COMMON_UNITS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      category,
      unit,
    });

    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#1e293b] border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-800/40">
          <h3 className="font-bold text-white text-lg">Add Material Inventory Item</h3>
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
              Material Item Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Vitrified 2x2 Glazed Floor Tiles"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {MATERIAL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Standard Unit *
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {COMMON_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
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
              Add Material
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
