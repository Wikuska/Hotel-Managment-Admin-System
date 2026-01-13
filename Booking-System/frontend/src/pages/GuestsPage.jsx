import { useState, useEffect } from "react";
import { getGuests, deleteGuest, createGuest } from "../api/guests";
import GuestRow from "../components/GuestRow";
import ModalWrapper from "../components/ModalWrapper";
import FetchState from "../components/FetchState";

export default function GuestsPage() {
  const [guests, setGuests] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalInputClass = "border-zinc-300 border px-5 py-2";

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

  const handleAddGuest = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const formData = new FormData(event.target);
    const newGuest = {
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    };

    try {
      console.log("try");
      const createdGuest = await createGuest(newGuest);

      if (createdGuest) {
        setGuests((prev) => [...prev, createdGuest]);
      }

      setIsModalOpen(false);
      alert("Guest created");
    } catch (error) {
      console.error(error);
      alert("Server error: " + (error?.message ?? String(error)));
    }
  };

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
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
        >
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
      <ModalWrapper
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add new guest"
      >
        <form onSubmit={handleAddGuest}>
          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            <input
              name="first_name"
              placeholder="First Name"
              required
              className={modalInputClass}
              autoComplete="off"
            />
            <input
              name="last_name"
              placeholder="Last Name"
              required
              className={modalInputClass}
              autoComplete="off"
            />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              required
              className={modalInputClass}
              autoComplete="off"
            />
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              required
              className={modalInputClass}
              autoComplete="off"
            />
          </div>
          <div className="flex w-full justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 mt-5 border border-blue-700 rounded cursor-pointer"
            >
              Seve Guest
            </button>
          </div>
        </form>
      </ModalWrapper>
    </main>
  );
}
