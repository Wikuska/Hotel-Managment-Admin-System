from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models import Room, Guest, Booking
from app.schemas import RoomCreate, GuestCreate, BookingCreate, BookingStatusEnum, GuestUpdate

# -- ROOMS --

def get_rooms(db: Session):
    return db.query(Room).all()

def get_room(db:Session, room_id:int):
    return db.query(Room).filter(Room.id == room_id).first()

def create_room(db: Session, room_data: RoomCreate):
    db_room = Room(**room_data.model_dump())
    db.add(db_room)
    try:
        db.commit()
        db.refresh(db_room)
        return db_room
    except Exception:
        db.rollback()
        return None
    
def update_room(db:Session, room_id:int, room_data:RoomCreate):
    db_room = db.query(Room).filter(Room.id == room_id).first()
    
    if not db_room:
        return None
    
    update_data = room_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_room, key, value)
        
    db.commit()
    db.refresh(db_room)
    return db_room

def delete_room(db:Session, room_id:int):
    db_room = db.query(Room).filter(Room.id == room_id).first()
    
    if not db_room:
        return False
    
    db.delete(db_room)
    db.commit()
    return True


# -- GUESTS --

def get_guests(db: Session):
    return db.query(Guest).all()

def get_guest(db: Session, guest_id: int):
    return db.query(Guest).filter(Guest.id == guest_id).first()

def create_guest(db: Session, guest_data: GuestCreate):
    db_guest = Guest(**guest_data.model_dump())
    db.add(db_guest)
    try:
        db.commit()
        db.refresh(db_guest)
        return db_guest
    except IntegrityError:
        db.rollback()
        return None
    
def update_guest(db:Session, guest_id:int, guest_data:GuestUpdate):
    db_guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not db_guest:
        return None
    update_data = guest_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_guest, key, value)
        
    try:
        db.commit()
        db.refresh(db_guest)
        return db_guest
    except IntegrityError:
        db.rollback()
        return False
    
def delete_guest(db:Session, guest_id:int):
    db_guest = db.query(Guest).filter(Guest.id == guest_id).first()
    
    if not db_guest:
        return False
    
    db.delete(db_guest)
    db.commit()
    return True


# -- BOOKINGS --

def get_bookings(db: Session):
    return db.query(Booking).all()

def create_booking(db:Session, booking_data:BookingCreate):
    
    conflict = (
        db.query(Booking)
        .filter(Booking.room_id == booking_data.room_id)
        .filter(Booking.status.in_(["confirmed", "checked in"])) 
        .filter(booking_data.date_from < Booking.date_to)
        .filter(booking_data.date_to > Booking.date_from)
        .first()
    )
    
    if conflict:
        return None
    
    db_booking = Booking(**booking_data.model_dump(), status="confirmed")
    
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

def cancel_booking(db: Session, booking_id: int):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        return False
    
    booking.status = "cancelled"
    db.commit()
    return True


# -- STATS --

def get_dashboard_stats(db:Session):
    today = date.today()
    
    arrivals = db.query(Booking).filter(
        Booking.date_from == today,
        Booking.status == BookingStatusEnum.CONFIRMED
    ).count()
    
    departures = db.query(Booking).filter(
        Booking.date_to == today,
        Booking.status == BookingStatusEnum.CHECKED_IN
    ).count()
    
    available_rooms_count = db.query(Room).filter(
        Room.room_status == "available"
    ).count()
    
    in_house = db.query(Booking).filter(
        Booking.status == BookingStatusEnum.CHECKED_IN
    ).count()
    
    return {
        "arrivals_today": arrivals,
        "departures_today": departures,
        "available_rooms": available_rooms_count,
        "guests_in_house": in_house
    }