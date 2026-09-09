import React, { useState } from 'react';
import { Material, MaterialPurchase } from '../types';
import { formatCurrency, formatDate } from '../utils/format';
import { Plus, Package, FileText, ShoppingCart } from 'lucide-react';

interface MaterialsViewProps {
  materials: Material[];
  purchases: MaterialPurchase[];
  onAddMaterial: () => void;
  onLogPurchase: (material?: Material) => void;
  onDeletePurchase: (id: number) => void;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  materials,
  purchases,
  onAddMaterial,
  onLogPurchase,
  onDeletePurchase,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'purchases'>('inventory');

  const totalMaterialSpent = materials.reduce((acc, m) => acc + m.total_spent, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1e293b] p-5 rounded-2xl border border-slate-700">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Materials & Inventory</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {materials.length} material categories &bull; Total expenditure{' '}
            <span className="text-emerald-400 font-bold">{formatCurrency(totalMaterialSpent)}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onAddMaterial}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Item</span>
          </button>
          <button
            onClick={() => onLogPurchase()}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm rounded-xl transition-colors shadow-md active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Log Inward Delivery</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700 gap-2">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'inventory'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Inventory & Site Stock</span>
        </button>
        <button
          onClick={() => setActiveTab('purchases')}
          className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'purchases'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Purchase Invoices & Challans ({purchases.length})</span>
        </button>
      </div>

      {activeTab === 'inventory' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((mat) => {
            const stockPct = mat.total_purchased > 0 ? (mat.current_stock / mat.total_purchased) * 100 : 0;
            const isLowStock = stockPct < 25;

            return (
              <div
                key={mat.id}
                className="bg-[#1e293b] rounded-2xl border border-slate-700 p-5 flex flex-col justify-between hover:border-slate-600 transition-all shadow-sm group"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-base">
                        🧱
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                          {mat.name}
                        </h4>
                        <span className="inline-block px-2 py-0.5 mt-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider">
                          {mat.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-slate-900/50 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Current On-Site:</span>
                      <span className="font-bold text-white">
                        {mat.current_stock} {mat.unit}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Total Procured:</span>
                      <span className="text-slate-300">
                        {mat.total_purchased} {mat.unit}
                      </span>
                    </div>

                    <div className="pt-1">
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${isLowStock ? 'bg-amber-500' : 'bg-blue-500'}`}
                          style={{ width: `${Math.min(stockPct, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Spent</span>
                    <p className="text-sm font-bold text-emerald-400">{formatCurrency(mat.total_spent)}</p>
                  </div>

                  <button
                    onClick={() => onLogPurchase(mat)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold text-xs rounded-xl border border-slate-700 transition-colors"
                  >
                    + Restock
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Inward Purchases Table */
        <div className="bg-[#1e293b] rounded-2xl border border-slate-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-900/70 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Date</th>
                  <th className="px-5 py-3.5 font-semibold">Material Item</th>
                  <th className="px-5 py-3.5 font-semibold">Supplier</th>
                  <th className="px-5 py-3.5 font-semibold">Quantity</th>
                  <th className="px-5 py-3.5 font-semibold">Unit Rate</th>
                  <th className="px-5 py-3.5 font-semibold">Bill / Challan</th>
                  <th className="px-5 py-3.5 text-right font-semibold">Total Cost</th>
                  <th className="px-5 py-3.5 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/70">
                {purchases.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                      No material purchases recorded yet.
                    </td>
                  </tr>
                ) : (
                  purchases.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                        {formatDate(p.date)}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-white">
                        {p.material_name}
                      </td>
                      <td className="px-5 py-3.5 text-slate-300 text-xs">
                        {p.supplier}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-white">
                        {p.quantity} {p.unit}
                      </td>
                      <td className="px-5 py-3.5 text-slate-300 text-xs">
                        {formatCurrency(p.rate_per_unit)}/{p.unit}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-400">
                        {p.bill_number ? (
                          <span className="font-mono bg-slate-900/60 px-2 py-0.5 rounded border border-slate-700/50">
                            {p.bill_number}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-white whitespace-nowrap text-sm">
                        {formatCurrency(p.total_amount)}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <button
                          onClick={() => onDeletePurchase(p.id)}
                          className="text-xs text-rose-400 hover:text-rose-300 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
