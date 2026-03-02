import { api } from "./client";

export function getBookings() {
  return api("/bookings");
}

export function createBooking(payload) {
  return api("/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateBooking(bookingId, payload) {
  return api(`/bookings/${bookingId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
