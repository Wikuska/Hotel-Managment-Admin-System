from fastapi import FastAPI

from app.api.rooms import router as rooms_router
from app.api.guests import router as guests_router
from app.api.bookings import router as bookings_router
from app.api.dashboard_stats import router as dashboard_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Booking System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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
