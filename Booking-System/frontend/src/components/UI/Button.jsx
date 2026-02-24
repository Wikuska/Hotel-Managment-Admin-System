export default function Button({
  onClick,
  text,
  additional_style = "",
  type = "button",
  disabled = false,
}) {
  const baseStyle =
    "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded cursor-pointer";
  const disabledStyle = disabled
    ? "opacity-50 cursor-not-allowed hover:bg-blue-600"
    : "";
  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${disabledStyle} ${additional_style}`}
      type={type}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
