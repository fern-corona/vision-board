
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.session import get_db
from models.card_db import CardDB
from models.sticker_db import StickerDB
from schemas.board import BoardData

router = APIRouter(prefix="/board", tags=["board"])

@router.get("/", response_model=BoardData)
def get_board(db: Session = Depends(get_db)):
    return {
        "cards":    db.query(CardDB).all(),
        "stickers": db.query(StickerDB).all(),
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
            existing.title = c.title; existing.affirmation = c.affirmation
            existing.color = c.color; existing.x = c.x; existing.y = c.y; existing.emoji = c.emoji
        else: 
            db.add(CardDB(**c.dict()))
    db.flush()
    incoming_sticker_ids = {s.id for s in data.stickers}
    for db_sticker in db.query(StickerDB).all():
        if (db_sticker.id not in incoming_sticker_ids) or db_sticker.card_id is None : 
            db.delete(db_sticker)
    for s in data.stickers: 
        existing = db.get(StickerDB, s.id)
    
        if existing: 
            if existing and s.card_id is None: 
                db.delete(existing)
            else: 
                existing.day = s.day; existing.x = s.x; existing.y = s.y; existing.card_id = s.card_id
        else: 
            if s.card_id is not None:
                db.add(StickerDB(**s.dict()))
    db.commit()
    return get_board(db)

