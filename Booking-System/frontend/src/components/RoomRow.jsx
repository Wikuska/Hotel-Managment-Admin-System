import { NotebookPen } from "lucide-react";
import { ROOM_STATUSES, ROOM_TYPES } from "../utils/constants";

export default function RoomRow({ room, onEdit }) {
  const typeConfig = ROOM_TYPES.find((s) => s.value === room.room_type);
  const statusConfig = ROOM_STATUSES.find((s) => s.value === room.room_status);

  return (
    <tr>
      <td className="p-3">{room.number}</td>
      <td className="text-left">{room.floor}</td>
      <td className="text-left">{typeConfig.desc}</td>
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
