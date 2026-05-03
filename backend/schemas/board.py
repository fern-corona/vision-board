
from schemas.card import Card
from schemas.sticker import Sticker
from pydantic import BaseModel
from typing import List

class BoardData(BaseModel): 
    cards: List[Card]
