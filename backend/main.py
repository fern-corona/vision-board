from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import card_routes, board_routes, insights_routes
from database.base import Base
from database.engine import engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(card_routes.router)
app.include_router(board_routes.router)
app.include_router(insights_routes.router)