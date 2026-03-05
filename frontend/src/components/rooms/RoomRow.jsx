import {
  NotebookPen,
  Info,
  SprayCan,
  Sparkles,
  Wrench,
  CheckCircle,
} from "lucide-react";
import {
  ROOM_STATUSES,
  ROOM_TYPES,
  ROOMS_ACTIONS_BY_STATUS,
} from "../../utils/constants";
import Button from "../ui/Button";

export default function RoomRow({ room, onEdit, onStatusChange }) {
  const typeConfig = ROOM_TYPES.find((s) => s.value === room.room_type);
  const statusConfig = ROOM_STATUSES.find((s) => s.value === room.room_status);
  const actions = ROOMS_ACTIONS_BY_STATUS[room.room_status] ?? {};

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
          {actions.markDirty && (
            <Button
              variant="icon"
              additional_style="hover:text-orange-600"
              title="Mark dirty"
              onClick={() => onStatusChange(room.id, "dirty")}
            >
              <SprayCan size={20} />
            </Button>
          )}
          {actions.markClean && (
            <Button
              variant="icon"
              additional_style="hover:text-green-600"
              title="Mark clean"
              onClick={() => onStatusChange(room.id, "available")}
            >
              <Sparkles size={20} />
            </Button>
          )}
          {actions.startMaintenance && (
            <Button
              variant="icon"
              additional_style="hover:text-amber-600"
              title="Start maintenance"
              onClick={() => onStatusChange(room.id, "maintenance")}
            >
              <Wrench size={20} />
            </Button>
          )}
          {actions.endMaintenance && (
            <Button
              variant="icon"
              additional_style="hover:text-green-600"
              title="End maintenance"
              onClick={() => onStatusChange(room.id, "available")}
            >
              <CheckCircle size={20} />
            </Button>
          )}
          {actions.edit && (
            <Button
              variant="icon"
              onClick={onEdit}
              additional_style="hover:text-green-600"
              title="Edit room"
            >
              <NotebookPen size={20} />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}
