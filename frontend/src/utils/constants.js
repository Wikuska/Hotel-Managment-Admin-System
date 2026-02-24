export const MODAL_INPUT_CLASS = "border-zinc-300 border px-5 py-2 w-full h-11";
export const MODAL_LABEL_CLASS = "text-sm font-medium text-gray-700";

export const ROOM_TYPES = [
  {
    value: "single",
    desc: "1 Single",
  },
  {
    value: "double",
    desc: "1 Double",
  },
  {
    value: "twin",
    desc: "2 Single",
  },
  {
    value: "triple_1d1s",
    desc: "1 Double + 1 Single",
  },
  {
    value: "triple_3s",
    desc: "3 Single",
  },
  {
    value: "quad_2d",
    desc: "2 Double",
  },
  {
    value: "quad_1d2s",
    desc: "1 Double + 2 Single",
  },
  {
    value: "quad_4s",
    desc: "4 Single",
  },
];

export const ROOM_STATUSES = [
  {
    value: "available",
    label: "Available",
    color:
      "bg-green-100 text-green-800 border border-green-200 px-3 py-1 rounded-full",
  },
  {
    value: "occupied",
    label: "Occupied",
    color:
      "bg-red-100 text-red-800 border border-red-200 px-3 py-1 rounded-full",
  },
  {
    value: "dirty",
    label: "Dirty",
    color:
      "bg-yellow-100 text-yellow-800 border border-yellow-200 px-3 py-1 rounded-full",
  },
  {
    value: "maintenance",
    label: "Out of order",
    color:
      "bg-gray-100 text-gray-800 border border-gray-200 px-3 py-1 rounded-full",
  },
  {
    value: "cleaning",
    label: "Cleaning",
    color:
      "bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1 rounded-full",
  },
];

export const BOOKING_STATUSES = [
  {
    value: "confirmed",
    label: "Confirmed",
    color:
      "bg-green-100 text-green-800 border border-green-200 px-3 py-1 rounded-full",
  },
  {
    value: "checked_in",
    label: "Checked in",
    color:
      "bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1 rounded-full",
  },
  {
    value: "checked_out",
    label: "Checked out",
    color:
      "bg-gray-100 text-gray-800 border border-gray-200 px-3 py-1 rounded-full",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    color:
      "bg-red-100 text-red-800 border border-red-200 px-3 py-1 rounded-full",
  },
  {
    value: "no_show",
    label: "No show",
    color:
      "bg-purple-100 text-purple-800 border border-purple-200 px-3 py-1 rounded-full",
  },
];
