/**
 * GharHishob - Data Export & Backup Center
 * Allows family members to download Excel/CSV spreadsheets of all records
 */

const ExportPage = {
    state: {
        isExporting: false,
        selectedYear: new Date().getFullYear(),
        selectedMonth: new Date().getMonth() + 1
    },

    view() {
        const currentYear = new Date().getFullYear();
        const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];
        const months = [
            { num: 1, name: 'January' },
            { num: 2, name: 'February' },
            { num: 3, name: 'March' },
            { num: 4, name: 'April' },
            { num: 5, name: 'May' },
            { num: 6, name: 'June' },
            { num: 7, name: 'July' },
            { num: 8, name: 'August' },
            { num: 9, name: 'September' },
            { num: 10, name: 'October' },
            { num: 11, name: 'November' },
            { num: 12, name: 'December' }
        ];

        const monthOptions = months.map(m => `
            <option value="${m.num}" ${m.num === this.state.selectedMonth ? 'selected' : ''}>${m.name}</option>
        `).join('');

        const yearOptions = years.map(y => `
            <option value="${y}" ${y === currentYear ? 'selected' : ''}>${y}</option>
        `).join('');

        return `
            <div class="page-header">
                <div>
                    <h1 class="page-title">Export & Backup Center</h1>
                    <p class="page-subtitle">Download clean CSV spreadsheets for physical record-keeping, accountant filing, or Excel analysis</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- 1. All Expenses Export -->
                <div class="card p-6 flex flex-col justify-between">
                    <div>
                        <div class="flex items-center gap-3 mb-3">
                            <span class="text-3xl p-3 bg-blue-light rounded-lg">📋</span>
                            <div>
                                <h3 class="text-lg font-bold">All Construction & Home Expenses</h3>
                                <p class="text-xs text-muted">Complete ledger of every single expense with dates, categories, payment modes, and bills</p>
                            </div>
                        </div>
                        <ul class="text-xs text-muted space-y-1 mb-6 list-disc pl-5">
                            <li>Includes payment modes (Cash, UPI, Cheque, Bank Transfer)</li>
                            <li>Shows bill numbers, contractor names, and notes</li>
                            <li>Contains amounts in both Rupees and exact Paisa</li>
                        </ul>
                    </div>
                    <button class="btn btn-primary w-full" id="btn-export-expenses" onclick="ExportPage.downloadCsv('/export/expenses', 'gharhishob_expenses.csv')">
                        📥 Download Expenses CSV
                    </button>
                </div>

                <!-- 2. Labour & Wages Export -->
                <div class="card p-6 flex flex-col justify-between">
                    <div>
                        <div class="flex items-center gap-3 mb-3">
                            <span class="text-3xl p-3 bg-amber-light rounded-lg">👷</span>
                            <div>
                                <h3 class="text-lg font-bold">Labour Directory & Wage Payments</h3>
                                <p class="text-xs text-muted">Worker master records, daily rates, days worked, and chronological payment receipts</p>
                            </div>
                        </div>
                        <ul class="text-xs text-muted space-y-1 mb-6 list-disc pl-5">
                            <li>Masons, Helpers, Plumbers, Electricians, Carpenters</li>
                            <li>Total amount paid per worker and daily wage rates</li>
                            <li>Audit log of all cash advances and weekly settlements</li>
                        </ul>
                    </div>
                    <button class="btn btn-primary w-full" id="btn-export-labour" onclick="ExportPage.downloadCsv('/export/labour', 'gharhishob_labour.csv')">
                        📥 Download Labour CSV
                    </button>
                </div>

                <!-- 3. Building Materials Export -->
                <div class="card p-6 flex flex-col justify-between">
                    <div>
                        <div class="flex items-center gap-3 mb-3">
                            <span class="text-3xl p-3 bg-green-light rounded-lg">🏗️</span>
                            <div>
                                <h3 class="text-lg font-bold">Materials Inventory & Purchases</h3>
                                <p class="text-xs text-muted">Material stocks, supplier invoices, unit rates (per bag/ton/truck/sq.ft), and challans</p>
                            </div>
                        </div>
                        <ul class="text-xs text-muted space-y-1 mb-6 list-disc pl-5">
                            <li>Cement, TMT Steel bars, Bricks, Sand, Aggregate, Tiles</li>
                            <li>Supplier store names and challan/invoice tracking</li>
                            <li>Total quantity received versus current site stock</li>
                        </ul>
                    </div>
                    <button class="btn btn-primary w-full" id="btn-export-materials" onclick="ExportPage.downloadCsv('/export/materials', 'gharhishob_materials.csv')">
                        📥 Download Materials CSV
                    </button>
                </div>

                <!-- 4. Monthly Executive Report Export -->
                <div class="card p-6 flex flex-col justify-between">
                    <div>
                        <div class="flex items-center gap-3 mb-3">
                            <span class="text-3xl p-3 bg-purple-light rounded-lg">📊</span>
                            <div>
                                <h3 class="text-lg font-bold">Monthly Executive Statement</h3>
                                <p class="text-xs text-muted">Monthly expense breakdown with category totals and percentage distributions</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-3 mb-4">
                            <div class="form-group mb-0">
                                <label class="form-label text-xs" for="export-month">Select Month</label>
                                <select id="export-month" class="form-select text-sm" onchange="ExportPage.state.selectedMonth = parseInt(this.value)">
                                    ${monthOptions}
                                </select>
                            </div>
                            <div class="form-group mb-0">
                                <label class="form-label text-xs" for="export-year">Select Year</label>
                                <select id="export-year" class="form-select text-sm" onchange="ExportPage.state.selectedYear = parseInt(this.value)">
                                    ${yearOptions}
                                </select>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-primary w-full" id="btn-export-monthly" onclick="ExportPage.exportMonthly()">
                        📥 Download Monthly Report CSV
                    </button>
                </div>
            </div>

            <!-- Notes on CSV format -->
            <div class="card mt-6 p-4 bg-surface-darker border">
                <div class="flex items-start gap-3">
                    <span class="text-xl">💡</span>
                    <div class="text-xs text-muted">
                        <strong class="text-foreground">Opening in Excel or Google Sheets:</strong>
                        All CSV files are exported in standard UTF-8 format. You can double-click to open them directly in Microsoft Excel, Apple Numbers, LibreOffice Calc, or import them into Google Sheets without any formatting loss.
                    </div>
                </div>
            </div>
        `;
    },

    async controller() {
        // Page view initialized
    },

    exportMonthly() {
        const month = document.getElementById('export-month')?.value || this.state.selectedMonth;
        const year = document.getElementById('export-year')?.value || this.state.selectedYear;
        const endpoint = `/export/monthly-report?year=${year}&month=${month}`;
        const filename = `gharhishob_monthly_report_${year}_${String(month).padStart(2, '0')}.csv`;
        this.downloadCsv(endpoint, filename);
    },

    async downloadCsv(endpoint, defaultFilename) {
        try {
            if (window.Components && window.Components.showToast) {
                Components.showToast('Preparing your spreadsheet download...', 'info');
            }

            const token = localStorage.getItem('token');
            const baseUrl = (window.API_BASE_URL || '/api').replace(/\/$/, '');
            const fullUrl = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

            const response = await fetch(fullUrl, {
                method: 'GET',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                }
            });

            if (!response.ok) {
                throw new Error(`Export failed with status: ${response.statusText}`);
            }

            // Extract filename from Content-Disposition header if available
            let filename = defaultFilename;
            const disposition = response.headers.get('Content-Disposition');
            if (disposition && disposition.indexOf('filename=') !== -1) {
                const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
                if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, '');
                }
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);

            if (window.Components && window.Components.showToast) {
                Components.showToast('Spreadsheet downloaded successfully!', 'success');
            }
        } catch (error) {
            console.error('Download error:', error);
            if (window.Components && window.Components.showToast) {
                Components.showToast('Failed to download file: ' + error.message, 'error');
            }
        }
    }
};

window.ExportPage = ExportPage;
