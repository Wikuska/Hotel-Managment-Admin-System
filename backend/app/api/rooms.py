from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.deps import get_db
from app.schemas import RoomCreate, RoomRead
from app import crud

router = APIRouter(prefix="/rooms", tags=["rooms"])

@router.get("", response_model=List[RoomRead])
def get_rooms(db: Session = Depends(get_db)):
    return crud.get_rooms(db)

@router.post("", response_model=RoomRead, status_code=status.HTTP_201_CREATED)
def create_room(data: RoomCreate, db: Session = Depends(get_db)):
    room = crud.create_room(db, data)
    if room is None:
        raise HTTPException(
            status_code=400,
            detail="Room number must be unique (or invalid data)"
        )
    return room

@router.put("/update/{room_id}", response_model=RoomRead)
def update_room(room_id: int, data: RoomCreate, db: Session = Depends(get_db)):
    room = crud.update_room(db, room_id, data)
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    return room

@router.delete("/delete/{room_id}")
def delete_room(room_id: int, db: Session = Depends(get_db)):
    success = crud.delete_room(db, room_id)
    if not success:
        raise HTTPException(status_code=404, detail="Room not found")
    return {"deleted": True}