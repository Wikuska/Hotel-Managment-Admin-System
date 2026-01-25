import { useState, useEffect } from "react";
import { getRooms, createRoom, updateRoom } from "../api/rooms";
import { sortEntities } from "../utils/dataUtils";
import RoomRow from "../components/RoomRow";
import RoomModal from "../components/RoomModal";
import FetchState from "../components/FetchState";
import Button from "../components/Button";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const sortedRooms = sortEntities(rooms, "number", sortOrder);

  useEffect(() => {
    async function fetchRooms() {
      setIsFetching(true);
      try {
        const rooms = await getRooms();
        setRooms(rooms);
      } catch (error) {
        setError({ message: error.message || "Failed to fetch rooms list" });
      }
      setIsFetching(false);
    }

    fetchRooms();
  }, []);

  const handleOpenCreate = () => {
    setSelectedRoom(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleSave = async (data) => {
    try {
      if (selectedRoom) {
        const updatedRoom = await updateRoom(selectedRoom.id, data);

        setRooms((prevRooms) =>
          prevRooms.map((room) =>
            room.id === updatedRoom.id ? updatedRoom : room,
          ),
        );
      } else {
        const createdRoom = await createRoom(data);

        if (createdRoom) {
          setRooms((prev) => [...prev, createdRoom]);
        }
        alert("Room created");
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Operation failed: " + (error?.message ?? String(error)));
    }
  };

  return (
    <main className="flex flex-col w-full max-w-7xl mx-auto">
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
          <FetchState
            isLoading={isFetching}
            error={error}
            data={rooms}
            className=""
          >
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
          </FetchState>
        </div>
      </div>
      <RoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        initialData={selectedRoom}
      />
    </main>
  );
}
