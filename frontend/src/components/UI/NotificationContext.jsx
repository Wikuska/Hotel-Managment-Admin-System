import { createContext, useState, useContext } from "react";
import AlertBanner from "./AlertBanner";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {notification && (
        <div className="fixed bottom-4 right-4 z-9999 min-w-75 rounded-lg">
          <AlertBanner
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
