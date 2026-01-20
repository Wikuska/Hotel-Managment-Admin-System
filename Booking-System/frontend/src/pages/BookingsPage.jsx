import { useState, useEffect } from "react";
import BookingRow from "../components/BookingRow";
import { getBookings } from "../api/bookings";
import Button from "../components/Button";
import FetchState from "../components/FetchState";
import { filterByAllowedValues } from "../utils/dataUtils";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState("active");

  const TAB_STATUSES = {
    active: ["confirmed", "checked in"],
    archived: ["checked out", "cancelled", "no show"],
    all: null,
  };

  useEffect(() => {
    async function fetchBookings() {
      setIsFetching(true);
      try {
        const bookings = await getBookings();
        setBookings(bookings);
      } catch (error) {
        setError({ message: error.message || "Failed to fetch guests list" });
      }
      setIsFetching(false);
    }

    fetchBookings();
  }, []);

  const bookingsInTab = TAB_STATUSES[activeTab]
    ? filterByAllowedValues(bookings, "status", TAB_STATUSES[activeTab])
    : bookings;

  return (
    <main className="flex flex-col w-full max-w-7xl mx-auto">
      <div className="flex justify-between pb-2">
        <p className="text-4xl">Bookings</p>
        <Button text="Create new reservation" />
      </div>
      <p className="text-ml pb-7">Manage guest reservations and check-ins</p>
      <div className="ml-3">
        {["active", "archived", "all"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
        pb-3 px-4 text-sm font-medium transition-colors relative
        ${
          activeTab === tab
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent"
        }
      `}
          >
            {tab === "active" && "Active"}
            {tab === "archived" && "Archived"}
            {tab === "all" && "All"}
          </button>
        ))}
      </div>
      <div className=" bg-white shadow-lg rounded-xl border border-gray-100 p-4">
        <div className="border-zinc-200 border-2 rounded-xl overflow-y-auto h-[50vh]">
          <FetchState isLoading={isFetching} error={error} data={bookings}>
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
          </FetchState>
        </div>
      </div>
    </main>
  );
}
