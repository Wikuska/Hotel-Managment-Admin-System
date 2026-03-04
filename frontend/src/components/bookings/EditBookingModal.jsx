import { useState, useEffect } from "react";
import { updateBooking } from "../../api/bookings";
import { useApi } from "../../hooks/useApi";
import { Alert } from "../UI/NotificationContext";

import ModalWrapper from "../ui/ModalWrapper";
import Button from "../ui/Button";
import ModalInput from "../ui/ModalInput";

export default function EditBookingModal({
  isOpen,
  onClose,
  onRefresh,
  booking,
}) {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  const {
    request: submitUpdate,
    loading: isSubmitting,
    error,
    setError,
  } = useApi(updateBooking, { showToast: false });

  useEffect(() => {
    if (booking && isOpen) {
      setCheckInDate(booking.date_from);
      setCheckOutDate(booking.date_to);
    }
  }, [booking, isOpen]);

  const handleSave = async () => {
    if (!booking || !checkInDate || !checkOutDate) return;

    const updateData = {
      date_from: checkInDate,
      date_to: checkOutDate,
    };

    const result = await submitUpdate(booking.id, updateData);

    if (result) {
      if (onRefresh) onRefresh();
      onClose();
    }
  };

  if (!booking) return null;

  const isArrivalLocked = booking.status !== "confirmed";

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Reservation #${booking.id}`}
      maxWidth="max-w-md"
    >
      {error && <Alert message={error} onClose={() => setError(null)} />}
      <div className="flex flex-col gap-5 mt-4">
        <div className="flex flex-col gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div>
            <p className="text-sm text-gray-500 font-medium">Guest</p>
            <p className="text-lg font-bold text-gray-900">
              {booking.guest?.first_name} {booking.guest?.last_name}
            </p>
            <p className="text-sm text-gray-600">{booking.guest?.email}</p>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-medium">Assigned Room</p>
            <p className="text-md font-bold text-gray-900">
              Room {booking.room?.number || booking.room_id}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ModalInput
            label="Arrival Date"
            input_type="date"
            input_name="edit_date_in"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            disabled={isArrivalLocked}
          />
          <ModalInput
            label="Departure Date"
            input_type="date"
            input_name="edit_date_out"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
          />
        </div>

        <p className="text-xs text-gray-500">
          {isArrivalLocked
            ? "Arrival date cannot be changed after check-in."
            : "System will automatically verify room availability for new dates."}
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-5 mt-6 border-t">
        <Button
          text={isSubmitting ? "Saving..." : "Save Dates"}
          onClick={handleSave}
          disabled={isSubmitting || checkInDate >= checkOutDate}
        />
        <Button text="Cancel" onClick={onClose} disabled={isSubmitting} />
      </div>
    </ModalWrapper>
  );
}
