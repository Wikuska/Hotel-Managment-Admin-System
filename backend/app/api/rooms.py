from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List

from app.db.deps import get_db
from app.schemas import RoomCreate, RoomRead, RoomUpdate
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
            status_code=status.HTTP_409_CONFLICT,
            detail="Room number must be unique"
        )
    return room

@router.patch("/{room_id}", response_model=RoomRead)
def update_room(room_id: int, data: RoomUpdate, db: Session = Depends(get_db)):
    db_room = crud.get_room(db, room_id)
    if not db_room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    
    updated_room, err, msg = crud.update_room(db, db_room, data)

    if err == "invalid_transition":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=msg)
    if err == "db_error":
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail=msg)
    if updated_room is None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Failed to update room")

    return updated_room

@router.delete("/{room_id}")
def delete_room(room_id: int, db: Session = Depends(get_db)):
    db_room = crud.get_room(db, room_id)
    if not db_room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    try:
        db.delete(db_room)
        db.commit()
    
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Cannot delete room linked to active booking")
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)