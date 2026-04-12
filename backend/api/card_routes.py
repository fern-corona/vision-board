from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.session import get_db
from models.card_db import CardDB
from schemas.card import Card

router = APIRouter(prefix="/cards", tags=["cards"])

@router.get("/",response_model=list[Card])
def get_cards(db: Session = Depends(get_db)):
    return db.query(CardDB).all()


@router.post("/", response_model=Card)
def create_card(card: Card, db: Session = Depends(get_db)):
    db_card = CardDB(**card.dict())
    db.add(db_card)
    db.commit()
    db.refresh(db_card)
    return db_card


@router.delete("/{card_id}")
def delete_card(card_id: str, db: Session = Depends(get_db)):
    card = db.get(CardDB, card_id)
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    db.delete(card)
    db.commit()
    return {"status": "deleted"}