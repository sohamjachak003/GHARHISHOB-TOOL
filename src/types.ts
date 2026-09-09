export type ExpenseType = 'construction' | 'home';

export interface Expense {
  id: number;
  title: string;
  category: string;
  expense_type: ExpenseType;
  amount: number; // in paisa (1 INR = 100 paisa)
  date: string; // YYYY-MM-DD
  payment_mode: 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque';
  paid_to?: string;
  bill_number?: string;
  notes?: string;
  created_at?: string;
}

export interface Labourer {
  id: number;
  name: string;
  role: string; // Mason / Helper / Carpenter / Plumber / Electrician / Painter / Contractor
  phone: string;
  daily_wage: number; // in paisa
  total_paid: number; // in paisa
  notes?: string;
}

export interface LabourPayment {
  id: number;
  labourer_id: number;
  labourer_name: string;
  amount: number; // in paisa
  date: string;
  days_worked: number;
  payment_mode: 'Cash' | 'UPI' | 'Bank Transfer';
  notes?: string;
}

export interface Material {
  id: number;
  name: string;
  category: string; // Cement, Steel, Sand, Bricks, Aggregates, Plumbing, Electrical, Tiles, Wood, Painting
  unit: string; // Bags, Tons, Brass, Units, Trucks, Sq.Ft, Liters
  current_stock: number;
  total_purchased: number;
  total_spent: number; // in paisa
}

export interface MaterialPurchase {
  id: number;
  material_id: number;
  material_name: string;
  category: string;
  quantity: number;
  unit: string;
  rate_per_unit: number; // in paisa
  total_amount: number; // in paisa
  supplier: string;
  bill_number?: string;
  date: string;
  payment_mode: 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque';
  notes?: string;
}

export interface AttendanceRecord {
  id: string; // `${labourer_id}_${date}`
  labourer_id: number;
  date: string; // YYYY-MM-DD
  status: 'present' | 'half' | 'absent';
}

export interface ProjectConfig {
  name: string;
  supervisor?: string;
  targetBudgetPaisa: number;
  startDate: string;
  isRealMode: boolean;
}

export interface Budget {
  id: number;
  name: string;
  category: string;
  budget_type: 'overall' | 'category';
  total_amount: number; // in paisa
  spent: number; // in paisa
}

export type ActiveTab = 
  | 'dashboard'
  | 'construction'
  | 'expenses'
  | 'labour'
  | 'materials'
  | 'reports'
  | 'budgets'
  | 'export'
  | 'settings';
