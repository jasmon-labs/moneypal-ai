import os
import google.generativeai as genai
from fastapi import APIRouter, Depends, HTTPException
from app.utils.auth import get_current_user
from app.models.user import User
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()
router = APIRouter(tags=["AI Coach"])

api_key = os.getenv("GEMINI_API_KEY")

if api_key:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('models/gemini-2.0-flash')
else:
    print("❌ ERROR: GEMINI_API_KEY not found in .env")

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat_with_coach(request: ChatRequest, current_user: User = Depends(get_current_user)):
    try:
        system_context = (
            f"You are MoneyPal AI for {current_user.full_name}. "
            "Budget: $5k income, $1.4k expenses. "
            "Give personalized, varied advice. Do not repeat previous phrases. "
            "Always conclude with: 'Would you like me to track this goal on your dashboard?'"
        )
        
        config = genai.types.GenerationConfig(temperature=0.8)
        
        response = model.generate_content(
            f"{system_context}\n\nUser: {request.message}",
            generation_config=config
        )
        
        if response.text:
            return {"reply": response.text}
        return {"reply": "I'm looking into your finances... could you rephrase that slightly?"}

    except Exception as e:
        print(f"AI ERROR: {str(e)}")
        if "429" in str(e):
             return {"reply": "I'm crunching numbers a bit too fast! Let's pause for 10 seconds. 🚀"}
        
        return {"reply": "I hit a snag analyzing that. Try asking me in a different way, or mention a specific budget item!"}
