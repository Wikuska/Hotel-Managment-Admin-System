import { api } from "./client";

export function getBookings() {
  return api("/bookings");
}

export function createBooking() {
  return api("/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
