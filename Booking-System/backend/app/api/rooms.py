from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.deps import get_db
from app.models.room import Room
from app.schemas.room import RoomCreate, RoomRead

router = APIRouter(prefix="/rooms", tags=["rooms"])

@router.get("", response_model=List[RoomRead])
def get_rooms(db: Session = Depends(get_db)):
    return db.query(Room).all()

@router.post("", response_model=RoomRead)
def create_room(data: RoomCreate, db: Session = Depends(get_db)):
    room = Room(**data.model_dump(), is_active=True)
    db.add(room)

    try:
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=400, detail="Room number must be unique (or invalid data)")

    db.refresh(room)
    return room
