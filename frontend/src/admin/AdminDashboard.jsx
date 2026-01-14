import { useEffect, useMemo, useRef, useState } from "react";
import AdminSidebar from "./AdminSidebar.jsx";
import api from "../services/api.js";

function StatCard({ label, value, sub }) {
  return (
    // ✅ min-w-0 allows children to shrink; prevents overflow
    <div className="min-w-0 rounded-2xl border border-white/10 bg-black/30 p-5">
      <p className="text-xs uppercase tracking-wider text-gray-400">{label}</p>

      {/* ✅ truncate prevents long text (Top Product) from pushing layout */}
      <p className="mt-2 text-2xl font-semibold text-white truncate">{value}</p>

      {sub ? (
        <p className="mt-1 text-xs text-gray-400 truncate">{sub}</p>
      ) : null}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5 animate-pulse">
      <div className="h-3 w-28 rounded bg-white/10" />
      <div className="mt-3 h-7 w-20 rounded bg-white/10" />
      <div className="mt-3 h-3 w-40 rounded bg-white/10" />
    </div>
  );
}

function formatMoney(n) {
  const v = Number(n || 0);
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(v);
}

function formatDateYYYYMMDD(d) {
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function toRangeISO(startDateStr, endDateStr) {
  const start = new Date(`${startDateStr}T00:00:00.000Z`);
  const endExclusive = new Date(`${endDateStr}T00:00:00.000Z`);
  endExclusive.setUTCDate(endExclusive.getUTCDate() + 1);
  return { start: start.toISOString(), end: endExclusive.toISOString() };
}

function CalendarIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M8 3v3M16 3v3M4.5 9.5h15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M6.5 5.5h11A2.5 2.5 0 0 1 20 8v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 19V8a2.5 2.5 0 0 1 2.5-2.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export default function AdminDashboard() {
  const [startDate, setStartDate] = useState(""); // "YYYY-MM-DD"
  const [endDate, setEndDate] = useState(""); // "YYYY-MM-DD"

  const startRef = useRef(null);
  const endRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const todayStr = useMemo(() => formatDateYYYYMMDD(new Date()), []);

  const clampToToday = (dateStr) => {
    if (!dateStr) return "";
    return dateStr > todayStr ? todayStr : dateStr;
  };

  const fetchDashboard = async ({ s = startDate, e = endDate } = {}) => {
    if (!s || !e) {
      setError("Please select both Start and End dates.");
      return;
    }

    s = clampToToday(s);
    e = clampToToday(e);

    setLoading(true);
    setError("");

    try {
      const { start, end } = toRangeISO(s, e);
      const qs = new URLSearchParams({ start, end });

      const res = await api.get(`/admin/admin-dashboard-data?${qs.toString()}`);
      setData(res?.data ?? null);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to fetch dashboard data";
      setError(msg);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ init: yesterday → today AND auto fetch once
  useEffect(() => {
    const today = new Date();
    const end = formatDateYYYYMMDD(today);

    const startDt = new Date();
    startDt.setDate(startDt.getDate() - 1);
    const start = formatDateYYYYMMDD(startDt);

    const s = clampToToday(start);
    const e = clampToToday(end);

    setStartDate(s);
    setEndDate(e);

    fetchDashboard({ s, e });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const productStats = useMemo(() => {
    const list = data?.productStats || [];
    return [...list].sort((a, b) => Number(b?.totalRevenue || 0) - Number(a?.totalRevenue || 0));
  }, [data]);

  const totalOrders = Number(data?.totalOrders ?? data?.totalOrder ?? 0);

  const totalRevenue = useMemo(() => {
    return productStats.reduce((sum, x) => sum + Number(x?.totalRevenue || 0), 0);
  }, [productStats]);

  const totalQty = useMemo(() => {
    return productStats.reduce((sum, x) => sum + Number(x?.totalQty || 0), 0);
  }, [productStats]);

  const topProduct = productStats?.[0];

  const setPreset = (days) => {
    const today = new Date();
    const end = formatDateYYYYMMDD(today);

    const startDt = new Date();
    startDt.setDate(startDt.getDate() - (days - 1));
    const start = formatDateYYYYMMDD(startDt);

    setStartDate(clampToToday(start));
    setEndDate(clampToToday(end));
  };

  const openPicker = (ref) => {
    const el = ref?.current;
    if (!el) return;
    if (typeof el.showPicker === "function") el.showPicker();
    else {
      el.focus();
      el.click();
    }
  };

  const canSearch = !!startDate && !!endDate && !loading;

  return (
    // ✅ overflow-x-hidden removes white space caused by horizontal overflow
    // ✅ pl-[2px] makes sidebar start 2px from left edge
    <div className="min-h-screen bg-black text-white overflow-x-hidden pt-3 pr-3 pb-3 pl-[2px]">
      {/* keep centered content if you want max width; remove mx-auto if you want full width */}
      <div className="mx-auto max-w-7xl flex flex-col gap-4 md:flex-row">
        <AdminSidebar />

        <main className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-6 min-w-0">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Overview</h2>
            </div>

            {/* Filters */}
            {/* ✅ flex-wrap prevents overflow on small screens */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-end">
              {/* Date Fields */}
              <div className="flex flex-wrap items-end gap-3">
                <div className="w-full sm:w-[190px]">
                  <label className="block text-[11px] text-gray-400 mb-1">Start Date</label>
                  <div className="relative">
                    <input
                      ref={startRef}
                      type="date"
                      value={startDate}
                      max={todayStr}
                      onChange={(e) => setStartDate(clampToToday(e.target.value))}
                      className="h-9 w-full rounded-xl border border-white/10 bg-black/40 pl-3 pr-10 text-sm outline-none focus:border-white/30"
                    />
                    <button
                      type="button"
                      title="Open start date"
                      onClick={() => openPicker(startRef)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-lg text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                      <CalendarIcon />
                    </button>
                  </div>
                </div>

                <div className="w-full sm:w-[190px]">
                  <label className="block text-[11px] text-gray-400 mb-1">End Date</label>
                  <div className="relative">
                    <input
                      ref={endRef}
                      type="date"
                      value={endDate}
                      max={todayStr}
                      onChange={(e) => setEndDate(clampToToday(e.target.value))}
                      className="h-9 w-full rounded-xl border border-white/10 bg-black/40 pl-3 pr-10 text-sm outline-none focus:border-white/30"
                    />
                    <button
                      type="button"
                      title="Open end date"
                      onClick={() => openPicker(endRef)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-lg text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                      <CalendarIcon />
                    </button>
                  </div>
                </div>

                {/* Search Button */}
                <button
                  disabled={!canSearch}
                  onClick={() => fetchDashboard({ s: startDate, e: endDate })}
                  className="h-9 rounded-xl border border-white/10 bg-white/10 px-4 text-sm hover:bg-white/15 disabled:opacity-50"
                >
                  Search
                </button>
              </div>

              {/* Presets + Refresh */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setPreset(2)}
                  className="h-9 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-gray-200 hover:bg-white/10"
                >
                  Last 2 days
                </button>
                <button
                  onClick={() => setPreset(7)}
                  className="h-9 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-gray-200 hover:bg-white/10"
                >
                  Last 7
                </button>

                <button
                  disabled={!canSearch}
                  onClick={() => fetchDashboard({ s: startDate, e: endDate })}
                  className="h-9 rounded-xl border border-white/10 bg-white/10 px-4 text-sm hover:bg-white/15 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Refresh"}
                </button>
              </div>
            </div>
          </div>

          {/* Error */}
          {error ? (
            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          {/* Stat cards */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              <>
                <StatCard label="Total Orders" value={totalOrders || "0"} sub="Orders in range" />
                <StatCard
                  label="Total Revenue"
                  value={`Rs. ${formatMoney(totalRevenue)}`}
                  sub="Sum of top products revenue"
                />
                <StatCard label="Total Items Sold" value={formatMoney(totalQty)} sub="Sum of quantities" />
                <StatCard
                  label="Top Product"
                  value={topProduct?.name ? topProduct.name : "—"}
                  sub={
                    topProduct
                      ? `Rs. ${formatMoney(topProduct.totalRevenue)} • Qty ${formatMoney(
                          topProduct.totalQty
                        )}`
                      : "No data"
                  }
                />
              </>
            )}
          </div>

          {/* Table */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
            <div className="flex items-center justify-between gap-3 bg-black/20 px-4 py-3">
              <div className="text-sm text-gray-300">
                Top Products{" "}
                <span className="text-gray-500">
                  ({startDate || "—"} → {endDate || "—"})
                </span>
              </div>
              <div className="text-xs text-gray-400">{loading ? "Loading..." : `Rows: ${productStats.length}`}</div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-gray-300">
                  <tr>
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">Qty</th>
                    <th className="px-4 py-3 font-medium text-right">Revenue</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {loading ? (
                    [...Array(6)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-4 py-3">
                          <div className="h-4 w-56 rounded bg-white/10" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 w-14 rounded bg-white/10" />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="ml-auto h-4 w-24 rounded bg-white/10" />
                        </td>
                      </tr>
                    ))
                  ) : productStats.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-10 text-center text-gray-400">
                        No data for this range.
                      </td>
                    </tr>
                  ) : (
                    productStats.map((p) => (
                      <tr key={p?._id || p?.id || p?.name} className="hover:bg-white/5">
                        <td className="px-4 py-3">
                          {/* ✅ prevent long names from causing overflow */}
                          <div className="font-medium text-white truncate max-w-[520px]">
                            {p?.name || "—"}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-200">{formatMoney(p?.totalQty)}</td>
                        <td className="px-4 py-3 text-right text-gray-200">Rs. {formatMoney(p?.totalRevenue)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
