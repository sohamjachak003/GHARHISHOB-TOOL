/**
 * GharHishob - Main Application Bootstrap
 * Connects all routes, controllers, and starts the hash-based Single Page App router
 */

document.addEventListener('DOMContentLoaded', () => {
    // Define all application routes matching views and controllers
    const routes = [
        { 
            path: '/login', 
            view: () => (window.Auth && Auth.renderLoginPage ? Auth.renderLoginPage() : '<div class="p-8 text-center">Loading Login...</div>'), 
            controller: () => (window.Auth && Auth.initLoginPage ? Auth.initLoginPage() : null), 
            layout: false 
        },
        { 
            path: '/dashboard', 
            view: () => (window.DashboardPage ? DashboardPage.view() : '<div class="p-8">Loading Dashboard...</div>'), 
            controller: () => (window.DashboardPage ? DashboardPage.controller() : null) 
        },
        { 
            path: '/construction', 
            view: () => (window.ConstructionPage ? ConstructionPage.view() : '<div class="p-8">Loading Construction Overview...</div>'), 
            controller: () => (window.ConstructionPage ? ConstructionPage.controller() : null) 
        },
        { 
            path: '/expenses/add', 
            view: () => (window.ExpensesPage && ExpensesPage.addView ? ExpensesPage.addView() : '<div class="p-8">Loading Form...</div>'), 
            controller: () => (window.ExpensesPage && ExpensesPage.initAddForm ? ExpensesPage.initAddForm() : null) 
        },
        { 
            path: '/expenses/history', 
            view: () => (window.ExpensesPage && ExpensesPage.historyView ? ExpensesPage.historyView() : '<div class="p-8">Loading Expenses...</div>'), 
            controller: () => (window.ExpensesPage && ExpensesPage.initHistory ? ExpensesPage.initHistory() : null) 
        },
        { 
            path: '/materials', 
            view: () => (window.MaterialsPage ? MaterialsPage.view() : '<div class="p-8">Loading Materials Inventory...</div>'), 
            controller: () => (window.MaterialsPage ? MaterialsPage.controller() : null) 
        },
        { 
            path: '/labour', 
            view: () => (window.LabourPage ? LabourPage.view() : '<div class="p-8">Loading Labour Ledger...</div>'), 
            controller: () => (window.LabourPage ? LabourPage.controller() : null) 
        },
        { 
            path: '/transport', 
            view: () => (window.TransportPage ? TransportPage.view() : '<div class="p-8">Loading Transport Records...</div>'), 
            controller: () => (window.TransportPage ? TransportPage.controller() : null) 
        },
        { 
            path: '/home', 
            view: () => (window.HomeExpensesPage ? HomeExpensesPage.view() : '<div class="p-8">Loading Home Expenses...</div>'), 
            controller: () => (window.HomeExpensesPage ? HomeExpensesPage.controller() : null) 
        },
        { 
            path: '/reports/daily', 
            view: () => (window.ReportsPage && ReportsPage.dailyView ? ReportsPage.dailyView() : '<div class="p-8">Loading Daily Report...</div>'), 
            controller: () => (window.ReportsPage && ReportsPage.dailyController ? ReportsPage.dailyController() : null) 
        },
        { 
            path: '/reports/monthly', 
            view: () => (window.ReportsPage && ReportsPage.monthlyView ? ReportsPage.monthlyView() : '<div class="p-8">Loading Monthly Report...</div>'), 
            controller: () => (window.ReportsPage && ReportsPage.monthlyController ? ReportsPage.monthlyController() : null) 
        },
        { 
            path: '/reports/yearly', 
            view: () => (window.ReportsPage && ReportsPage.yearlyView ? ReportsPage.yearlyView() : '<div class="p-8">Loading Yearly Report...</div>'), 
            controller: () => (window.ReportsPage && ReportsPage.yearlyController ? ReportsPage.yearlyController() : null) 
        },
        { 
            path: '/reports/category', 
            view: () => (window.ReportsPage && ReportsPage.categoryView ? ReportsPage.categoryView() : '<div class="p-8">Loading Category Report...</div>'), 
            controller: () => (window.ReportsPage && ReportsPage.categoryController ? ReportsPage.categoryController() : null) 
        },
        { 
            path: '/budget', 
            view: () => (window.BudgetPage ? BudgetPage.view() : '<div class="p-8">Loading Budgets...</div>'), 
            controller: () => (window.BudgetPage ? BudgetPage.controller() : null) 
        },
        { 
            path: '/settings', 
            view: () => (window.SettingsPage ? SettingsPage.view() : '<div class="p-8">Loading Settings...</div>'), 
            controller: () => (window.SettingsPage ? SettingsPage.controller() : null) 
        },
        { 
            path: '/export', 
            view: () => (window.ExportPage ? ExportPage.view() : '<div class="p-8">Loading Export Center...</div>'), 
            controller: () => (window.ExportPage ? ExportPage.controller() : null) 
        }
    ];

    // Instantiate and start the router
    if (typeof Router !== 'undefined') {
        const router = new Router(routes);
        window.router = router;
    } else {
        console.error('Router class not found. Ensure router.js is included before app.js in index.html');
    }
});
