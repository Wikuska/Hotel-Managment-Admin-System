from datetime import date, datetime
from pydantic import BaseModel
import enum

class BookingStatusEnum(str, enum.Enum):
    CONFIRMED = "confirmed"
    CHECKED_IN = "checked_in"
    CHECKED_OUT = "checked_out"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"

class RoomSummary(BaseModel):
    id: int
    number: str
    
    class Config:
        from_attributes = True

class GuestSummary(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    
    class Config:
        from_attributes = True

class BookingCreate(BaseModel):
    room_id: int
    guest_id: int
    date_from: date
    date_to: date

class BookingRead(BaseModel):
    id: int
    room_id: int
    guest_id: int
    date_from: date
    date_to: date
    status: BookingStatusEnum
    created_at: datetime
    room: RoomSummary
    guest: GuestSummary

    class Config:
        from_attributes = True
