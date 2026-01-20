from fastapi import APIRouter, Depends
from datetime import date
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.schemas.dashboard_stats import DashboardStats
from app.models.booking import Booking
from app.models.room import Room

router = APIRouter(prefix="/dashboard-stats", tags=["stats"])

@router.get("", response_model=DashboardStats)
def fet_dashboard_stats(db: Session = Depends(get_db)):
    today = date.today()
    
    arrivals = db.query(Booking).filter(
        Booking.date_from == today,
        Booking.status == "confirmed"
    ).count()
    
    departures = db.query(Booking).filter(
        Booking.date_to == today,
        Booking.status == "checked in"
    ).count ()
    
    available_rooms = db.query(Room).filter(
        Room.room_status == "available"
    ).count()
    
    in_house = db.query(Booking).filter(
        Booking.status == "checked_in"
    ).count()
    
    return {
        "arrivals_today": arrivals,
        "departures_today": departures,
        "available_rooms": available_rooms,
        "guests_in_house": in_house
    }
