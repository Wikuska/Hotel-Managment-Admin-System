import { NotebookPen, Trash2 } from "lucide-react";

export default function GuestRow({ guest, onDelete, onEdit }) {
  return (
    <tr>
      <td className="p-3">
        {guest.last_name} {guest.first_name}
      </td>
      <td className="text-left">{guest.email}</td>
      <td className="text-left">{guest.phone}</td>
      <td className="p-3">
        <div className="flex items-center justify-end gap-4">
          <button
            onClick={onEdit}
            className="cursor-pointer text-zinc-500 hover:text-green-600 transition-colors duration-200"
            title="Edit guest"
          >
            <NotebookPen size={20} />
          </button>

          <button
            onClick={onDelete}
            className="cursor-pointer text-zinc-500 hover:text-red-600 transition-colors duration-200"
            title="Delete guest"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </td>
    </tr>
  );
}
