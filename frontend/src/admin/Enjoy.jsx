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

// ✅ normalize API responses so state always gets the real enjoy object
function normalizeEnjoy(payload) {
  if (!payload) return payload;

  // examples backend can return:
  // { success:true, enjoyData: [ {...} ] }
  // { success:true, enjoy: {...} }
  // {...enjoy}
  if (payload.enjoy) return payload.enjoy;

  if (payload.enjoyData) {
    return Array.isArray(payload.enjoyData) ? payload.enjoyData[0] : payload.enjoyData;
  }

  return payload;
}

export default function Enjoy() {
  const [enjoys, setEnjoys] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const [mode, setMode] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEnjoy, setSelectedEnjoy] = useState(null);

  // ✅ saving states (disable buttons while saving)
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const MODE = {
    CREATE: "create",
    DELETE: "delete",
    EDIT: "edit",
  };

  const isBusy = creating || editing || deleting;

  const openModal = (newMode, enjoy = null) => {
    if (isBusy) return;
    setMode(newMode);
    setSelectedEnjoy(enjoy);
    setShowModal(true);
  };

  const closeModal = () => {
    if (isBusy) return; // ✅ prevent closing while saving
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

      const updatedEnjoy = normalizeEnjoy(response.data);
      setEnjoys((prev) => prev.map((en) => (en._id === id ? updatedEnjoy : en)));

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
      if (image) formData.append("photo", image);

      const payload = await handleEnjoyCreate(formData);
      const newEnjoy = normalizeEnjoy(payload);

      setEnjoys((prev) => [newEnjoy, ...prev]);

      // ✅ reset & close (closeModal blocks while busy, so close manually here)
      setShowModal(false);
      setSelectedEnjoy(null);
      setMode(null);

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

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="mx-auto max-w-7xl flex flex-col gap-6 md:flex-row">
        <AdminSidebar />

        <main className="flex-1 space-y-6">
          {/* Header */}
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
                      ? "bg-white/20 text-black/50 cursor-not-allowed"
                      : "bg-white text-black hover:bg-gray-200"
                  }`}
              >
                + Add New
              </button>
            </div>

            {isBusy && (
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-300">
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white/80" />
                <span>Saving changes… please wait</span>
              </div>
            )}
          </div>

          {/* Table */}
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
                        <td className="px-6 py-4">
                          <div className="h-12 w-12 overflow-hidden rounded-xl border border-white/10 bg-black/40 ring-1 ring-white/5">
                            {imgSrc ? (
                              <img
                                src={imgSrc}
                                alt={enjoy.name}
                                className="h-full w-full object-cover"
                                onError={(e) => (e.currentTarget.style.display = "none")}
                              />
                            ) : (
                              <div className="grid h-full w-full place-items-center text-[10px] text-gray-500">
                                No image
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 font-semibold text-white">
                          {enjoy.name || "—"}
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex max-w-[520px] truncate rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                            {enjoy.description || "—"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openModal(MODE.EDIT, enjoy)}
                              disabled={isBusy}
                              className={`rounded-xl border px-4 py-2 text-sm transition
                                ${
                                  isBusy
                                    ? "border-white/5 bg-white/[0.03] text-white/30 cursor-not-allowed"
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
                                    ? "border-red-500/10 bg-red-500/5 text-red-200/40 cursor-not-allowed"
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
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
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
          saving={creating}
          saveText={creating ? "Saving..." : "Save"}
        />
      )}

      {showModal && mode === MODE.DELETE && (
        <DeleteModal
          onClose={closeModal}
          onConfirm={handleDelete}
          saving={deleting}
          confirmText={deleting ? "Deleting..." : "Delete"}
        />
      )}

      {showModal && mode === MODE.EDIT && (
        <EditModel
          enjoy={selectedEnjoy}
          onClose={closeModal}
          onSubmit={handleEdit}
          saving={editing}
          saveText={editing ? "Saving..." : "Save Changes"}
        />
      )}
    </div>
  );
}
