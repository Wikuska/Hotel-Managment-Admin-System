import { useState } from "react";
import { getRooms } from "../../api/rooms";
import { getGuests } from "../../api/guests";
import { createBooking } from "../../api/bookings";
import { useApi } from "../../hooks/useApi";

import ModalWrapper from "../ui/ModalWrapper";
import Button from "../ui/Button";
import ErrorBanner from "../ui/ErrorBanner";

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
  const [step, setStep] = useState(1);
  const [checkInDate, setCheckInDate] = useState(getTodayString());
  const [checkOutDate, setCheckOutDate] = useState("");
  const [numGuests, setNumGuests] = useState(1);

  const [chosenRoomId, setChosenRoomId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGuestId, setSelectedGuestId] = useState(null);

  const [rooms, setRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState("all");
  const [configurations, setConfigurations] = useState([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");

  const {
    request: submitBooking,
    loading: isSubmitting,
    error: submitError,
    setError: setSubmitError,
  } = useApi(createBooking);

  const { data: guests = [], request: fetchGuestsList } = useApi(getGuests);

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

  const handleCheckAvailability = async () => {
    if (!checkInDate || !checkOutDate || checkInDate >= checkOutDate) return;

    setIsLoadingAvailability(true);
    setAvailabilityError("");

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
      setAvailabilityError(
        "Failed to fetch available rooms. Please try again.",
      );
      console.error(err);
    } finally {
      setIsLoadingAvailability(false);
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

    if (!guests || guests.length === 0) {
      fetchGuestsList();
    }
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
      maxWidth="max-w-5xl"
    >
      <ErrorBanner message={submitError} onClose={() => setSubmitError(null)} />

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

      {step >= 2 && (
        <Step2Rooms
          error={availabilityError}
          configurations={configurations}
          selectedConfig={selectedConfig}
          filteredRooms={filteredRooms}
          chosenRoomId={chosenRoomId}
          isLoading={isLoadingAvailability}
          onConfigChange={handleConfigChange}
          onRoomSelect={handleRoomSelect}
        />
      )}

      {step >= 3 && (
        <Step3Guests
          guests={guests}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedGuestId={selectedGuestId}
          setSelectedGuestId={setSelectedGuestId}
        />
      )}

      <div className="flex justify-end gap-2 pt-5">
        <Button
          text={isSubmitting ? "Confirming..." : "Confirm Reservation"}
          onClick={handleConfirmReservation}
          disabled={step < 3 || !selectedGuestId || isSubmitting}
        />
        <Button text="Cancel" onClick={onClose} disabled={isSubmitting} />
      </div>
    </ModalWrapper>
  );
}
