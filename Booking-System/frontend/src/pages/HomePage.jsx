import React from "react";
import StatCard from "../components/StatCard";
import { CalendarDays, Bed, User, BookmarkX } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-zinc-200">
      <div className="w-full max-w-7xl my-auto mx-auto bg-zinc-300 shadow-lg rounded-xl p-8 border">
        <div className="flex justify-between">
          <p className="text-4xl">Front Desk Overview</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
            New Reservation
          </button>
        </div>
        <div className="grid grid-cols-4 gap-10 w-full p-10">
          <StatCard
            Icon={CalendarDays}
            number={14}
            description="Arrivals Today"
          />

          <StatCard
            Icon={BookmarkX}
            number={9}
            description="Departures Today"
          />

          <StatCard Icon={Bed} number={32} description="Available Rooms" />

          <StatCard Icon={User} number={115} description="Guests In-House" />
        </div>
      </div>
    </main>
  );
}
