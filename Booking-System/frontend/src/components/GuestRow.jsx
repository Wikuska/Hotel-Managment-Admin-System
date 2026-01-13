import { NotebookPen, Trash2 } from "lucide-react";

export default function GuestRow({ guest, onDelete, onEdit }) {
  return (
    <tr>
      <td className="p-3">
        {guest.first_name} {guest.last_name}
      </td>
      <td className="text-left">{guest.email}</td>
      <td className="text-left">{guest.phone}</td>
      <td>
        <button onClick={onEdit} className="mr-3 cursor-pointer">
          <NotebookPen />
        </button>
        <button onClick={onDelete} className="ml-3 cursor-pointer">
          <Trash2 />
        </button>
      </td>
    </tr>
  );
}
