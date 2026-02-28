import { AlertCircle, CheckCircle2, X } from "lucide-react";

export default function AlertBanner({ message, type = "error", onClose }) {
  if (!message) return null;

  const colorStyles = {
    error: "text-red-800 border-red-300 bg-red-50",
    success: "text-green-800 border-green-300 bg-green-50",
  };

  const buttonStyles = {
    error: "bg-red-50 text-red-500 focus:ring-red-400 hover:bg-red-200",
    success:
      "bg-green-50 text-green-500 focus:ring-green-400 hover:bg-green-200",
  };

  const icons = {
    error: <AlertCircle className="shrink-0 w-5 h-5 mr-2" />,
    success: <CheckCircle2 className="shrink-0 w-5 h-5 mr-2" />,
  };

  return (
    <div
      className={`flex items-center justify-between p-4 mb-4 border rounded-lg ${colorStyles[type]}`}
    >
      <div className="flex items-center">
        {icons[type]}
        <span className="sr-only">
          {type === "error" ? "Error" : "Success"}
        </span>
        <h3 className="text-sm font-medium">{message}</h3>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className={`ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex items-center justify-center h-8 w-8 transition-colors ${buttonStyles[type]}`}
        >
          <span className="sr-only">Dismiss</span>
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
