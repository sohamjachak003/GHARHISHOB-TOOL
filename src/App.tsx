import React, { useState, useEffect, useMemo } from 'react';
import {
  Expense,
  Labourer,
  LabourPayment,
  Material,
  MaterialPurchase,
  Budget,
  ActiveTab,
  AttendanceRecord,
  ProjectConfig,
} from './types';
import {
  INITIAL_EXPENSES,
  INITIAL_LABOURERS,
  INITIAL_LABOUR_PAYMENTS,
  INITIAL_MATERIALS,
  INITIAL_MATERIAL_PURCHASES,
  INITIAL_BUDGETS,
} from './data/initialData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { DashboardView } from './components/DashboardView';
import { ExpensesView } from './components/ExpensesView';
import { LabourView } from './components/LabourView';
import { MaterialsView } from './components/MaterialsView';
import { BudgetsView } from './components/BudgetsView';
import { ReportsView } from './components/ReportsView';
import { ExportView } from './components/ExportView';
import { SettingsView } from './components/SettingsView';
import { AddExpenseModal } from './components/AddExpenseModal';
import { AddLabourPaymentModal } from './components/AddLabourPaymentModal';
import { AddLabourerModal } from './components/AddLabourerModal';
import { AddMaterialPurchaseModal } from './components/AddMaterialPurchaseModal';
import { AddMaterialModal } from './components/AddMaterialModal';
import { AddBudgetModal } from './components/AddBudgetModal';
import { SimpleFatherView } from './components/SimpleFatherView';
import { ToastContainer, ToastMessage } from './components/Toast';

export default function App() {
  // State from LocalStorage or Initial Data
  const [viewMode, setViewMode] = useState<'simple' | 'detailed'>(() => {
    const saved = localStorage.getItem('gharhishob_view_mode');
    return saved ? (saved as 'simple' | 'detailed') : 'simple';
  });

  const [lang, setLang] = useState<'hi' | 'en'>(() => {
    const saved = localStorage.getItem('gharhishob_lang');
    return saved ? (saved as 'hi' | 'en') : 'hi';
  });

  const [projectConfig, setProjectConfig] = useState<ProjectConfig>(() => {
    const saved = localStorage.getItem('gharhishob_project_config');
    return saved
      ? JSON.parse(saved)
      : {
          name: 'हमारा नया घर',
          supervisor: 'पापा',
          targetBudgetPaisa: 250000000,
          startDate: '2024-01-01',
          isRealMode: true,
        };
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('gharhishob_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [labourers, setLabourers] = useState<Labourer[]>(() => {
    const saved = localStorage.getItem('gharhishob_labourers');
    return saved ? JSON.parse(saved) : INITIAL_LABOURERS;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('gharhishob_attendance');
    return saved ? JSON.parse(saved) : [];
  });

  const [labourPayments, setLabourPayments] = useState<LabourPayment[]>(() => {
    const saved = localStorage.getItem('gharhishob_labour_payments');
    return saved ? JSON.parse(saved) : INITIAL_LABOUR_PAYMENTS;
  });

  const [materials, setMaterials] = useState<Material[]>(() => {
    const saved = localStorage.getItem('gharhishob_materials');
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
  });

  const [materialPurchases, setMaterialPurchases] = useState<MaterialPurchase[]>(() => {
    const saved = localStorage.getItem('gharhishob_material_purchases');
    return saved ? JSON.parse(saved) : INITIAL_MATERIAL_PURCHASES;
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('gharhishob_budgets');
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  // UI state
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals state
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);

  const [isAddLabourPaymentOpen, setIsAddLabourPaymentOpen] = useState(false);
  const [selectedLabourerForPayment, setSelectedLabourerForPayment] = useState<Labourer | null>(null);

  const [isAddLabourerOpen, setIsAddLabourerOpen] = useState(false);

  const [isAddMaterialPurchaseOpen, setIsAddMaterialPurchaseOpen] = useState(false);
  const [selectedMaterialForPurchase, setSelectedMaterialForPurchase] = useState<Material | null>(null);

  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('gharhishob_view_mode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('gharhishob_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('gharhishob_project_config', JSON.stringify(projectConfig));
  }, [projectConfig]);

  useEffect(() => {
    localStorage.setItem('gharhishob_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('gharhishob_labourers', JSON.stringify(labourers));
  }, [labourers]);

  useEffect(() => {
    localStorage.setItem('gharhishob_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('gharhishob_labour_payments', JSON.stringify(labourPayments));
  }, [labourPayments]);

  useEffect(() => {
    localStorage.setItem('gharhishob_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('gharhishob_material_purchases', JSON.stringify(materialPurchases));
  }, [materialPurchases]);

  useEffect(() => {
    localStorage.setItem('gharhishob_budgets', JSON.stringify(budgets));
  }, [budgets]);

  // Toast notifier helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const newToast: ToastMessage = {
      id: Date.now().toString(),
      type,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Calculations
  const totalSpent = useMemo(() => {
    return expenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses]);

  const constructionSpent = useMemo(() => {
    return expenses
      .filter((e) => e.expense_type === 'construction' || !e.expense_type)
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses]);

  const labourSpent = useMemo(() => {
    return expenses
      .filter(
        (e) =>
          e.category.toLowerCase().includes('labour') ||
          e.category.toLowerCase().includes('wage') ||
          e.category.toLowerCase().includes('mistri')
      )
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses]);

  const materialsSpent = useMemo(() => {
    return expenses
      .filter(
        (e) =>
          e.category.toLowerCase().includes('material') ||
          e.category.toLowerCase().includes('cement') ||
          e.category.toLowerCase().includes('steel') ||
          e.category.toLowerCase().includes('sand') ||
          e.category.toLowerCase().includes('brick')
      )
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses]);

  // Total Planned Budget Target
  const overallBudgetTarget = useMemo(() => {
    if (projectConfig.targetBudgetPaisa && projectConfig.targetBudgetPaisa > 0) {
      return projectConfig.targetBudgetPaisa;
    }
    const overall = budgets.find((b) => b.budget_type === 'overall');
    if (overall) return overall.total_amount;
    return 250000000; // Rs 25,00,000 default target
  }, [projectConfig, budgets]);

  const remainingBudget = overallBudgetTarget - totalSpent;

  // Expense Handlers
  const handleSaveExpense = (expenseData: Omit<Expense, 'id'> | Expense) => {
    if ('id' in expenseData && expenseData.id) {
      // Edit existing
      setExpenses((prev) =>
        prev.map((item) => (item.id === expenseData.id ? (expenseData as Expense) : item))
      );
      showToast(lang === 'hi' ? 'खर्चा अपडेट हो गया!' : 'Expense updated successfully');
    } else {
      // Create new
      const newId = expenses.length > 0 ? Math.max(...expenses.map((e) => e.id)) + 1 : 1;
      const newExpense: Expense = {
        ...expenseData,
        id: newId,
        created_at: new Date().toISOString(),
      };
      setExpenses((prev) => [newExpense, ...prev]);
      showToast(lang === 'hi' ? 'नया खर्चा दर्ज हो गया!' : 'New expense recorded successfully');
    }
  };

  const handleDeleteExpense = (id: number) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    showToast(lang === 'hi' ? 'खर्चा हटा दिया गया' : 'Expense removed from ledger', 'info');
  };

  // Labour Handlers
  const handleSaveLabourPayment = (paymentData: Omit<LabourPayment, 'id'>) => {
    const newId = labourPayments.length > 0 ? Math.max(...labourPayments.map((p) => p.id)) + 1 : 1;
    const newPayment: LabourPayment = {
      ...paymentData,
      id: newId,
    };
    setLabourPayments((prev) => [newPayment, ...prev]);

    // Update labourer's total paid
    setLabourers((prev) =>
      prev.map((l) =>
        l.id === paymentData.labourer_id ? { ...l, total_paid: l.total_paid + paymentData.amount } : l
      )
    );

    // Also automatically log into expenses for financial synchronization!
    const newExpenseId = expenses.length > 0 ? Math.max(...expenses.map((e) => e.id)) + 1 : 1;
    const syncedExpense: Expense = {
      id: newExpenseId,
      title: `Wage Payment - ${paymentData.labourer_name} (${paymentData.days_worked || 1} day)`,
      category: 'Labour',
      expense_type: 'construction',
      amount: paymentData.amount,
      date: paymentData.date,
      payment_mode: paymentData.payment_mode,
      paid_to: paymentData.labourer_name,
      notes: paymentData.notes || `Daily wage for ${paymentData.labourer_name}`,
    };
    setExpenses((prev) => [syncedExpense, ...prev]);

    showToast(
      lang === 'hi'
        ? `₹${Math.floor(paymentData.amount / 100)} मजदूरी दर्ज हो गई`
        : `Labour payment of ₹${Math.floor(paymentData.amount / 100)} recorded`
    );
  };

  const handleDeleteLabourPayment = (id: number) => {
    const pmt = labourPayments.find((p) => p.id === id);
    if (pmt) {
      setLabourers((prev) =>
        prev.map((l) =>
          l.id === pmt.labourer_id ? { ...l, total_paid: Math.max(0, l.total_paid - pmt.amount) } : l
        )
      );
    }
    setLabourPayments((prev) => prev.filter((p) => p.id !== id));
    showToast(lang === 'hi' ? 'मजदूरी पर्ची हटाई गई' : 'Labour payment deleted', 'info');
  };

  const handleAddLabourer = (newLab: Omit<Labourer, 'id' | 'total_paid'>) => {
    const newId = labourers.length > 0 ? Math.max(...labourers.map((l) => l.id)) + 1 : 1;
    const labourerObj: Labourer = {
      ...newLab,
      id: newId,
      total_paid: 0,
    };
    setLabourers((prev) => [...prev, labourerObj]);
    showToast(
      lang === 'hi'
        ? `नया मजदूर/मिस्त्री "${newLab.name}" जुड़ गया`
        : `Added worker "${newLab.name}"`
    );
  };

  const handleToggleAttendance = (
    labourerId: number,
    date: string,
    status: 'present' | 'half' | 'absent'
  ) => {
    const id = `${labourerId}_${date}`;
    setAttendanceRecords((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      return [...filtered, { id, labourer_id: labourerId, date, status }];
    });

    const statusText =
      status === 'present'
        ? lang === 'hi'
          ? 'उपस्थित (Full Day)'
          : 'Present'
        : status === 'half'
        ? lang === 'hi'
          ? 'आधा दिन (Half Day)'
          : 'Half Day'
        : lang === 'hi'
        ? 'छुट्टी (Absent)'
        : 'Absent';

    showToast(`हाजिरी लगाई: ${statusText}`);
  };

  // Material Handlers
  const handleSaveMaterialPurchase = (purchaseData: Omit<MaterialPurchase, 'id'>) => {
    const newId =
      materialPurchases.length > 0 ? Math.max(...materialPurchases.map((p) => p.id)) + 1 : 1;
    const newPurchase: MaterialPurchase = {
      ...purchaseData,
      id: newId,
    };
    setMaterialPurchases((prev) => [newPurchase, ...prev]);

    // Update material stock & total spent
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === purchaseData.material_id
          ? {
              ...m,
              current_stock: m.current_stock + purchaseData.quantity,
              total_purchased: m.total_purchased + purchaseData.quantity,
              total_spent: m.total_spent + purchaseData.total_amount,
            }
          : m
      )
    );

    // Sync to expenses
    const newExpenseId = expenses.length > 0 ? Math.max(...expenses.map((e) => e.id)) + 1 : 1;
    const syncedExpense: Expense = {
      id: newExpenseId,
      title: `${purchaseData.quantity} ${purchaseData.unit} ${purchaseData.material_name}`,
      category: 'Materials',
      expense_type: 'construction',
      amount: purchaseData.total_amount,
      date: purchaseData.date,
      payment_mode: purchaseData.payment_mode,
      paid_to: purchaseData.supplier,
      bill_number: purchaseData.bill_number,
      notes: purchaseData.notes,
    };
    setExpenses((prev) => [syncedExpense, ...prev]);

    showToast(
      lang === 'hi'
        ? `${purchaseData.quantity} ${purchaseData.unit} ${purchaseData.material_name} स्टॉक में जुड़ गया`
        : `Logged purchase of ${purchaseData.quantity} ${purchaseData.unit} ${purchaseData.material_name}`
    );
  };

  const handleDeleteMaterialPurchase = (id: number) => {
    const purchase = materialPurchases.find((p) => p.id === id);
    if (purchase) {
      setMaterials((prev) =>
        prev.map((m) =>
          m.id === purchase.material_id
            ? {
                ...m,
                current_stock: Math.max(0, m.current_stock - purchase.quantity),
                total_purchased: Math.max(0, m.total_purchased - purchase.quantity),
                total_spent: Math.max(0, m.total_spent - purchase.total_amount),
              }
            : m
        )
      );
    }
    setMaterialPurchases((prev) => prev.filter((p) => p.id !== id));
    showToast(lang === 'hi' ? 'सामान की खरीद पर्ची हटाई गई' : 'Material purchase removed', 'info');
  };

  const handleAddMaterial = (newMat: Omit<Material, 'id' | 'total_spent'>) => {
    const newId = materials.length > 0 ? Math.max(...materials.map((m) => m.id)) + 1 : 1;
    const materialObj: Material = {
      ...newMat,
      id: newId,
      total_spent: 0,
    };
    setMaterials((prev) => [...prev, materialObj]);
    showToast(
      lang === 'hi'
        ? `नया सामान "${newMat.name}" कैटलॉग में जुड़ गया`
        : `Added material item "${newMat.name}"`
    );
  };

  // Budget Handlers
  const handleAddBudget = (newBud: Omit<Budget, 'id' | 'spent'>) => {
    const newId = budgets.length > 0 ? Math.max(...budgets.map((b) => b.id)) + 1 : 1;
    const budgetObj: Budget = {
      ...newBud,
      id: newId,
      spent: 0,
    };
    setBudgets((prev) => [...prev, budgetObj]);
    showToast(lang === 'hi' ? 'नया बजट लक्ष्य सेट हो गया' : 'Budget target added');
  };

  const handleDeleteBudget = (id: number) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
    showToast('Budget cap removed', 'info');
  };

  // Real Project Initializer (Wipes demo mock data and starts a real ledger)
  const handleStartFreshRealProject = (name: string, budgetPaisa: number) => {
    const cleanProject: ProjectConfig = {
      name: name || 'हमारा नया घर',
      supervisor: 'पापा',
      targetBudgetPaisa: budgetPaisa || 250000000,
      startDate: new Date().toISOString().split('T')[0],
      isRealMode: true,
    };

    const cleanBudgets: Budget[] = [
      {
        id: 1,
        name: 'Overall Construction Budget',
        category: 'All',
        budget_type: 'overall',
        total_amount: budgetPaisa || 250000000,
        spent: 0,
      },
    ];

    setExpenses([]);
    setLabourPayments([]);
    setMaterialPurchases([]);
    setAttendanceRecords([]);
    setProjectConfig(cleanProject);
    setBudgets(cleanBudgets);

    localStorage.setItem('gharhishob_expenses', JSON.stringify([]));
    localStorage.setItem('gharhishob_labour_payments', JSON.stringify([]));
    localStorage.setItem('gharhishob_material_purchases', JSON.stringify([]));
    localStorage.setItem('gharhishob_attendance', JSON.stringify([]));
    localStorage.setItem('gharhishob_project_config', JSON.stringify(cleanProject));
    localStorage.setItem('gharhishob_budgets', JSON.stringify(cleanBudgets));

    showToast(
      lang === 'hi'
        ? `🎉 नया असली खाता "${cleanProject.name}" तैयार है!`
        : `🎉 Real project "${cleanProject.name}" initialized!`,
      'success'
    );
  };

  // Reset to Demo Data
  const handleResetToDemoData = () => {
    setExpenses(INITIAL_EXPENSES);
    setLabourers(INITIAL_LABOURERS);
    setLabourPayments(INITIAL_LABOUR_PAYMENTS);
    setMaterials(INITIAL_MATERIALS);
    setMaterialPurchases(INITIAL_MATERIAL_PURCHASES);
    setBudgets(INITIAL_BUDGETS);
    setAttendanceRecords([]);
    setProjectConfig({
      name: 'Dream Home Construction',
      supervisor: 'पापा',
      targetBudgetPaisa: 380000000,
      startDate: '2024-01-01',
      isRealMode: false,
    });
    localStorage.clear();
    showToast(
      lang === 'hi' ? 'डेमो डेटा लोड हो गया' : 'Sample construction demo data loaded',
      'info'
    );
  };

  // Toggle handlers
  const handleToggleViewMode = () => {
    setViewMode((prev) => (prev === 'simple' ? 'detailed' : 'simple'));
    showToast(
      viewMode === 'simple'
        ? lang === 'hi'
          ? 'विस्तृत मोड चालू हो गया'
          : 'Switched to Detailed Mode'
        : lang === 'hi'
        ? 'सरल मोड (Father Mode) चालू हो गया'
        : 'Switched to Simple Easy Mode',
      'info'
    );
  };

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'hi' ? 'en' : 'hi'));
  };

  // View title helper
  const getTabTitle = () => {
    if (lang === 'hi') {
      switch (activeTab) {
        case 'dashboard':
          return '🏡 घर का कुल हिसाब';
        case 'construction':
          return '🏗️ निर्माण खर्च खाता';
        case 'expenses':
          return '📝 सभी खर्चे की पर्चियां';
        case 'labour':
          return '👷 मजदूर और मिस्त्री हाजिरी';
        case 'materials':
          return '🧱 सामान व बिल पर्ची';
        case 'reports':
          return '📈 खर्चा रिपोर्ट व चार्ट';
        case 'budgets':
          return '🎯 बजट और सीमा';
        case 'export':
          return '📥 बैकअप व व्हाट्सएप शेयर';
        case 'settings':
          return '⚙️ प्रोजेक्ट सेटिंग्स';
        default:
          return '🏡 घर का हिसाब';
      }
    }
    switch (activeTab) {
      case 'dashboard':
        return 'Home Ledger Overview';
      case 'construction':
        return 'Construction Ledger';
      case 'expenses':
        return 'All Expense Records';
      case 'labour':
        return 'Labour & Wages';
      case 'materials':
        return 'Materials & Invoices';
      case 'reports':
        return 'Financial Reports';
      case 'budgets':
        return 'Phase Budgets';
      case 'export':
        return 'Export & Data Backup';
      case 'settings':
        return 'Project Settings';
      default:
        return 'Home Ledger Overview';
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans flex overflow-x-hidden antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        viewMode={viewMode}
        onToggleViewMode={handleToggleViewMode}
        isOpenMobile={isMobileNavOpen}
        setIsOpenMobile={setIsMobileNavOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Header */}
        <Header
          title={getTabTitle()}
          totalSpent={totalSpent}
          viewMode={viewMode}
          onToggleViewMode={handleToggleViewMode}
          lang={lang}
          onToggleLang={handleToggleLang}
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          onQuickAddExpense={() => {
            setExpenseToEdit(null);
            setIsAddExpenseOpen(true);
          }}
        />

        {/* Dynamic Body */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Top 4 Summary Cards (Visible in detailed mode across key operational tabs) */}
          {viewMode === 'detailed' && (
            <StatsCards
              constructionSpent={constructionSpent}
              labourSpent={labourSpent}
              materialsSpent={materialsSpent}
              remainingBudget={remainingBudget}
              onCardClick={(type) => {
                if (type === 'construction') setActiveTab('construction');
                else if (type === 'labour') setActiveTab('labour');
                else if (type === 'materials') setActiveTab('materials');
                else if (type === 'budgets') setActiveTab('budgets');
              }}
            />
          )}

          {/* Active Tab View Rendering */}
          {activeTab === 'dashboard' &&
            (viewMode === 'simple' ? (
              <SimpleFatherView
                expenses={expenses}
                budgets={budgets}
                labourers={labourers}
                materials={materials}
                attendanceRecords={attendanceRecords}
                projectConfig={projectConfig}
                lang={lang}
                onAddExpense={handleSaveExpense}
                onEditExpense={(exp) => {
                  setExpenseToEdit(exp);
                  setIsAddExpenseOpen(true);
                }}
                onDeleteExpense={handleDeleteExpense}
                onOpenPayoutLabour={(labourer) => {
                  setSelectedLabourerForPayment(labourer || null);
                  setIsAddLabourPaymentOpen(true);
                }}
                onOpenLogMaterial={(material) => {
                  setSelectedMaterialForPurchase(material || null);
                  setIsAddMaterialPurchaseOpen(true);
                }}
                onOpenAddLabourer={() => setIsAddLabourerOpen(true)}
                onToggleAttendance={handleToggleAttendance}
                onStartFreshRealProject={handleStartFreshRealProject}
                onLoadDemoData={handleResetToDemoData}
                onSwitchToDetailed={() => setViewMode('detailed')}
              />
            ) : (
              <DashboardView
                expenses={expenses}
                budgets={budgets}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenAddExpense={() => {
                  setExpenseToEdit(null);
                  setIsAddExpenseOpen(true);
                }}
                onOpenLogMaterial={() => {
                  setSelectedMaterialForPurchase(null);
                  setIsAddMaterialPurchaseOpen(true);
                }}
                onOpenPayoutLabour={() => {
                  setSelectedLabourerForPayment(null);
                  setIsAddLabourPaymentOpen(true);
                }}
                onSelectExpense={(exp) => {
                  setExpenseToEdit(exp);
                  setIsAddExpenseOpen(true);
                }}
              />
            ))}

          {activeTab === 'construction' && (
            <ExpensesView
              expenses={expenses}
              onAddExpense={() => {
                setExpenseToEdit(null);
                setIsAddExpenseOpen(true);
              }}
              onEditExpense={(exp) => {
                setExpenseToEdit(exp);
                setIsAddExpenseOpen(true);
              }}
              onDeleteExpense={handleDeleteExpense}
              defaultTypeFilter="construction"
            />
          )}

          {activeTab === 'expenses' && (
            <ExpensesView
              expenses={expenses}
              onAddExpense={() => {
                setExpenseToEdit(null);
                setIsAddExpenseOpen(true);
              }}
              onEditExpense={(exp) => {
                setExpenseToEdit(exp);
                setIsAddExpenseOpen(true);
              }}
              onDeleteExpense={handleDeleteExpense}
              defaultTypeFilter="all"
            />
          )}

          {activeTab === 'labour' && (
            <LabourView
              labourers={labourers}
              payments={labourPayments}
              onAddLabourer={() => setIsAddLabourerOpen(true)}
              onRecordPayment={(labourer) => {
                setSelectedLabourerForPayment(labourer || null);
                setIsAddLabourPaymentOpen(true);
              }}
              onDeletePayment={handleDeleteLabourPayment}
            />
          )}

          {activeTab === 'materials' && (
            <MaterialsView
              materials={materials}
              purchases={materialPurchases}
              onAddMaterial={() => setIsAddMaterialOpen(true)}
              onLogPurchase={(mat) => {
                setSelectedMaterialForPurchase(mat || null);
                setIsAddMaterialPurchaseOpen(true);
              }}
              onDeletePurchase={handleDeleteMaterialPurchase}
            />
          )}

          {activeTab === 'budgets' && (
            <BudgetsView
              budgets={budgets}
              onAddBudget={() => setIsAddBudgetOpen(true)}
              onDeleteBudget={handleDeleteBudget}
            />
          )}

          {activeTab === 'reports' && <ReportsView expenses={expenses} />}

          {activeTab === 'export' && (
            <ExportView
              expenses={expenses}
              labourers={labourers}
              labourPayments={labourPayments}
              materials={materials}
              materialPurchases={materialPurchases}
              budgets={budgets}
              onResetToDemoData={handleResetToDemoData}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              projectConfig={projectConfig}
              onUpdateProjectConfig={(cfg) => {
                setProjectConfig(cfg);
                showToast(lang === 'hi' ? 'प्रोजेक्ट सेटिंग्स सेव हो गई!' : 'Project settings saved!');
              }}
              onStartFreshRealProject={handleStartFreshRealProject}
              onLoadDemoData={handleResetToDemoData}
              lang={lang}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => {
          setIsAddExpenseOpen(false);
          setExpenseToEdit(null);
        }}
        onSave={handleSaveExpense}
        expenseToEdit={expenseToEdit}
        lang={lang}
      />

      <AddLabourPaymentModal
        isOpen={isAddLabourPaymentOpen}
        onClose={() => {
          setIsAddLabourPaymentOpen(false);
          setSelectedLabourerForPayment(null);
        }}
        onSave={handleSaveLabourPayment}
        labourers={labourers}
        defaultLabourer={selectedLabourerForPayment}
      />

      <AddLabourerModal
        isOpen={isAddLabourerOpen}
        onClose={() => setIsAddLabourerOpen(false)}
        onSave={handleAddLabourer}
      />

      <AddMaterialPurchaseModal
        isOpen={isAddMaterialPurchaseOpen}
        onClose={() => {
          setIsAddMaterialPurchaseOpen(false);
          setSelectedMaterialForPurchase(null);
        }}
        onSave={handleSaveMaterialPurchase}
        materials={materials}
        defaultMaterial={selectedMaterialForPurchase}
      />

      <AddMaterialModal
        isOpen={isAddMaterialOpen}
        onClose={() => setIsAddMaterialOpen(false)}
        onSave={handleAddMaterial}
      />

      <AddBudgetModal
        isOpen={isAddBudgetOpen}
        onClose={() => setIsAddBudgetOpen(false)}
        onSave={handleAddBudget}
      />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
