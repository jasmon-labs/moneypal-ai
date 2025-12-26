import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from app.models.user import User
from app.models.transaction import Transaction 
from app.routes import ai_coach, auth, transactions

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    uri = os.getenv("MONGODB_URI")
    if not uri:
        uri = "mongodb+srv://debug0197_db_user:finwise123@cluster0.taer7in.mongodb.net/finwise?retryWrites=true&w=majority"
    
    try:
        client = AsyncIOMotorClient(uri)
        await client.admin.command('ping')
        # Initialize BOTH User and Transaction models
        await init_beanie(database=client.finwise, document_models=[User, Transaction])
        print("✅ MoneyPal Backend Initialized")
        yield
    except Exception as e:
        print(f"❌ Connection Failed: {e}")
        raise e
    finally:
        if 'client' in locals():
            client.close()

app = FastAPI(title="MoneyPal AI API", lifespan=lifespan)

origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(ai_coach.router, prefix="/api", tags=["AI Coach"])
app.include_router(transactions.router, prefix="/api", tags=["Transactions"])

@app.get("/")
def read_root():
    return {"message": "MoneyPal Backend is Running! 🚀"}
