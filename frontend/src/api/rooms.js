import { api } from "./client";

export function getRooms() {
  return api("/rooms");
}

export function createRoom(payload) {
  return api("/rooms", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateRoom(id, payload) {
  return api(`/rooms/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteRoom(id) {
  return api(`/rooms/${id}`, { method: "DELETE" });
}
