from fastapi import APIRouter, Depends, HTTPException, status, Response 
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List

from app.db.deps import get_db
from app.schemas import GuestCreate, GuestRead, GuestUpdate
from app import crud

router = APIRouter(prefix="/guests", tags=["guests"])

# Status 200, if db is empty returns []
@router.get("", response_model=List[GuestRead])
def get_guests(db: Session = Depends(get_db)):
    return crud.get_guests(db)

# Status 422 if passed data types is not corresponding with schema, 409 if email is already registered
@router.post("", response_model=GuestRead, status_code=status.HTTP_201_CREATED)
def create_guest(data: GuestCreate, db: Session = Depends(get_db)):
    guest = crud.create_guest(db, data)
    
    if guest is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Guest with this email already exists."
        )
    return guest
        
@router.put("/{guest_id}", response_model=GuestUpdate)
def update_guest(guest_id: int, data: GuestUpdate, db: Session = Depends(get_db)):
    db_guest = crud.get_guest(db, guest_id)
    if not db_guest:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Guest not found")
    
    updated_guest = crud.update_guest(db, db_guest, data)
    
    if not updated_guest:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
            detail="Guest with this email already exists.")
    
    return updated_guest

@router.delete("/{guest_id}")
def delete_guest(guest_id: int, db: Session = Depends(get_db)):
    db_guest = crud.get_guest(db, guest_id)
    if not db_guest:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Guest not found")
    
    try:
        db.delete(db_guest)
        db.commit()
        
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Cannot delete guest linked to active booking")
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)
        
