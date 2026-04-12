from sqlalchemy import Column, String, Float, Integer, ForeignKey
from database.base import Base


class CardDB(Base):
    __tablename__ = "cards"
    id          = Column(String, primary_key=True)
    title       = Column(String, nullable=False)
    affirmation = Column(String, nullable=False)
    color       = Column(Integer, nullable=False, default=100)
    x           = Column(Float, nullable=False, default=100)
    y           = Column(Float, nullable=False, default=100)
    emoji       = Column(String, nullable=False, default="*")
