import { useState, useCallback, useRef, useEffect } from "react";
import { getApiError } from "../utils/errorHandler";

export function useApi(apiFunc, { autoFetch = false } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  // Makes sure if component is still open on screen
  const isMounded = useRef(true);

  useEffect(() => {
    isMounded.current = true;
    return () => {
      isMounded.current = false;
    };
  }, []);

  const request = useCallback(
    async (...args) => {
      if (isMounded.current) {
        setLoading(true);
        setError(null);
      }

      try {
        const result = await apiFunc(...args);

        if (isMounded.current) {
          setData(result);
          return result;
        }
      } catch (err) {
        if (isMounded.current) {
          const msg = getApiError(err);
          setError(msg);
          throw err;
        }
      } finally {
        if (isMounded.current) {
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
  };
}
