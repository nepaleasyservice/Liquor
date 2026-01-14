import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "./AdminSidebar.jsx";
import { useAdmin } from "../context/AdminContext.jsx";

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

function ConfirmModal({
  open,
  title = "Confirm",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  danger = false,
  onConfirm,
  onClose,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            {message ? <p className="mt-1 text-sm text-gray-300">{message}</p> : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-gray-400 hover:text-white"
            aria-label="Close"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-60"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={classNames(
              "rounded-xl border px-4 py-2 text-sm disabled:opacity-60",
              danger
                ? "border-red-500/30 bg-red-500/10 hover:bg-red-500/15 text-red-100"
                : "border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-100"
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Users() {
  const {
    users,
    usersPagination,
    usersLoading,
    error,
    fetchUsers,
    toggleDisableUser,
    USERS_DEFAULT_LIMIT,
  } = useAdmin();

  const [name, setName] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  useEffect(() => {
    fetchUsers({ page: 1, limit: USERS_DEFAULT_LIMIT, name: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const page = usersPagination?.page ?? 1;
  const totalPages = usersPagination?.totalPages ?? 1;

  const doSearch = () => {
    fetchUsers({ page: 1, limit: USERS_DEFAULT_LIMIT, name: name.trim() });
  };

  const clearSearch = () => {
    setName("");
    fetchUsers({ page: 1, limit: USERS_DEFAULT_LIMIT, name: "" });
  };

  const goToPage = (nextPage) => {
    fetchUsers({ page: nextPage, limit: USERS_DEFAULT_LIMIT });
  };

  const rows = useMemo(() => users || [], [users]);

  const requestToggle = (u) => {
    const disabled = !!u?.isDisabled;

    if (!disabled) {
      setPendingUser({ _id: u?._id, name: u?.name, isDisabled: disabled });
      setConfirmOpen(true);
      return;
    }

    toggleDisableUser(u?._id);
  };

  const closeConfirm = () => {
    if (usersLoading) return;
    setConfirmOpen(false);
    setPendingUser(null);
  };

  const confirmDisable = () => {
    if (!pendingUser?._id) return;
    toggleDisableUser(pendingUser._id);
    closeConfirm();
  };

  return (
    // ✅ prevents the whole page from horizontally overflowing (white space)
    // ✅ pl-[2px] if you want sidebar ~2px from left
    <div className="min-h-screen bg-black text-white overflow-x-hidden pt-6 pr-6 pb-6 pl-[2px]">
      <div className="mx-auto max-w-7xl flex flex-col gap-6 md:flex-row">
        <AdminSidebar />

        {/* ✅ min-w-0 allows main to shrink instead of forcing overflow */}
        <main className="flex-1 min-w-0 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Users</h1>
              <p className="mt-1 text-sm text-gray-400">
                Manage registered users (server-side search, paginate, disable/enable).
              </p>
            </div>

            {/* ✅ WRAP on small screens so it doesn't overflow */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
              <div className="relative w-full sm:w-auto">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") doSearch();
                  }}
                  placeholder="Search by name..."
                  // ✅ responsive width instead of fixed w-72 always
                  className="w-full sm:w-72 rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm outline-none focus:border-white/30"
                />

                {name && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    aria-label="Clear"
                    type="button"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={doSearch}
                  disabled={usersLoading}
                  className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15 disabled:opacity-60"
                  type="button"
                >
                  Search
                </button>

                <button
                  onClick={() => fetchUsers({ page: 1, limit: USERS_DEFAULT_LIMIT })}
                  disabled={usersLoading}
                  className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15 disabled:opacity-60"
                  type="button"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
            {/* ✅ table can scroll horizontally INSIDE without breaking the page */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[720px]">
                <thead className="bg-white/5 text-gray-300">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Joined</th>
                    <th className="px-4 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {usersLoading ? (
                    [...Array(6)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-4 py-3">
                          <div className="h-4 w-40 rounded bg-white/10" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 w-56 rounded bg-white/10" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 w-20 rounded bg-white/10" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 w-28 rounded bg-white/10" />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="ml-auto h-8 w-28 rounded bg-white/10" />
                        </td>
                      </tr>
                    ))
                  ) : rows.length === 0 ? (
                    <tr>
                      <td className="px-4 py-10 text-center text-gray-400" colSpan={5}>
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    rows.map((u) => {
                      const disabled = !!u?.isDisabled;
                      return (
                        <tr key={u?._id} className="hover:bg-white/5">
                          <td className="px-4 py-3">
                            {/* ✅ prevents long names from widening layout */}
                            <div className="font-medium text-white truncate max-w-[240px]">
                              {u?.name || "—"}
                            </div>
                          </td>

                          <td className="px-4 py-3 text-gray-200">
                            {/* ✅ prevents long emails from widening layout */}
                            <div className="truncate max-w-[320px]">{u?.email || "—"}</div>
                          </td>

                          <td className="px-4 py-3">
                            <span
                              className={classNames(
                                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border",
                                disabled
                                  ? "border-red-500/30 bg-red-500/10 text-red-200"
                                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                              )}
                            >
                              {disabled ? "Disabled" : "Active"}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                            {u?.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                          </td>

                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <button
                              onClick={() => requestToggle(u)}
                              disabled={usersLoading}
                              className={classNames(
                                "rounded-xl px-4 py-2 text-sm border disabled:opacity-60",
                                disabled
                                  ? "border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-100"
                                  : "border-red-500/30 bg-red-500/10 hover:bg-red-500/15 text-red-100"
                              )}
                              type="button"
                            >
                              {disabled ? "Enable" : "Disable"}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white/5 px-4 py-3">
              <div className="text-sm text-gray-300">
                Page <span className="font-medium text-white">{page}</span> of{" "}
                <span className="font-medium text-white">{totalPages}</span>
                <span className="ml-2 text-gray-400">
                  (Total: {usersPagination?.total ?? rows.length})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={!usersPagination?.hasPrevPage || usersLoading}
                  onClick={() => goToPage(page - 1)}
                  className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm disabled:opacity-40"
                  type="button"
                >
                  Prev
                </button>
                <button
                  disabled={!usersPagination?.hasNextPage || usersLoading}
                  onClick={() => goToPage(page + 1)}
                  className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm disabled:opacity-40"
                  type="button"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Disable user?"
        message={`Are you sure you want to disable ${pendingUser?.name || "this user"}?`}
        confirmText="Yes, disable"
        cancelText="Cancel"
        danger
        loading={usersLoading}
        onClose={closeConfirm}
        onConfirm={confirmDisable}
      />
    </div>
  );
}
