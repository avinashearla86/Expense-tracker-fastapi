from fastapi import APIRouter, Depends, HTTPException # type: ignore
from sqlalchemy.orm import Session # type: ignore
from .. import models, database, auth
from pydantic import BaseModel # type: ignore
from typing import List
from app.database import get_db

router = APIRouter()

class ExpenseCreate(BaseModel):
    title: str
    amount: float
    category: str

class ExpenseOut(ExpenseCreate):
    id: int
    class Config:
        from_attributes = True

@router.get("/expenses", response_model=List[ExpenseOut])
def get_expenses(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    return db.query(models.Expense).filter(models.Expense.user_id == current_user.id).all()

@router.post("/expenses", response_model=ExpenseOut)
def create_expense(expense: ExpenseCreate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    new_expense = models.Expense(**expense.dict(), user_id=current_user.id)
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense

@router.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    expense = db.query(models.Expense).filter(models.Expense.id == expense_id, models.Expense.user_id == current_user.id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    db.delete(expense)
    db.commit()
    return {"msg": "Expense deleted"}

@router.put("/expenses/{expense_id}", response_model=ExpenseOut)
def update_expense(
    expense_id: int,
    updated_data: ExpenseCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    expense = db.query(models.Expense).filter(
        models.Expense.id == expense_id,
        models.Expense.user_id == current_user.id
    ).first()

    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    expense.title = updated_data.title
    expense.amount = updated_data.amount
    expense.category = updated_data.category

    db.commit()
    db.refresh(expense)
    return expense