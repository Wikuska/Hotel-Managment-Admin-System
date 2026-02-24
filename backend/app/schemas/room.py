from pydantic import BaseModel
import enum

class RoomTypeEnum(str, enum.Enum):
    SINGLE = "single"
    DOUBLE = "double"
    TWIN = "twin"
    TRIPLE_1D1S = "triple_1d1s"
    TRIPLE_3S = "triple_3s"
    QUAD_2D = "quad_2d"
    QUAD_1D2S = "quad_1d2s"
    QUAD_4S = "quad_4s"

class RoomStatusEnum(str, enum.Enum):
    AVAILABLE = "available"
    OCCUPIED = "occupied"
    DIRTY = "dirty"
    CLEANING = "cleaning"
    MAINTENANCE = "maintenance"

class RoomCreate(BaseModel):
    number: str
    floor: int
    capacity:int
    room_type: RoomTypeEnum
    room_status: RoomStatusEnum

class RoomRead(BaseModel):
    id: int
    number: str
    floor: int
    capacity: int
    room_type: RoomTypeEnum
    room_status: RoomStatusEnum

    class Config:
        from_attributes = True
