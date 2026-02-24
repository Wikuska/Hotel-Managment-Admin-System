from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.deps import get_db
from app.models import Guest
from app.schemas import GuestCreate, GuestRead
from app import crud

router = APIRouter(prefix="/guests", tags=["guests"])

@router.get("", response_model=List[GuestRead])
def get_guests(db: Session = Depends(get_db)):
    return crud.get_guests(db)

@router.post("", response_model=GuestRead, status_code=status.HTTP_201_CREATED)
def create_guest(data: GuestCreate, db: Session = Depends(get_db)):
    guest = crud.create_guest(db, data)
    
    if guest is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Guest with this email already exists."
        )
    return guest
        
@router.put("/update/{guest_id}", response_model=GuestRead)
def update_guest(guest_id: int, data: GuestCreate, db: Session = Depends(get_db)):
    result = crud.update_guest(db, guest_id, data)
    
    if result is None:
        raise HTTPException(status_code=404, detail="Guest not found")
    
    if result is False:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already assigned to another guest."
        )
        
    return result

@router.delete("/delete/{guest_id}")
def delete_guest(guest_id: int, db: Session = Depends(get_db)):
    success = crud.delete_guest(db, guest_id)
    if not success:
        raise HTTPException(status_code=404, detail="Guest not found")
    return {"deleted": True}
