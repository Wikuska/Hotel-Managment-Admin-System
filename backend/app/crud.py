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
    except IntegrityError:
        db.rollback()
        return None
    
def update_room(db:Session, room:Room, room_data:RoomCreate):
    update_data = room_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(room, key, value)
        
    try:
        db.commit()
        db.refresh(room)
        return room
    except IntegrityError:
        db.rollback()
        return None


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
    
def update_guest(db:Session, guest:Guest, guest_data:GuestUpdate):
    update_data = guest_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(guest, key, value)
        
    try:
        db.commit()
        db.refresh(guest)
        return guest
    except IntegrityError:
        db.rollback()
        return None


# -- BOOKINGS --

def get_bookings(db: Session):
    return db.query(Booking).all()

def is_room_available(db: Session, room_id: int, date_from: date, date_to: date):
    
    conflict = (
        db.query(Booking)
        .filter(Booking.room_id == room_id)
        .filter(Booking.status.in_([BookingStatusEnum.CONFIRMED.value, BookingStatusEnum.CHECKED_IN.value])) 
        .filter(date_from < Booking.date_to)
        .filter(date_to > Booking.date_from)
        .first()
    )
    return conflict is None

def create_booking(db:Session, booking_data:BookingCreate):
    
    db_booking = Booking(**booking_data.model_dump(), status = BookingStatusEnum.CONFIRMED.value)
    
    db.add(db_booking)
    try:
        db.commit()
        db.refresh(db_booking)
        return db_booking
    except IntegrityError:
        db.rollback()
        return None

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