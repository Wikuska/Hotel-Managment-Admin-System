export const getApiError = (error) => {
  if (!navigator.onLine) {
    return "No internet connection.";
  }

  console.log(error);

  if (!error.response) {
    return "The server is not responding. Please try again later.";
  }

  const status = error.response.status;
  const detail = error.response.data?.detail;

  if (status >= 500) {
    console.error("Critical Server Error:", error);
    return "Server error occured";
  }

  if (detail) {
    // Pydantic error array
    if (Array.isArray(detail)) {
      return detail[0].msg;
    }

    // Error with detail msg
    return detail;
  }

  return "An unexpected error occurred: " + (error.message || "No details");
};
