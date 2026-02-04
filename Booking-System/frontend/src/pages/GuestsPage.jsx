import { useState, useEffect } from "react";
import {
  getGuests,
  deleteGuest,
  createGuest,
  updateGuest,
} from "../api/guests";
import { filterEntities, sortEntities } from "../utils/dataUtils";
import GuestRow from "../components/GuestRow";
import GuestModal from "../components/GuestModal";
import FetchState from "../components/FetchState";
import Button from "../components/Button";

export default function GuestsPage() {
  const [guests, setGuests] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGuests = filterEntities(guests, searchQuery, (guest) => {
    return `${guest.first_name} ${guest.last_name}`;
  });

  const sortedGuests = sortEntities(filteredGuests, "last_name");

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

  const handleOpenCreate = () => {
    setSelectedGuest(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (guest) => {
    setSelectedGuest(guest);
    setIsModalOpen(true);
  };

  const handleSave = async (data) => {
    try {
      if (selectedGuest) {
        const updatedGuest = await updateGuest(selectedGuest.id, data);

        setGuests((prevGuestes) =>
          prevGuestes.map((guest) =>
            guest.id === selectedGuest.id ? updatedGuest : guest,
          ),
        );
      } else {
        const createdGuest = await createGuest(data);

        if (createdGuest) {
          setGuests((prev) => [...prev, createdGuest]);
        }
        alert("Guest created");
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Operation failed: " + (error?.message ?? String(error)));
    }
  };

  const handleRemoveGuest = async (id) => {
    if (!confirm("Are you sure you want to delete guest?")) return;

    try {
      await deleteGuest(id);
      setGuests((currentGuests) =>
        currentGuests.filter((guest) => guest.id != id),
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
        <Button
          onClick={() => {
            handleOpenCreate();
          }}
          text="Add new guest"
        />
      </div>
      <p className="text-ml pb-7">Update and delete guests data</p>
      <div className=" bg-white shadow-lg rounded-xl border border-gray-100 p-4">
        <input
          type="text"
          placeholder="Find guest (name/last name)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border-zinc-200 border-2 rounded-xl p-1.5"
        />
      </div>
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
                {sortedGuests.map((guest) => (
                  <GuestRow
                    key={guest.id}
                    guest={guest}
                    onDelete={() => {
                      handleRemoveGuest(guest.id);
                    }}
                    onEdit={() => {
                      handleOpenEdit(guest);
                    }}
                  />
                ))}
              </tbody>
            </table>
          </FetchState>
        </div>
      </div>
      <GuestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        initialData={selectedGuest}
      />
    </main>
  );
}
