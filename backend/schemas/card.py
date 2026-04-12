from pydantic import BaseModel

class Card(BaseModel):
    id: str
    title: str
    affirmation: str
    color: int = 0
    x: float = 100
    y: float = 100
    emoji: str = "*"

    class Config:
        from_attributes = True 