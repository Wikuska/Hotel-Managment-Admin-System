import {
  NotebookPen,
  DoorOpen,
  LogIn,
  LogOut,
  XCircle,
  UserX,
} from "lucide-react";
import Button from "../ui/Button";
import {
  BOOKING_STATUSES,
  BOOKINGS_ACTIONS_BY_STATUS,
} from "../../utils/constants";

export default function BookingRow({ booking, onEdit, onStatusChange }) {
  const statusConfig = BOOKING_STATUSES.find((s) => s.value === booking.status);
  const actions = BOOKINGS_ACTIONS_BY_STATUS[booking.status] ?? {};

  return (
    <tr className="hover:bg-zinc-50 transition-colors border-b border-zinc-200 last:border-0">
      <td className="p-3">
        <div className="flex items-center gap-2">
          <DoorOpen size={20} className="text-zinc-500" />
          <span className="font-medium">{booking.room.number}</span>
        </div>
      </td>
      <td className="text-left">
        {booking.guest.first_name} {booking.guest.last_name}
      </td>
      <td className="text-left">
        {booking.date_from} 🠒 {booking.date_to}
      </td>
      <td className="text-left">
        <span className={statusConfig.color}>{statusConfig.label}</span>
      </td>
      <td className="p-3">
        <div className="flex items-center justify-end gap-4">
          {actions.checkIn && (
            <Button
              onClick={() => onStatusChange(booking.id, "checked_in")}
              variant="icon"
              title="Check-in"
              additional_style="hover:text-green-600"
            >
              <LogIn size={20} />
            </Button>
          )}
          {actions.checkOut && (
            <Button
              onClick={() => onStatusChange(booking.id, "checked_out")}
              variant="icon"
              additional_style="hover:text-blue-600"
              title="Check-out"
            >
              <LogOut size={20} />
            </Button>
          )}
          {actions.cancel && (
            <Button
              onClick={() => onStatusChange(booking.id, "cancelled")}
              variant="icon"
              additional_style="hover:text-red-600"
              title="Cancel booking"
            >
              <XCircle size={20} />
            </Button>
          )}
          {actions.noShow && (
            <Button
              onClick={() => onStatusChange(booking.id, "no_show")}
              variant="icon"
              additional_style="hover:text-orange-600"
              title="No show"
            >
              <UserX size={20} />
            </Button>
          )}
          {actions.edit && (
            <Button
              onClick={() => onEdit(booking)}
              variant="icon"
              additional_style="hover:text-green-600"
              title="Edit booking"
            >
              <NotebookPen size={20} />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}
