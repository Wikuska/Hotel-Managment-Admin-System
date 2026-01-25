import ModalWrapper from "./ModalWrapper";
import Button from "./Button";
import {
  ROOM_TYPES,
  MODAL_INPUT_CLASS,
  ROOM_STATUSES,
} from "../utils/constants";

export default function RoomModal({ isOpen, onClose, onSubmit, initialData }) {
  const isEditMode = !!initialData;

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const data = {
      number: formData.get("room_number"),
      floor: parseInt(formData.get("room_floor")),
      capacity: parseInt(formData.get("capacity")),
      room_type: formData.get("room_type"),
      room_status: formData.get("room_status") || "available",
    };

    onSubmit(data);
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Update room information" : "Create new room"}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="room_number"
              className="text-sm font-medium text-gray-700"
            >
              Room Number
            </label>
            <input
              name="room_number"
              placeholder="Room number"
              required
              defaultValue={isEditMode ? initialData.number : ""}
              readOnly={isEditMode ? true : false}
              className={MODAL_INPUT_CLASS}
              autoComplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="room_floor"
              className="text-sm font-medium text-gray-700 bg"
            >
              Floor Number
            </label>
            <input
              name="room_floor"
              type="number"
              placeholder="Floor"
              required
              defaultValue={isEditMode ? initialData.floor : ""}
              readOnly={isEditMode ? true : false}
              className={MODAL_INPUT_CLASS}
              autoComplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="capacity"
              className="text-sm font-medium text-gray-700"
            >
              Room Capacity
            </label>
            <input
              name="capacity"
              type="number"
              placeholder="Capacity"
              required
              defaultValue={isEditMode ? initialData.capacity : ""}
              className={MODAL_INPUT_CLASS}
              autoComplete="off"
            />
          </div>
          <div className="col-span-2 ">
            <label
              htmlFor="room_type"
              className="text-sm font-medium text-gray-700"
            >
              Room Type
            </label>
            <select
              name="room_type"
              className={MODAL_INPUT_CLASS}
              defaultValue={isEditMode ? initialData.room_type : "single"}
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
            text={isEditMode ? "Update" : "Create room"}
            additional_style="mt-2"
            type="submit"
          />
        </div>
      </form>
    </ModalWrapper>
  );
}
