import { NotebookPen, DoorOpen } from "lucide-react";
import { BOOKING_STATUSES } from "../utils/constants";

export default function BookingRow({ booking }) {
  const statusConfig = BOOKING_STATUSES.find((s) => s.value === booking.status);

  return (
    <tr>
      <td className="flex p-3">
        <DoorOpen /> {booking.room.number}
      </td>
      <td>
        {booking.guest.first_name} {booking.guest.last_name}
      </td>
      <td>
        {booking.date_from} 🠒 {booking.date_to}
      </td>
      <td>
        <span className={statusConfig.color}>{statusConfig.label}</span>
      </td>
      <td className="text-center align-middle">
        <button className=" mt-1.5 cursor-pointer">
          <NotebookPen />
        </button>
      </td>
    </tr>
  );
}
