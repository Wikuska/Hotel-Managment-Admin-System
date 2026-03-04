import FilterChip from "../../ui/FilterChip";
import RoomCard from "../../rooms/RoomCard";

export default function Step2Rooms({
  configurations,
  selectedConfig,
  filteredRooms,
  chosenRoomId,
  isLoading,
  onConfigChange,
  onRoomSelect,
  hasValidDates,
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-white px-5 pt-5 pb-4 border-b border-zinc-100 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900">Select Room</h3>

        {configurations.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
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
      </div>

      <div className="p-5">
        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-items-center pb-2">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                isSelected={chosenRoomId === room.id}
                onSelect={onRoomSelect}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center p-10 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-500 font-medium text-center">
              {!hasValidDates
                ? "Please fill in the Arrival and Departure dates to see available rooms."
                : isLoading
                  ? "Searching for perfect rooms..."
                  : "No rooms available for selected dates or criteria."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
