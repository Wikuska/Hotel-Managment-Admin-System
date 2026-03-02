import { getBookings } from "../api/bookings";
import { ROOM_TYPES } from "./constants";

/**
 * Check if a room is available for the given date range
 */
export async function isRoomAvailable(
  roomId,
  checkIn,
  checkOut,
  bookings,
  excludeBookingId = null,
) {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  return !bookings.some((booking) => {
    if (excludeBookingId && String(booking.id) === String(excludeBookingId)) {
      return false;
    }

    if (booking.room_id !== roomId) {
      return false;
    }
    const bookingStart = new Date(booking.date_from);
    const bookingEnd = new Date(booking.date_to);

    // Overlap occurs if: checkIn < bookingEnd AND checkOut > bookingStart
    return checkInDate < bookingEnd && checkOutDate > bookingStart;
  });
}

/**
 * Fetch all bookings and filter available rooms by capacity match and date range
 */
export async function getAvailableRooms(
  rooms,
  checkIn,
  checkOut,
  guestCount,
  excludeBookingId = null,
) {
  try {
    const bookings = await getBookings();
    const availableRooms = [];

    for (const room of rooms) {
      if (room.capacity !== guestCount) continue;
      if (room.room_status === "maintenance") continue;

      const available = await isRoomAvailable(
        room.id,
        checkIn,
        checkOut,
        bookings,
        excludeBookingId,
      );
      if (available) {
        availableRooms.push(room);
      }
    }

    return availableRooms;
  } catch (error) {
    console.error("Error fetching available rooms:", error);
    throw error;
  }
}

/**
 * Extract unique bed configurations from rooms for dynamic filter chips
 */
export function getConfigurationsForCapacity(rooms, capacity) {
  const typeMap = Object.fromEntries(ROOM_TYPES.map((t) => [t.value, t.desc]));

  const filteredRooms = rooms.filter((r) => r.capacity === capacity);
  const configs = new Set(
    filteredRooms.map((r) => typeMap[r.room_type] || r.room_type),
  );

  return Array.from(configs).sort();
}

export function filterRoomsByConfiguration(rooms, configLabel) {
  const typeMap = Object.fromEntries(ROOM_TYPES.map((t) => [t.value, t.desc]));

  if (configLabel === "all") return rooms;

  return rooms.filter(
    (r) => (typeMap[r.room_type] || r.room_type) === configLabel,
  );
}
