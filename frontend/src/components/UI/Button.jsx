export default function Button({
  onClick,
  text,
  additional_style = "",
  type = "button",
  disabled = false,
  variant = "primary",
  children,
  ...props
}) {
  const basePrimary =
    "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded cursor-pointer";

  const baseIcon =
    "text-zinc-500 hover:text-blue-600 transition-colors duration-200 p-1";

  const variants = {
    primary: basePrimary,
    icon: baseIcon,
  };

  const disabledStyle = disabled
    ? "opacity-50 cursor-not-allowed hover:bg-blue-600"
    : "";

  return (
    <button
      onClick={onClick}
      className={`${variants[variant]} ${disabledStyle} ${additional_style}`}
      type={type}
      disabled={disabled}
      {...props}
    >
      {children ?? text}
    </button>
  );
}
