from datetime import datetime, date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract

from ..database import get_db
from ..models import User, Budget, Expense
from ..schemas import BudgetCreate, BudgetUpdate, BudgetResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/budgets", tags=["budgets"])


def calculate_budget_spent(budget: Budget, db: Session, user_id: int) -> int:
    """Calculate total spent amount in paisa for a given budget."""
    query = db.query(func.coalesce(func.sum(Expense.amount), 0)).filter(Expense.user_id == user_id)
    
    # Filter by category if it's a category-specific budget
    if getattr(budget, "category", None):
        query = query.filter(Expense.category == budget.category)
    elif getattr(budget, "budget_type", None) == "category" and getattr(budget, "category", None):
        query = query.filter(Expense.category == budget.category)
        
    # Filter by month/year if specified
    month = getattr(budget, "month", None)
    year = getattr(budget, "year", None)
    if month and year:
        query = query.filter(
            extract("year", Expense.date) == year,
            extract("month", Expense.date) == month
        )
    elif year:
        query = query.filter(extract("year", Expense.date) == year)
        
    # Filter by start_date/end_date if specified
    start_date = getattr(budget, "start_date", None)
    end_date = getattr(budget, "end_date", None)
    if start_date:
        query = query.filter(Expense.date >= start_date)
    if end_date:
        query = query.filter(Expense.date <= end_date)
        
    spent = query.scalar() or 0
    return int(spent)


def format_budget_dict(budget: Budget, db: Session, user_id: int) -> dict:
    """Serialize budget and append calculated spent and remaining amounts."""
    data = {c.name: getattr(budget, c.name) for c in budget.__table__.columns}
    spent = calculate_budget_spent(budget, db, user_id)
    
    total_amount = getattr(budget, "amount", None)
    if total_amount is None:
        total_amount = getattr(budget, "total_amount", 0)
        
    remaining = total_amount - spent
    percentage = round((spent / total_amount * 100), 1) if total_amount > 0 else 0.0
    
    data["spent_amount"] = spent
    data["spent"] = spent
    data["remaining_amount"] = remaining
    data["remaining"] = remaining
    data["percentage_used"] = percentage
    data["percentage"] = percentage
    return data


@router.get("/", response_model=List[dict])
def list_budgets(
    month: Optional[int] = Query(None, ge=1, le=12),
    year: Optional[int] = Query(None, ge=2000, le=2100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Budget).filter(Budget.user_id == current_user.id)
    
    if hasattr(Budget, "month") and month is not None:
        query = query.filter(Budget.month == month)
    if hasattr(Budget, "year") and year is not None:
        query = query.filter(Budget.year == year)
        
    budgets = query.order_by(Budget.id.desc()).all()
    return [format_budget_dict(b, db, current_user.id) for b in budgets]


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_budget(
    budget_in: BudgetCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    budget_data = budget_in.model_dump() if hasattr(budget_in, "model_dump") else budget_in.dict()
    new_budget = Budget(**budget_data, user_id=current_user.id)
    db.add(new_budget)
    db.commit()
    db.refresh(new_budget)
    return format_budget_dict(new_budget, db, current_user.id)


@router.get("/{budget_id}")
def get_budget(
    budget_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    budget = db.query(Budget).filter(Budget.id == budget_id, Budget.user_id == current_user.id).first()
    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Budget with ID {budget_id} not found"
        )
    return format_budget_dict(budget, db, current_user.id)


@router.put("/{budget_id}")
def update_budget(
    budget_id: int,
    budget_in: BudgetUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    budget = db.query(Budget).filter(Budget.id == budget_id, Budget.user_id == current_user.id).first()
    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Budget with ID {budget_id} not found"
        )
        
    update_data = budget_in.model_dump(exclude_unset=True) if hasattr(budget_in, "model_dump") else budget_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(budget, field, value)
        
    if hasattr(budget, "updated_at"):
        setattr(budget, "updated_at", datetime.utcnow())
        
    db.commit()
    db.refresh(budget)
    return format_budget_dict(budget, db, current_user.id)


@router.delete("/{budget_id}", status_code=status.HTTP_200_OK)
def delete_budget(
    budget_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    budget = db.query(Budget).filter(Budget.id == budget_id, Budget.user_id == current_user.id).first()
    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Budget with ID {budget_id} not found"
        )
        
    db.delete(budget)
    db.commit()
    return {"message": "Budget deleted successfully", "id": budget_id}
