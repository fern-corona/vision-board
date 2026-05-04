from pydantic import BaseModel
from typing import List, Optional
from schemas.sticker import Sticker

class Card(BaseModel):
    id: str
    title: str
    affirmation: str
    color: int = 0
    x: float = 100
    y: float = 100
    emoji: str = "*"
    stickers: List[Sticker] = []
    image: Optional[str] = None

    class Config:
        from_attributes = True 