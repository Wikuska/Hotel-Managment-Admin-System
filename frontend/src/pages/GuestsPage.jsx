import { useState } from "react";
import { deleteGuest, getGuests } from "../api/guests";
import { filterEntities, sortEntities } from "../utils/dataUtils";
import { Loader2 } from "lucide-react";
import { useNotification } from "../components/ui/NotificationContext";
import { useApi } from "../hooks/useApi";
import GuestRow from "../components/guests/GuestRow";
import GuestModal from "../components/guests/GuestModal";
import Button from "../components/ui/Button";

export default function GuestsPage() {
  const {
    data: guests,
    loading,
    setData: setGuests,
    request: refreshGuests,
  } = useApi(getGuests, { autoFetch: true });
  const { request: executeDeleteGuest } = useApi(deleteGuest);

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

    try {
      await executeDeleteGuest(id);
      setGuests((currentGuests) =>
        currentGuests.filter((guest) => guest.id != id),
      );

      showNotification("Guest deleted successfully", "success");
    } catch (err) {
      console.error("Action cancelled due to API error");
    }
  };

  return (
    <main className="flex flex-col w-full max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6">
        <div>
          <h1 className="text-4xl font-semibold text-zinc-800">Guests page</h1>
          <p className="text-lg text-zinc-500 mt-2">
            Update and delete guests data
          </p>
        </div>
        <Button onClick={handleOpenCreate} text="Add new guest" />
      </div>

      <div className="bg-white shadow-md rounded-2xl border border-zinc-200">
        <div className="p-6 pb-4">
          <input
            id="guest-search"
            type="text"
            placeholder="Find guest (name/last name)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md border border-zinc-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>

        <div className="px-6 pb-6">
          <div className="border border-zinc-200 rounded-xl shadow-sm h-[60vh] overflow-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-100 sticky top-0 text-zinc-600 font-medium z-10 border-b border-zinc-200">
                <tr>
                  <th className="p-4 w-1/3">First and last name</th>
                  <th className="p-4 w-1/3">E-mail</th>
                  <th className="p-4 w-1/4">Phone</th>
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
                ) : sortedGuests.length > 0 ? (
                  sortedGuests.map((guest) => (
                    <GuestRow
                      key={guest.id}
                      guest={guest}
                      onDelete={() => handleRemoveGuest(guest.id)}
                      onEdit={() => handleOpenEdit(guest)}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-zinc-500">
                      No guests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <GuestModal
          isOpen={true}
          onClose={() => setIsModalOpen(false)}
          onRefresh={handleSuccess}
          initialData={selectedGuest}
        />
      )}
    </main>
  );
}
