from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models import Room, Guest, Booking
from app.schemas import RoomCreate, GuestCreate, BookingCreate, BookingStatusEnum, GuestUpdate, BookingUpdate, RoomUpdate, RoomStatusEnum
from app.services.booking_rules import validate_booking_status_transition, apply_room_status_after_booking_status_change

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

def has_active_checked_in_booking(db: Session, room_id: int):
    return (
        db.query(Booking)
        .filter(Booking.room_id == room_id)
        .filter(Booking.status == BookingStatusEnum.CHECKED_IN.value)
        .first()
        is not None
    )

def validate_room_status_transition(db: Session, room: Room, new_status: str):
    old_status = room.room_status
    if new_status == old_status:
        return True, None

    if new_status == RoomStatusEnum.OCCUPIED.value:
        return False, "Room status 'occupied' is controlled by bookings (check-in)."

    if has_active_checked_in_booking(db, room.id):
        return False, "Cannot change room status while a guest is checked in."

    allowed = {
        RoomStatusEnum.DIRTY.value: {RoomStatusEnum.AVAILABLE.value, RoomStatusEnum.MAINTENANCE.value},
        RoomStatusEnum.AVAILABLE.value: {RoomStatusEnum.MAINTENANCE.value},
        RoomStatusEnum.MAINTENANCE.value: {RoomStatusEnum.AVAILABLE.value},
        RoomStatusEnum.OCCUPIED.value: set(),
    }

    if new_status not in allowed.get(old_status, set()):
        return False, f"Invalid room status transition: {old_status} -> {new_status}"

    return True, None

def update_room(db:Session, room:Room, room_data:RoomUpdate):
    update_data = room_data.model_dump(exclude_unset=True)
    
    if "room_status" in update_data:
        ok, msg = validate_room_status_transition(db, room, update_data["room_status"])
        if not ok:
            return None, "invalid_transition", msg

    try:
        for key, value in update_data.items():
            setattr(room, key, value)

        db.commit()
        db.refresh(room)
        return room, None, None

    except IntegrityError:
        db.rollback()
        return None, "db_error", "Room with this number already exists."


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

def get_booking(db: Session, booking_id: int):
    return db.query(Booking).filter(Booking.id == booking_id).first()

def is_room_available(db: Session, room_id: int, date_from: date, date_to: date, exclude_booking_id: int | None = None):
    
    query = (
        db.query(Booking)
        .filter(Booking.room_id == room_id)
        .filter(Booking.status.in_([BookingStatusEnum.CONFIRMED.value, BookingStatusEnum.CHECKED_IN.value])) 
        .filter(date_from < Booking.date_to)
        .filter(date_to > Booking.date_from)
    )
    
    if exclude_booking_id is not None:
        query = query.filter(Booking.id != exclude_booking_id)
        
    conflict = query.first()
    
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

def update_booking(db:Session, booking:Booking, booking_data:BookingUpdate):
    update_data = booking_data.model_dump(exclude_unset=True)
    
    old_status = booking.status
    new_status = update_data.get("status", old_status)
    
    if "status" in update_data:
        ok, msg = validate_booking_status_transition(old_status, new_status)
        if not ok:
            return None, "invalid_transition", msg
    
    try:
        for key, value in update_data.items():
            setattr(booking, key, value)

        if "status" in update_data and new_status != old_status:
            ok, msg = apply_room_status_after_booking_status_change(db, booking.room_id, new_status)
            if not ok:
                db.rollback()
                return None, "room_error", msg

        db.commit()
        db.refresh(booking)
        return booking, None, None

    except IntegrityError:
        db.rollback()
        return None, "db_error", "Database error"


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