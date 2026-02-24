export default function FilterChip({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1 text-sm font-medium rounded-full border transition-colors capitalize
        ${
          isActive
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-zinc-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50"
        }
      `}
    >
      {label}
    </button>
  );
}
