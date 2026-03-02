import { NotebookPen, DoorOpen } from "lucide-react";
import { BOOKING_STATUSES } from "../../utils/constants";

export default function BookingRow({ booking, onEdit }) {
  const statusConfig = BOOKING_STATUSES.find((s) => s.value === booking.status);

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
          <button
            onClick={onEdit}
            className="cursor-pointer text-zinc-500 hover:text-green-600 transition-colors duration-200"
            title="Edit booking"
          >
            <NotebookPen size={20} />
          </button>
        </div>
      </td>
    </tr>
  );
}
