import Button from "../../ui/Button";

export default function Step3Guests({
  guests,
  searchQuery,
  setSearchQuery,
  selectedGuestId,
  setSelectedGuestId,
}) {
  return (
    <div className="border-zinc-200 border-2 rounded-xl p-5 mt-4">
      <span className="text-2xl font-bold text-gray-900">Select Guest</span>
      <div className="mt-5 flex gap-2">
        <input
          type="text"
          placeholder="Find guest (name/last name)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border-zinc-200 border-2 rounded-xl p-2"
        />
        <Button text="+ New Guest" onClick={() => {}} />
      </div>

      <div className="mt-4 max-h-40 overflow-y-auto border border-zinc-200 rounded-xl">
        {(guests || [])
          .filter((g) =>
            `${g.first_name} ${g.last_name}`
              .toLowerCase()
              .includes(searchQuery.toLowerCase()),
          )
          .map((guest) => (
            <div
              key={guest.id}
              onClick={() => setSelectedGuestId(guest.id)}
              className={`p-3 cursor-pointer border-b last:border-b-0 transition-colors ${
                selectedGuestId === guest.id
                  ? "bg-blue-100 border-l-4 border-l-blue-600 font-medium"
                  : "hover:bg-zinc-50"
              }`}
            >
              {guest.first_name} {guest.last_name}{" "}
              <span className="text-gray-500 text-sm">({guest.email})</span>
            </div>
          ))}
      </div>
    </div>
  );
}
