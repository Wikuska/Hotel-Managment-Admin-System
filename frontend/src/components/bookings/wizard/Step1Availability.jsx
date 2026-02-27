import ModalInput from "../../ui/ModalInput";
import Button from "../../ui/Button";
import { MODAL_LABEL_CLASS, MODAL_INPUT_CLASS } from "../../../utils/constants";

const getTodayString = () => new Date().toISOString().split("T")[0];
const getNextDay = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
};

export default function Step1Availability({
  checkInDate,
  checkOutDate,
  numGuests,
  isLoading,
  onCheckInChange,
  onCheckOutChange,
  onGuestsChange,
  onCheckAvailability,
}) {
  const canCheckAvailability =
    checkInDate && checkOutDate && checkInDate < checkOutDate;

  return (
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
          onChange={onCheckInChange}
        />
        <ModalInput
          label="Departure Date"
          input_type="date"
          input_name="date_out"
          min={getNextDay(checkInDate)}
          value={checkOutDate}
          onChange={onCheckOutChange}
        />
        <div className="flex flex-col flex-1">
          <label htmlFor="guests_in_room" className={MODAL_LABEL_CLASS}>
            Number of guests
          </label>
          <select
            id="guests_in_room"
            name="guests_in_room"
            className={MODAL_INPUT_CLASS}
            value={numGuests}
            onChange={onGuestsChange}
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
          onClick={onCheckAvailability}
          disabled={!canCheckAvailability || isLoading}
        />
      </div>
    </div>
  );
}
