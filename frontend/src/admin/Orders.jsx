import AdminSidebar from "./AdminSidebar.jsx";
import { useEffect, useMemo, useState } from "react";
import { fetchOrders } from "../services/orderService.js";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders(status);
      setOrders(Array.isArray(data?.orders) ? data.orders : []);
    } catch (e) {
      console.error("Fetch orders failed", e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.paymentStatus === "PENDING").length;
    const paid = orders.filter((o) => o.paymentStatus === "SUCCESS").length;
    const failed = orders.filter((o) => o.paymentStatus === "FAILED").length;
    return { total, pending, paid, failed };
  }, [orders]);

  return (
    <div className="min-h-screen w-full bg-black text-white overflow-x-hidden font-sans">
      <div className="p-4 md:p-6">
        <div className="mx-auto max-w-7xl flex flex-col gap-4 md:gap-6 md:flex-row">
          <AdminSidebar />

          <main className="flex-1 min-w-0 space-y-4 md:space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6 backdrop-blur-md md:flex-row md:items-center">
              <div className="min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  Orders
                </h1>
                <p className="mt-1 text-xs md:text-sm text-gray-400">
                  View and manage customer orders.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full sm:w-auto rounded-xl bg-black/40 border border-white/10 px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  <option value="">All</option>
                  <option value="PENDING">Pending</option>
                  <option value="SUCCESS">Success</option>
                  <option value="FAILED">Failed</option>
                </select>

                <button
                  onClick={load}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <StatCard label="Total" value={stats.total} />
              <StatCard label="Pending" value={stats.pending} />
              <StatCard label="Paid" value={stats.paid} />
              <StatCard label="Failed" value={stats.failed} />
            </div>

            {/* MOBILE (NO TABLE, NO SCROLL) */}
            <div className="md:hidden space-y-3">
              {loading && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-gray-400">
                  Loading...
                </div>
              )}

              {!loading && orders.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-gray-400">
                  No orders found.
                </div>
              )}

              {!loading &&
                orders.map((o) => (
                  <OrderCompactRow
                    key={o._id || o.orderId}
                    order={o}
                    onView={() => setSelected(o)}
                  />
                ))}
            </div>

            {/* DESKTOP/TABLET (FIT SCREEN, NO H-SCROLL) */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <table className="w-full table-fixed text-left text-sm text-gray-300">
                <thead className="bg-white/5 text-xs uppercase tracking-wider text-gray-400">
                  <tr>
                    <th className="px-4 py-4 font-semibold w-[14%]">Order ID</th>
                    <th className="px-4 py-4 font-semibold w-[20%]">
                      Customer
                    </th>
                    <th className="px-4 py-4 font-semibold w-[8%]">Items</th>
                    <th className="px-4 py-4 font-semibold w-[12%]">Total</th>
                    <th className="px-4 py-4 font-semibold w-[12%]">
                      Payment
                    </th>
                    <th className="px-4 py-4 font-semibold w-[12%]">Status</th>
                    <th className="px-4 py-4 font-semibold w-[14%]">
                      Created
                    </th>
                    <th className="px-4 py-4 font-semibold w-[8%]">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {loading && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-10 text-center text-gray-400"
                      >
                        Loading...
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    orders.map((o) => (
                      <tr
                        key={o._id || o.orderId}
                        className="transition-colors hover:bg-white/5"
                      >
                        <td className="px-4 py-4 font-mono text-xs text-gray-300">
                          <div className="truncate">{o.orderId || "—"}</div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="font-medium text-white truncate">
                            {o.deliveryAddress?.fullName || o.user?.name || "—"}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {o.deliveryAddress?.email || o.user?.email || "—"}
                          </div>
                        </td>

                        <td className="px-4 py-4">{sumQty(o)}</td>

                        <td className="px-4 py-4 font-semibold text-[#D4A056]">
                          <div className="truncate">
                            Rs. {Number(o.total || 0).toLocaleString()}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex max-w-full rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs">
                            <span className="truncate">
                              {o.paymentMethod || "—"}
                            </span>
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <StatusPill status={o.paymentStatus} />
                        </td>

                        {/* ✅ Created shown in 2 lines */}
                        <td className="px-4 py-4 text-xs text-gray-400">
                          <div className="leading-4">
                            <div className="truncate">
                              {formatDate(o.createdAt)}
                            </div>
                            <div className="truncate">
                              {formatTime(o.createdAt)}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <button
                            onClick={() => setSelected(o)}
                            className="w-full rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}

                  {!loading && orders.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-10 text-center text-gray-400"
                      >
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </main>
        </div>

        {/* Modal */}
        {selected && (
          <OrderModal order={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </div>
  );
}

/* ====================== COMPONENTS ====================== */

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5">
      <div className="text-[10px] md:text-xs uppercase tracking-wider text-gray-400">
        {label}
      </div>
      <div className="mt-2 text-xl md:text-2xl font-bold text-white">
        {value}
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border";

  if (status === "SUCCESS")
    return (
      <span
        className={`${base} bg-green-500/10 text-green-400 border-green-500/20`}
      >
        SUCCESS
      </span>
    );

  if (status === "FAILED")
    return (
      <span className={`${base} bg-red-500/10 text-red-400 border-red-500/20`}>
        FAILED
      </span>
    );

  return (
    <span
      className={`${base} bg-yellow-500/10 text-yellow-300 border-yellow-500/20`}
    >
      PENDING
    </span>
  );
}

function OrderCompactRow({ order, onView }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs text-gray-400">Order</div>
          <div className="mt-1 font-mono text-xs text-gray-200 break-all">
            {order.orderId || "—"}
          </div>
        </div>
        <StatusPill status={order.paymentStatus} />
      </div>

      <div className="mt-3">
        <div className="font-semibold text-white truncate">
          {order.deliveryAddress?.fullName || order.user?.name || "—"}
        </div>
        <div className="text-xs text-gray-500 truncate">
          {order.deliveryAddress?.email || order.user?.email || "—"}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-xs text-gray-400">Items</div>
          <div className="text-gray-200">{sumQty(order)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Total</div>
          <div className="font-semibold text-[#D4A056]">
            Rs. {Number(order.total || 0).toLocaleString()}
          </div>
        </div>

        {/* ✅ Created in 2 lines on mobile too */}
        <div className="col-span-2">
          <div className="text-xs text-gray-400">Created</div>
          <div className="text-xs text-gray-500 leading-4">
            <div>{formatDate(order.createdAt)}</div>
            <div>{formatTime(order.createdAt)}</div>
          </div>
        </div>
      </div>

      <button
        onClick={onView}
        className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
      >
        View
      </button>
    </div>
  );
}

/* ====================== MODAL ====================== */

function OrderModal({ order, onClose }) {
  const items = Array.isArray(order.items) ? order.items : [];
  const addr = order.deliveryAddress || {};
  const khalti = order.khalti || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 text-white">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-xl font-bold">Order Details</h2>
            <p className="text-sm text-gray-400 mt-1 break-all">
              {order.orderId}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h3 className="font-semibold text-[#D4A056]">Customer</h3>
            <p className="mt-2 text-sm text-gray-300">
              <span className="text-gray-400">Name:</span>{" "}
              {addr.fullName || order.user?.name || "—"}
            </p>
            <p className="text-sm text-gray-300">
              <span className="text-gray-400">Email:</span>{" "}
              {addr.email || order.user?.email || "—"}
            </p>
            <p className="text-sm text-gray-300">
              <span className="text-gray-400">Phone:</span> {addr.phone || "—"}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h3 className="font-semibold text-[#D4A056]">Payment</h3>
            <p className="mt-2 text-sm text-gray-300">
              <span className="text-gray-400">Method:</span>{" "}
              {order.paymentMethod || "—"}
            </p>
            <p className="text-sm text-gray-300">
              <span className="text-gray-400">Status:</span>{" "}
              {order.paymentStatus || "—"}
            </p>
            {order.paymentMethod === "KHALTI" && (
              <>
                <p className="text-sm text-gray-300">
                  <span className="text-gray-400">PIDX:</span>{" "}
                  {khalti.pidx || "—"}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="text-gray-400">Txn:</span>{" "}
                  {khalti.transaction_id || "—"}
                </p>
              </>
            )}
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 md:col-span-2">
            <h3 className="font-semibold text-[#D4A056]">Delivery Address</h3>
            <p className="mt-2 text-sm text-gray-300">
              {addr.address || "—"}
              {addr.city ? `, ${addr.city}` : ""}
              {addr.province ? `, ${addr.province}` : ""}
              {addr.postalCode ? `, ${addr.postalCode}` : ""}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
          <h3 className="font-semibold text-[#D4A056]">Items</h3>

          <div className="mt-3 space-y-3">
            {items.map((it, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/30 p-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {it.imageUrl ? (
                    <img
                      src={
                        it.imageUrl.startsWith("http")
                          ? it.imageUrl
                          : `${import.meta.env.VITE_API_URL}${it.imageUrl}`
                      }
                      alt={it.name || "Item"}
                      className="h-12 w-12 rounded-lg object-cover bg-white/5 flex-none"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-white/5 flex-none" />
                  )}

                  <div className="min-w-0">
                    <div className="font-semibold text-white truncate">
                      {it.name || "—"}
                    </div>
                    <div className="text-xs text-gray-400">
                      Qty: {it.qty || 0} • Rs.{" "}
                      {Number(it.price || 0).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="font-bold text-[#D4A056] whitespace-nowrap">
                  Rs.{" "}
                  {Number((it.price || 0) * (it.qty || 0)).toLocaleString()}
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="text-sm text-gray-400">No items</div>
            )}
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <div className="text-gray-400">Subtotal</div>
              <div className="font-semibold text-white">
                Rs. {Number(order.subtotal || 0).toLocaleString()}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <div className="text-gray-400">Delivery Fee</div>
              <div className="font-semibold text-white">
                Rs. {Number(order.deliveryFee || 0).toLocaleString()}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <div className="text-gray-400">Total</div>
              <div className="font-semibold text-[#D4A056]">
                Rs. {Number(order.total || 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          Created: {formatDate(order.createdAt)} {formatTime(order.createdAt)} •
          Updated: {formatDate(order.updatedAt)} {formatTime(order.updatedAt)}
        </div>
      </div>
    </div>
  );
}

/* ====================== HELPERS ====================== */

function sumQty(o) {
  return Array.isArray(o?.items)
    ? o.items.reduce((a, i) => a + (i.qty || 0), 0)
    : 0;
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function formatTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
