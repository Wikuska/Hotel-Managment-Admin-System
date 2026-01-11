from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.deps import get_db
from app.models.guest import Guest
from app.schemas.guest import GuestCreate, GuestRead

router = APIRouter(prefix="/guests", tags=["guests"])

@router.get("", response_model=List[GuestRead])
def get_guests(db: Session = Depends(get_db)):
    return db.query(Guest).all()

@router.post("", response_model=GuestRead)
def create_guest(data: GuestCreate, db: Session = Depends(get_db)):
    guest = Guest(**data.model_dump())
    db.add(guest)

    try:
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email must be unique (or invalid data)")

    db.refresh(guest)
    return guest

@router.delete("/{guest_id}")
def delete_room(guest_id: int, db: Session = Depends(get_db)):
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Room not found")
    
    db.delete(guest)
    db.commit()
    return {"deleted":True}
