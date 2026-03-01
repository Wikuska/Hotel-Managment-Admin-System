import { useState } from "react";
import { getRooms } from "../api/rooms";
import { sortEntities } from "../utils/dataUtils";
import { useApi } from "../hooks/useApi";
import { useNotification } from "../components/UI/NotificationContext";
import { Loader2 } from "lucide-react";
import RoomRow from "../components/rooms/RoomRow";
import RoomModal from "../components/rooms/RoomModal";
import Button from "../components/ui/Button";

export default function RoomsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const { showNotification } = useNotification();

  const {
    data: rooms,
    loading,
    request: refreshRooms,
  } = useApi(getRooms, { autoFetch: true });

  const sortedRooms = sortEntities(rooms, "number", sortOrder);

  const handleOpenCreate = () => {
    setSelectedRoom(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    refreshRooms();

    const message = selectedRoom
      ? "Room updated successfully"
      : "Room created successfully";
    showNotification(message, "success");
  };

  return (
    <main className="flex flex-col w-full max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6">
        <div>
          <h1 className="text-4xl font-semibold text-zinc-800">Rooms page</h1>
          <p className="text-lg text-zinc-500 mt-2">
            Manage status and availability
          </p>
        </div>
        <Button onClick={handleOpenCreate} text="Create new room" />
      </div>

      <div className="bg-white shadow-md rounded-2xl border border-zinc-200">
        <div className="p-6">
          <div className="border border-zinc-200 rounded-xl shadow-sm h-[calc(60vh+56px)] overflow-auto">
            <table className="w-full text-sm text-left ">
              <thead className="bg-zinc-100 sticky top-0 text-zinc-600 font-medium z-10 border-b border-zinc-200">
                <tr>
                  <th
                    className="p-4 w-1/5 cursor-pointer hover:bg-zinc-200 transition-colors group select-none"
                    onClick={() =>
                      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                    }
                    title="Click to sort by room number"
                  >
                    <div className="flex items-center">
                      Room number
                      <span className="ml-2 text-zinc-400 group-hover:text-zinc-600 transition-colors">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    </div>
                  </th>
                  <th className="p-4 w-1/5">Floor</th>
                  <th className="p-4 w-1/4">Room type</th>
                  <th className="p-4 w-1/5">Status</th>
                  <th className="p-4 w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-zinc-500">
                      <Loader2
                        className="animate-spin inline-block mr-2 align-middle"
                        size={20}
                      />
                      <span className="align-middle">Loading data...</span>
                    </td>
                  </tr>
                ) : sortedRooms?.length > 0 ? (
                  sortedRooms.map((room) => (
                    <RoomRow
                      key={room.id}
                      room={room}
                      onEdit={() => handleOpenEdit(room)}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-zinc-500">
                      No rooms found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <RoomModal
          isOpen={true}
          onClose={() => setIsModalOpen(false)}
          onRefresh={handleSuccess}
          initialData={selectedRoom}
        />
      )}
    </main>
  );
}
