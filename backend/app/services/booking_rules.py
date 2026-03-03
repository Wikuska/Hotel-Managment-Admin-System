from app.schemas import BookingStatusEnum, RoomStatusEnum
from app.models import Room
from sqlalchemy.orm import Session

def validate_booking_status_transition(old_status: str, new_status: str):
    if old_status == new_status:
        return True, None

    allowed = {
        BookingStatusEnum.CONFIRMED.value: {
            BookingStatusEnum.CHECKED_IN.value,
            BookingStatusEnum.CANCELLED.value,
            BookingStatusEnum.NO_SHOW.value,
        },
        BookingStatusEnum.CHECKED_IN.value: {
            BookingStatusEnum.CHECKED_OUT.value,
        },
        BookingStatusEnum.CHECKED_OUT.value: set(),
        BookingStatusEnum.CANCELLED.value: set(),
        BookingStatusEnum.NO_SHOW.value: set(),
    }

    if new_status not in allowed.get(old_status, set()):
        return False, f"Invalid status transition: {old_status} -> {new_status}"

    return True, None


def apply_room_status_after_booking_status_change(db: Session, room_id: int, new_status: str):
    if new_status not in (
        BookingStatusEnum.CHECKED_IN.value,
        BookingStatusEnum.CHECKED_OUT.value,
    ):
        return True, None

    room = (
        db.query(Room)
        .filter(Room.id == room_id)
        .with_for_update()
        .one_or_none()
    )
    if room is None:
        return False, "Room not found"

    if room.room_status == RoomStatusEnum.MAINTENANCE.value:
        if new_status == BookingStatusEnum.CHECKED_IN.value:
            return False, "Cannot check in: room is in maintenance"
        return True, None

    if new_status == BookingStatusEnum.CHECKED_IN.value:
        room.room_status = RoomStatusEnum.OCCUPIED.value
    else:
        room.room_status = RoomStatusEnum.DIRTY.value

    return True, None