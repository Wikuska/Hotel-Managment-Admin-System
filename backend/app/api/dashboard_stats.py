from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.schemas import DashboardStats
from app import crud

router = APIRouter(prefix="/dashboard-stats", tags=["stats"])

@router.get("", response_model=DashboardStats)
def fet_dashboard_stats(db: Session = Depends(get_db)):
    return crud.get_dashboard_stats(db)
