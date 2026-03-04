import { useState, useEffect } from "react";
import { getRooms } from "../../api/rooms";
import { getGuests } from "../../api/guests";
import { createBooking } from "../../api/bookings";
import { useApi } from "../../hooks/useApi";

import ModalWrapper from "../ui/ModalWrapper";
import Button from "../ui/Button";

import Step1Availability from "./wizard/Step1Availability";
import Step2Rooms from "./wizard/Step2Rooms";
import Step3Guests from "./wizard/Step3Guests";

import {
  getAvailableRooms,
  getConfigurationsForCapacity,
  filterRoomsByConfiguration,
} from "../../utils/availabilityUtils";

const getTodayString = () => {
  return new Date().toISOString().split("T")[0];
};

export default function NewBookingModal({ isOpen, onClose, onRefresh }) {
  const [checkInDate, setCheckInDate] = useState(getTodayString());
  const [checkOutDate, setCheckOutDate] = useState("");
  const [numGuests, setNumGuests] = useState(1);

  const [chosenRoomId, setChosenRoomId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGuestId, setSelectedGuestId] = useState(null);

  const [availableRooms, setAvailableRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState("all");
  const [configurations, setConfigurations] = useState([]);

  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);

  const { request: submitBooking, loading: isSubmitting } =
    useApi(createBooking);

  const { data: guests = [], request: fetchGuestsList } = useApi(getGuests, {
    autoFetch: true,
  });

  const handleCheckInChange = (event) => {
    const newDate = event.target.value;
    setCheckInDate(newDate);
    setChosenRoomId(null);
    if (checkOutDate && newDate > checkOutDate) {
      setCheckOutDate("");
    }
  };

  const handleCheckOutChange = (event) => {
    setCheckOutDate(event.target.value);
    setChosenRoomId(null);
  };

  const handleGuestsChange = (event) => {
    setNumGuests(Number(event.target.value));
    setChosenRoomId(null);
  };

  const handleCheckAvailability = async () => {
    if (!checkInDate || !checkOutDate || checkInDate >= checkOutDate) return;

    setIsLoadingAvailability(true);

    try {
      const allRooms = await getRooms();

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
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  useEffect(() => {
    if (checkInDate && checkOutDate && checkInDate < checkOutDate) {
      handleCheckAvailability();
    } else {
      setAvailableRooms([]);
      setFilteredRooms([]);
      setChosenRoomId(null);
    }
  }, [checkInDate, checkOutDate, numGuests]);

  const handleConfigChange = (config) => {
    setSelectedConfig(config);
    const filtered = filterRoomsByConfiguration(availableRooms, config);
    setFilteredRooms(filtered);
  };

  const handleRoomSelect = (roomId) => {
    setChosenRoomId(roomId);
  };

  const handleConfirmReservation = async () => {
    if (!chosenRoomId || !selectedGuestId) return;

    const bookingData = {
      room_id: chosenRoomId,
      guest_id: selectedGuestId,
      date_from: checkInDate,
      date_to: checkOutDate,
    };

    const result = await submitBooking(bookingData);

    if (result) {
      if (onRefresh) onRefresh();
      if (onClose) onClose();
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="New Reservation"
      maxWidth="max-w-6xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          <Step1Availability
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            numGuests={numGuests}
            isLoading={isLoadingAvailability}
            onCheckInChange={handleCheckInChange}
            onCheckOutChange={handleCheckOutChange}
            onGuestsChange={handleGuestsChange}
            onCheckAvailability={handleCheckAvailability}
          />

          <Step3Guests
            guests={guests}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedGuestId={selectedGuestId}
            setSelectedGuestId={setSelectedGuestId}
            onGuestAdded={fetchGuestsList}
          />
        </div>

        <div className="relative border-2 border-zinc-200 rounded-xl bg-white overflow-hidden">
          <div className="absolute inset-0 overflow-y-auto">
            <Step2Rooms
              configurations={configurations}
              selectedConfig={selectedConfig}
              filteredRooms={filteredRooms}
              chosenRoomId={chosenRoomId}
              isLoading={isLoadingAvailability}
              onConfigChange={handleConfigChange}
              onRoomSelect={handleRoomSelect}
              hasValidDates={
                checkInDate && checkOutDate && checkInDate < checkOutDate
              }
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-5 mt-4 border-t">
        <Button
          text={isSubmitting ? "Confirming..." : "Confirm Reservation"}
          onClick={handleConfirmReservation}
          disabled={!chosenRoomId || !selectedGuestId || isSubmitting}
        />
        <Button text="Cancel" onClick={onClose} disabled={isSubmitting} />
      </div>
    </ModalWrapper>
  );
}
