import ModalWrapper from "../ui/ModalWrapper";
import Button from "../ui/Button";
import ModalInput from "../ui/ModalInput";

export default function GuestModal({ isOpen, onClose, onSubmit, initialData }) {
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
      title={isEditMode ? "Edit guest informations" : "Add new guest"}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          <ModalInput
            label="First Name"
            input_name="first_name"
            defaultValue={isEditMode ? initialData.first_name : ""}
            autoComplete="off"
          />
          <ModalInput
            label="Last Name"
            input_name="last_name"
            defaultValue={isEditMode ? initialData.last_name : ""}
            autoComplete="off"
          />
          <ModalInput
            label="Email Address"
            input_name="email"
            input_type="emial"
            defaultValue={isEditMode ? initialData.email : ""}
            autoComplete="off"
          />
          <ModalInput
            label="Phone Number"
            input_name="phone"
            input_type="tel"
            defaultValue={isEditMode ? initialData.phone : ""}
            autoComplete="off"
          />
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
