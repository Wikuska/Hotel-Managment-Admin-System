from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
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
        db.refresh(guest)
        return guest
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Guest with this email already exists."
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {str(e)}"
        )
        
@router.put("/update/{guest_id}", response_model=GuestRead)
def update_guest(guest_id: int, data: GuestCreate, db: Session = Depends(get_db)):
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Guest not found")
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(guest, key, value)
        
    try:
        db.commit()
        db.refresh(guest)
        return guest
        
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already exists assigned to another guest."
        )

@router.delete("/delete/{guest_id}")
def delete_guest(guest_id: int, db: Session = Depends(get_db)):
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")
    
    db.delete(guest)
    db.commit()
    return {"deleted":True}
