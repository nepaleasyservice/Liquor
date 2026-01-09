import AdminSidebar from "./AdminSidebar.jsx";
import { useEffect, useMemo, useState } from "react";
import api from "../services/api.js";
import { handleEnjoyCreate } from "../services/enjoyService.js";
import DeleteModal from "../components/Admin/DeleteEnjoy.jsx";
import CreateModel from "../components/Admin/CreateEnjoy.jsx";
import EditModel from "../components/Admin/EditEnjoy.jsx";

function getEnjoyImage(enjoy) {
  if (!enjoy) return "";
  if (enjoy.photo?.url) return enjoy.photo.url;
  return "";
}

export default function Enjoy() {
  const [enjoys, setEnjoys] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const [mode, setMode] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEnjoy, setSelectedEnjoy] = useState(null);

  // ✅ NEW: saving states (disable buttons while saving)
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const MODE = {
    CREATE: "create",
    DELETE: "delete",
    EDIT: "edit",
  };

  const openModal = (newMode, enjoy = null) => {
    setMode(newMode);
    setSelectedEnjoy(enjoy);
    setShowModal(true);
  };

  const closeModal = () => {
    if (creating || editing || deleting) return; // ✅ prevent closing while saving
    setShowModal(false);
    setSelectedEnjoy(null);
    setMode(null);
  };

  const handleDelete = async () => {
    if (!selectedEnjoy || deleting) return;
    setDeleting(true);
    try {
      const id = selectedEnjoy._id;
      await api.delete(`/enjoy/delete/${id}`);
      setEnjoys((prev) => prev.filter((e) => e._id !== id));
      closeModal();
    } catch (error) {
      console.error("Error deleting enjoy:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!selectedEnjoy || editing) return;

    setEditing(true);
    try {
      const formData = new FormData(e.target);
      const id = selectedEnjoy._id;

      const response = await api.put(`/enjoy/update/${id}`, formData);

      // ✅ keep your original logic
      setEnjoys((prev) => prev.map((en) => (en._id === id ? response.data : en)));
      closeModal();
    } catch (error) {
      console.error("Error editing enjoy:", error);
    } finally {
      setEditing(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (creating) return;

    setCreating(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("photo", image);

      const newEnjoy = await handleEnjoyCreate(formData);
      setEnjoys((prev) => [newEnjoy, ...prev]);

      setShowModal(false);
      setName("");
      setDescription("");
      setImage(null);
    } catch (error) {
      console.error("Error creating enjoy:", error);
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    const fetchEnjoys = async () => {
      try {
        const response = await api.get("/enjoy/get");
        setEnjoys(response.data);
      } catch (error) {
        console.error("Error fetching enjoys:", error);
      }
    };
    fetchEnjoys();
  }, []);

  const rows = useMemo(() => enjoys || [], [enjoys]);

  // ✅ one flag for UI disabling
  const isBusy = creating || editing || deleting;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="mx-auto max-w-7xl flex flex-col gap-6 md:flex-row">
        <AdminSidebar />

        <main className="flex-1 space-y-6">
          {/* Header (improved UI) */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-[0_0_30px_rgba(255,255,255,0.06)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Enjoy Management
                </h1>
                <p className="mt-1 text-sm text-gray-400">
                  Create, edit, and remove items in one place.
                </p>
              </div>

              <button
                onClick={() => openModal(MODE.CREATE)}
                disabled={isBusy}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition
                  ${
                    isBusy
                      ? "bg-white/30 text-black/70 cursor-not-allowed"
                      : "bg-white text-black hover:bg-gray-200"
                  }`}
              >
                + Add New
              </button>
            </div>

            {/* ✅ subtle busy indicator */}
            {isBusy && (
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-300">
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                <span>Saving changes… please wait</span>
              </div>
            )}
          </div>

          {/* Table (improved UI) */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_30px_rgba(0,0,0,0.35)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-white/5 text-gray-300">
                  <tr>
                    <th className="px-6 py-4 font-medium w-[12%]">Image</th>
                    <th className="px-6 py-4 font-medium w-[18%]">Name</th>
                    <th className="px-6 py-4 font-medium w-[40%]">Description</th>
                    <th className="px-6 py-4 font-medium text-right w-[30%]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {rows.map((enjoy) => {
                    const imgSrc = getEnjoyImage(enjoy);

                    return (
                      <tr key={enjoy._id} className="hover:bg-white/5 transition">
                        {/* Image */}
                        <td className="px-6 py-4">
                          <div className="h-12 w-12 overflow-hidden rounded-xl border border-white/10 bg-black/40 ring-1 ring-white/5">
                            {imgSrc ? (
                              <img
                                src={imgSrc}
                                alt={enjoy.name}
                                className="h-full w-full object-cover"
                                onError={(e) =>
                                  (e.currentTarget.style.display = "none")
                                }
                              />
                            ) : (
                              <div className="grid h-full w-full place-items-center text-[10px] text-gray-500">
                                No image
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Name */}
                        <td className="px-6 py-4 font-semibold text-white">
                          {enjoy.name || "—"}
                        </td>

                        {/* Description */}
                        <td className="px-6 py-4">
                          <span className="inline-flex max-w-[520px] truncate rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                            {enjoy.description || "—"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openModal(MODE.EDIT, enjoy)}
                              disabled={isBusy}
                              className={`rounded-xl border px-4 py-2 text-sm transition
                                ${
                                  isBusy
                                    ? "border-white/10 bg-white/5 text-gray-500 cursor-not-allowed"
                                    : "border-white/10 bg-white/5 text-gray-200 hover:bg-white/10"
                                }`}
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => openModal(MODE.DELETE, enjoy)}
                              disabled={isBusy}
                              className={`rounded-xl border px-4 py-2 text-sm transition
                                ${
                                  isBusy
                                    ? "border-red-500/20 bg-red-500/5 text-red-200/40 cursor-not-allowed"
                                    : "border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20"
                                }`}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {rows.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-gray-400"
                      >
                        No items found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {showModal && mode === MODE.CREATE && (
        <CreateModel
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          setImage={setImage}
          onClose={closeModal}
          onSubmit={handleCreateSubmit}
          // ✅ pass saving info (CreateModel should use it to disable submit button)
          saving={creating}
          saveText={creating ? "Saving..." : "Save"}
        />
      )}

      {showModal && mode === MODE.DELETE && (
        <DeleteModal
          onClose={closeModal}
          onConfirm={handleDelete}
          // ✅ pass saving info (DeleteModal should disable confirm button)
          saving={deleting}
          confirmText={deleting ? "Deleting..." : "Delete"}
        />
      )}

      {showModal && mode === MODE.EDIT && (
        <EditModel
          enjoy={selectedEnjoy}
          onClose={closeModal}
          onSubmit={handleEdit}
          // ✅ pass saving info (EditModel should disable submit button)
          saving={editing}
          saveText={editing ? "Saving..." : "Save Changes"}
        />
      )}
    </div>
  );
}
