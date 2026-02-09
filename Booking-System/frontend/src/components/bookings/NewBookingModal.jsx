import { useState } from "react";
import ModalWrapper from "../ui/ModalWrapper";
import { MODAL_INPUT_CLASS, MODAL_LABEL_CLASS } from "../../utils/constants";
import ModalInput from "../ui/ModalInput";
import Button from "../Button";
import RoomCard from "../rooms/RoomCard";
import FilterChip from "../ui/FilterChip";
import {
  getAvailableRooms,
  getConfigurationsForCapacity,
  filterRoomsByConfiguration,
} from "../../utils/availabilityUtils";
import { getRooms } from "../../api/rooms";

const getTodayString = () => {
  return new Date().toISOString().split("T")[0];
};

const getNextDay = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
};

export default function NewBookingModal({ isOpen, onClose }) {
  // Step flow: 1 = availability, 2 = select room, 3 = select guest
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkInDate, setCheckInDate] = useState(getTodayString());
  const [checkOutDate, setCheckOutDate] = useState("");
  const [numGuests, setNumGuests] = useState(1);
  const [chosenRoomId, setChosenRoomId] = useState(null);

  const [rooms, setRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState("all");
  const [configurations, setConfigurations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckInChange = (event) => {
    const newDate = event.target.value;
    setCheckInDate(newDate);
    setStep(1);

    if (checkOutDate && newDate > checkOutDate) {
      setCheckOutDate("");
    }
  };

  const handleCheckOutChange = (event) => {
    setCheckOutDate(event.target.value);
    setStep(1);
  };

  const handleGuestsChange = (event) => {
    setNumGuests(Number(event.target.value));
    setStep(1);
  };

  const canCheckAvailability =
    checkInDate && checkOutDate && checkInDate < checkOutDate;

  const handleCheckAvailability = async () => {
    if (!canCheckAvailability) return;

    setIsLoading(true);
    setError("");

    try {
      const allRooms = await getRooms();
      setRooms(allRooms);

      const available = await getAvailableRooms(
        allRooms,
        checkInDate,
        checkOutDate,
        numGuests,
      );

      setAvailableRooms(available);

      const configs = getConfigurationsForCapacity(available, numGuests);
      setConfigurations(["all", ...configs]);
      setSelectedConfig("all");
      setFilteredRooms(available);

      setChosenRoomId(null);
      setSearchQuery("");
      setStep(2);
    } catch (err) {
      setError("Failed to fetch available rooms. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigChange = (config) => {
    setSelectedConfig(config);
    const filtered = filterRoomsByConfiguration(availableRooms, config);
    setFilteredRooms(filtered);
  };

  const handleRoomSelect = (roomId) => {
    setChosenRoomId(roomId);
    setStep(3);
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="New Reservation"
      maxWidth="max-w-5xl"
    >
      {/* Step 1: Check Availability */}
      <div className="border-zinc-200 border-2 rounded-xl p-5">
        <span className="text-2xl font-bold text-gray-900">
          Check Availability
        </span>
        <div className="flex items-end w-full mt-5 gap-4">
          <ModalInput
            label="Arrival Date"
            input_type="date"
            input_name="date_in"
            min={getTodayString()}
            value={checkInDate}
            onChange={handleCheckInChange}
          />
          <ModalInput
            label="Departure Date"
            input_type="date"
            input_name="date_out"
            min={getNextDay(checkInDate)}
            value={checkOutDate}
            onChange={handleCheckOutChange}
          />
          <div className="flex flex-col flex-1">
            <label htmlFor="guests_in_room" className={MODAL_LABEL_CLASS}>
              Number of guests
            </label>
            <select
              name="guests_in_room"
              className={MODAL_INPUT_CLASS}
              value={numGuests}
              onChange={handleGuestsChange}
            >
              {[1, 2, 3, 4].map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>
          </div>
          <Button
            text={isLoading ? "Loading..." : "Check availability"}
            additional_style="h-11"
            onClick={handleCheckAvailability}
            disabled={!canCheckAvailability || isLoading}
          />
        </div>
      </div>

      {/* Step 2: Select Room */}
      {step >= 2 && (
        <div className="border-zinc-200 border-2 rounded-xl p-5 mt-4">
          <span className="text-2xl font-bold text-gray-900">Select Room</span>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Filter Chips */}
          {configurations.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {configurations.map((config) => (
                <FilterChip
                  key={config}
                  label={config}
                  isActive={selectedConfig === config}
                  onClick={() => handleConfigChange(config)}
                />
              ))}
            </div>
          )}

          {/* Room Cards Carousel */}
          {filteredRooms.length > 0 ? (
            <div className="mt-4 overflow-x-auto pb-2">
              <div className="flex gap-4">
                {filteredRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    isSelected={chosenRoomId === room.id}
                    onSelect={handleRoomSelect}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-4 text-gray-600 text-sm">
              {isLoading
                ? "Loading rooms..."
                : "No rooms available for selected criteria."}
            </p>
          )}
        </div>
      )}

      {/* Step 3: Select Guest */}
      {step >= 3 && (
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
        </div>
      )}

      <div className="flex justify-end gap-2 pt-5">
        <Button
          text="Confirm Reservation"
          onClick={() => {}}
          disabled={step < 3}
        />
        <Button text="Cancel" onClick={onClose} />
      </div>
    </ModalWrapper>
  );
}
