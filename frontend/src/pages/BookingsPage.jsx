import { useState } from "react";
import { getBookings } from "../api/bookings";
import { useNotification } from "../components/UI/NotificationContext";
import { Loader2 } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { filterByAllowedValues } from "../utils/dataUtils";
import Button from "../components/ui/Button";
import BookingRow from "../components/bookings/BookingRow";
import NewBookingModal from "../components/bookings/NewBookingModal";

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("active");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showNotification } = useNotification();

  const TAB_STATUSES = {
    active: ["confirmed", "checked_in"],
    archived: ["checked_out", "cancelled", "no_show"],
    all: null,
  };

  const {
    data: bookings = [],
    loading,
    request: refreshBookings,
  } = useApi(getBookings, { autoFetch: true });

  const bookingsInTab = TAB_STATUSES[activeTab]
    ? filterByAllowedValues(bookings, "status", TAB_STATUSES[activeTab])
    : bookings;

  const handleSuccess = () => {
    refreshBookings();
    showNotification("Reservation successfully created!", "success");
  };

  return (
    <main className="flex flex-col w-full max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6">
        <div>
          <h1 className="text-4xl font-semibold text-zinc-800">Bookings</h1>
          <p className="text-lg text-zinc-500 mt-2">
            Manage guest reservations and check-ins
          </p>
        </div>
        <Button
          text="Create new reservation"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      <div className="bg-white shadow-md rounded-2xl border border-zinc-200">
        <div className="flex border-b border-zinc-200 px-6 pt-2 overflow-x-auto">
          {["active", "archived", "all"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                py-3 px-4 text-sm font-medium transition-colors capitalize border-b-2 whitespace-nowrap
                ${
                  activeTab === tab
                    ? "text-blue-600 border-blue-600"
                    : "text-zinc-500 hover:text-zinc-700 hover:border-zinc-300 border-transparent"
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          <div className="border border-zinc-200 rounded-xl shadow-sm h-[60vh] overflow-auto">
            <table className="w-full min-w-200 text-sm text-left">
              <thead className="bg-zinc-100 sticky top-0 text-zinc-600 font-medium z-10 border-b border-zinc-200">
                <tr>
                  <th className="p-4 w-1/6">Room</th>
                  <th className="p-4 w-1/4">Guest</th>
                  <th className="p-4 w-1/3">Check-in/Check-out</th>
                  <th className="p-4 w-1/6">Status</th>
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
                ) : bookingsInTab?.length > 0 ? (
                  bookingsInTab.map((booking) => (
                    <BookingRow key={booking.id} booking={booking} />
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-zinc-500">
                      No {activeTab} bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <NewBookingModal
          isOpen={true}
          onClose={() => setIsModalOpen(false)}
          onRefresh={handleSuccess}
        />
      )}
    </main>
  );
}
