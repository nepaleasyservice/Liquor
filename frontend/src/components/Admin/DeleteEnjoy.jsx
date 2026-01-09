function DeleteModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl bg-neutral-900 p-6">
        <h2 className="text-xl font-bold text-white">Delete Item</h2>

        <p className="mt-4 text-gray-300">
          Are you sure you want to delete this item?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded px-4 py-2 text-white hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-900 transition-colors"
            onClick={onConfirm}
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}
export default DeleteModal;
