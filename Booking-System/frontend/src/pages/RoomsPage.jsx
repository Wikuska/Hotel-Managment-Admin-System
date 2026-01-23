import { useState, useEffect } from "react";
import { getRooms, createRoom, updateRoom } from "../api/rooms";
import { sortEntities } from "../utils/dataUtils";
import { ROOM_STATUSES } from "../utils/constants";
import RoomRow from "../components/RoomRow";
import FetchState from "../components/FetchState";
import ModalWrapper from "../components/ModalWrapper";
import Button from "../components/Button";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const modalInputClass = "border-zinc-300 border px-5 py-2";
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const formData = new FormData(event.target);
    const roomData = {
      number: formData.get("room_number"),
      floor: formData.get("room_floor"),
      beds: formData.get("number_of_beds"),
      room_status: formData.get("room_status"),
    };

    try {
      if (selectedRoom) {
        const updatedRoom = await updateRoom(selectedRoom.id, roomData);

        setRooms((prevRooms) =>
          prevRooms.map((room) =>
            room.id === updatedRoom.id ? updatedRoom : room
          )
        );
      } else {
        const createdRoom = await createRoom(roomData);

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
                  <th className="text-left w-1/5">Beds</th>
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
      <ModalWrapper
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedRoom ? "Update room information" : "Create new room"}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            <input
              name="room_number"
              placeholder="Room number"
              required
              defaultValue={selectedRoom ? selectedRoom.number : ""}
              readOnly={selectedRoom ? true : false}
              className={modalInputClass}
              autoComplete="off"
            />
            <input
              name="room_floor"
              type="number"
              placeholder="Floor"
              required
              defaultValue={selectedRoom ? selectedRoom.floor : ""}
              readOnly={selectedRoom ? true : false}
              className={modalInputClass}
              autoComplete="off"
            />
            <input
              name="number_of_beds"
              type="number"
              placeholder="Beds"
              required
              defaultValue={selectedRoom ? selectedRoom.beds : ""}
              className={modalInputClass}
              autoComplete="off"
            />
            <select
              name="room_status"
              className={modalInputClass}
              defaultValue={
                selectedRoom ? selectedRoom.room_status : "available"
              }
            >
              {ROOM_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-full justify-end">
            <Button
              text={selectedRoom ? "Update" : "Create room"}
              additional_style="mt-2"
              type="submit"
            />
          </div>
        </form>
      </ModalWrapper>
    </main>
  );
}
