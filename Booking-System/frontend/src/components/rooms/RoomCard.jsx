import { ROOM_TYPES } from "../../utils/constants";

export default function RoomCard({ room, isSelected, onSelect }) {
  const typeMap = Object.fromEntries(ROOM_TYPES.map((t) => [t.value, t.desc]));

  const configLabel = typeMap[room.room_type] || room.room_type;

  return (
    <div
      onClick={() => onSelect(room.id)}
      className={`
        shrink-0 w-48 p-4 border-2 rounded-lg cursor-pointer transition-all
        ${
          isSelected
            ? "border-blue-600 bg-blue-50"
            : "border-zinc-300 hover:border-blue-400 hover:bg-gray-50"
        }
      `}
    >
      <div className="flex flex-col h-full gap-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-900">
            Room {room.number}
          </h3>
          <span className="text-xs font-semibold px-2 py-1 bg-zinc-100 rounded text-gray-700">
            Cap {room.capacity}
          </span>
        </div>

        <p className="text-xs text-gray-600">Floor {room.floor}</p>

        <div className="mt-2 pt-2 border-t border-zinc-200">
          <span className="inline-block text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded">
            {configLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
