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
    stickers = db.query(StickerDB).all()
    cards = db.query(CardDB).all()

    card_map = {c.id: c for c in cards}

    counts = {}
    for s in stickers: 
        if s.card_id and s.card_id in card_map: 
            counts[s.card_id] = counts.get(s.card_id, 0) + 1

    total = sum(counts.values())

    insights = []
    for card_id, count in counts.items():
        card = card_map[card_id]
        pct_week = round((count/7)*100)
        insights.append({
            "card_title": card.title, 
            "emoji": card.emoji,
            "days_count": count, 
            "percentage": pct_week,
            "message": get_message(pct_week),
        })
    return {
        "insights": sorted(insights, key=lambda x: -x["days_count"]),
        "total_days_tracked": total,
        "unassigned_days": [s.day for s in stickers if not s.card_id],
        "streak_message": get_streak_message(total),

    }

            
