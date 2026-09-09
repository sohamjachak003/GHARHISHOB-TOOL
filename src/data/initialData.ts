import { Expense, Labourer, LabourPayment, Material, MaterialPurchase, Budget } from '../types';

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 1,
    title: '500 Bags Ultratech Cement (PPC)',
    category: 'Materials',
    expense_type: 'construction',
    amount: 18500000, // Rs 1,85,000 (370/bag)
    date: '2023-10-12',
    payment_mode: 'Bank Transfer',
    paid_to: 'Sri Lakshmi Cement Traders',
    bill_number: 'INV-2023-889',
    notes: 'Grade 53 PPC for 1st floor roof casting slab'
  },
  {
    id: 2,
    title: 'Weekly Labour Payment (Masons & Helpers)',
    category: 'Labour',
    expense_type: 'construction',
    amount: 4560000, // Rs 45,600
    date: '2023-10-11',
    payment_mode: 'Cash',
    paid_to: 'Mestri Ramesh & Team (6 masons, 8 helpers)',
    bill_number: 'WAGE-WK-41',
    notes: '6 days full work on brickwork and column beam shuttering'
  },
  {
    id: 3,
    title: 'Electrical Conduit Pipes & Junction Boxes',
    category: 'Materials',
    expense_type: 'construction',
    amount: 1245000, // Rs 12,450
    date: '2023-10-10',
    payment_mode: 'UPI',
    paid_to: 'Apex Electricals & Hardware',
    bill_number: 'BILL-4412',
    notes: '25mm heavy duty PVC conduits for roof embedding'
  },
  {
    id: 4,
    title: 'River Sand Truck Unloading (3 loads)',
    category: 'Transport',
    expense_type: 'construction',
    amount: 3200000, // Rs 32,000
    date: '2023-10-08',
    payment_mode: 'UPI',
    paid_to: 'Balaji Freight & Sand Suppliers',
    bill_number: 'CHL-9902',
    notes: 'Coarse river sand for plastering and concrete mix'
  },
  {
    id: 5,
    title: 'New Heavy Drilling Machine & Bits',
    category: 'Tools',
    expense_type: 'construction',
    amount: 850000, // Rs 8,500
    date: '2023-10-05',
    payment_mode: 'UPI',
    paid_to: 'Industrial Hardware Store',
    bill_number: 'INV-1092',
    notes: 'Rotary hammer drill for chipping and electrical wall chasing'
  },
  {
    id: 6,
    title: 'Tata Tiscon 550D TMT Steel (3.5 Tons)',
    category: 'Materials',
    expense_type: 'construction',
    amount: 22750000, // Rs 2,27,500 (65/kg)
    date: '2023-10-02',
    payment_mode: 'Bank Transfer',
    paid_to: 'National Steel Corp',
    bill_number: 'ST-9031',
    notes: '12mm and 16mm rebar for beam and lintel reinforcement'
  },
  {
    id: 7,
    title: 'Plumber Advance & Drainage Fittings',
    category: 'Plumbing',
    expense_type: 'construction',
    amount: 2150000, // Rs 21,500
    date: '2023-09-28',
    payment_mode: 'Cash',
    paid_to: 'Suresh Plumber',
    bill_number: 'PL-04',
    notes: 'PVC 4-inch sewer pipes and underground pit connections'
  },
  {
    id: 8,
    title: 'Red Clay Kiln Bricks (10,000 Units)',
    category: 'Materials',
    expense_type: 'construction',
    amount: 9500000, // Rs 95,000 (9.5/brick)
    date: '2023-09-24',
    payment_mode: 'Cheque',
    paid_to: 'Om Sai Brick Kiln',
    bill_number: 'BK-552',
    notes: 'First-class wire cut red bricks for outer 9-inch walls'
  },
  {
    id: 9,
    title: 'Tractor Haulage & Debris Clearing',
    category: 'Transport',
    expense_type: 'construction',
    amount: 1420000, // Rs 14,200
    date: '2023-09-20',
    payment_mode: 'Cash',
    paid_to: 'Raju Tractor Service',
    bill_number: 'TR-12',
    notes: '4 tractor rounds clearing foundation rubble and excavation earth'
  },
  {
    id: 10,
    title: 'Carpenter Shuttering Planks Rental',
    category: 'Labour',
    expense_type: 'construction',
    amount: 1840000, // Rs 18,400
    date: '2023-09-15',
    payment_mode: 'UPI',
    paid_to: 'Ganesh Scaffolding & Formwork',
    bill_number: 'SCF-229',
    notes: 'Steel staging props and waterproof plywood sheets for roof'
  }
];

export const INITIAL_LABOURERS: Labourer[] = [
  {
    id: 1,
    name: 'Ramesh Mestri (Head Mason)',
    role: 'Mason',
    phone: '+91 98450 12345',
    daily_wage: 95000, // Rs 950/day
    total_paid: 8400000, // Rs 84,000
    notes: 'Specialist in 9-inch brick alignment and RCC slab staging'
  },
  {
    id: 2,
    name: 'Santosh Kumar (Assistant Mason)',
    role: 'Mason',
    phone: '+91 98231 67890',
    daily_wage: 80000, // Rs 800/day
    total_paid: 5200000, // Rs 52,000
    notes: 'Plastering and corner setting'
  },
  {
    id: 3,
    name: 'Suresh Rao (Plumbing Tech)',
    role: 'Plumber',
    phone: '+91 94480 55432',
    daily_wage: 85000, // Rs 850/day
    total_paid: 2850000, // Rs 28,500
    notes: 'CPVC water line routing & bathroom conceals'
  },
  {
    id: 4,
    name: 'Mohan Lal (Master Electrician)',
    role: 'Electrician',
    phone: '+91 97312 99881',
    daily_wage: 90000, // Rs 900/day
    total_paid: 2400000, // Rs 24,000
    notes: 'Main distribution board & concealed slab conduit layout'
  },
  {
    id: 5,
    name: 'Babu & Team (Helpers Group - 4 members)',
    role: 'Helper',
    phone: '+91 96112 33445',
    daily_wage: 50000, // Rs 500/day per person
    total_paid: 2700000, // Rs 27,000
    notes: 'Cement mixing, brick carrying, curing water hose'
  }
];

export const INITIAL_LABOUR_PAYMENTS: LabourPayment[] = [
  {
    id: 1,
    labourer_id: 1,
    labourer_name: 'Ramesh Mestri (Head Mason)',
    amount: 1140000, // Rs 11,400
    date: '2023-10-11',
    days_worked: 12,
    payment_mode: 'Cash',
    notes: 'Fortnightly settlement for beam shuttering'
  },
  {
    id: 2,
    labourer_id: 2,
    labourer_name: 'Santosh Kumar (Assistant Mason)',
    amount: 800000, // Rs 8,000
    date: '2023-10-11',
    days_worked: 10,
    payment_mode: 'Cash',
    notes: 'Brick masonry on eastern boundary'
  },
  {
    id: 3,
    labourer_id: 3,
    labourer_name: 'Suresh Rao (Plumbing Tech)',
    amount: 510000, // Rs 5,100
    date: '2023-10-04',
    days_worked: 6,
    payment_mode: 'UPI',
    notes: 'Kitchen and utility pipe embedding'
  },
  {
    id: 4,
    labourer_id: 4,
    labourer_name: 'Mohan Lal (Master Electrician)',
    amount: 720000, // Rs 7,200
    date: '2023-09-30',
    days_worked: 8,
    payment_mode: 'UPI',
    notes: 'Phase 1 ground floor switch box conduits'
  }
];

export const INITIAL_MATERIALS: Material[] = [
  {
    id: 1,
    name: 'Ultratech Cement (PPC Grade 53)',
    category: 'Cement',
    unit: 'Bags',
    current_stock: 140,
    total_purchased: 650,
    total_spent: 24050000 // Rs 2,40,500
  },
  {
    id: 2,
    name: 'Tata Tiscon 550D TMT Rebar (12mm / 16mm)',
    category: 'Steel',
    unit: 'Tons',
    current_stock: 1.2,
    total_purchased: 4.8,
    total_spent: 31200000 // Rs 3,12,000
  },
  {
    id: 3,
    name: 'Kiln Red Clay Bricks (9" x 4" x 3")',
    category: 'Bricks',
    unit: 'Units',
    current_stock: 3500,
    total_purchased: 18000,
    total_spent: 17100000 // Rs 1,71,000
  },
  {
    id: 4,
    name: 'Washed River Sand (Coarse Grade)',
    category: 'Sand',
    unit: 'Trucks',
    current_stock: 1,
    total_purchased: 5,
    total_spent: 7500000 // Rs 75,000
  },
  {
    id: 5,
    name: '20mm Blue Metal Stone Aggregate',
    category: 'Aggregates',
    unit: 'Trucks',
    current_stock: 2,
    total_purchased: 6,
    total_spent: 6600000 // Rs 66,000
  },
  {
    id: 6,
    name: 'Vitrified Double Charge Floor Tiles (2x2 ft)',
    category: 'Tiles',
    unit: 'Sq.Ft',
    current_stock: 450,
    total_purchased: 1200,
    total_spent: 7200000 // Rs 72,000
  }
];

export const INITIAL_MATERIAL_PURCHASES: MaterialPurchase[] = [
  {
    id: 1,
    material_id: 1,
    material_name: 'Ultratech Cement (PPC Grade 53)',
    category: 'Cement',
    quantity: 500,
    unit: 'Bags',
    rate_per_unit: 37000, // Rs 370/bag
    total_amount: 18500000, // Rs 1,85,000
    supplier: 'Sri Lakshmi Cement Traders',
    bill_number: 'INV-2023-889',
    date: '2023-10-12',
    payment_mode: 'Bank Transfer',
    notes: 'Direct from authorized dealer with test certificate'
  },
  {
    id: 2,
    material_id: 2,
    material_name: 'Tata Tiscon 550D TMT Rebar (12mm / 16mm)',
    category: 'Steel',
    quantity: 3.5,
    unit: 'Tons',
    rate_per_unit: 6500000, // Rs 65,000/ton
    total_amount: 22750000, // Rs 2,27,500
    supplier: 'National Steel Corp',
    bill_number: 'ST-9031',
    date: '2023-10-02',
    payment_mode: 'Bank Transfer',
    notes: 'Weighbridge slip attached'
  },
  {
    id: 3,
    material_id: 3,
    material_name: 'Kiln Red Clay Bricks (9" x 4" x 3")',
    category: 'Bricks',
    quantity: 10000,
    unit: 'Units',
    rate_per_unit: 950, // Rs 9.50/brick
    total_amount: 9500000, // Rs 95,000
    supplier: 'Om Sai Brick Kiln',
    bill_number: 'BK-552',
    date: '2023-09-24',
    payment_mode: 'Cheque',
    notes: 'Second batch for second floor parapet'
  }
];

export const INITIAL_BUDGETS: Budget[] = [
  {
    id: 1,
    name: 'Slab & Pillar Phase',
    category: 'Overall Construction',
    budget_type: 'overall',
    total_amount: 120000000, // Rs 12,00,000
    spent: 102000000 // 85% = Rs 10,20,000
  },
  {
    id: 2,
    name: 'Plumbing & Piping',
    category: 'Plumbing',
    budget_type: 'category',
    total_amount: 25000000, // Rs 2,50,000
    spent: 10500000 // 42% = Rs 1,05,000
  },
  {
    id: 3,
    name: 'Internal Wiring',
    category: 'Electrical',
    budget_type: 'category',
    total_amount: 12500000, // Rs 1,25,000
    spent: 14020000 // 112% = Rs 1,40,200 (exceeded by Rs 15,200)
  },
  {
    id: 4,
    name: 'Masonry Labour Allocation',
    category: 'Labour',
    budget_type: 'category',
    total_amount: 35000000, // Rs 3,50,000
    spent: 21550000 // 61.5% = Rs 2,15,500
  },
  {
    id: 5,
    name: 'Tiles, Flooring & Granite',
    category: 'Tiles',
    budget_type: 'category',
    total_amount: 28000000, // Rs 2,80,000
    spent: 7200000 // 25.7% = Rs 72,000
  }
];
