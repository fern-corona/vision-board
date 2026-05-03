
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.session import get_db
from models.card_db import CardDB
from models.sticker_db import StickerDB
from schemas.board import BoardData

router = APIRouter(prefix="/board", tags=["board"])

DAY_ORDER = {
    "Mon": 0,
    "Tue": 1,
    "Wed": 2,
    "Thu": 3,
    "Fri": 4,
    "Sat": 5,
    "Sun": 6,
}

@router.get("/", response_model=BoardData)
def get_board(db: Session = Depends(get_db)):
    cards = db.query(CardDB).all()
    stickers = db.query(StickerDB).all()

    stickers_by_card = {}
    for s in stickers: 
        stickers_by_card.setdefault(s.card_id, []).append(s)
    result_cards = []
    
    for c in cards:
        result_cards.append({
            "id": c.id,
            "title": c.title,
            "affirmation": c.affirmation,
            "color": c.color,
            "x": c.x,
            "y": c.y,
            "emoji": c.emoji,
            "stickers": stickers_by_card.get(c.id, [])
        })

    return {
        "cards": result_cards,
    }


@router.post("/")
def save_board(data: BoardData, db: Session = Depends(get_db)):

    incoming_card_ids = {c.id for c in data.cards}

    for db_card in db.query(CardDB).all():
        if db_card.id not in incoming_card_ids:
            db.delete(db_card)

    for c in data.cards:
        existing = db.get(CardDB, c.id)

        if existing:
            existing.title = c.title
            existing.affirmation = c.affirmation
            existing.color = c.color
            existing.x = c.x
            existing.y = c.y
            existing.emoji = c.emoji
        else:
            db.add(CardDB(**c.model_dump(exclude={"stickers"})))

    db.flush()

    db.query(StickerDB).delete()
    for c in data.cards:
        for s in getattr(c, "stickers", []):
            if s.card_id is None:
                continue

            db.add(StickerDB(
                id=s.id,
                day=s.day,
                x=s.x,
                y=s.y,
                card_id=c.id,
                status=s.status
            ))

    db.commit()

    return get_board(db)