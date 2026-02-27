import { useState } from "react";
import BookingRow from "../components/bookings/BookingRow";
import { getBookings } from "../api/bookings";
import Button from "../components/ui/Button";
import { useApi } from "../hooks/useApi";
import { filterByAllowedValues } from "../utils/dataUtils";
import NewBookingModal from "../components/bookings/NewBookingModal";
import ErrorBanner from "../components/ui/ErrorBanner";

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("active");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const TAB_STATUSES = {
    active: ["confirmed", "checked_in"],
    archived: ["checked_out", "cancelled", "no_show"],
    all: null,
  };

  const {
    data: bookings = [],
    loading,
    error,
    request: refreshBookings,
  } = useApi(getBookings, { autoFetch: true });

  const bookingsInTab = TAB_STATUSES[activeTab]
    ? filterByAllowedValues(bookings, "status", TAB_STATUSES[activeTab])
    : bookings;

  if (loading) return <p>Loading bookings...</p>;
  return (
    <main className="flex flex-col w-full max-w-7xl mx-auto">
      <ErrorBanner message={error} onClose={() => setError(null)} />
      <div className="flex justify-between pb-2">
        <p className="text-4xl">Bookings</p>
        <Button
          text="Create new reservation"
          onClick={() => setIsModalOpen(true)}
        />
      </div>
      <p className="text-ml pb-7">Manage guest reservations and check-ins</p>
      <div className="ml-3">
        {["active", "archived", "all"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
        pb-3 px-4 text-sm font-medium transition-colors relative capitalize
        ${
          activeTab === tab
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent"
        }
      `}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className=" bg-white shadow-lg rounded-xl border border-gray-100 p-4">
        <div className="border-zinc-200 border-2 rounded-xl overflow-y-auto h-[50vh]">
          <table className=" w-full ">
            <thead className="bg-zinc-200 sticky top-0">
              <tr>
                <th className="p-3 text-left w-2/9">Room</th>
                <th className="text-left w-2/9">Guest</th>
                <th className="text-left w-3/9">Check-in/Check-out date</th>
                <th className="text-left w-1/9">Status</th>
                <th className="w-1/9"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-300">
              {bookingsInTab.map((booking) => (
                <BookingRow key={booking.id} booking={booking} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <NewBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={refreshBookings}
      />
    </main>
  );
}
