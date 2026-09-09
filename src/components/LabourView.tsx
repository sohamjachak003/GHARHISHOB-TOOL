import React, { useState } from 'react';
import { Labourer, LabourPayment } from '../types';
import { formatCurrency, formatDate } from '../utils/format';
import { Plus, UserCheck, DollarSign, Phone, Calendar } from 'lucide-react';

interface LabourViewProps {
  labourers: Labourer[];
  payments: LabourPayment[];
  onAddLabourer: () => void;
  onRecordPayment: (labourer?: Labourer) => void;
  onDeletePayment: (id: number) => void;
}

export const LabourView: React.FC<LabourViewProps> = ({
  labourers,
  payments,
  onAddLabourer,
  onRecordPayment,
  onDeletePayment,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'workers' | 'history'>('workers');

  const totalLabourPaid = labourers.reduce((acc, l) => acc + l.total_paid, 0);

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1e293b] p-5 rounded-2xl border border-slate-700">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Labour & Workforce Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {labourers.length} active tradesmen registered &bull; Total disbursed{' '}
            <span className="text-emerald-400 font-bold">{formatCurrency(totalLabourPaid)}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onAddLabourer}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Worker</span>
          </button>
          <button
            onClick={() => onRecordPayment()}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm rounded-xl transition-colors shadow-md active:scale-95"
          >
            <DollarSign className="w-4 h-4" />
            <span>Record Wage Payout</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-700 gap-2">
        <button
          onClick={() => setActiveSubTab('workers')}
          className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeSubTab === 'workers'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Workforce Directory ({labourers.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('history')}
          className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeSubTab === 'history'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Wage Payout History ({payments.length})</span>
        </button>
      </div>

      {/* Workers Grid */}
      {activeSubTab === 'workers' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {labourers.map((worker) => (
            <div
              key={worker.id}
              className="bg-[#1e293b] rounded-2xl border border-slate-700 p-5 flex flex-col justify-between hover:border-slate-600 transition-all shadow-sm group"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold text-base">
                      👷
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                        {worker.name}
                      </h4>
                      <span className="inline-block px-2 py-0.5 mt-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                        {worker.role}
                      </span>
                    </div>
                  </div>
                </div>

                {worker.phone && (
                  <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{worker.phone}</span>
                  </div>
                )}

                {worker.notes && (
                  <p className="text-xs text-slate-400 mt-2 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800">
                    {worker.notes}
                  </p>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-700/80 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Daily Wage</div>
                  <div className="text-sm font-bold text-white">
                    {formatCurrency(worker.daily_wage)}/day
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Paid</div>
                  <div className="text-sm font-bold text-emerald-400">
                    {formatCurrency(worker.total_paid)}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onRecordPayment(worker)}
                className="mt-3 w-full py-2 bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>➕ Pay Wages</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Payout History Table */
        <div className="bg-[#1e293b] rounded-2xl border border-slate-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-900/70 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Date</th>
                  <th className="px-5 py-3.5 font-semibold">Worker / Team</th>
                  <th className="px-5 py-3.5 font-semibold">Days Worked</th>
                  <th className="px-5 py-3.5 font-semibold">Mode</th>
                  <th className="px-5 py-3.5 font-semibold">Remarks</th>
                  <th className="px-5 py-3.5 text-right font-semibold">Amount Paid</th>
                  <th className="px-5 py-3.5 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/70">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      No wage payouts recorded yet.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                        {formatDate(p.date)}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-white">
                        {p.labourer_name}
                      </td>
                      <td className="px-5 py-3.5 text-slate-300 font-mono text-xs">
                        {p.days_worked} days
                      </td>
                      <td className="px-5 py-3.5 text-slate-300 text-xs">
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs">
                          {p.payment_mode}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 text-xs">
                        {p.notes || '-'}
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-emerald-400 whitespace-nowrap text-sm">
                        {formatCurrency(p.amount)}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <button
                          onClick={() => onDeletePayment(p.id)}
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
