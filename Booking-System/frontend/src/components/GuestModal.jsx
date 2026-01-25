import ModalWrapper from "./ModalWrapper";
import Button from "./Button";
import { MODAL_INPUT_CLASS } from "../utils/constants";

export default function GuestModal({ isOpen, onClose, onSubmit, initialData }) {
  const isEditMode = !!initialData;

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const data = {
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    };

    onSubmit(data);
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit guest informations" : "Add new guest"}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          <div>
            <label
              htmlFor="first_name"
              className="text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              name="first_name"
              placeholder="First Name"
              defaultValue={isEditMode ? initialData.first_name : ""}
              required
              className={MODAL_INPUT_CLASS}
              autoComplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="last_name"
              className="text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              name="last_name"
              placeholder="Last Name"
              defaultValue={isEditMode ? initialData.last_name : ""}
              required
              className={MODAL_INPUT_CLASS}
              autoComplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              defaultValue={isEditMode ? initialData.email : ""}
              required
              className={MODAL_INPUT_CLASS}
              autoComplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              defaultValue={isEditMode ? initialData.phone : ""}
              required
              className={MODAL_INPUT_CLASS}
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex w-full justify-end">
          <Button
            text={isEditMode ? "Update guest" : "Create guest"}
            additional_style="mt-2"
            type="submit"
          />
        </div>
      </form>
    </ModalWrapper>
  );
}
