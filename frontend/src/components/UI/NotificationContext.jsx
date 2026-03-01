import { createContext, useState, useContext, useRef, useEffect } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { useLocation } from "react-router-dom";

const NotificationContext = createContext();

export function Alert({
  message,
  type = "error",
  onClose,
  variant = "inline",
}) {
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

  const baseClasses =
    "border-l-4 p-4 flex items-start justify-between transition-all duration-300";

  const variantClasses =
    variant === "inline"
      ? "w-full rounded-lg mb-4"
      : "fixed bottom-8 right-8 z-50 w-full max-w-sm rounded-lg shadow-2xl";

  return (
    <div className={`${baseClasses} ${variantClasses} ${colorStyles[type]}`}>
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

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);
  const timerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (notification) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setNotification(null);
    }
  }, [location.pathname]);

  const showNotification = (message, type = "success") => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setNotification({ message, type });
    if (type === "success") {
      timerRef.current = setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {notification && (
        <div>
          <Alert
            message={notification.message}
            type={notification.type}
            variant="floating"
            onClose={() => setNotification(null)}
          />
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
