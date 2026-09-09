from datetime import datetime, date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from dateutil.relativedelta import relativedelta

from ..database import get_db
from ..models import User, RecurringExpense, Expense
from ..schemas import RecurringExpenseCreate, RecurringExpenseUpdate, RecurringExpenseResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/recurring", tags=["recurring"])


def calculate_next_due(current_date: date, frequency: str) -> date:
    """Calculate subsequent due date based on recurrence frequency."""
    freq = (frequency or "monthly").lower()
    if freq == "daily":
        return current_date + relativedelta(days=1)
    elif freq == "weekly":
        return current_date + relativedelta(weeks=1)
    elif freq == "monthly":
        return current_date + relativedelta(months=1)
    elif freq == "quarterly":
        return current_date + relativedelta(months=3)
    elif freq == "yearly":
        return current_date + relativedelta(years=1)
    return current_date + relativedelta(months=1)


@router.get("/", response_model=List[dict])
def list_recurring_expenses(
    active_only: bool = Query(False),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(RecurringExpense).filter(RecurringExpense.user_id == current_user.id)
    if active_only:
        query = query.filter(RecurringExpense.is_active == True)
    
    recurring = query.order_by(RecurringExpense.next_due_date.asc(), RecurringExpense.id.desc()).all()
    return [{c.name: getattr(item, c.name) for c in item.__table__.columns} for item in recurring]


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_recurring_expense(
    recurring_in: RecurringExpenseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    data = recurring_in.model_dump() if hasattr(recurring_in, "model_dump") else recurring_in.dict()
    
    # If next_due_date is not set, initialize with start_date or today
    if not data.get("next_due_date"):
        data["next_due_date"] = data.get("start_date") or date.today()
        
    new_item = RecurringExpense(**data, user_id=current_user.id)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return {c.name: getattr(new_item, c.name) for c in new_item.__table__.columns}


@router.get("/{recurring_id}")
def get_recurring_expense(
    recurring_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(RecurringExpense).filter(
        RecurringExpense.id == recurring_id,
        RecurringExpense.user_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recurring expense with ID {recurring_id} not found"
        )
    return {c.name: getattr(item, c.name) for c in item.__table__.columns}


@router.put("/{recurring_id}")
def update_recurring_expense(
    recurring_id: int,
    recurring_in: RecurringExpenseUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(RecurringExpense).filter(
        RecurringExpense.id == recurring_id,
        RecurringExpense.user_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recurring expense with ID {recurring_id} not found"
        )
        
    update_data = recurring_in.model_dump(exclude_unset=True) if hasattr(recurring_in, "model_dump") else recurring_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)
        
    if hasattr(item, "updated_at"):
        setattr(item, "updated_at", datetime.utcnow())
        
    db.commit()
    db.refresh(item)
    return {c.name: getattr(item, c.name) for c in item.__table__.columns}


@router.delete("/{recurring_id}", status_code=status.HTTP_200_OK)
def delete_recurring_expense(
    recurring_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(RecurringExpense).filter(
        RecurringExpense.id == recurring_id,
        RecurringExpense.user_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recurring expense with ID {recurring_id} not found"
        )
        
    db.delete(item)
    db.commit()
    return {"message": "Recurring expense deleted successfully", "id": recurring_id}


@router.post("/{recurring_id}/process", status_code=status.HTTP_201_CREATED)
def process_recurring_expense(
    recurring_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Manually process an individual recurring expense: logs an Expense entry and advances next_due_date."""
    item = db.query(RecurringExpense).filter(
        RecurringExpense.id == recurring_id,
        RecurringExpense.user_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recurring expense with ID {recurring_id} not found"
        )
        
    # Create the expense transaction
    expense_date = item.next_due_date or date.today()
    new_expense = Expense(
        user_id=current_user.id,
        title=item.title,
        amount=item.amount,
        category=item.category,
        expense_type=item.expense_type or "home",
        date=expense_date,
        payment_mode=getattr(item, "payment_mode", "Cash"),
        notes=f"Auto-generated from recurring expense: {item.title}"
    )
    db.add(new_expense)
    
    # Calculate next due date
    item.next_due_date = calculate_next_due(expense_date, item.frequency)
    
    # If passed end_date, deactivate
    if item.end_date and item.next_due_date > item.end_date:
        item.is_active = False
        
    db.commit()
    db.refresh(new_expense)
    db.refresh(item)
    
    return {
        "message": "Expense generated successfully",
        "expense": {c.name: getattr(new_expense, c.name) for c in new_expense.__table__.columns},
        "next_due_date": item.next_due_date
    }


@router.post("/process-due")
def process_all_due_recurring(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Scan and generate expenses for all active recurring items that are due on or before today."""
    today = date.today()
    due_items = db.query(RecurringExpense).filter(
        RecurringExpense.user_id == current_user.id,
        RecurringExpense.is_active == True,
        RecurringExpense.next_due_date <= today
    ).all()
    
    processed_count = 0
    created_expenses = []
    
    for item in due_items:
        expense_date = item.next_due_date or today
        new_exp = Expense(
            user_id=current_user.id,
            title=item.title,
            amount=item.amount,
            category=item.category,
            expense_type=item.expense_type or "home",
            date=expense_date,
            payment_mode=getattr(item, "payment_mode", "Cash"),
            notes=f"Recurring: {item.title} ({item.frequency})"
        )
        db.add(new_exp)
        
        item.next_due_date = calculate_next_due(expense_date, item.frequency)
        if item.end_date and item.next_due_date > item.end_date:
            item.is_active = False
            
        processed_count += 1
        created_expenses.append(item.title)
        
    db.commit()
    return {
        "processed_count": processed_count,
        "processed_items": created_expenses
    }
