import { useEffect, useState } from "react";

export default function EditEnjoy({
  enjoy,
  onClose,
  onSubmit,
  saving,
  saveText = "Save Changes",
}) {
  const [previewName, setPreviewName] = useState("");
  const [previewDescription, setPreviewDescription] = useState("");

  useEffect(() => {
    setPreviewName(enjoy?.name || "");
    setPreviewDescription(enjoy?.description || "");
  }, [enjoy]);

  if (!enjoy) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-[0_0_30px_rgba(0,0,0,0.55)]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Edit Enjoy</h2>

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

        {/* IMPORTANT: keep name="name", name="description", name="photo" for FormData */}
        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-sm text-white/70">Name</label>
            <input
              name="name"
              value={previewName}
              onChange={(e) => setPreviewName(e.target.value)}
              disabled={saving}
              className={`mt-2 w-full rounded-xl border bg-white/5 px-4 py-2 outline-none transition
                ${saving ? "border-white/5 text-white/50 cursor-not-allowed" : "border-white/10 text-white"}
              `}
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Description</label>
            <textarea
              name="description"
              value={previewDescription}
              onChange={(e) => setPreviewDescription(e.target.value)}
              disabled={saving}
              rows={4}
              className={`mt-2 w-full rounded-xl border bg-white/5 px-4 py-2 outline-none transition
                ${saving ? "border-white/5 text-white/50 cursor-not-allowed" : "border-white/10 text-white"}
              `}
              placeholder="Enter description"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Change Photo</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              disabled={saving}
              className={`mt-2 block w-full text-sm transition ${
                saving ? "text-white/35 cursor-not-allowed" : "text-white/70"
              }`}
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-2">
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

            {/* ✅ Save disabled while saving + faint */}
            <button
              type="submit"
              disabled={saving}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition
                ${
                  saving
                    ? "bg-white/20 text-black/50 cursor-not-allowed"
                    : "bg-white text-black hover:bg-white/90"
                }`}
            >
              {saveText}
            </button>
          </div>

          {saving && (
            <div className="flex items-center gap-2 text-xs text-white/50">
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/25 border-t-white/80" />
              Saving…
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
