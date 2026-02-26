from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional

class GuestCreate(BaseModel):
    first_name: str = Field(..., min_length=2, max_length=50)
    last_name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    phone: str = Field(pattern=r"^\+?[0-9\s\-]{9,15}$")

class GuestUpdate(BaseModel):
    first_name: Optional[str] = Field(None, min_length=2, max_length=50)
    last_name: Optional[str] = Field(None, min_length=2, max_length=50)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, pattern=r"^\+?[0-9\s\-]{9,15}$")

class GuestRead(GuestCreate):
    id: int

    class Config:
        from_attributes = True
