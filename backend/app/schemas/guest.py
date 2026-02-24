from pydantic import BaseModel
from typing import Optional

class GuestCreate(BaseModel):
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone: Optional[str] = None

class GuestRead(GuestCreate):
    id: int

    class Config:
        from_attributes = True
