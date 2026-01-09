import { api } from "./client";

export function getGuests() {
  return api("/guests");
}

export function createGuest(payload) {
  return api("/guests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
