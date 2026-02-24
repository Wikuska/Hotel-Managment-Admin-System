from pydantic import BaseModel

class DashboardStats(BaseModel):
    arrivals_today: int
    departures_today: int
    available_rooms: int
    guests_in_house: int
