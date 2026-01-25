import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function ModalWrapper({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-md",
}) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div
        className={`bg-white w-full ${maxWidth} rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95`}
      >
        <div className="flex justify-between items-center border-b border-zinc-300 p-4 bg-zinc-200">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-300 rounded text-zinc-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
