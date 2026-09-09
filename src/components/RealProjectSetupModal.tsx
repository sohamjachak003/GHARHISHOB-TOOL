import React, { useState } from 'react';
import { X, Check, Building, Trash2, Sparkles, RefreshCw } from 'lucide-react';
import { formatRupeesInWords, parseRupeesToPaisa } from '../utils/format';

interface RealProjectSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProjectName: string;
  currentBudgetRupees: number;
  onStartFreshRealProject: (projectName: string, budgetRupees: number) => void;
  onLoadDemoData: () => void;
  lang: 'hi' | 'en';
}

export const RealProjectSetupModal: React.FC<RealProjectSetupModalProps> = ({
  isOpen,
  onClose,
  currentProjectName,
  currentBudgetRupees,
  onStartFreshRealProject,
  onLoadDemoData,
  lang = 'hi',
}) => {
  const [projectName, setProjectName] = useState(currentProjectName || 'हमारा नया घर');
  const [budgetInput, setBudgetInput] = useState(
    currentBudgetRupees > 0 ? (currentBudgetRupees / 100).toString() : '2500000'
  );
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  if (!isOpen) return null;

  const numericBudget = parseFloat(budgetInput.replace(/,/g, '')) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    const finalBudget = parseRupeesToPaisa(numericBudget);
    onStartFreshRealProject(projectName.trim(), finalBudget);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#1e293b] border-2 border-emerald-500/60 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-700 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
              🏡
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg sm:text-xl">
                {lang === 'hi' ? 'असली खाता शुरू करें (Real Setup)' : 'Setup Your Real Home Ledger'}
              </h3>
              <p className="text-xs text-emerald-300">
                {lang === 'hi'
                  ? 'डेमो डेटा हटाकर अपने असली घर का हिसाब शुरू करें'
                  : 'Start clean for your actual house construction'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5 overflow-y-auto max-h-[80vh]">
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                {lang === 'hi' ? 'घर / प्रोजेक्ट का नाम (House Name) *' : 'House / Project Name *'}
              </label>
              <input
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="जैसे: हमारा नया मकान, पापा का घर, प्लॉट 42..."
                className="w-full px-4 py-3 bg-slate-950 border-2 border-slate-700 focus:border-emerald-400 rounded-xl text-base font-bold text-white focus:outline-none"
              />
              <div className="flex gap-2 mt-2 flex-wrap">
                {['हमारा नया घर', 'पापा का मकान', 'Dream Villa', 'प्लॉट 42 निर्माण'].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setProjectName(sug)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700 transition-colors"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                {lang === 'hi'
                  ? 'अनुमानित कुल बजट (Target Construction Budget) ₹'
                  : 'Total Construction Budget (₹)'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-2xl font-black text-emerald-400">
                  ₹
                </span>
                <input
                  type="number"
                  step="any"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  placeholder="2500000"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border-2 border-slate-700 focus:border-emerald-400 rounded-xl text-2xl font-black text-white focus:outline-none"
                />
              </div>
              {numericBudget > 0 && (
                <div className="mt-2 px-3 py-1.5 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-300 flex items-center justify-between">
                  <span>{formatRupeesInWords(numericBudget, 'hi')}</span>
                  <span className="text-slate-400">({formatRupeesInWords(numericBudget, 'en')})</span>
                </div>
              )}
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {[1000000, 1500000, 2000000, 2500000, 3500000, 5000000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setBudgetInput(amt.toString())}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700"
                  >
                    ₹{amt / 100000} Lakh
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Clean Real Start Alert */}
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                {lang === 'hi'
                  ? 'शून्य (0) से साफ असली रजिस्टर शुरू होगा'
                  : 'Fresh blank register with 0 fake entries'}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {lang === 'hi'
                ? 'पुराना सारा डेमो डेटा हट जाएगा। अब पिताजी जो भी खर्चा या मजदूरी फोन में लिखेंगे, वो हमेशा सुरक्षित सेव रहेगा।'
                : 'All sample/demo data will be cleared so your father can record real everyday expenses.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base rounded-2xl transition-all shadow-xl active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>{lang === 'hi' ? '✅ असली खाता शुरू करें (Start Real Ledger)' : 'Start Real Ledger Now'}</span>
            </button>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => {
                  onLoadDemoData();
                  onClose();
                }}
                className="text-slate-400 hover:text-slate-200 flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-slate-800"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'डेमो डेटा वापस लोड करें' : 'Load Demo Sample'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-200 py-1 px-2"
              >
                {lang === 'hi' ? 'बंद करें (Close)' : 'Close'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
