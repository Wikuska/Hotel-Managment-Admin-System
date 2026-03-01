import ModalWrapper from "../ui/ModalWrapper";
import Button from "../ui/Button";
import ModalInput from "../ui/ModalInput";
import { createGuest, updateGuest } from "../../api/guests";
import { Alert } from "../UI/NotificationContext";
import { useApi } from "../../hooks/useApi";

export default function GuestModal({
  isOpen,
  onClose,
  onRefresh,
  initialData,
}) {
  const isEditMode = !!initialData;

  const {
    request: saveGuest,
    loading: isSubmitting,
    error,
    setError,
  } = useApi(
    (data) =>
      isEditMode ? updateGuest(initialData.id, data) : createGuest(data),
    { showToast: false },
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));

    const result = await saveGuest(data);
    if (result) {
      onRefresh();
      onClose();
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit guest informations" : "Add new guest"}
      maxWidth="max-w-xl"
    >
      {error && <Alert message={error} onClose={() => setError(null)} />}
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
            input_type="email"
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
            text={
              isSubmitting
                ? "Saving..."
                : isEditMode
                  ? "Update guest"
                  : "Create guest"
            }
            additional_style="mt-2"
            type="submit"
          />
        </div>
      </form>
    </ModalWrapper>
  );
}
