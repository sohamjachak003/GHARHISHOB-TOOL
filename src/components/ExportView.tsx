import React, { useState } from 'react';
import { Expense, Labourer, LabourPayment, Material, MaterialPurchase, Budget } from '../types';
import { formatCurrency } from '../utils/format';
import { Download, FileSpreadsheet, Check, RefreshCw } from 'lucide-react';

interface ExportViewProps {
  expenses: Expense[];
  labourers: Labourer[];
  labourPayments: LabourPayment[];
  materials: Material[];
  materialPurchases: MaterialPurchase[];
  budgets: Budget[];
  onResetToDemoData: () => void;
}

export const ExportView: React.FC<ExportViewProps> = ({
  expenses,
  labourers,
  labourPayments,
  materials,
  materialPurchases,
  budgets,
  onResetToDemoData,
}) => {
  const [downloadedStatus, setDownloadedStatus] = useState<string | null>(null);

  const downloadCSV = (filename: string, csvContent: string, statusKey: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadedStatus(statusKey);
    setTimeout(() => setDownloadedStatus(null), 3000);
  };

  const handleExportExpenses = () => {
    let csv = 'ID,Date,Title,Category,Type,Payment Mode,Paid To,Bill Number,Notes,Amount (INR)\n';
    expenses.forEach((e) => {
      const row = [
        e.id,
        `"${e.date}"`,
        `"${e.title.replace(/"/g, '""')}"`,
        `"${e.category}"`,
        `"${e.expense_type}"`,
        `"${e.payment_mode}"`,
        `"${(e.paid_to || '').replace(/"/g, '""')}"`,
        `"${(e.bill_number || '').replace(/"/g, '""')}"`,
        `"${(e.notes || '').replace(/"/g, '""')}"`,
        (e.amount / 100).toFixed(2),
      ].join(',');
      csv += row + '\n';
    });
    downloadCSV(`GharHishob_Expenses_${new Date().toISOString().split('T')[0]}.csv`, csv, 'expenses');
  };

  const handleExportLabour = () => {
    let csv = 'Payment ID,Date,Worker Name,Days Worked,Daily Wage (INR),Payment Mode,Remarks,Amount Paid (INR)\n';
    labourPayments.forEach((p) => {
      const labourer = labourers.find((l) => l.id === p.labourer_id);
      const dailyWage = labourer ? (labourer.daily_wage / 100).toFixed(2) : '0';
      const row = [
        p.id,
        `"${p.date}"`,
        `"${p.labourer_name.replace(/"/g, '""')}"`,
        p.days_worked,
        dailyWage,
        `"${p.payment_mode}"`,
        `"${(p.notes || '').replace(/"/g, '""')}"`,
        (p.amount / 100).toFixed(2),
      ].join(',');
      csv += row + '\n';
    });
    downloadCSV(`GharHishob_Labour_Wages_${new Date().toISOString().split('T')[0]}.csv`, csv, 'labour');
  };

  const handleExportMaterials = () => {
    let csv = 'Challan ID,Date,Material Name,Category,Quantity,Unit,Unit Rate (INR),Supplier,Challan No,Total Cost (INR)\n';
    materialPurchases.forEach((p) => {
      const row = [
        p.id,
        `"${p.date}"`,
        `"${p.material_name.replace(/"/g, '""')}"`,
        `"${p.category}"`,
        p.quantity,
        `"${p.unit}"`,
        (p.rate_per_unit / 100).toFixed(2),
        `"${p.supplier.replace(/"/g, '""')}"`,
        `"${(p.bill_number || '').replace(/"/g, '""')}"`,
        (p.total_amount / 100).toFixed(2),
      ].join(',');
      csv += row + '\n';
    });
    downloadCSV(`GharHishob_Materials_${new Date().toISOString().split('T')[0]}.csv`, csv, 'materials');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-700">
        <h2 className="text-xl font-bold text-white tracking-tight">Export & Data Backup</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Generate clean CSV spreadsheets for accounting, tax filing, and construction audits
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Expenses CSV */}
        <div className="bg-[#1e293b] rounded-2xl border border-slate-700 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-lg">Expenses Ledger CSV</h3>
            <p className="text-xs text-slate-400 mt-2">
              Exports all {expenses.length} site entries including voucher numbers, categories, payment modes, and notes.
            </p>
          </div>

          <button
            onClick={handleExportExpenses}
            className="mt-6 w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {downloadedStatus === 'expenses' ? (
              <>
                <Check className="w-4 h-4" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Expenses CSV</span>
              </>
            )}
          </button>
        </div>

        {/* Labour CSV */}
        <div className="bg-[#1e293b] rounded-2xl border border-slate-700 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-4">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-lg">Labour & Wages CSV</h3>
            <p className="text-xs text-slate-400 mt-2">
              Exports all wage disbursement records ({labourPayments.length} entries), days worked, daily wages, and settlements.
            </p>
          </div>

          <button
            onClick={handleExportLabour}
            className="mt-6 w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {downloadedStatus === 'labour' ? (
              <>
                <Check className="w-4 h-4" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Wages CSV</span>
              </>
            )}
          </button>
        </div>

        {/* Materials CSV */}
        <div className="bg-[#1e293b] rounded-2xl border border-slate-700 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-4">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-lg">Materials & Invoices CSV</h3>
            <p className="text-xs text-slate-400 mt-2">
              Exports all inward material delivery receipts, supplier names, unit rates, quantities, and totals.
            </p>
          </div>

          <button
            onClick={handleExportMaterials}
            className="mt-6 w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {downloadedStatus === 'materials' ? (
              <>
                <Check className="w-4 h-4" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Materials CSV</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Reset Section */}
      <div className="bg-[#1e293b] rounded-2xl border border-slate-700 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-white text-base">Reset Demo Data</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Restore sample construction records (Ultratech cement, Tata Tiscon steel, Masons, Plumbers).
          </p>
        </div>
        <button
          onClick={onResetToDemoData}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-600 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset to Initial Sample Data</span>
        </button>
      </div>
    </div>
  );
};
