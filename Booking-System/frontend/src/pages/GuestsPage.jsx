import { useState, useEffect } from "react";
import { getGuests, deleteGuest } from "../api/guests";
import GuestRow from "../components/GuestRow";
import FetchState from "../components/FetchState";

export default function GuestsPage() {
  const [guests, setGuests] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchGuests() {
      setIsFetching(true);
      try {
        const guests = await getGuests();
        setGuests(guests);
      } catch (error) {
        setError({ message: error.message || "Failed to fetch guests list" });
      }
      setIsFetching(false);
    }

    fetchGuests();
  }, []);

  const handleRemoveGuest = async (id) => {
    if (!confirm("Are you sure you want to delete guest?")) return;

    try {
      await deleteGuest(id);
      setGuests((currentGuests) =>
        currentGuests.filter((guest) => guest.id != id)
      );
    } catch (error) {
      console.error("Error occured:", error);
      alert("Couldn't delete guest");
    }
  };

  return (
    <main className="flex flex-col w-full max-w-7xl mx-auto">
      <div className="flex justify-between pb-2">
        <p className="text-4xl">Guests page</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
          Add new guest
        </button>
      </div>
      <p className="text-ml pb-7">Update and delete guests data</p>
      <div className=" bg-white shadow-lg rounded-xl border border-gray-100 p-4">
        <div className="border-zinc-200 border-2 rounded-xl overflow-y-auto h-[50vh]">
          <FetchState
            isLoading={isFetching}
            error={error}
            data={guests}
            className=""
          >
            <table className=" w-full ">
              <thead className="bg-zinc-200 sticky top-0">
                <tr>
                  <th className="p-3 text-left w-2/9">First and last name</th>
                  <th className="text-left w-2/9">E-mail</th>
                  <th className="text-left w-2/9">Phone</th>
                  <th className="text-left w-1/9"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-300">
                {guests.map((guest) => (
                  <GuestRow
                    key={guest.id}
                    guest={guest}
                    onDelete={handleRemoveGuest}
                  />
                ))}
              </tbody>
            </table>
          </FetchState>
        </div>
      </div>
    </main>
  );
}
