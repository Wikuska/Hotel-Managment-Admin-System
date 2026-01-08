from pydantic import BaseModel

class RoomCreate(BaseModel):
    number: str
    floor: int
    beds: int

class RoomRead(BaseModel):
    id: int
    number: str
    floor: int
    beds: int
    is_active: bool

    class Config:
        from_attributes = True
