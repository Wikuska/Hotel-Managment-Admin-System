import { MODAL_INPUT_CLASS, MODAL_LABEL_CLASS } from "../utils/constants";

export default function ModalInput({
  label,
  input_type = "text",
  input_name,
  additional_style = "",
  ...props
}) {
  return (
    <div className="flex-1">
      <div className="flex flex-col">
        <label htmlFor={input_name} className={MODAL_LABEL_CLASS}>
          {label}
        </label>
        <input
          type={input_type}
          name={input_name}
          className={`${MODAL_INPUT_CLASS} ${additional_style}`}
          {...props}
        />
      </div>
    </div>
  );
}
