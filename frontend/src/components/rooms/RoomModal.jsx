import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { updateRoom, createRoom } from "../../api/rooms";
import ModalWrapper from "../ui/ModalWrapper";
import Button from "../ui/Button";
import ModalInput from "../ui/ModalInput";
import {
  ROOM_TYPES,
  MODAL_INPUT_CLASS,
  ROOM_STATUSES,
} from "../../utils/constants";
import { Alert } from "../ui/NotificationContext";

export default function RoomModal({ isOpen, onClose, onRefresh, initialData }) {
  const isEditMode = !!initialData;
  const [selectedType, setSelectedType] = useState(
    initialData ? initialData.room_type : "single",
  );
  const currentRoomInfo = ROOM_TYPES.find(
    (type) => type.value === selectedType,
  );
  const currentCapacity = currentRoomInfo ? currentRoomInfo.capacity : 1;

  const {
    request: saveRoom,
    loading: isSubmitting,
    error,
    setError,
  } = useApi(
    (data) =>
      isEditMode ? updateRoom(initialData.id, data) : createRoom(data),
    { showToast: false },
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    const rawData = Object.fromEntries(new FormData(event.target));

    const data = {
      ...rawData,
      floor: parseInt(rawData.floor, 10),
      capacity: parseInt(rawData.capacity, 10),
    };

    if (await saveRoom(data)) {
      onRefresh();
      onClose();
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Update room information" : "Create new room"}
      maxWidth="max-w-xl"
    >
      {error && <Alert message={error} onClose={() => setError(null)} />}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-4">
          <ModalInput
            label="Room number"
            input_name="number"
            autoComplete="off"
            defaultValue={isEditMode ? initialData.number : ""}
            readOnly={isEditMode ? true : false}
          />
          <ModalInput
            label="Floor Number"
            input_name="floor"
            input_type="number"
            defaultValue={isEditMode ? initialData.floor : ""}
            readOnly={isEditMode ? true : false}
            autoComplete="off"
          />

          <ModalInput
            label="Room Capacity"
            input_name="capacity"
            input_type="number"
            value={currentCapacity}
            readOnly={true}
          />

          <div className="col-span-2 ">
            <label
              htmlFor="room_type"
              className="text-sm font-medium text-gray-700"
            >
              Room Type
            </label>
            <select
              id="room_type"
              name="room_type"
              className={MODAL_INPUT_CLASS}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {ROOM_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.desc}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="room_status"
              className="text-sm font-medium text-gray-700"
            >
              Room Status
            </label>
            <select
              id="room_status"
              name="room_status"
              className={MODAL_INPUT_CLASS}
              defaultValue={isEditMode ? initialData.room_status : "available"}
            >
              {ROOM_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex w-full justify-end">
          <Button
            text={
              isSubmitting
                ? "Saving..."
                : isEditMode
                  ? "Update room"
                  : "Create room"
            }
            additional_style="mt-2"
            type="submit"
          />
        </div>
      </form>
    </ModalWrapper>
  );
}
