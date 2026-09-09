/**
 * GharHishob - Budget Management Page
 * Handles overall and category-specific budget tracking with progress indicators
 */

const BudgetPage = {
    state: {
        budgets: [],
        isLoading: true,
        selectedYear: new Date().getFullYear(),
        selectedMonth: new Date().getMonth() + 1
    },

    categories: [
        'All / Overall Construction',
        'Cement',
        'Steel / TMT',
        'Bricks & Blocks',
        'Sand & Aggregates',
        'Labour & Masons',
        'Transport & Freight',
        'Plumbing & Sanitation',
        'Electrical & Wiring',
        'Wood & Carpentry',
        'Tiles & Flooring',
        'Painting & Polish',
        'Doors & Windows',
        'Architect & Contractor Fees',
        'Groceries & Food',
        'Utilities (Electricity/Water)',
        'Home Maintenance',
        'Other'
    ],

    view() {
        return `
            <div class="page-header">
                <div>
                    <h1 class="page-title">Budget Management</h1>
                    <p class="page-subtitle">Track spending limits, prevent budget overruns, and monitor savings</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary" id="btn-add-budget">
                        <span class="btn-icon">+</span> Add New Budget
                    </button>
                </div>
            </div>

            <!-- Summary Stats -->
            <div class="stats-grid" id="budget-summary-grid">
                <div class="stat-card">
                    <div class="stat-icon-wrapper bg-blue-light">📊</div>
                    <div class="stat-content">
                        <span class="stat-label">Total Budget</span>
                        <h3 class="stat-value" id="stat-total-budget">Rs 0</h3>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon-wrapper bg-amber-light">💸</div>
                    <div class="stat-content">
                        <span class="stat-label">Total Spent</span>
                        <h3 class="stat-value" id="stat-total-spent">Rs 0</h3>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon-wrapper bg-green-light">🛡️</div>
                    <div class="stat-content">
                        <span class="stat-label">Remaining Safe</span>
                        <h3 class="stat-value" id="stat-total-remaining">Rs 0</h3>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon-wrapper bg-purple-light">📈</div>
                    <div class="stat-content">
                        <span class="stat-label">Overall Usage</span>
                        <h3 class="stat-value" id="stat-overall-percentage">0%</h3>
                    </div>
                </div>
            </div>

            <!-- Budgets List Container -->
            <div class="card mt-4">
                <div class="card-header flex-between">
                    <div>
                        <h2 class="card-title">Active Budgets & Spending Meters</h2>
                        <span class="card-subtitle">Real-time expenditure tracked against predefined limits</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button class="btn btn-outline btn-sm" id="btn-refresh-budgets">↻ Refresh</button>
                    </div>
                </div>
                <div class="card-body" id="budgets-list-container">
                    <div class="skeleton-loader p-4 text-center">Loading budgets...</div>
                </div>
            </div>
        `;
    },

    async controller() {
        this.bindGlobalEvents();
        await this.loadBudgets();
    },

    bindGlobalEvents() {
        const addBtn = document.getElementById('btn-add-budget');
        if (addBtn) {
            addBtn.onclick = () => this.showBudgetModal();
        }

        const refreshBtn = document.getElementById('btn-refresh-budgets');
        if (refreshBtn) {
            refreshBtn.onclick = () => this.loadBudgets();
        }
    },

    async loadBudgets() {
        const container = document.getElementById('budgets-list-container');
        if (!container) return;

        try {
            this.state.isLoading = true;
            container.innerHTML = `<div class="p-8 text-center text-muted">Calculating real-time budget balances...</div>`;
            
            const budgets = await window.api.get('/budgets/');
            this.state.budgets = Array.isArray(budgets) ? budgets : [];
            
            this.renderSummary();
            this.renderBudgetCards();
        } catch (error) {
            console.error('Failed to load budgets:', error);
            container.innerHTML = `
                <div class="p-6 text-center text-danger">
                    <p>Failed to load budget data. Please verify your connection.</p>
                    <button class="btn btn-outline btn-sm mt-2" onclick="BudgetPage.loadBudgets()">Retry</button>
                </div>
            `;
            if (window.Components && window.Components.showToast) {
                Components.showToast('Could not load budget data', 'error');
            }
        } finally {
            this.state.isLoading = false;
        }
    },

    renderSummary() {
        let totalBudget = 0;
        let totalSpent = 0;

        this.state.budgets.forEach(b => {
            const amt = b.amount || b.total_amount || 0;
            const spent = b.spent_amount || b.spent || 0;
            totalBudget += amt;
            totalSpent += spent;
        });

        const remaining = totalBudget - totalSpent;
        const percentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

        const totalBudgetEl = document.getElementById('stat-total-budget');
        const totalSpentEl = document.getElementById('stat-total-spent');
        const totalRemEl = document.getElementById('stat-total-remaining');
        const overallPctEl = document.getElementById('stat-overall-percentage');

        if (totalBudgetEl) totalBudgetEl.innerText = Utils.formatCurrency(totalBudget);
        if (totalSpentEl) totalSpentEl.innerText = Utils.formatCurrency(totalSpent);
        if (totalRemEl) {
            totalRemEl.innerText = Utils.formatCurrency(remaining);
            totalRemEl.className = `stat-value ${remaining < 0 ? 'text-danger' : 'text-success'}`;
        }
        if (overallPctEl) overallPctEl.innerText = `${percentage}%`;
    },

    renderBudgetCards() {
        const container = document.getElementById('budgets-list-container');
        if (!container) return;

        if (this.state.budgets.length === 0) {
            container.innerHTML = `
                <div class="empty-state p-8 text-center">
                    <div class="empty-icon" style="font-size: 3rem; margin-bottom: 1rem;">🎯</div>
                    <h3 class="text-lg font-semibold">No Budgets Configured Yet</h3>
                    <p class="text-muted text-sm max-w-md mx-auto mt-1 mb-4">
                        Set planned expense caps for your overall house construction or specific materials like Cement, Steel, or Labour.
                    </p>
                    <button class="btn btn-primary" onclick="BudgetPage.showBudgetModal()">
                        + Create Your First Budget
                    </button>
                </div>
            `;
            return;
        }

        const cardsHtml = this.state.budgets.map(b => {
            const total = b.amount || b.total_amount || 0;
            const spent = b.spent_amount || b.spent || 0;
            const remaining = total - spent;
            const percentage = total > 0 ? Math.min(Math.round((spent / total) * 100), 100) : 0;
            const rawPct = total > 0 ? Math.round((spent / total) * 100) : 0;
            const isExceeded = spent > total;
            
            let statusColor = 'var(--color-success, #10b981)';
            let badgeClass = 'badge-success';
            let statusText = 'On Track';

            if (isExceeded) {
                statusColor = 'var(--color-danger, #ef4444)';
                badgeClass = 'badge-danger';
                statusText = `Over by ${Utils.formatCurrency(Math.abs(remaining))}`;
            } else if (rawPct >= 85) {
                statusColor = 'var(--color-warning, #f59e0b)';
                badgeClass = 'badge-warning';
                statusText = 'Near Limit';
            }

            const categoryIcon = Utils.getCategoryIcon ? Utils.getCategoryIcon(b.category || 'Other') : '🏷️';

            return `
                <div class="budget-card p-4 border-b last:border-b-0 hover:bg-surface-hover transition-colors" id="budget-item-${b.id}">
                    <div class="flex-between items-start mb-2">
                        <div class="flex items-center gap-3">
                            <div class="category-icon-box text-xl p-2 rounded bg-surface border">
                                ${categoryIcon}
                            </div>
                            <div>
                                <h4 class="font-semibold text-base">${Utils.escapeHtml(b.name || b.category || 'Budget')}</h4>
                                <div class="text-xs text-muted flex items-center gap-2 mt-0.5">
                                    <span>${b.category ? `Category: <strong>${Utils.escapeHtml(b.category)}</strong>` : 'Overall Construction'}</span>
                                    ${b.month && b.year ? `• <span>${b.month}/${b.year}</span>` : ''}
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="badge ${badgeClass}">${statusText}</span>
                            <button class="btn-icon-action" title="Edit Budget" onclick="BudgetPage.showBudgetModal(${b.id})">✏️</button>
                            <button class="btn-icon-action text-danger" title="Delete Budget" onclick="BudgetPage.confirmDeleteBudget(${b.id}, '${Utils.escapeHtml(b.name || 'Budget')}')">🗑️</button>
                        </div>
                    </div>

                    <!-- Progress bar -->
                    <div class="progress-bar-container w-full bg-surface-darker rounded-full h-3 my-2 overflow-hidden border">
                        <div class="progress-bar-fill h-full transition-all duration-500" 
                             style="width: ${percentage}%; background-color: ${statusColor};"></div>
                    </div>

                    <!-- Progress figures -->
                    <div class="flex-between text-xs mt-1">
                        <div>
                            <span class="text-muted">Spent:</span> 
                            <strong class="text-foreground">${Utils.formatCurrency(spent)}</strong> 
                            <span class="text-muted">(${rawPct}%)</span>
                        </div>
                        <div>
                            <span class="text-muted">Remaining:</span> 
                            <strong class="${remaining < 0 ? 'text-danger' : 'text-success'}">${Utils.formatCurrency(remaining)}</strong>
                        </div>
                        <div>
                            <span class="text-muted">Limit:</span> 
                            <strong>${Utils.formatCurrency(total)}</strong>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = `<div class="budget-items-list divide-y">${cardsHtml}</div>`;
    },

    showBudgetModal(budgetId = null) {
        const isEdit = budgetId !== null;
        const budget = isEdit ? this.state.budgets.find(b => b.id === budgetId) : null;

        const currentAmountRupees = budget ? ((budget.amount || budget.total_amount || 0) / 100) : '';
        const currentCategory = budget ? (budget.category || '') : '';
        const currentName = budget ? (budget.name || '') : '';
        const currentType = budget ? (budget.budget_type || 'category') : 'category';

        const categoryOptions = this.categories.map(cat => {
            const isSelected = currentCategory === cat ? 'selected' : '';
            return `<option value="${cat}" ${isSelected}>${cat}</option>`;
        }).join('');

        const modalBody = `
            <form id="budget-form" class="space-y-4" onsubmit="event.preventDefault();">
                <div class="form-group">
                    <label class="form-label" for="budget-name">Budget Title / Purpose *</label>
                    <input type="text" id="budget-name" class="form-input" 
                           placeholder="e.g. Ground Floor Cement, Masonry Labour, Overall Slab" 
                           value="${Utils.escapeHtml(currentName)}" required />
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div class="form-group">
                        <label class="form-label" for="budget-type">Type</label>
                        <select id="budget-type" class="form-select">
                            <option value="category" ${currentType === 'category' ? 'selected' : ''}>Category-Specific</option>
                            <option value="overall" ${currentType === 'overall' ? 'selected' : ''}>Overall Construction</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="budget-category">Target Category</label>
                        <select id="budget-category" class="form-select">
                            <option value="">-- Select Category --</option>
                            ${categoryOptions}
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label" for="budget-amount">Allocated Amount (in Rupees ₹) *</label>
                    <div class="relative">
                        <span class="absolute left-3 top-2.5 text-muted">₹</span>
                        <input type="number" step="1" min="1" id="budget-amount" class="form-input pl-8" 
                               placeholder="e.g. 250000" value="${currentAmountRupees}" required />
                    </div>
                    <small class="text-muted text-xs mt-1 block">Stored securely in paisa (1 Rupee = 100 paisa)</small>
                </div>
            </form>
        `;

        if (window.Components && window.Components.showModal) {
            Components.showModal({
                title: isEdit ? 'Edit Budget Target' : 'Create New Budget Target',
                body: modalBody,
                confirmText: isEdit ? 'Update Budget' : 'Save Budget',
                confirmClass: 'btn-primary',
                onConfirm: async () => {
                    const name = document.getElementById('budget-name')?.value.trim();
                    const budgetType = document.getElementById('budget-type')?.value;
                    const category = document.getElementById('budget-category')?.value;
                    const amountInput = document.getElementById('budget-amount')?.value;

                    if (!name) {
                        Components.showToast('Please enter a budget name', 'warning');
                        return false;
                    }
                    if (!amountInput || parseFloat(amountInput) <= 0) {
                        Components.showToast('Please enter a valid positive budget amount', 'warning');
                        return false;
                    }

                    const paisaAmount = Utils.parseCurrencyToPaisa ? Utils.parseCurrencyToPaisa(amountInput) : Math.round(parseFloat(amountInput) * 100);

                    const payload = {
                        name: name,
                        budget_type: budgetType,
                        category: category || (budgetType === 'overall' ? 'Overall Construction' : name),
                        amount: paisaAmount,
                        total_amount: paisaAmount
                    };

                    try {
                        if (isEdit) {
                            await window.api.put(`/budgets/${budgetId}`, payload);
                            Components.showToast('Budget updated successfully', 'success');
                        } else {
                            await window.api.post('/budgets/', payload);
                            Components.showToast('New budget created successfully', 'success');
                        }
                        await BudgetPage.loadBudgets();
                        return true;
                    } catch (err) {
                        console.error('Save budget error:', err);
                        Components.showToast(err.message || 'Failed to save budget', 'error');
                        return false;
                    }
                }
            });
        }
    },

    confirmDeleteBudget(budgetId, budgetName) {
        if (window.Components && window.Components.showModal) {
            Components.showModal({
                title: 'Delete Budget Target',
                body: `<p>Are you sure you want to delete the budget <strong>"${Utils.escapeHtml(budgetName)}"</strong>? Recorded expenses will not be affected.</p>`,
                confirmText: 'Delete Budget',
                confirmClass: 'btn-danger',
                onConfirm: async () => {
                    try {
                        await window.api.delete(`/budgets/${budgetId}`);
                        Components.showToast('Budget deleted successfully', 'success');
                        await BudgetPage.loadBudgets();
                        return true;
                    } catch (err) {
                        console.error('Delete budget error:', err);
                        Components.showToast(err.message || 'Failed to delete budget', 'error');
                        return false;
                    }
                }
            });
        }
    }
};

window.BudgetPage = BudgetPage;
