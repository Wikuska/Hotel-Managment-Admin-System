export default function Button({
  onClick,
  text,
  additional_style = "",
  type = "button",
}) {
  const baseStyle =
    "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded cursor-pointer";
  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${additional_style}`}
      type={type}
    >
      {text}
    </button>
  );
}
