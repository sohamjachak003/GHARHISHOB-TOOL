import React from 'react';
import { formatCurrency, formatRupeesInWords } from '../utils/format';
import { Menu, Plus, Globe, Sparkles } from 'lucide-react';

interface HeaderProps {
  title?: string;
  totalSpent: number;
  viewMode: 'simple' | 'detailed';
  onToggleViewMode: () => void;
  lang: 'hi' | 'en';
  onToggleLang: () => void;
  onOpenMobileNav: () => void;
  onQuickAddExpense: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'घर का हिसाब',
  totalSpent,
  viewMode,
  onToggleViewMode,
  lang,
  onToggleLang,
  onOpenMobileNav,
  onQuickAddExpense,
}) => {
  const rupeeVal = Math.floor(totalSpent / 100);

  return (
    <header className="min-h-16 py-2 sm:py-0 border-b border-slate-700 bg-[#0f172a]/90 backdrop-blur-md flex items-center justify-between px-3 sm:px-6 shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile menu button */}
        <button
          id="mobile-nav-toggle"
          onClick={onOpenMobileNav}
          className="p-2 -ml-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 lg:hidden"
          title="Open Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
              {title}
            </h2>
            {viewMode === 'simple' && (
              <span className="hidden sm:inline-flex px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[11px] rounded-full font-bold uppercase">
                {lang === 'hi' ? 'सरल मोड' : 'Simple Mode'}
              </span>
            )}
          </div>
          <p className="text-[11px] text-emerald-400 font-medium hidden sm:block">
            {formatRupeesInWords(rupeeVal, lang)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Language Switcher */}
        <button
          id="lang-toggle-btn"
          onClick={onToggleLang}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold rounded-xl border border-slate-700 transition-colors"
          title="Change Language"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>{lang === 'hi' ? 'ENG' : 'हिंदी'}</span>
        </button>

        {/* Mode Switcher: Simple vs Detailed */}
        <button
          id="view-mode-toggle-btn"
          onClick={onToggleViewMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
            viewMode === 'simple'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
          title="Switch UI Mode"
        >
          <span>{viewMode === 'simple' ? '👴' : '📊'}</span>
          <span className="hidden md:inline">
            {viewMode === 'simple'
              ? lang === 'hi'
                ? 'सरल मोड'
                : 'Simple Mode'
              : lang === 'hi'
              ? 'विस्तृत मोड'
              : 'Detailed Mode'}
          </span>
        </button>

        {/* Big Quick Add Button */}
        <button
          id="header-quick-add"
          onClick={onQuickAddExpense}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{lang === 'hi' ? 'खर्चा लिखें' : '+ Add Expense'}</span>
        </button>

        {/* Total Spent Widget */}
        <div className="text-right pl-1 sm:pl-2 border-l border-slate-800">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            {lang === 'hi' ? 'कुल खर्च' : 'Total'}
          </p>
          <p className="text-sm sm:text-base font-black text-white tracking-tight">
            {formatCurrency(totalSpent)}
          </p>
        </div>
      </div>
    </header>
  );
};
