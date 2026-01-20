from pydantic import BaseModel
import enum

class RoomStatusEnum(str, enum.Enum):
    AVAILABLE = "available"
    OCCUPIED = "occupied"
    DIRTY = "dirty"
    CLEANING = "cleaning"
    MAINTENANCE = "maintenance"

class RoomCreate(BaseModel):
    number: str
    floor: int
    beds: int
    room_status: RoomStatusEnum

class RoomRead(BaseModel):
    id: int
    number: str
    floor: int
    beds: int
    room_status: RoomStatusEnum

    class Config:
        from_attributes = True
