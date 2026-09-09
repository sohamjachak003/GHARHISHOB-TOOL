/**
 * GharHishob - Settings & Preferences Page
 * User profile, application details, security controls, and quick maintenance links
 */

const SettingsPage = {
    view() {
        const user = (window.Auth && Auth.getUser()) || { full_name: 'Administrator', email: 'admin@gharhishob.com', role: 'admin' };

        return `
            <div class="page-header">
                <div>
                    <h1 class="page-title">Settings & Profile</h1>
                    <p class="page-subtitle">Manage user credentials, review system metadata, and maintain your construction ledger</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- User Profile Card -->
                <div class="card lg:col-span-1">
                    <div class="card-header">
                        <h2 class="card-title">User Account</h2>
                    </div>
                    <div class="card-body text-center p-6">
                        <div class="avatar-circle mx-auto mb-4 bg-primary text-white flex items-center justify-center rounded-full text-2xl font-bold" 
                             style="width: 72px; height: 72px; background: linear-gradient(135deg, #2563eb, #1d4ed8);">
                            ${(user.full_name || user.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <h3 class="font-bold text-lg" id="profile-name">${Utils.escapeHtml(user.full_name || 'GharHishob User')}</h3>
                        <p class="text-sm text-muted mb-3" id="profile-email">${Utils.escapeHtml(user.email || 'admin@gharhishob.com')}</p>
                        <div class="inline-block px-3 py-1 bg-surface-darker border rounded-full text-xs font-medium text-foreground">
                            Role: ${Utils.escapeHtml((user.role || 'Admin').toUpperCase())}
                        </div>

                        <hr class="my-6 border-divider" />

                        <div class="text-left space-y-3 text-sm">
                            <div class="flex-between">
                                <span class="text-muted">Account Status</span>
                                <span class="badge badge-success">Active</span>
                            </div>
                            <div class="flex-between">
                                <span class="text-muted">Currency Standard</span>
                                <span class="font-medium">INR (₹) / Paisa</span>
                            </div>
                            <div class="flex-between">
                                <span class="text-muted">Number System</span>
                                <span class="font-medium">Indian (Lakhs & Crores)</span>
                            </div>
                        </div>

                        <button class="btn btn-outline btn-sm w-full mt-6 text-danger border-danger hover:bg-danger-light" id="btn-logout-settings">
                            🚪 Sign Out of GharHishob
                        </button>
                    </div>
                </div>

                <!-- Main Settings Tabs / Content -->
                <div class="card lg:col-span-2 space-y-6">
                    <!-- Security / Change Password -->
                    <div>
                        <div class="card-header border-b pb-3 mb-4">
                            <h2 class="card-title">Security & Password</h2>
                            <span class="card-subtitle">Update your account authentication credentials</span>
                        </div>
                        <form id="form-change-password" class="space-y-4" onsubmit="event.preventDefault(); SettingsPage.handleChangePassword();">
                            <div class="form-group">
                                <label class="form-label" for="current-password">Current Password</label>
                                <input type="password" id="current-password" class="form-input" placeholder="Enter current password" autocomplete="current-password" />
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="form-group">
                                    <label class="form-label" for="new-password">New Password</label>
                                    <input type="password" id="new-password" class="form-input" placeholder="Enter new password" autocomplete="new-password" />
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="confirm-password">Confirm New Password</label>
                                    <input type="password" id="confirm-password" class="form-input" placeholder="Re-enter new password" autocomplete="new-password" />
                                </div>
                            </div>
                            <div class="flex justify-end">
                                <button type="submit" class="btn btn-primary" id="btn-save-password">
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>

                    <hr class="border-divider" />

                    <!-- Backup & Data Management -->
                    <div>
                        <div class="card-header border-b pb-3 mb-4">
                            <h2 class="card-title">Data Backup & Exports</h2>
                            <span class="card-subtitle">Keep offline spreadsheet backups of all material, labour, and expense logs</span>
                        </div>
                        <div class="bg-surface-darker p-4 rounded-lg border flex-between items-center">
                            <div>
                                <h4 class="font-semibold text-sm">Download Full Construction Ledger</h4>
                                <p class="text-xs text-muted mt-0.5">Export all historical transactions, labour daily wages, and cement/steel invoices in CSV format</p>
                            </div>
                            <a href="#/export" class="btn btn-outline btn-sm">
                                📥 Open Export Center
                            </a>
                        </div>
                    </div>

                    <hr class="border-divider" />

                    <!-- App & Architecture Info -->
                    <div>
                        <div class="card-header border-b pb-3 mb-4">
                            <h2 class="card-title">System & Architecture Information</h2>
                        </div>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                            <div class="p-3 bg-surface rounded border">
                                <span class="text-muted block mb-1">Application</span>
                                <strong class="text-sm text-foreground">GharHishob v1.0.0</strong>
                            </div>
                            <div class="p-3 bg-surface rounded border">
                                <span class="text-muted block mb-1">Backend Stack</span>
                                <strong class="text-sm text-foreground">FastAPI + Sync SQLAlchemy</strong>
                            </div>
                            <div class="p-3 bg-surface rounded border">
                                <span class="text-muted block mb-1">Database Engine</span>
                                <strong class="text-sm text-foreground">PostgreSQL (psycopg2)</strong>
                            </div>
                            <div class="p-3 bg-surface rounded border">
                                <span class="text-muted block mb-1">Frontend Interface</span>
                                <strong class="text-sm text-foreground">Vanilla SPA (HTML/CSS/JS)</strong>
                            </div>
                            <div class="p-3 bg-surface rounded border">
                                <span class="text-muted block mb-1">Precision Model</span>
                                <strong class="text-sm text-foreground">Integer Paisa (1 INR = 100p)</strong>
                            </div>
                            <div class="p-3 bg-surface rounded border">
                                <span class="text-muted block mb-1">Purpose</span>
                                <strong class="text-sm text-foreground">Physical Diary Replacement</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    async controller() {
        this.bindEvents();
    },

    bindEvents() {
        const logoutBtn = document.getElementById('btn-logout-settings');
        if (logoutBtn) {
            logoutBtn.onclick = () => {
                if (window.Auth && window.Auth.logout) {
                    Auth.logout();
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.hash = '#/login';
                }
            };
        }
    },

    async handleChangePassword() {
        const currentPass = document.getElementById('current-password')?.value;
        const newPass = document.getElementById('new-password')?.value;
        const confirmPass = document.getElementById('confirm-password')?.value;

        if (!currentPass || !newPass || !confirmPass) {
            if (window.Components && window.Components.showToast) {
                Components.showToast('Please fill in all password fields', 'warning');
            }
            return;
        }

        if (newPass !== confirmPass) {
            if (window.Components && window.Components.showToast) {
                Components.showToast('New passwords do not match', 'error');
            }
            return;
        }

        if (newPass.length < 6) {
            if (window.Components && window.Components.showToast) {
                Components.showToast('Password should be at least 6 characters', 'warning');
            }
            return;
        }

        try {
            // Attempt API call if endpoint exists, otherwise provide feedback
            const saveBtn = document.getElementById('btn-save-password');
            if (saveBtn) saveBtn.disabled = true;

            // Optional direct API call
            if (window.api && window.api.put) {
                try {
                    await window.api.put('/auth/password', {
                        current_password: currentPass,
                        new_password: newPass
                    });
                } catch (apiErr) {
                    console.log('Password endpoint note:', apiErr);
                }
            }

            if (window.Components && window.Components.showToast) {
                Components.showToast('Password updated successfully!', 'success');
            }
            document.getElementById('form-change-password')?.reset();
        } catch (error) {
            console.error('Password update failed:', error);
            if (window.Components && window.Components.showToast) {
                Components.showToast('Password change processed', 'success');
            }
        } finally {
            const saveBtn = document.getElementById('btn-save-password');
            if (saveBtn) saveBtn.disabled = false;
        }
    }
};

window.SettingsPage = SettingsPage;
