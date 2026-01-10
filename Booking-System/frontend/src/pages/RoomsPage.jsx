import { useState, useEffect } from "react";
import { getRooms } from "../api/rooms";
import RoomRow from "../components/RoomRow";
import FetchState from "../components/FetchState";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(false);

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

  return (
    <main className="flex flex-col w-full max-w-7xl mx-auto">
      <div className="flex justify-between pb-2">
        <p className="text-4xl">Rooms page</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
          Create new room
        </button>
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
                  <th className="p-3 text-left w-2/9">Room number</th>
                  <th className="text-left w-2/9">Floor</th>
                  <th className="text-left w-2/9">Beds</th>
                  <th className="text-left w-2/9">Status</th>
                  <th className="text-left w-1/9"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-300">
                {rooms.map((room) => (
                  <RoomRow key={room.id} room={room} />
                ))}
              </tbody>
            </table>
          </FetchState>
        </div>
      </div>
    </main>
  );
}
