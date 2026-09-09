import React, { useState } from 'react';
import { Check, Save, Building, ShieldCheck, Trash2, Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';
import { ProjectConfig } from '../types';

interface SettingsViewProps {
  projectConfig?: ProjectConfig;
  onUpdateProjectConfig?: (cfg: ProjectConfig) => void;
  onStartFreshRealProject?: (name: string, budgetPaisa: number) => void;
  onLoadDemoData?: () => void;
  lang?: 'hi' | 'en';
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  projectConfig = {
    name: 'हमारा नया घर',
    supervisor: 'पापा',
    targetBudgetPaisa: 250000000,
    startDate: '2024-01-01',
    isRealMode: true,
  },
  onUpdateProjectConfig,
  onStartFreshRealProject,
  onLoadDemoData,
  lang = 'hi',
}) => {
  const [projectName, setProjectName] = useState(projectConfig.name || 'हमारा नया घर');
  const [supervisor, setSupervisor] = useState(projectConfig.supervisor || 'पापा');
  const [budgetRupees, setBudgetRupees] = useState(
    (projectConfig.targetBudgetPaisa ? projectConfig.targetBudgetPaisa / 100 : 2500000).toString()
  );
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProjectConfig) {
      onUpdateProjectConfig({
        ...projectConfig,
        name: projectName.trim() || 'हमारा नया घर',
        supervisor: supervisor.trim(),
        targetBudgetPaisa: (parseFloat(budgetRupees) || 2500000) * 100,
      });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-700">
        <h2 className="text-xl font-bold text-white tracking-tight">
          {lang === 'hi' ? '⚙️ प्रोजेक्ट व खाता सेटिंग्स' : 'Application & Project Settings'}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {lang === 'hi'
            ? 'घर का नाम, सुपरवाइजर और बजट सेट करें'
            : 'Configure site metadata, project ownership, and real accounting preferences'}
        </p>
      </div>

      {/* Real Project Setup Box */}
      <div className="bg-gradient-to-r from-emerald-950 to-slate-900 rounded-2xl border-2 border-emerald-500/50 p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-slate-950 font-bold text-xl">
            🚀
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base sm:text-lg">
              {lang === 'hi' ? 'असली खाता मोड (Real Live Ledger)' : 'Real Live Ledger Mode'}
            </h3>
            <p className="text-xs text-emerald-300">
              {lang === 'hi'
                ? 'डेमो डेटा हटाकर अपने घर का बिल्कुल नया असली खाता शुरू करें।'
                : 'Clear demo mock data and start your real family house ledger.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {onStartFreshRealProject && (
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    lang === 'hi'
                      ? 'क्या आप सारा डेमो डेटा साफ़ करके नया असली खाता शुरू करना चाहते हैं?'
                      : 'Do you want to clear demo data and start a fresh real ledger?'
                  )
                ) {
                  onStartFreshRealProject(projectName, (parseFloat(budgetRupees) || 2500000) * 100);
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{lang === 'hi' ? 'नया खाली खाता शुरू करें (Start Real)' : 'Start Fresh Real Ledger'}</span>
            </button>
          )}

          {onLoadDemoData && (
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    lang === 'hi'
                      ? 'क्या आप नमूना (Demo Data) लोड करना चाहते हैं?'
                      : 'Do you want to reload sample demo data?'
                  )
                ) {
                  onLoadDemoData();
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-600 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'नमूना डेटा लोड करें (Demo Data)' : 'Load Sample Demo'}</span>
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Project Details */}
        <div className="bg-[#1e293b] rounded-2xl border border-slate-700 p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-700/80">
            <Building className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">
              {lang === 'hi' ? 'घर व प्रोजेक्ट की जानकारी' : 'Project Metadata'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">
                {lang === 'hi' ? 'घर / प्रोजेक्ट का नाम' : 'Project Name'}
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">
                {lang === 'hi' ? 'देखरेखकर्ता / सुपरवाइजर' : 'Site Supervisor'}
              </label>
              <input
                type="text"
                value={supervisor}
                onChange={(e) => setSupervisor(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">
                {lang === 'hi' ? 'अनुमानित कुल बजट (रुपये में)' : 'Target Budget (in INR)'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  value={budgetRupees}
                  onChange={(e) => setBudgetRupees(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm rounded-xl transition-colors shadow-md cursor-pointer"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                <span>{lang === 'hi' ? 'सेव हो गया!' : 'Settings Saved'}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{lang === 'hi' ? 'बदलाव सेव करें' : 'Save Changes'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
