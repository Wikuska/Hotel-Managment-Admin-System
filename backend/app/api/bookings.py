from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.deps import get_db
from app.schemas.booking import BookingCreate, BookingRead, BookingUpdate
from app import crud

router = APIRouter(prefix="/bookings", tags=["bookings"])

@router.get("", response_model=List[BookingRead])
def get_bookings(db: Session = Depends(get_db)):
    return crud.get_bookings(db)

@router.post("", response_model=BookingRead)
def create_booking(data: BookingCreate, db: Session = Depends(get_db)):
    
    if data.date_to <= data.date_from:
        raise HTTPException(status_code=400, detail="Check out date must be after check in date")

    if not crud.get_room(db, data.room_id):
        raise HTTPException(status_code=404, detail="Room not found")
    if not crud.get_guest(db, data.guest_id):
        raise HTTPException(status_code=404, detail="Guest not found")

    if not crud.is_room_available(db, data.room_id, data.date_from, data.date_to):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Room is already booked in this date range"
        )
    
    booking = crud.create_booking(db, data)
    
    if booking is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="A database error occured while creating the booking"
        )
        
    return booking

@router.patch("/{booking_id}", response_model=BookingRead)
def update_booking(booking_id: int, data: BookingUpdate, db: Session = Depends(get_db)):
    
    db_booking = crud.get_booking(db, booking_id)
    if not db_booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if not crud.is_room_available(
        db, 
        data.room_id if data.room_id is not None else db_booking.room_id, 
        data.date_from if data.date_from is not None else db_booking.date_from, 
        data.date_to if data.date_to is not None else db_booking.date_to,
        exclude_booking_id=booking_id
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Room is already booked in this date range"
        )
    
    updated_booking = crud.update_booking(db, db_booking, data)
    if not updated_booking:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update booking"
        )
    return updated_booking