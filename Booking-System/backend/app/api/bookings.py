from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.deps import get_db
from app.models.booking import Booking
from app.models.room import Room
from app.models.guest import Guest
from app.schemas.booking import BookingCreate, BookingRead

router = APIRouter(prefix="/bookings", tags=["bookings"])

@router.get("", response_model=List[BookingRead])
def get_bookings(db: Session = Depends(get_db)):
    return db.query(Booking).all()

@router.post("", response_model=BookingRead)
def create_booking(data: BookingCreate, db: Session = Depends(get_db)):
    if data.date_to <= data.date_from:
        raise HTTPException(status_code=400, detail="date_to must be after date_from")

    if not db.query(Room).filter(Room.id == data.room_id).first():
        raise HTTPException(status_code=404, detail="Room not found")
    if not db.query(Guest).filter(Guest.id == data.guest_id).first():
        raise HTTPException(status_code=404, detail="Guest not found")

    conflict = (
        db.query(Booking)
        .filter(Booking.room_id == data.room_id)
        .filter(Booking.status == "active")
        .filter(data.date_from < Booking.date_to)
        .filter(data.date_to > Booking.date_from)
        .first()
    )
    if conflict:
        raise HTTPException(status_code=409, detail="Room is already booked in this date range")

    booking = Booking(**data.model_dump(), status="active")
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking

@router.post("/{booking_id}/cancel")
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking.status = "cancelled"
    db.commit()
    return {"cancelled": True}
