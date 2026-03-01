import { useState, useCallback, useRef, useEffect } from "react";
import { getApiError } from "../utils/errorHandler";
import { useNotification } from "../components/UI/NotificationContext";

export function useApi(apiFunc, { autoFetch = false, showToast = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  // Makes sure if component is still open on screen
  const isMounted = useRef(true);

  const { showNotification } = useNotification();

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const request = useCallback(
    async (...args) => {
      if (isMounted.current) {
        setLoading(true);
        setError(null);
      }

      try {
        const result = await apiFunc(...args);

        if (isMounted.current) {
          setData(result);
          return result;
        }
      } catch (err) {
        if (isMounted.current) {
          const msg = getApiError(err);
          setError(msg);
          if (showToast) {
            showNotification(msg, "error");
          }
          throw err;
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    },
    [apiFunc],
  );

  useEffect(() => {
    if (autoFetch) {
      request();
    }
  }, [request, autoFetch]);

  return {
    data,
    loading,
    error,
    request,
    setError,
    setData,
  };
}
