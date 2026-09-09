import React, { useState, useMemo } from 'react';
import { Expense, Budget, Labourer, Material, AttendanceRecord, ProjectConfig } from '../types';
import { formatCurrency, formatDate, getCategoryBadge, formatRupeesInWords, getTodayDate } from '../utils/format';
import { QuickAddInHandBar } from './QuickAddInHandBar';
import { RealProjectSetupModal } from './RealProjectSetupModal';
import {
  Plus,
  Search,
  Share2,
  Users,
  Package,
  Edit2,
  Trash2,
  Check,
  Copy,
  Calendar,
  X,
  Phone,
  ArrowRight,
  TrendingDown,
  Sparkles,
  RefreshCw,
  Clock,
  Printer,
  Building,
  UserCheck,
  UserX,
  Wallet,
} from 'lucide-react';

interface SimpleFatherViewProps {
  expenses: Expense[];
  budgets: Budget[];
  labourers: Labourer[];
  materials: Material[];
  attendanceRecords: AttendanceRecord[];
  projectConfig: ProjectConfig;
  lang: 'hi' | 'en';
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: number) => void;
  onOpenPayoutLabour: (labourer?: Labourer) => void;
  onOpenLogMaterial: (material?: Material) => void;
  onOpenAddLabourer: () => void;
  onToggleAttendance: (labourerId: number, date: string, status: 'present' | 'half' | 'absent') => void;
  onStartFreshRealProject: (name: string, budgetPaisa: number) => void;
  onLoadDemoData: () => void;
  onSwitchToDetailed: () => void;
}

type SubTab = 'diary' | 'labour' | 'materials' | 'share';

export const SimpleFatherView: React.FC<SimpleFatherViewProps> = ({
  expenses,
  budgets,
  labourers,
  materials,
  attendanceRecords,
  projectConfig,
  lang = 'hi',
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
  onOpenPayoutLabour,
  onOpenLogMaterial,
  onOpenAddLabourer,
  onToggleAttendance,
  onStartFreshRealProject,
  onLoadDemoData,
  onSwitchToDetailed,
}) => {
  const [subTab, setSubTab] = useState<SubTab>('diary');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const todayStr = getTodayDate();

  // Totals calculations
  const totalSpent = useMemo(() => {
    return expenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses]);

  const materialsSpent = useMemo(() => {
    return expenses
      .filter((e) =>
        e.category.toLowerCase().includes('material') ||
        e.category.toLowerCase().includes('cement') ||
        e.category.toLowerCase().includes('steel') ||
        e.category.toLowerCase().includes('brick') ||
        e.category.toLowerCase().includes('sand') ||
        e.category.toLowerCase().includes('tile') ||
        e.category.toLowerCase().includes('wood') ||
        e.category.toLowerCase().includes('paint')
      )
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses]);

  const labourSpent = useMemo(() => {
    return expenses
      .filter((e) =>
        e.category.toLowerCase().includes('labour') ||
        e.category.toLowerCase().includes('wage') ||
        e.category.toLowerCase().includes('mistri')
      )
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses]);

  const overallBudgetTarget = useMemo(() => {
    if (projectConfig.targetBudgetPaisa && projectConfig.targetBudgetPaisa > 0) {
      return projectConfig.targetBudgetPaisa;
    }
    const overall = budgets.find((b) => b.budget_type === 'overall');
    return overall ? overall.total_amount : 250000000; // 25 Lakhs
  }, [projectConfig, budgets]);

  const remainingBudget = overallBudgetTarget - totalSpent;

  // Filtered List
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((item) => {
        if (selectedFilter === 'materials') {
          const isMat =
            item.category.toLowerCase().includes('material') ||
            item.category.toLowerCase().includes('cement') ||
            item.category.toLowerCase().includes('steel') ||
            item.category.toLowerCase().includes('sand') ||
            item.category.toLowerCase().includes('brick');
          if (!isMat) return false;
        } else if (selectedFilter === 'labour') {
          const isLab =
            item.category.toLowerCase().includes('labour') ||
            item.category.toLowerCase().includes('wage') ||
            item.category.toLowerCase().includes('mistri');
          if (!isLab) return false;
        } else if (selectedFilter === 'cash') {
          if (item.payment_mode !== 'Cash') return false;
        } else if (selectedFilter === 'online') {
          if (item.payment_mode === 'Cash') return false;
        }

        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase().trim();
          const matchTitle = item.title.toLowerCase().includes(term);
          const matchCategory = item.category.toLowerCase().includes(term);
          const matchPaidTo = (item.paid_to || '').toLowerCase().includes(term);
          const matchBill = (item.bill_number || '').toLowerCase().includes(term);
          if (!matchTitle && !matchCategory && !matchPaidTo && !matchBill) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, selectedFilter, searchTerm]);

  // Group expenses by Date for Physical Register feel
  const groupedExpenses = useMemo(() => {
    const groups: { [date: string]: Expense[] } = {};
    filteredExpenses.forEach((exp) => {
      if (!groups[exp.date]) {
        groups[exp.date] = [];
      }
      groups[exp.date].push(exp);
    });

    const dates = Object.keys(groups).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    return dates.map((date) => {
      const items = groups[date];
      const dayTotal = items.reduce((acc, curr) => acc + curr.amount, 0);
      return {
        date,
        items,
        dayTotal,
      };
    });
  }, [filteredExpenses]);

  // Generate WhatsApp summary text
  const whatsappSummaryText = useMemo(() => {
    const today = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const recentItems = expenses.slice(0, 7).map((e, idx) => {
      return `${idx + 1}. ${e.title} - ${formatCurrency(e.amount)} (${e.date})`;
    });

    return `🏡 *${projectConfig.name || 'घर का हिसाब'} - कुल खर्चा रिपोर्ट* 🏡\n🗓️ दिनांक: ${today}\n━━━━━━━━━━━━━━━━━━━━\n💰 *कुल खर्चा हुआ:* ${formatCurrency(totalSpent)}\n🧱 *सीमेंट/सामान:* ${formatCurrency(materialsSpent)}\n👷 *मजदूर/मिस्त्री:* ${formatCurrency(labourSpent)}\n🎯 *कुल बजट:* ${formatCurrency(overallBudgetTarget)}\n💵 *बचा हुआ पैसा:* ${formatCurrency(remainingBudget)}\n━━━━━━━━━━━━━━━━━━━━\n📋 *हाल के मुख्य खर्चे:*\n${recentItems.length > 0 ? recentItems.join('\n') : 'अभी कोई खर्चा नहीं लिखा'}\n━━━━━━━━━━━━━━━━━━━━\n✅ _GharHishob App द्वारा बनाया गया_`;
  }, [projectConfig, expenses, totalSpent, materialsSpent, labourSpent, overallBudgetTarget, remainingBudget]);

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(whatsappSummaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(whatsappSummaryText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-16">
      {/* 1. TOP STATUS & HOUSE BANNER */}
      <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-slate-900 p-4 sm:p-6 rounded-3xl border-2 border-emerald-500/50 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider">
              <span>🏡</span>
              <span>{projectConfig.name || (lang === 'hi' ? 'हमारा नया घर' : 'My House Ledger')}</span>
              <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded font-black">
                {lang === 'hi' ? 'हाथ का बही-खाता' : 'In-Hand Register'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {lang === 'hi' ? 'घर का आसान हिसाब-किताब' : 'House Expense Ledger'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {lang === 'hi'
                ? 'कागज के रजिस्टर की जगह मोबाइल में 3 सेकंड में खर्चा लिखें और मिस्त्री की हाजिरी लगाएं।'
                : 'Manage construction expenses, mason attendance, and material bills in hand.'}
            </p>
          </div>

          {/* Top Actions */}
          <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={() => setIsSetupModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold rounded-xl border border-emerald-500/40 shadow-sm transition-colors cursor-pointer"
              title="प्रोजेक्ट बदलें या नया खाता शुरू करें"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'hi' ? '🚀 नया असली खाता शुरू करें' : 'Setup Real Ledger'}</span>
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{lang === 'hi' ? 'WhatsApp भेजें' : 'WhatsApp'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. ULTRA-FAST 3-SECOND IN-HAND ENTRY BAR WITH VOICE INPUT */}
      <QuickAddInHandBar onAddExpense={onAddExpense} lang={lang} />

      {/* 3. 4 BIG, HIGH-CONTRAST STATS TILES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Tile 1: Kul Kharcha */}
        <div className="bg-[#1e293b] p-4 sm:p-5 rounded-2xl border-2 border-slate-700 hover:border-emerald-500/50 transition-all shadow-md">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xl sm:text-2xl">💰</span>
            <span className="text-[10px] sm:text-xs font-bold uppercase px-2 py-0.5 bg-emerald-500/15 text-emerald-400 rounded-md">
              {lang === 'hi' ? 'कुल खर्च' : 'Total'}
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-400">
            {lang === 'hi' ? 'अब तक कुल खर्च' : 'Total Spent'}
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5 tracking-tight truncate">
            {formatCurrency(totalSpent)}
          </h3>
          <p className="text-[11px] text-emerald-400 font-semibold mt-0.5 truncate">
            {formatRupeesInWords(Math.floor(totalSpent / 100), lang)}
          </p>
        </div>

        {/* Tile 2: Samaan / Materials */}
        <div className="bg-[#1e293b] p-4 sm:p-5 rounded-2xl border-2 border-slate-700 hover:border-blue-500/50 transition-all shadow-md">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xl sm:text-2xl">🧱</span>
            <span className="text-[10px] sm:text-xs font-bold uppercase px-2 py-0.5 bg-blue-500/15 text-blue-400 rounded-md">
              {lang === 'hi' ? 'सामान' : 'Materials'}
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-400">
            {lang === 'hi' ? 'सीमेंट, सरिया, ईंट' : 'Materials Stock'}
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5 tracking-tight truncate">
            {formatCurrency(materialsSpent)}
          </h3>
          <p className="text-[11px] text-blue-400 font-semibold mt-0.5 truncate">
            {formatRupeesInWords(Math.floor(materialsSpent / 100), lang)}
          </p>
        </div>

        {/* Tile 3: Majdoor / Labour */}
        <div className="bg-[#1e293b] p-4 sm:p-5 rounded-2xl border-2 border-slate-700 hover:border-purple-500/50 transition-all shadow-md">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xl sm:text-2xl">👷</span>
            <span className="text-[10px] sm:text-xs font-bold uppercase px-2 py-0.5 bg-purple-500/15 text-purple-400 rounded-md">
              {lang === 'hi' ? 'मजदूरी' : 'Labour'}
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-400">
            {lang === 'hi' ? 'मिस्त्री व लेबर दिहाड़ी' : 'Wages Paid'}
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5 tracking-tight truncate">
            {formatCurrency(labourSpent)}
          </h3>
          <p className="text-[11px] text-purple-400 font-semibold mt-0.5 truncate">
            {formatRupeesInWords(Math.floor(labourSpent / 100), lang)}
          </p>
        </div>

        {/* Tile 4: Bacha Hua Budget */}
        <div className="bg-[#1e293b] p-4 sm:p-5 rounded-2xl border-2 border-slate-700 hover:border-amber-500/50 transition-all shadow-md">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xl sm:text-2xl">🎯</span>
            <span className="text-[10px] sm:text-xs font-bold uppercase px-2 py-0.5 bg-amber-500/15 text-amber-400 rounded-md">
              {lang === 'hi' ? 'बचा पैसा' : 'Remaining'}
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-400">
            {lang === 'hi' ? 'बजट में से बाकी' : 'Left from Budget'}
          </p>
          <h3
            className={`text-xl sm:text-2xl font-black mt-0.5 tracking-tight truncate ${
              remainingBudget < 0 ? 'text-rose-400' : 'text-amber-300'
            }`}
          >
            {formatCurrency(remainingBudget)}
          </h3>
          <p className="text-[11px] text-slate-400 font-semibold mt-0.5 truncate">
            {remainingBudget < 0
              ? lang === 'hi'
                ? 'बजट से अधिक'
                : 'Over Budget'
              : formatRupeesInWords(Math.floor(remainingBudget / 100), lang)}
          </p>
        </div>
      </div>

      {/* 4. SUB-NAVIGATION TABS: DAILY REGISTER / LABOUR KHATA / SUPPLIER / SHARE */}
      <div className="flex items-center gap-2 bg-[#1e293b] p-2 rounded-2xl border-2 border-slate-700 overflow-x-auto scrollbar-none shadow-md">
        <button
          onClick={() => setSubTab('diary')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shrink-0 transition-all cursor-pointer ${
            subTab === 'diary'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span>📒</span>
          <span>{lang === 'hi' ? 'दैनिक डायरी (Daily Register)' : 'Daily Register'}</span>
          <span className="px-1.5 py-0.2 bg-slate-900/60 text-[10px] rounded font-mono">
            {expenses.length}
          </span>
        </button>

        <button
          onClick={() => setSubTab('labour')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shrink-0 transition-all cursor-pointer ${
            subTab === 'labour'
              ? 'bg-purple-500 text-slate-950 shadow-md font-black'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span>👷</span>
          <span>{lang === 'hi' ? 'मजदूर व मिस्त्री हाजिरी' : 'Labour Attendance'}</span>
          <span className="px-1.5 py-0.2 bg-slate-900/60 text-[10px] rounded font-mono">
            {labourers.length}
          </span>
        </button>

        <button
          onClick={() => setSubTab('materials')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shrink-0 transition-all cursor-pointer ${
            subTab === 'materials'
              ? 'bg-blue-500 text-slate-950 shadow-md font-black'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span>🧱</span>
          <span>{lang === 'hi' ? 'सामान व दुकानदार' : 'Materials & Stock'}</span>
          <span className="px-1.5 py-0.2 bg-slate-900/60 text-[10px] rounded font-mono">
            {materials.length}
          </span>
        </button>

        <button
          onClick={() => setIsShareModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shrink-0 text-slate-300 hover:text-white hover:bg-slate-800 ml-auto cursor-pointer"
        >
          <span>📲</span>
          <span>{lang === 'hi' ? 'WhatsApp पर्ची' : 'WhatsApp Slip'}</span>
        </button>
      </div>

      {/* 5. TAB VIEW 1: DAILY DIARY REGISTER (GROUPED BY DAY) */}
      {subTab === 'diary' && (
        <div className="space-y-4">
          {/* Search & Filter bar */}
          <div className="bg-[#1e293b] p-3.5 rounded-2xl border border-slate-700 flex flex-col sm:flex-row gap-2.5 items-center">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  lang === 'hi'
                    ? 'खर्चे में ढूंढें (सीमेंट, मिस्त्री, रेत, बिल)...'
                    : 'Search expenses (Cement, Mistri, Sand)...'
                }
                className="w-full pl-10 pr-9 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
              {[
                { id: 'all', label: lang === 'hi' ? 'सभी' : 'All' },
                { id: 'materials', label: '🧱 ' + (lang === 'hi' ? 'सामान' : 'Materials') },
                { id: 'labour', label: '👷 ' + (lang === 'hi' ? 'मजदूरी' : 'Labour') },
                { id: 'cash', label: '💵 ' + (lang === 'hi' ? 'कैश' : 'Cash') },
              ].map((flt) => (
                <button
                  key={flt.id}
                  onClick={() => setSelectedFilter(flt.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                    selectedFilter === flt.id
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
                  }`}
                >
                  {flt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grouped Day-by-Day List */}
          {groupedExpenses.length === 0 ? (
            <div className="bg-[#1e293b] p-8 sm:p-12 rounded-3xl border-2 border-slate-700 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center text-3xl mx-auto">
                📝
              </div>
              <h4 className="text-xl font-bold text-white">
                {lang === 'hi' ? 'रजिस्टर में कोई खर्चा नहीं है' : 'Register is Empty'}
              </h4>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                {lang === 'hi'
                  ? 'ऊपर दिए गए हरे बॉक्स में रुपये और सामान लिखें या माइक 🎙️ दबाकर बोलें और "खर्चा जोड़ें" दबाएं।'
                  : 'Use the quick entry bar above to log your first expense in seconds!'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {groupedExpenses.map((group) => {
                const isToday = group.date === todayStr;
                const formattedDate = formatDate(group.date);

                return (
                  <div
                    key={group.date}
                    className="bg-[#1e293b] rounded-3xl border-2 border-slate-700 overflow-hidden shadow-md"
                  >
                    {/* Day Group Header */}
                    <div className="p-3.5 sm:p-4 bg-slate-900/90 border-b border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-400" />
                        <span className="font-extrabold text-white text-sm sm:text-base">
                          {isToday
                            ? lang === 'hi'
                              ? `🌟 आज (Today) - ${formattedDate}`
                              : `🌟 Today - ${formattedDate}`
                            : formattedDate}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          ({group.items.length} {lang === 'hi' ? 'खर्चे' : 'items'})
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400 mr-2">
                          {lang === 'hi' ? 'दिन का कुल:' : 'Day Total:'}
                        </span>
                        <strong className="text-sm sm:text-base font-black text-emerald-400">
                          {formatCurrency(group.dayTotal)}
                        </strong>
                      </div>
                    </div>

                    {/* Day Rows */}
                    <div className="divide-y divide-slate-800">
                      {group.items.map((exp) => {
                        const badge = getCategoryBadge(exp.category);
                        const rupeeVal = Math.floor(exp.amount / 100);

                        return (
                          <div
                            key={exp.id}
                            className="p-3.5 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-slate-800/60 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-2xl mt-0.5">{badge.icon}</span>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h5 className="font-bold text-white text-base">{exp.title}</h5>
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${badge.bg}`}
                                  >
                                    {exp.category}
                                  </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-1">
                                  {exp.paid_to && (
                                    <span>
                                      {lang === 'hi' ? 'किसको दिया:' : 'To:'}{' '}
                                      <strong className="text-slate-200">{exp.paid_to}</strong>
                                    </span>
                                  )}
                                  <span>
                                    {exp.payment_mode === 'Cash' ? '💵 नकद' : `📱 ${exp.payment_mode}`}
                                  </span>
                                  {exp.bill_number && (
                                    <span className="font-mono bg-slate-900 px-1.5 py-0.2 rounded border border-slate-700 text-slate-300">
                                      #{exp.bill_number}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Right side: Amount & Quick edit/delete */}
                            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                              <div className="text-left sm:text-right">
                                <p className="text-lg sm:text-xl font-black text-emerald-400">
                                  {formatCurrency(exp.amount)}
                                </p>
                                <p className="text-[10px] text-slate-400 font-semibold">
                                  {formatRupeesInWords(rupeeVal, lang)}
                                </p>
                              </div>

                              <div className="flex items-center gap-1 mt-1.5">
                                <button
                                  onClick={() => onEditExpense(exp)}
                                  className="p-1.5 text-slate-400 hover:text-emerald-300 hover:bg-slate-800 rounded-lg"
                                  title="बदलाव करें"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => onDeleteExpense(exp.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg"
                                  title="हटाएं"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 6. TAB VIEW 2: LABOUR & MISTRI ATTENDANCE ROSTER */}
      {subTab === 'labour' && (
        <div className="space-y-4">
          <div className="bg-[#1e293b] p-4 sm:p-5 rounded-3xl border-2 border-purple-500/40 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>👷</span>
                <span>{lang === 'hi' ? 'मजदूर व मिस्त्री हाजिरी बही' : 'Labour Attendance Roster'}</span>
              </h3>
              <p className="text-xs text-slate-300">
                {lang === 'hi'
                  ? 'आज की तारीख में हाजिरी (उपस्थित / आधा दिन / छुट्टी) लगाएं और सीधे पैसे दें।'
                  : 'Mark daily presence, track daily wages, and record wage payouts.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAddLabourer}
                className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'hi' ? '+ नया मजदूर जोड़ें' : '+ Add Worker'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {labourers.map((lab) => {
              const wageRupees = Math.floor(lab.daily_wage / 100);
              const paidRupees = Math.floor(lab.total_paid / 100);

              // Check today attendance status
              const record = attendanceRecords.find(
                (r) => r.labourer_id === lab.id && r.date === todayStr
              );
              const currentStatus = record ? record.status : 'absent';

              return (
                <div
                  key={lab.id}
                  className="bg-[#1e293b] p-4 sm:p-5 rounded-3xl border-2 border-slate-700 hover:border-purple-500/60 transition-all shadow-md space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-500/20 text-purple-300 rounded-2xl flex items-center justify-center text-2xl font-bold">
                        👷
                      </div>
                      <div>
                        <h4 className="font-extrabold text-white text-base sm:text-lg">
                          {lab.name}
                        </h4>
                        <span className="text-xs font-bold px-2 py-0.5 bg-purple-950 text-purple-300 rounded-md border border-purple-800">
                          {lab.role}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-400">{lang === 'hi' ? 'दिहाड़ी (Wage)' : 'Daily'}</p>
                      <p className="text-base font-black text-emerald-400">
                        ₹{wageRupees} / {lang === 'hi' ? 'दिन' : 'day'}
                      </p>
                    </div>
                  </div>

                  {/* Today's 1-Tap Attendance Buttons */}
                  <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300">
                        {lang === 'hi' ? '🌟 आज की हाजिरी (Today Attendance):' : 'Today Attendance:'}
                      </span>
                      <span className="text-[11px] text-slate-400">{todayStr}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => onToggleAttendance(lab.id, todayStr, 'present')}
                        className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                          currentStatus === 'present'
                            ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{lang === 'hi' ? 'उपस्थित (Full)' : 'Present'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleAttendance(lab.id, todayStr, 'half')}
                        className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                          currentStatus === 'half'
                            ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <span>🌗</span>
                        <span>{lang === 'hi' ? 'आधा दिन' : 'Half Day'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleAttendance(lab.id, todayStr, 'absent')}
                        className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                          currentStatus === 'absent'
                            ? 'bg-rose-500 text-white shadow-md font-black'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        <UserX className="w-3.5 h-3.5" />
                        <span>{lang === 'hi' ? 'छुट्टी' : 'Absent'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Financial Payout Summary & Button */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400">{lang === 'hi' ? 'कुल दिया:' : 'Total Paid:'}</span>{' '}
                      <strong className="text-white">₹{paidRupees}</strong>
                    </div>

                    <button
                      onClick={() => onOpenPayoutLabour(lab)}
                      className="px-3 py-1.5 bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center gap-1 active:scale-95"
                    >
                      <Wallet className="w-3.5 h-3.5" />
                      <span>{lang === 'hi' ? 'पैसे दें (Pay)' : 'Pay Wages'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. TAB VIEW 3: MATERIALS & DUKANDAR STOCK */}
      {subTab === 'materials' && (
        <div className="space-y-4">
          <div className="bg-[#1e293b] p-4 sm:p-5 rounded-3xl border-2 border-blue-500/40 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>🧱</span>
                <span>{lang === 'hi' ? 'सामान व सप्लायर स्टॉक' : 'Materials & Supplier Stock'}</span>
              </h3>
              <p className="text-xs text-slate-300">
                {lang === 'hi'
                  ? 'सीमेंट, सरिया, ईंट, रेत का स्टॉक और कुल खर्च।'
                  : 'Track material stocks and purchase logs.'}
              </p>
            </div>

            <button
              onClick={() => onOpenLogMaterial()}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'hi' ? '+ सामान की पर्ची लिखें' : '+ Log Purchase'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {materials.map((mat) => {
              const spentRupees = Math.floor(mat.total_spent / 100);

              return (
                <div
                  key={mat.id}
                  className="bg-[#1e293b] p-4 sm:p-5 rounded-3xl border-2 border-slate-700 hover:border-blue-500/60 transition-all shadow-md space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-xs font-bold px-2 py-0.5 bg-blue-950 text-blue-300 rounded border border-blue-800">
                        {mat.category}
                      </span>
                      <h4 className="font-bold text-white text-base">{mat.name}</h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-900/90 p-3 rounded-2xl border border-slate-800 text-xs">
                    <div>
                      <p className="text-slate-400">{lang === 'hi' ? 'मौजूदा स्टॉक:' : 'Stock:'}</p>
                      <p className="text-base font-black text-emerald-400">
                        {mat.current_stock} {mat.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">{lang === 'hi' ? 'कुल मंगवाया:' : 'Total:'}</p>
                      <p className="text-base font-bold text-white">
                        {mat.total_purchased} {mat.unit}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400">{lang === 'hi' ? 'कुल खर्च:' : 'Spent:'}</span>{' '}
                      <strong className="text-white">₹{spentRupees}</strong>
                    </div>

                    <button
                      onClick={() => onOpenLogMaterial(mat)}
                      className="px-3 py-1.5 bg-blue-500 hover:bg-blue-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md active:scale-95"
                    >
                      {lang === 'hi' ? '+ नया माल' : '+ Add Stock'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WHATSAPP SHARE MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#1e293b] border-2 border-emerald-500/50 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-5 bg-gradient-to-r from-emerald-950 to-slate-900 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-2xl text-slate-950 font-bold">
                  📲
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">
                    {lang === 'hi' ? 'व्हाट्सएप पर हिसाब भेजें' : 'Share Hisab on WhatsApp'}
                  </h3>
                  <p className="text-xs text-emerald-300">
                    {lang === 'hi' ? 'परिवार या ठेकेदार को तुरंत रिपोर्ट भेजें' : 'Send instant ledger summary'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                {whatsappSummaryText}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCopyWhatsApp}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl border border-slate-600 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>
                    {copied
                      ? lang === 'hi'
                        ? 'कॉपी हो गया!'
                        : 'Copied!'
                      : lang === 'hi'
                      ? 'टेक्स्ट कॉपी करें'
                      : 'Copy Text'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl transition-colors shadow-md cursor-pointer"
                >
                  <span>📲</span>
                  <span>{lang === 'hi' ? 'WhatsApp खोलें' : 'Open WhatsApp'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REAL PROJECT SETUP MODAL */}
      <RealProjectSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        currentProjectName={projectConfig.name}
        currentBudgetRupees={overallBudgetTarget}
        onStartFreshRealProject={onStartFreshRealProject}
        onLoadDemoData={onLoadDemoData}
        lang={lang}
      />
    </div>
  );
};
