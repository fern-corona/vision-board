from sqlalchemy import create_engine, Column, String, Float, Integer, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, Session, relationship
from typing import Optional, List, Literal
from pydantic import BaseModel


class Sticker(BaseModel): 
    id:  str
    day: str
    x:   float = 160
    y:   float = 680
    card_id: Optional[str] = None 
    status: Literal["none", "complete", "incomplete"] = "none"

    class Config: 
        from_attributes = True
