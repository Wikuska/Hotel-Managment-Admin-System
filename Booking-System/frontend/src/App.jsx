import HomePage from "./pages/HomePage";
import RoomsPage from "./pages/RoomsPage";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div>
      <Navbar />
      <div className="bg-zinc-200 flex items-center justify-center min-h-screen">
        <RoomsPage />
      </div>
    </div>
  );
}
