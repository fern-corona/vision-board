from sqlalchemy import create_engine
from core.config import DATABASE_URL

engine = create_engine(DATABASE_URL)