from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.session import get_db
from models.card_db import CardDB
from models.sticker_db import StickerDB
from schemas.card import Card
from schemas.sticker import Sticker
from utils.messages import get_message, get_streak_message


router = APIRouter(prefix="/insights", tags=["insights"])

@router.get("/")
def get_insights(db: Session = Depends(get_db)):
    cards = db.query(CardDB).all()

    total_completed = 0
    insights = []

    for card in cards: 
        if not card.stickers: 
            continue 

        total_on_card = len(card.stickers)
        completed_on_card = len([s for s in card.stickers if s.status == "complete"])
        pct = round((completed_on_card / total_on_card) * 100)

        total_completed += completed_on_card

        insights.append({
            "card_title": card.title, 
            "emoji": card.emoji,
            "total_on_card": total_on_card,
            "completed_on_card": completed_on_card,
            "percentage": pct,
            "message": get_message(pct),
        })
    return {
        "insights": sorted(insights, key=lambda x: -x["completed_on_card"]),
        "total_days_tracked": total_completed,
        "unassigned_days": [], #TODO fix this not needed
        "streak_message": get_streak_message(total_completed),

    }

            
