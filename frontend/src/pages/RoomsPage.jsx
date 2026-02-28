import { useState } from "react";
import { getRooms } from "../api/rooms";
import { sortEntities } from "../utils/dataUtils";
import { useApi } from "../hooks/useApi";
import { useNotification } from "../components/UI/NotificationContext";
import RoomRow from "../components/rooms/RoomRow";
import RoomModal from "../components/rooms/RoomModal";
import AlertBanner from "../components/UI/AlertBanner";
import Button from "../components/ui/Button";

export default function RoomsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const { showNotification } = useNotification();

  const {
    data: rooms,
    loading,
    error,
    setError,
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

  if (loading) return <p>Loading rooms...</p>;
  return (
    <main className="flex flex-col w-full max-w-7xl mx-auto">
      <AlertBanner message={error} onClose={() => setError(null)} />
      <div className="flex justify-between pb-2">
        <p className="text-4xl">Rooms page</p>
        <Button
          onClick={() => {
            handleOpenCreate();
          }}
          text="Create new room"
        />
      </div>
      <p className="text-ml pb-7">Manage status and availability</p>
      <div className=" bg-white shadow-lg rounded-xl border border-gray-100 p-4">
        <div className="border-zinc-200 border-2 rounded-xl overflow-y-auto h-[50vh]">
          <table className=" w-full ">
            <thead className="bg-zinc-200 sticky top-0">
              <tr>
                <th
                  className="p-3 text-left w-2/9"
                  onClick={() =>
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                  }
                >
                  <div>
                    Room number
                    <span className="ml-2 cursor-pointer">
                      {sortOrder === "asc" ? "⬆️" : "⬇️"}
                    </span>
                  </div>
                </th>
                <th className="text-left w-1/5">Floor</th>
                <th className="text-left w-1/5">Room type</th>
                <th className="text-left w-1/5">Status</th>
                <th className="text-left w-1/5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-300">
              {sortedRooms.map((room) => (
                <RoomRow
                  key={room.id}
                  room={room}
                  onEdit={() => {
                    handleOpenEdit(room);
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <RoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={handleSuccess}
        initialData={selectedRoom}
      />
    </main>
  );
}
