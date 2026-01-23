import { NotebookPen } from "lucide-react";
import { ROOM_STATUSES } from "../utils/constants";

export default function RoomRow({ room, onEdit }) {
  const statusConfig = ROOM_STATUSES.find((s) => s.value === room.room_status);

  return (
    <tr>
      <td className="p-3">{room.number}</td>
      <td className="text-left">{room.floor}</td>
      <td className="text-left">{room.beds}</td>
      <td>
        <span className={statusConfig.color}>{statusConfig.label}</span>
      </td>
      <td>
        <button onClick={onEdit} className="align-middle mr-3">
          <NotebookPen />
        </button>
        Room details
      </td>
    </tr>
  );
}
