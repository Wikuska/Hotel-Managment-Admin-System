import { useState } from "react";
import { createGuest } from "../../../api/guests";
import { useApi } from "../../../hooks/useApi";
import { Alert } from "../../UI/NotificationContext";
import Button from "../../ui/Button";
import ModalInput from "../../ui/ModalInput";

export default function Step3Guests({
  guests,
  searchQuery,
  setSearchQuery,
  selectedGuestId,
  setSelectedGuestId,
  onGuestAdded,
}) {
  const [isQuickAdd, setIsQuickAdd] = useState(false);
  const {
    request: saveGuest,
    loading: isSaving,
    error,
    setError,
  } = useApi(createGuest, { showToast: false });

  const handleQuickSave = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    const result = await saveGuest(data);
    if (result) {
      if (onGuestAdded) await onGuestAdded();

      setSelectedGuestId(result.id);
      setIsQuickAdd(false);
    }
  };

  if (isQuickAdd) {
    return (
      <div className="border-blue-200 border-2 bg-blue-50/30 rounded-xl p-5 mt-4">
        {error && <Alert message={error} onClose={() => setError(null)} />}
        <span className="text-xl font-bold text-gray-900 block mb-4">
          Quick Add New Guest
        </span>
        <form onSubmit={handleQuickSave}>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <ModalInput
              label="First Name"
              input_name="first_name"
              autoComplete="off"
            />
            <ModalInput
              label="Last Name"
              input_name="last_name"
              autoComplete="off"
            />
            <ModalInput
              label="Email Address"
              input_name="email"
              input_type="email"
              autoComplete="off"
            />
            <ModalInput
              label="Phone Number"
              input_name="phone"
              input_type="tel"
              autoComplete="off"
            />
          </div>
          <div className="flex justify-end gap-2 mt-5">
            <Button
              text={isSaving ? "Saving..." : "Save & Select"}
              type="submit"
              disabled={isSaving}
            />
            <Button
              text="Cancel"
              type="button"
              onClick={() => setIsQuickAdd(false)}
              additional_style="bg-gray-500 hover:bg-gray-600"
            />
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="border-zinc-200 border-2 rounded-xl p-5 mt-4">
      <span className="text-xl font-bold text-gray-900 block mb-4">
        Select Guest
      </span>
      <div className="mt-5 flex gap-2">
        <input
          type="text"
          placeholder="Find guest (name/last name)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border-zinc-200 border-2 rounded-xl p-2"
        />
        <Button text="+ New Guest" onClick={() => setIsQuickAdd(true)} />
      </div>

      <div className="mt-4 max-h-40 min-h-40 overflow-y-auto border border-zinc-200 rounded-xl">
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
