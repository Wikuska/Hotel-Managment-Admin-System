import {
  NotebookPen,
  DoorOpen,
  LogIn,
  LogOut,
  XCircle,
  UserX,
} from "lucide-react";
import { BOOKING_STATUSES, ACTIONS_BY_STATUS } from "../../utils/constants";

export default function BookingRow({
  booking,
  onEdit,
  onCheckIn,
  onCheckOut,
  onCancel,
  onNoShow,
}) {
  const statusConfig = BOOKING_STATUSES.find((s) => s.value === booking.status);
  const actions = ACTIONS_BY_STATUS[booking.status] ?? {};

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
            <button
              onClick={() => onCheckIn(booking.id)}
              className="cursor-pointer text-zinc-500 hover:text-green-600 transition-colors duration-200"
              title="Check-in"
            >
              <LogIn size={20} />
            </button>
          )}
          {actions.checkOut && (
            <button
              onClick={() => onCheckOut(booking.id)}
              className="cursor-pointer text-zinc-500 hover:text-blue-600 transition-colors duration-200"
              title="Check-out"
            >
              <LogOut size={20} />
            </button>
          )}
          {actions.cancel && (
            <button
              onClick={() => onCancel(booking.id)}
              className="cursor-pointer text-zinc-500 hover:text-red-600 transition-colors duration-200"
              title="Cancel booking"
            >
              <XCircle size={20} />
            </button>
          )}
          {actions.noShow && (
            <button
              onClick={() => onNoShow(booking.id)}
              className="cursor-pointer text-zinc-500 hover:text-orange-600 transition-colors duration-200"
              title="No show"
            >
              <UserX size={20} />
            </button>
          )}
          {actions.edit && (
            <button
              onClick={() => onEdit(booking)}
              className="cursor-pointer text-zinc-500 hover:text-green-600 transition-colors duration-200"
              title="Edit booking"
            >
              <NotebookPen size={20} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
