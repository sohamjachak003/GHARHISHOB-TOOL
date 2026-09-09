import csv
import io
from datetime import datetime, date
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session
from sqlalchemy import extract

from ..database import get_db
from ..models import User, Expense, Labourer, LabourPayment, Material, MaterialPurchase
from ..auth import get_current_user

router = APIRouter(prefix="/api/export", tags=["export"])


def format_paisa_to_rupees(paisa: Optional[int]) -> str:
    """Format paisa integer into rupee string format (e.g., 845620.00)."""
    if paisa is None:
        return "0.00"
    return f"{paisa / 100:.2f}"


@router.get("/expenses")
def export_expenses_csv(
    expense_type: Optional[str] = Query(None, description="Filter by construction or home"),
    category: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Expense).filter(Expense.user_id == current_user.id)
    
    if expense_type:
        query = query.filter(Expense.expense_type == expense_type)
    if category:
        query = query.filter(Expense.category == category)
    if start_date:
        query = query.filter(Expense.date >= start_date)
    if end_date:
        query = query.filter(Expense.date <= end_date)
        
    expenses = query.order_by(Expense.date.desc(), Expense.id.desc()).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow([
        "ID",
        "Date",
        "Title / Description",
        "Category",
        "Type",
        "Amount (INR)",
        "Amount (Paisa)",
        "Payment Mode",
        "Paid To",
        "Bill No",
        "Notes"
    ])
    
    # Write rows
    for exp in expenses:
        writer.writerow([
            exp.id,
            exp.date.strftime("%Y-%m-%d") if hasattr(exp.date, "strftime") else str(exp.date),
            getattr(exp, "title", "") or getattr(exp, "description", ""),
            getattr(exp, "category", ""),
            getattr(exp, "expense_type", ""),
            format_paisa_to_rupees(exp.amount),
            exp.amount,
            getattr(exp, "payment_mode", "") or "",
            getattr(exp, "paid_to", "") or "",
            getattr(exp, "bill_number", "") or getattr(exp, "bill_no", "") or "",
            getattr(exp, "notes", "") or ""
        ])
        
    csv_data = output.getvalue()
    filename = f"gharhishob_expenses_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.csv"
    
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )


@router.get("/labour")
def export_labour_csv(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    labourers = db.query(Labourer).filter(Labourer.user_id == current_user.id).order_by(Labourer.id.asc()).all()
    payments = db.query(LabourPayment).filter(LabourPayment.user_id == current_user.id).order_by(LabourPayment.payment_date.desc()).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Section 1: Labourers Summary
    writer.writerow(["=== LABOURERS DIRECTORY ==="])
    writer.writerow(["ID", "Name", "Role / Trade", "Phone", "Daily Wage (INR)", "Daily Wage (Paisa)", "Total Paid (INR)", "Notes"])
    
    labourer_map = {l.id: l.name for l in labourers}
    
    for l in labourers:
        # Calculate total paid for this labourer
        labourer_paid = sum(p.amount for p in payments if getattr(p, "labourer_id", None) == l.id)
        writer.writerow([
            l.id,
            getattr(l, "name", ""),
            getattr(l, "role", "") or getattr(l, "trade", "") or "Labour",
            getattr(l, "phone", "") or "",
            format_paisa_to_rupees(getattr(l, "daily_wage", 0)),
            getattr(l, "daily_wage", 0),
            format_paisa_to_rupees(labourer_paid),
            getattr(l, "notes", "") or ""
        ])
        
    writer.writerow([])
    
    # Section 2: Detailed Payment History
    writer.writerow(["=== LABOUR PAYMENT TRANSACTIONS ==="])
    writer.writerow(["Payment ID", "Date", "Labourer Name", "Labourer ID", "Amount (INR)", "Amount (Paisa)", "Days Worked", "Payment Mode", "Notes"])
    
    for p in payments:
        p_date = getattr(p, "payment_date", None) or getattr(p, "date", None)
        p_date_str = p_date.strftime("%Y-%m-%d") if hasattr(p_date, "strftime") else str(p_date or "")
        l_name = labourer_map.get(getattr(p, "labourer_id", None), "Unknown")
        
        writer.writerow([
            p.id,
            p_date_str,
            l_name,
            getattr(p, "labourer_id", ""),
            format_paisa_to_rupees(p.amount),
            p.amount,
            getattr(p, "days_worked", "") or 1,
            getattr(p, "payment_mode", "") or "Cash",
            getattr(p, "notes", "") or ""
        ])
        
    csv_data = output.getvalue()
    filename = f"gharhishob_labour_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.csv"
    
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )


@router.get("/materials")
def export_materials_csv(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    materials = db.query(Material).filter(Material.user_id == current_user.id).order_by(Material.id.asc()).all()
    purchases = db.query(MaterialPurchase).filter(MaterialPurchase.user_id == current_user.id).order_by(MaterialPurchase.purchase_date.desc()).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Section 1: Materials Catalog & Stock
    writer.writerow(["=== BUILDING MATERIALS INVENTORY ==="])
    writer.writerow(["ID", "Material Name", "Category", "Unit", "Total Quantity Purchased", "Current Stock", "Total Spent (INR)"])
    
    material_map = {m.id: m for m in materials}
    
    for m in materials:
        m_purchases = [p for p in purchases if getattr(p, "material_id", None) == m.id]
        total_qty = sum(getattr(p, "quantity", 0) for p in m_purchases)
        total_spent = sum(getattr(p, "total_amount", 0) for p in m_purchases)
        
        writer.writerow([
            m.id,
            getattr(m, "name", ""),
            getattr(m, "category", "") or "Construction",
            getattr(m, "unit", "") or "Units",
            total_qty,
            getattr(m, "current_stock", total_qty),
            format_paisa_to_rupees(total_spent)
        ])
        
    writer.writerow([])
    
    # Section 2: Detailed Purchases
    writer.writerow(["=== MATERIAL PURCHASES & INVOICES ==="])
    writer.writerow(["Purchase ID", "Date", "Material Name", "Category", "Quantity", "Unit", "Rate per Unit (INR)", "Total Amount (INR)", "Supplier / Store", "Bill / Challan No", "Payment Mode", "Notes"])
    
    for p in purchases:
        p_date = getattr(p, "purchase_date", None) or getattr(p, "date", None)
        p_date_str = p_date.strftime("%Y-%m-%d") if hasattr(p_date, "strftime") else str(p_date or "")
        mat = material_map.get(getattr(p, "material_id", None))
        mat_name = mat.name if mat else getattr(p, "material_name", "Material")
        unit = mat.unit if mat else getattr(p, "unit", "")
        
        writer.writerow([
            p.id,
            p_date_str,
            mat_name,
            getattr(mat, "category", "") if mat else "",
            getattr(p, "quantity", ""),
            unit,
            format_paisa_to_rupees(getattr(p, "rate_per_unit", getattr(p, "unit_price", 0))),
            format_paisa_to_rupees(getattr(p, "total_amount", getattr(p, "amount", 0))),
            getattr(p, "supplier", "") or getattr(p, "vendor", "") or "",
            getattr(p, "bill_number", "") or getattr(p, "challan_number", "") or "",
            getattr(p, "payment_mode", "") or "Cash",
            getattr(p, "notes", "") or ""
        ])
        
    csv_data = output.getvalue()
    filename = f"gharhishob_materials_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.csv"
    
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )


@router.get("/monthly-report")
def export_monthly_report_csv(
    year: int = Query(..., ge=2000, le=2100),
    month: int = Query(..., ge=1, le=12),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    expenses = db.query(Expense).filter(
        Expense.user_id == current_user.id,
        extract("year", Expense.date) == year,
        extract("month", Expense.date) == month
    ).order_by(Expense.date.asc()).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    month_name = datetime(year, month, 1).strftime("%B %Y")
    
    writer.writerow([f"=== GHARHISHOB MONTHLY EXPENSE REPORT - {month_name.upper()} ==="])
    writer.writerow([])
    
    # Category summary
    category_totals = {}
    construction_total = 0
    home_total = 0
    grand_total = 0
    
    for exp in expenses:
        cat = getattr(exp, "category", "Other") or "Other"
        category_totals[cat] = category_totals.get(cat, 0) + exp.amount
        if getattr(exp, "expense_type", "") == "construction":
            construction_total += exp.amount
        else:
            home_total += exp.amount
        grand_total += exp.amount
        
    writer.writerow(["SUMMARY OVERVIEW"])
    writer.writerow(["Construction Expenses (INR)", format_paisa_to_rupees(construction_total)])
    writer.writerow(["Home Expenses (INR)", format_paisa_to_rupees(home_total)])
    writer.writerow(["Grand Total (INR)", format_paisa_to_rupees(grand_total)])
    writer.writerow([])
    
    writer.writerow(["CATEGORY BREAKDOWN"])
    writer.writerow(["Category", "Total Spent (INR)", "% of Month Total"])
    for cat, total in sorted(category_totals.items(), key=lambda x: x[1], reverse=True):
        pct = round((total / grand_total * 100), 1) if grand_total > 0 else 0.0
        writer.writerow([cat, format_paisa_to_rupees(total), f"{pct}%"])
    writer.writerow([])
    
    writer.writerow(["TRANSACTION DETAILS"])
    writer.writerow(["Date", "Title / Item", "Category", "Type", "Amount (INR)", "Payment Mode", "Paid To", "Bill No", "Notes"])
    for exp in expenses:
        writer.writerow([
            exp.date.strftime("%Y-%m-%d") if hasattr(exp.date, "strftime") else str(exp.date),
            getattr(exp, "title", "") or getattr(exp, "description", ""),
            getattr(exp, "category", ""),
            getattr(exp, "expense_type", ""),
            format_paisa_to_rupees(exp.amount),
            getattr(exp, "payment_mode", "") or "",
            getattr(exp, "paid_to", "") or "",
            getattr(exp, "bill_number", "") or "",
            getattr(exp, "notes", "") or ""
        ])
        
    csv_data = output.getvalue()
    filename = f"gharhishob_monthly_report_{year}_{month:02d}.csv"
    
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
