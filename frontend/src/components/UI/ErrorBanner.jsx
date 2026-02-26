const ErrorBanner = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed top-24 right-4 z-50 flex max-w-sm w-full bg-white border-l-4 border-red-500 rounded shadow-lg overflow-hidden animate-fade-in-down">
      <div className="flex justify-center items-center w-12 bg-red-500">
        <svg
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <div className="-mx-3 py-2 px-4 flex-1">
        <div className="mx-3">
          <span className="text-red-500 font-semibold text-sm">Błąd</span>
          <p className="text-gray-600 text-sm mt-1">{message}</p>
        </div>
      </div>

      <div className="flex items-start border-l border-gray-100">
        <button
          onClick={onClose}
          className="p-3 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ErrorBanner;
