import { useApi } from "../hooks/useApi";
import { useState } from "react";
import { CalendarDays, Bed, User, BookmarkX, Loader2 } from "lucide-react";
import { getDashboardStats } from "../api/dashboard";
import Button from "../components/ui/Button";
import StatCard from "../components/ui/StatCard";
import NewBookingModal from "../components/bookings/NewBookingModal";

export default function HomePage() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const {
    data: stats = {
      arrivals_today: 0,
      departures_today: 0,
      available_rooms: 0,
      guests_in_house: 0,
    },
    loading: isLoading,
    request: refreshStats,
  } = useApi(getDashboardStats, { autoFetch: true });

  return (
    <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto">
      <div className="my-auto bg-zinc-50/80 shadow-sm rounded-2xl p-8 border border-zinc-200/60 backdrop-blur-sm">
        <div className="flex justify-between">
          <h1 className="text-4xl font-semibold text-zinc-800">
            Front Desk Overview
          </h1>
          <Button
            text="New Booking"
            onClick={() => setIsBookingModalOpen(true)}
          />
        </div>
        <div className="grid grid-cols-4 gap-10 w-full p-10">
          <StatCard
            Icon={CalendarDays}
            number={
              isLoading ? (
                <Loader2 className="animate-spin text-zinc-400" size={28} />
              ) : (
                stats.arrivals_today
              )
            }
            description="Arrivals Today"
          />

          <StatCard
            Icon={BookmarkX}
            number={
              isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                stats.departures_today
              )
            }
            description="Departures Today"
          />

          <StatCard
            Icon={Bed}
            number={
              isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                stats.available_rooms
              )
            }
            description="Available Rooms"
          />

          <StatCard
            Icon={User}
            number={
              isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                stats.guests_in_house
              )
            }
            description="Guests In-House"
          />
        </div>
      </div>
      <NewBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSuccess={refreshStats}
      />
    </main>
  );
}
