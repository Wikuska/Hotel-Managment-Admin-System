from fastapi import APIRouter, Depends, HTTPException, status
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
    room = Room(**data.model_dump())
    db.add(room)

    try:
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=400, detail="Room number must be unique (or invalid data)")

    db.refresh(room)
    return room

@router.put("/update/{room_id}", response_model=RoomRead)
def update_room(room_id: int, data: RoomCreate, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Guest not found")
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(room, key, value)
        
    db.commit()
    db.refresh(room)
    return room

@router.delete("/delete/{room_id}")
def delete_room(room_id: int, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    db.delete(room)
    db.commit
    return {"deleted":True}
