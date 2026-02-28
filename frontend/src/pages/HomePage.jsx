import { useApi } from "../hooks/useApi";
import StatCard from "../components/ui/StatCard";
import AlertBanner from "../components/UI/AlertBanner";
import { CalendarDays, Bed, User, BookmarkX, Loader2 } from "lucide-react";
import { getDashboardStats } from "../api/dashboard";

export default function HomePage() {
  const {
    data: stats = {
      arrivals_today: 0,
      departures_today: 0,
      available_rooms: 0,
      guests_in_house: 0,
    },
    loading: isLoading,
    error,
    setError,
  } = useApi(getDashboardStats, { autoFetch: true });

  return (
    <main className="flex flex-col w-full max-w-7xl mx-auto">
      <AlertBanner message={error} onClose={() => setError(null)} />
      <div className="my-auto bg-zinc-300 shadow-lg rounded-xl p-8 border">
        <div className="flex justify-between">
          <p className="text-4xl">Front Desk Overview</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
            New Reservation
          </button>
        </div>
        <div className="grid grid-cols-4 gap-10 w-full p-10">
          <StatCard
            Icon={CalendarDays}
            number={
              isLoading ? (
                <Loader2 className="animate-spin" />
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
    </main>
  );
}
