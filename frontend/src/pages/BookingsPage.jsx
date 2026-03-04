import { useState } from "react";
import { getBookings, updateBooking } from "../api/bookings";
import { useNotification } from "../components/UI/NotificationContext";
import { Loader2 } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { filterByAllowedValues } from "../utils/dataUtils";
import Button from "../components/ui/Button";
import BookingRow from "../components/bookings/BookingRow";
import NewBookingModal from "../components/bookings/NewBookingModal";
import EditBookingModal from "../components/bookings/EditBookingModal";

const BOOKING_STATUS_MESSAGES = {
  checked_in: "Guest checked in successfully!",
  checked_out: "Guest checked out successfully!",
  cancelled: "Booking cancelled successfully.",
  no_show: "Booking marked as no-show.",
};

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("active");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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
  const { request: executeUpdateBooking } = useApi(updateBooking);

  const bookingsInTab = TAB_STATUSES[activeTab]
    ? filterByAllowedValues(bookings, "status", TAB_STATUSES[activeTab])
    : bookings;

  const finalBookings = bookingsInTab?.filter((booking) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    const guestName =
      `${booking.guest?.first_name} ${booking.guest?.last_name}`.toLowerCase();
    const roomNumber = String(booking.room?.number || booking.room_id);

    return guestName.includes(query) || roomNumber.includes(query);
  });

  const changeStatus = async (bookingId, status) => {
    try {
      await executeUpdateBooking(bookingId, { status });
      refreshBookings();
      showNotification(BOOKING_STATUS_MESSAGES[status] ?? "Updated");
    } catch {}
  };

  const handleCreateBooking = () => {
    setSelectedBooking(null);
    setIsModalOpen(true);
  };
  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    refreshBookings();
    showNotification(
      selectedBooking
        ? "Booking updated successfully!"
        : "Booking created successfully!",
    );
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
        <Button text="Create new reservation" onClick={handleCreateBooking} />
      </div>

      <div className="bg-white shadow-md rounded-2xl border border-zinc-200">
        <div className="flex flex-col sm:flex-row justify-between items-center border-b border-zinc-200 px-6 pt-2 gap-4">
          <div className="flex overflow-x-auto w-full sm:w-auto">
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

          <div className="w-full sm:w-auto pb-2 sm:pb-0">
            <input
              id="guest-search"
              type="text"
              placeholder="Find guest or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 border border-zinc-300 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
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
                ) : finalBookings?.length > 0 ? (
                  finalBookings.map((booking) => (
                    <BookingRow
                      key={booking.id}
                      booking={booking}
                      onEdit={() => handleEditBooking(booking)}
                      onStatusChange={changeStatus}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-zinc-500">
                      No bookings found for these criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && !selectedBooking && (
        <NewBookingModal
          isOpen={true}
          onClose={() => setIsModalOpen(false)}
          onRefresh={handleSuccess}
        />
      )}
      {isModalOpen && selectedBooking && (
        <EditBookingModal
          isOpen={true}
          booking={selectedBooking}
          onClose={() => setIsModalOpen(false)}
          onRefresh={handleSuccess}
        />
      )}
    </main>
  );
}
