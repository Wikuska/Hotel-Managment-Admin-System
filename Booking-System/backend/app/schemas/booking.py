from datetime import date, datetime
from pydantic import BaseModel
import enum

class BookingStatusEnum(str, enum.Enum):
    CONFIRMED = "confirmed",
    CHECKED_IN = "checked in",
    CHECKED_OUT = "checked out",
    CANCELLED = "cancelled"
    NO_SHOW = "no show"


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

    class Config:
        from_attributes = True
