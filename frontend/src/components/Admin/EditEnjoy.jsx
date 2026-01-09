function EditModel({ enjoy, onClose, onSubmit }) {
  if (!enjoy) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl">
        <div className="border-b border-white/10 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Edit Item</h2>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <input type="hidden" name="id" value={enjoy._id} />

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Name</label>
            <input
              type="text"
              name="name"
              defaultValue={enjoy.name}
              className="w-full rounded-lg border border-white/10 bg-black/50 p-3 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">
              Description
            </label>
            <textarea
              name="description"
              rows="3"
              defaultValue={enjoy.description}
              className="w-full rounded-lg border border-white/10 bg-black/50 p-3 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">
              Change Image (optional)
            </label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              className="w-full rounded-lg border border-white/10 bg-black/50 p-2 text-sm text-gray-400 file:mr-4 file:rounded-md file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-white/20"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModel;
