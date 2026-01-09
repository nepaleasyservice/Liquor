export default function DeleteEnjoy({
  onClose,
  onConfirm,
  saving,
  confirmText = "Delete",
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-[0_0_30px_rgba(0,0,0,0.55)]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Delete Item</h2>

          {/* ✅ Disable X while saving */}
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className={`rounded-lg px-3 py-1 text-sm transition ${
              saving ? "text-white/25 cursor-not-allowed" : "text-white/70 hover:text-white"
            }`}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <p className="mt-3 text-sm text-white/60">
          Are you sure you want to delete this item? This action can’t be undone.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          {/* ✅ Cancel disabled while saving */}
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className={`rounded-xl border px-4 py-2 text-sm transition
              ${
                saving
                  ? "border-white/5 bg-white/[0.03] text-white/30 cursor-not-allowed"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
              }`}
          >
            Cancel
          </button>

          {/* ✅ Confirm disabled while saving + faint */}
          <button
            type="button"
            onClick={onConfirm}
            disabled={saving}
            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition
              ${
                saving
                  ? "border-red-500/10 bg-red-500/5 text-red-200/40 cursor-not-allowed"
                  : "border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20"
              }`}
          >
            {confirmText}
          </button>
        </div>

        {saving && (
          <div className="mt-3 flex items-center gap-2 text-xs text-white/50">
            <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/25 border-t-white/80" />
            Deleting…
          </div>
        )}
      </div>
    </div>
  );
}
