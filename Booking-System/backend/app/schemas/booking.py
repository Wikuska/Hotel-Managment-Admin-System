from datetime import date, datetime
from pydantic import BaseModel

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
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
