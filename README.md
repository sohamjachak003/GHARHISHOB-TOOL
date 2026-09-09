# GharHishob (घर हिसाब) 🏠💰
### Smart Construction & Home Expense Manager

**GharHishob** is a dedicated construction and household expense tracker engineered to replace physical diaries and disorganized paper receipts. Built with a focus on simplicity and non-technical family usability ("father-friendly"), it provides accurate cost tracking for building materials, daily wage labour payments, freight transport, and overall construction budgets.

---

## 🌟 Key Features

- 🏗️ **Construction Material Inventory & Purchases**: Track cement bags, TMT steel bars (tons/kg), bricks, sand, aggregate, plumbing, electricals, and tiles with supplier records and challan numbers.
- 👷 **Labour & Daily Wage Ledger**: Maintain worker master files (masons, helpers, carpenters, plumbers) with daily wage rates, attendance days, cash advances, and settlement history.
- 🚚 **Transport & Freight Costs**: Dedicated logging for material transportation, tractor/truck freight, and unloading expenses.
- 🎯 **Budgeting & Overrun Warnings**: Set overall house construction budgets and category caps with real-time visual progress meters.
- 📊 **Visual Analytics & Reports**: Daily, monthly, yearly, and category-wise breakdowns powered by Chart.js.
- 🇮🇳 **Indian Financial Precision**: Stores all currency values as exact integers in **Paisa (1 Rupee = 100 Paisa)** with standard Indian number formatting (e.g. `₹ 8,45,620`).
- 📥 **One-Click CSV / Excel Exports**: Download offline spreadsheet records for expenses, labour wage sheets, material invoices, and monthly executive summaries.

---

## 🛠️ Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Backend** | Python 3.14 + FastAPI | Synchronous SQLAlchemy ORM (high reliability, low latency) |
| **Database** | PostgreSQL | Connected via `psycopg2-binary` (no C++ build tool requirements) |
| **Authentication** | JWT (JSON Web Tokens) | `python-jose` + `passlib[bcrypt]` password hashing |
| **Frontend** | Vanilla JavaScript SPA | Single-page application using modern HTML5 + CSS3 + Vanilla JS |
| **Charts** | Chart.js | Visual doughnut, bar, and line distribution graphs |
| **Data Format** | Paisa Integers (INR) | Stored as integer paisa; formatted with Indian commas |

---

## 📁 Directory Structure

```text
gharhishob/
├── backend/
│   ├── alembic/              # Database migration environments
│   ├── routers/
│   │   ├── auth_router.py    # Login, registration, profile
│   │   ├── budgets.py        # Synchronous budget CRUD & spending calculations
│   │   ├── dashboard.py      # Aggregated metrics & recent transactions
│   │   ├── expenses.py       # Full expense CRUD with audit logs
│   │   ├── export.py         # CSV spreadsheet generation
│   │   ├── labour.py         # Worker master directory & wage payments
│   │   ├── materials.py      # Material catalog, stock, and purchase invoices
│   │   ├── recurring.py      # Recurring expense scheduling & auto-generation
│   │   └── reports.py        # Daily, monthly, yearly, & category analytics
│   ├── auth.py               # Synchronous auth helpers & JWT token validation
│   ├── config.py             # Pydantic Settings & environment variables
│   ├── create_admin.py       # Script to seed default administrator
│   ├── database.py           # Synchronous engine, SessionLocal, and get_db
│   ├── init_db.py            # Table creation initialization script
│   ├── main.py               # FastAPI application entry point
│   ├── middleware.py         # Security headers middleware
│   ├── models.py             # SQLAlchemy ORM models (9 tables)
│   ├── requirements.txt      # Python dependencies
│   └── schemas.py            # Pydantic validation schemas
├── frontend/
│   ├── css/                  # Dark theme CSS modular styles
│   │   ├── base.css
│   │   ├── components.css
│   │   ├── dashboard.css
│   │   ├── forms.css
│   │   ├── layout.css
│   │   ├── pages.css
│   │   ├── responsive.css
│   │   └── variables.css
│   ├── js/
│   │   ├── api.js            # Fetch wrapper with JWT headers
│   │   ├── app.js            # SPA route registry & bootstrapping
│   │   ├── auth.js           # Login controller & session management
│   │   ├── budget.js         # Budget manager with progress meters
│   │   ├── charts.js         # Chart.js dark-themed Indian Rupee wrapper
│   │   ├── components.js     # Modals, toasts, layout injection
│   │   ├── construction.js   # Construction expense dashboard
│   │   ├── dashboard.js      # Main overview stats & activity
│   │   ├── expenses.js       # Add expense & historical search/filter
│   │   ├── export.js         # CSV export page controller
│   │   ├── home-expenses.js  # Home budget & recurring items
│   │   ├── labour.js         # Labour wage ledger & payouts
│   │   ├── materials.js      # Materials stock & invoice log
│   │   ├── reports.js        # Daily/Monthly/Yearly/Category charts
│   │   ├── router.js         # Hash-based SPA routing engine
│   │   ├── settings.js       # User profile & app preferences
│   │   ├── transport.js      # Freight & haulage filtered ledger
│   │   └── utils.js          # Currency, date, and string formatting
│   └── index.html            # Main HTML shell
├── .env.example              # Environment variables template
├── .gitignore                # Git exclusions
└── README.md                 # Project documentation
```

---

## 🚀 Quickstart & Setup Guide

### 1. Prerequisites
- Python 3.10+ (Recommended Python 3.14)
- PostgreSQL Server running locally or in the cloud
- Any web browser (Chrome, Edge, Firefox, Safari)

### 2. Environment Configuration
Copy the `.env.example` to `.env` in the project root or `backend/` directory:

```bash
cp .env.example .env
```

Update your PostgreSQL connection details in `.env`:
```ini
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/gharhishob_db
JWT_SECRET=super_secret_random_key_replace_in_production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200
```

### 3. Install Python Dependencies
Create a virtual environment and install the required packages:

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux / macOS
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt
```

### 4. Initialize Database & Create Admin User
Run the automated table setup and admin seeder:

```bash
# Create all 9 database tables
python -m backend.init_db

# Seed default administrator account
python -m backend.create_admin
```

> **Default Administrator Credentials:**
> - **Email:** `admin@gharhishob.com`
> - **Password:** `admin123`

---

## 💻 Running the Application

### Start the Backend Server (FastAPI)
Run Uvicorn from the project root:

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```
- API Base URL: `http://localhost:8000/api`
- Interactive Swagger API Docs: `http://localhost:8000/docs`

### Start the Frontend Interface
Because the frontend is pure vanilla HTML/CSS/JS (no Node.js or build tools required), you can serve it with any static server:

```bash
# Using Python's built-in HTTP server:
python -m http.server 3000 --directory frontend
```

Now open your browser and navigate to:
**`http://localhost:3000`**

Log in using `admin@gharhishob.com` / `admin123` to start recording expenses!

---

## 🔒 Financial Calculation Rule

All monetary amounts are converted to and stored as **integer paisa**:
$$\text{Paisa} = \text{Rupees} \times 100$$

- Example: ₹ 1,500.50 is stored in the database as `150050`.
- This eliminates floating-point rounding errors and ensures total accounting precision across all invoices, labour wages, and reports.
