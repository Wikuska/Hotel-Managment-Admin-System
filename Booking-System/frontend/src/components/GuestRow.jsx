import { NotebookPen, Trash2 } from "lucide-react";

export default function GuestRow({ guest, onDelete }) {
  return (
    <tr>
      <td className="p-3">
        {guest.first_name} {guest.last_name}
      </td>
      <td className="text-left">{guest.email}</td>
      <td className="text-left">{guest.phone}</td>
      <td>
        <button className="mr-3 cursor-pointer">
          <NotebookPen />
        </button>
        <button
          className="ml-3 cursor-pointer"
          onClick={() => onDelete(guest.id)}
        >
          <Trash2 />
        </button>
      </td>
    </tr>
  );
}
