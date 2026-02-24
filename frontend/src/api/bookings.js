import { api } from "./client";

export function getBookings() {
  return api("/bookings");
}
