import ModalWrapper from "../ui/ModalWrapper";
import Button from "../ui/Button";
import ModalInput from "../ui/ModalInput";
import {
  ROOM_TYPES,
  MODAL_INPUT_CLASS,
  ROOM_STATUSES,
} from "../../utils/constants";

export default function RoomModal({ isOpen, onClose, onSubmit, initialData }) {
  const isEditMode = !!initialData;

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const data = Object.fromEntries(formData);

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
            min="1"
            max="4"
            step="1"
            defaultValue={isEditMode ? initialData.capacity : ""}
            autoComplete="off"
          />

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
