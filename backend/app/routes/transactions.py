from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from app.models.user import User
from app.models.transaction import Transaction, TransactionCreate, TransactionResponse
from app.utils.auth import get_current_user

router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.post("/add", response_model=TransactionResponse)
async def add_transaction(
    txn_data: TransactionCreate,
    current_user: User = Depends(get_current_user)
):
    detected_category = "Food" if "mess" in txn_data.description.lower() else "General"
    
    transaction = Transaction(
        user_id=current_user.id,
        amount=txn_data.amount,
        description=txn_data.description,
        merchant=txn_data.merchant or "Unknown",
        category=detected_category,
        transaction_type=txn_data.transaction_type,
        payment_method=txn_data.payment_method or "Cash",
        date=txn_data.date or datetime.now()
    )
    await transaction.insert()
    
    return TransactionResponse(
        id=str(transaction.id),
        amount=transaction.amount,
        category=transaction.category,
        description=transaction.description,
        date=transaction.date,
        category_confidence=1.0
    )

@router.get("/", response_model=List[Transaction])
async def get_transactions(
    limit: int = 50,
    current_user: User = Depends(get_current_user)
):
    # This matches the GET /api/transactions/ call
    return await Transaction.find(
        Transaction.user_id == current_user.id
    ).sort("-date").limit(limit).to_list()