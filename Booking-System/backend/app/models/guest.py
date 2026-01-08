from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base

class Guest(Base):
    __tablename__ = "guests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(80), nullable=False)
    email: Mapped[str | None] = mapped_column(String(120), unique=True, nullable=True)
    phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
