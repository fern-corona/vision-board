from sqlalchemy import create_engine
import os
# from core.config import DATABASE_URL TODO: Dev comment
DATABASE_URL = os.environ["DATABASE_URL"]
engine = create_engine(os.environ["DATABASE_URL"])