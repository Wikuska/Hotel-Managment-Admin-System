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
      <div>
        <Navbar />
        <div className="pt-20 bg-zinc-200 flex items-center justify-center min-h-screen">
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
