import HomePage from "./pages/HomePage";
import RoomsPage from "./pages/RoomsPage";
import GuestsPage from "./pages/GuestsPage";
import Navbar from "./components/layout/Navbar";
import BookingsPage from "./pages/BookingsPage";
import { NotificationProvider } from "./components/UI/NotificationContext";
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <NotificationProvider>
      <div className="flex flex-col min-h-screen bg-zinc-100">
        <Navbar />
        <div className="grow flex flex-col p-4 sm:p-8 bg-zinc-200">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/guests" element={<GuestsPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
          </Routes>
        </div>
      </div>
    </NotificationProvider>
  );
}
