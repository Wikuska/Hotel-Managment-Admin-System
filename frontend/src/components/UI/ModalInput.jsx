import { MODAL_INPUT_CLASS, MODAL_LABEL_CLASS } from "../../utils/constants";

export default function ModalInput({
  label,
  input_type = "text",
  input_name,
  additional_style = "",
  required = true,
  readOnly = false,
  ...props
}) {
  return (
    <div className="flex-1">
      <div className="flex flex-col">
        <label htmlFor={input_name} className={MODAL_LABEL_CLASS}>
          {label}
        </label>
        <input
          id={input_name}
          type={input_type}
          name={input_name}
          required={required}
          readOnly={readOnly}
          className={`
            ${MODAL_INPUT_CLASS} 
            ${readOnly ? "bg-zinc-50 text-zinc-600 cursor-default focus:ring-0 focus:outline-none" : ""} 
            ${additional_style}`}
          {...props}
        />
      </div>
    </div>
  );
}
