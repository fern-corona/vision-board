from sqlalchemy import Column, String, Float, Integer, ForeignKey
from sqlalchemy.orm import declarative_base #TODO: figure out if this is necessary
from database.base import Base

class StickerDB(Base): 
    __tablename__ = "stickers"
    id      = Column(String, primary_key=True)
    day     = Column(String, nullable=False)
    x       = Column(Float, nullable=False, default=100)
    y       = Column(Float, nullable=False, default=160)
    card_id = Column(String, ForeignKey("cards.id", ondelete="SET NULL"), nullable=True)
    status = Column(String, nullable=False, default="none")
