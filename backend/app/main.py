from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.api.rooms import router as rooms_router
from app.api.guests import router as guests_router
from app.api.bookings import router as bookings_router
from app.api.dashboard_stats import router as dashboard_router
from app.models import Booking, Room, Guest
from app.db.session import engine
from app.models import Base
from fastapi.middleware.cors import CORSMiddleware
from app.seed import seed_database

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    seed_database()
    yield

app = FastAPI(title="Booking System API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rooms_router)
app.include_router(guests_router)
app.include_router(bookings_router)
app.include_router(dashboard_router)

@app.get("/health")
def health():
    return {"status": "ok"}
