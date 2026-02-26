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

export function updateGuest(id, payload) {
  return api(`/guests/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteGuest(id) {
  return api(`/guests/${id}`, { method: "DELETE" });
}
