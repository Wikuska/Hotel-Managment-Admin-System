import { useState } from "react";
import { deleteGuest, getGuests } from "../api/guests";
import { filterEntities, sortEntities } from "../utils/dataUtils";
import { getApiError } from "../utils/errorHandler";
import GuestRow from "../components/guests/GuestRow";
import GuestModal from "../components/guests/GuestModal";
import AlertBanner from "../components/UI/AlertBanner";
import Button from "../components/ui/Button";
import { useNotification } from "../components/UI/NotificationContext";
import { useApi } from "../hooks/useApi";

export default function GuestsPage() {
  const {
    data: guests,
    loading,
    error,
    setError,
    setData: setGuests,
    request: refreshGuests,
  } = useApi(getGuests, { autoFetch: true });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { showNotification } = useNotification();

  const filteredGuests = filterEntities(guests || [], searchQuery, (guest) => {
    return `${guest.first_name} ${guest.last_name}`;
  });

  const sortedGuests = sortEntities(filteredGuests, "last_name");

  const handleOpenCreate = () => {
    setSelectedGuest(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (guest) => {
    setSelectedGuest(guest);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    refreshGuests();

    const message = selectedGuest
      ? "Guest updated successfully"
      : "Guest created successfully";
    showNotification(message, "success");
  };

  const handleRemoveGuest = async (id) => {
    if (!confirm("Are you sure you want to delete guest?")) return;

    setError(null);
    try {
      await deleteGuest(id);
      setGuests((currentGuests) =>
        currentGuests.filter((guest) => guest.id != id),
      );

      showNotification("Guest deleted successfully", "success");
    } catch (err) {
      setError(getApiError(err));
    }
  };

  if (loading) return <p>Loading guests...</p>;
  return (
    <main className="flex flex-col w-full max-w-7xl mx-auto">
      <AlertBanner message={error} onClose={() => setError(null)} />
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
          id="guest-search"
          type="text"
          placeholder="Find guest (name/last name)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border-zinc-200 border-2 rounded-xl p-1.5"
        />
      </div>
      <div className=" bg-white shadow-lg rounded-xl border border-gray-100 p-4">
        <div className="border-zinc-200 border-2 rounded-xl overflow-y-auto h-[50vh]">
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
        </div>
      </div>
      <GuestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={handleSuccess}
        initialData={selectedGuest}
      />
    </main>
  );
}
