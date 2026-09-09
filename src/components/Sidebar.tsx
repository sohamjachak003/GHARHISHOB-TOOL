import React from 'react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lang?: 'hi' | 'en';
  viewMode?: 'simple' | 'detailed';
  onToggleViewMode?: () => void;
  isOpenMobile?: boolean;
  setIsOpenMobile?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  lang = 'hi',
  viewMode = 'simple',
  onToggleViewMode,
  isOpenMobile,
  setIsOpenMobile,
}) => {
  const navItems: { id: ActiveTab; labelHi: string; labelEn: string; icon: string }[] = [
    { id: 'dashboard', labelHi: '🏠 घर का हिसाब', labelEn: 'Home Overview', icon: '🏠' },
    { id: 'expenses', labelHi: '📝 सभी खर्चे', labelEn: 'All Expenses', icon: '💸' },
    { id: 'labour', labelHi: '👷 मजदूर व हाजिरी', labelEn: 'Labour & Mistri', icon: '👷' },
    { id: 'materials', labelHi: '🧱 सामान का स्टॉक', labelEn: 'Materials Stock', icon: '🧱' },
    { id: 'budgets', labelHi: '🎯 बजट और सीमा', labelEn: 'Phase Budgets', icon: '🎯' },
    { id: 'reports', labelHi: '📈 रिपोर्ट व ग्राफ', labelEn: 'Financial Reports', icon: '📈' },
    { id: 'export', labelHi: '📥 बैकअप व एक्सपोर्ट', labelEn: 'Backup & Export', icon: '📥' },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (setIsOpenMobile) {
      setIsOpenMobile(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setIsOpenMobile && setIsOpenMobile(false)}
        />
      )}

      <aside
        className={`w-64 bg-[#1e293b] border-r border-slate-700 flex flex-col shrink-0 z-50 transition-transform duration-300 ${
          isOpenMobile
            ? 'fixed inset-y-0 left-0 translate-x-0'
            : 'fixed inset-y-0 left-0 -translate-x-full lg:translate-x-0 lg:static'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-emerald-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20">
              🏡
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white">GharHishob</h1>
              <p className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                {lang === 'hi' ? 'सरल निर्माण हिसाब' : 'Easy Home Ledger'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation items with large, comfortable buttons */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md scale-[1.02]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span className="text-xl leading-none">{item.icon}</span>
                <span className="truncate">{lang === 'hi' ? item.labelHi : item.labelEn}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer with Mode Switcher & Settings */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          {onToggleViewMode && (
            <button
              onClick={onToggleViewMode}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span>{viewMode === 'simple' ? '👴' : '📊'}</span>
                <span>{viewMode === 'simple' ? (lang === 'hi' ? 'सरल मोड चालू है' : 'Simple Mode On') : (lang === 'hi' ? 'विस्तृत मोड चालू है' : 'Detailed Mode')}</span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-slate-800 px-2 py-0.5 rounded">
                {lang === 'hi' ? 'बदलें' : 'Switch'}
              </span>
            </button>
          )}

          <button
            id="nav-settings"
            onClick={() => handleSelectTab('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span className="text-base leading-none">⚙️</span>
            <span>{lang === 'hi' ? 'सेटिंग्स व प्रोजेक्ट' : 'Settings & Project'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
