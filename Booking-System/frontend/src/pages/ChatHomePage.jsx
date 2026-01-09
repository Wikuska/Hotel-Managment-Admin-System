import { useEffect, useState } from "react";
import { getRooms, createRoom, deleteRoom } from "../api/rooms";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortDir, setSortDir] = useState("asc"); // asc | desc

  const [form, setForm] = useState({
    number: "",
    floor: 1,
    beds: 1,
  });

  // -----------------------------
  // LOAD ROOMS
  // -----------------------------
  async function loadRooms() {
    setLoading(true);
    setError(null);

    try {
      const data = await getRooms();
      setRooms(data);
    } catch (e) {
      setError(e.message || "Failed to load rooms");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRooms();
  }, []);

  // -----------------------------
  // CREATE ROOM
  // -----------------------------
  async function onSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.number.trim()) {
      setError("Room number is required");
      return;
    }

    const payload = {
      number: form.number.trim(),
      floor: Number(form.floor),
      beds: Number(form.beds),
    };

    if (!Number.isFinite(payload.floor) || !Number.isFinite(payload.beds)) {
      setError("Floor and beds must be valid numbers");
      return;
    }

    try {
      const created = await createRoom(payload);
      setRooms((prev) => [created, ...prev]);
      setForm({ number: "", floor: 1, beds: 1 });
    } catch (e) {
      setError(e.message || "Failed to create room");
    }
  }

  // -----------------------------
  // DELETE ROOM
  // -----------------------------
  async function onDelete(id) {
    if (!window.confirm("Delete this room?")) return;

    try {
      await deleteRoom(id);
      setRooms((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      setError(e.message || "Failed to delete room");
    }
  }

  // -----------------------------
  // SORT ROOMS BY NUMBER
  // -----------------------------
  function getSortedRooms(list) {
    const copy = [...list];
    copy.sort((a, b) => {
      const cmp = String(a.number).localeCompare(String(b.number), undefined, {
        numeric: true,
        sensitivity: "base",
      });
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div>
      <h1>Rooms</h1>

      {/* FORM */}
      <form onSubmit={onSubmit} style={formGrid}>
        <div>
          <label style={label}>Room number</label>
          <input
            value={form.number}
            onChange={(e) => setForm((p) => ({ ...p, number: e.target.value }))}
            style={input}
          />
        </div>

        <div>
          <label style={label}>Floor</label>
          <input
            type="number"
            value={form.floor}
            onChange={(e) => setForm((p) => ({ ...p, floor: e.target.value }))}
            style={input}
          />
        </div>

        <div>
          <label style={label}>Beds</label>
          <input
            type="number"
            min={1}
            value={form.beds}
            onChange={(e) => setForm((p) => ({ ...p, beds: e.target.value }))}
            style={input}
          />
        </div>

        <div style={{ alignSelf: "end" }}>
          <button type="submit">Add room</button>
        </div>
      </form>

      {/* ERROR */}
      {error && <p style={{ color: "crimson", marginTop: 12 }}>{error}</p>}

      {/* SORT */}
      <div style={{ marginTop: 16 }}>
        <button
          type="button"
          onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
        >
          Sort by number: {sortDir === "asc" ? "Ascending ↑" : "Descending ↓"}
        </button>
      </div>

      {/* TABLE */}
      {loading ? (
        <p style={{ marginTop: 16 }}>Loading…</p>
      ) : (
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Number</th>
              <th style={th}>Floor</th>
              <th style={th}>Beds</th>
              <th style={th}>Active</th>
              <th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {getSortedRooms(rooms).map((r) => (
              <tr key={r.id}>
                <td style={td}>{r.number}</td>
                <td style={td}>{r.floor}</td>
                <td style={td}>{r.beds}</td>
                <td style={td}>{r.is_active ? "yes" : "no"}</td>
                <td style={td}>
                  <button onClick={() => onDelete(r.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// -----------------------------
// STYLES
// -----------------------------
const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 12,
  marginTop: 16,
  maxWidth: 700,
};

const label = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  marginBottom: 4,
};

const input = {
  width: "100%",
  padding: "6px 8px",
  border: "1px solid #ccc",
  borderRadius: 4,
};

const table = {
  marginTop: 16,
  borderCollapse: "collapse",
  width: "100%",
};
