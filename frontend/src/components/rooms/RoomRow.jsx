import { NotebookPen, Info } from "lucide-react";
import { ROOM_STATUSES, ROOM_TYPES } from "../../utils/constants";

export default function RoomRow({ room, onEdit }) {
  const typeConfig = ROOM_TYPES.find((s) => s.value === room.room_type);
  const statusConfig = ROOM_STATUSES.find((s) => s.value === room.room_status);

  return (
    <tr className="hover:bg-zinc-50 transition-colors border-b border-zinc-200 last:border-0">
      <td className="p-3 text-left">{room.number}</td>
      <td className="text-left">{room.floor}</td>
      <td className="text-left">{typeConfig.desc}</td>
      <td className="text-left">
        <span className={statusConfig.color}>{statusConfig.label}</span>
      </td>
      <td className="p-3">
        <div className="flex items-center justify-end gap-4">
          <button
            onClick={onEdit}
            className="cursor-pointer text-zinc-500 hover:text-green-600 transition-colors duration-200"
            title="Edit room"
          >
            <NotebookPen size={20} />
          </button>

          <button
            className="cursor-pointer text-zinc-500 hover:text-blue-600 transition-colors duration-200"
            title="Room details"
          >
            <Info size={20} />
          </button>
        </div>
      </td>
    </tr>
  );
}
