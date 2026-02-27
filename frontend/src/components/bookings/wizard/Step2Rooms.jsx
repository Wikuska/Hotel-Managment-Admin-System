import FilterChip from "../../ui/FilterChip";
import RoomCard from "../../rooms/RoomCard";

export default function Stem2Rooms({
  error,
  configurations,
  selectedConfig,
  filteredRooms,
  chosenRoomId,
  isLoading,
  onConfigChange,
  onRoomSelect,
}) {
  return (
    <div className="border-zinc-200 border-2 rounded-xl p-5 mt-4">
      <span className="text-2xl font-bold text-gray-900">Select Room</span>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Filter Chips */}
      {configurations.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {configurations.map((config) => (
            <FilterChip
              key={config}
              label={config}
              isActive={selectedConfig === config}
              onClick={() => onConfigChange(config)}
            />
          ))}
        </div>
      )}

      {/* Room Cards Carousel */}
      {filteredRooms.length > 0 ? (
        <div className="mt-4 overflow-x-auto pb-2">
          <div className="flex gap-4">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                isSelected={chosenRoomId === room.id}
                onSelect={onRoomSelect}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-4 text-gray-600 text-sm">
          {isLoading
            ? "Loading rooms..."
            : "No rooms available for selected criteria."}
        </p>
      )}
    </div>
  );
}
