// AdminProducts.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import AdminSidebar from "./AdminSidebar.jsx";
import { useAdmin } from "../context/AdminContext.jsx";
import ProductModal from "../components/Admin/ProductModal.jsx";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FiEdit2, FiTrash2 } from "react-icons/fi";

// robust date parser for "M/D/YYYY, h:mm:ss AM"
function parseMaybeLocaleDate(value) {
  if (!value) return 0;

  const native = new Date(value).getTime();
  if (Number.isFinite(native) && native > 0) return native;

  const str = String(value);
  const parts = str.split(",");
  if (parts.length < 2) return 0;

  const datePart = parts[0].trim();
  const timePart = parts.slice(1).join(",").trim();

  const [m, d, y] = datePart.split("/").map((x) => parseInt(x, 10));
  if (!m || !d || !y) return 0;

  const timeBits = timePart.split(" ");
  const hhmmss = (timeBits[0] || "").trim();
  const ampm = (timeBits[1] || "").trim().toUpperCase();

  const [hh0, mm0, ss0] = hhmmss.split(":").map((x) => parseInt(x, 10));
  if (!Number.isFinite(hh0) || !Number.isFinite(mm0)) return 0;

  let hh = hh0;
  const mm = mm0;
  const ss = Number.isFinite(ss0) ? ss0 : 0;

  if (ampm === "PM" && hh < 12) hh += 12;
  if (ampm === "AM" && hh === 12) hh = 0;

  const dt = new Date(y, m - 1, d, hh, mm, ss).getTime();
  return Number.isFinite(dt) ? dt : 0;
}

// fallback: ObjectId timestamp (Mongo)
function getMongoObjectIdTime(id) {
  if (!id || typeof id !== "string" || id.length < 8) return 0;
  const hexSeconds = id.substring(0, 8);
  const seconds = parseInt(hexSeconds, 16);
  return Number.isFinite(seconds) ? seconds * 1000 : 0;
}

function getProductTime(p) {
  const t1 = parseMaybeLocaleDate(p?.createdAt);
  const t2 = parseMaybeLocaleDate(p?.updatedAt);
  if (t1) return t1;
  if (t2) return t2;
  return getMongoObjectIdTime(p?._id ?? p?.id);
}

// SUPER SAFE image resolver (so UI doesn't break if backend changes shape)
function getImgSrc(p) {
  if (!p) return "";
  if (typeof p?.image === "string" && p.image) return p.image;
  if (p?.image?.url) return p.image.url;
  if (p?.image?.secure_url) return p.image.secure_url;
  if (typeof p?.imageUrl === "string" && p.imageUrl) return p.imageUrl;
  if (typeof p?.imageURL === "string" && p.imageURL) return p.imageURL;
  return "";
}

/* ------------------------ Skeleton UI helpers ------------------------ */
function SkeletonLine({ className = "" }) {
  return <div className={`animate-pulse rounded bg-white/10 ${className}`} aria-hidden="true" />;
}

function DesktopTableSkeleton({ rows = 8 }) {
  const items = Array.from({ length: rows });
  return (
    <div className="hidden md:block w-full max-w-full overflow-x-auto">
      {/* NOTE: removed min-w and table-fixed to avoid overflow */}
      <table className="w-full table-auto text-left text-sm">
        <thead className="bg-black/30 text-gray-300">
          <tr>
            <th className="px-2 py-2 font-medium">Product</th>
            <th className="px-2 py-2 font-medium">Category</th>
            <th className="px-2 py-2 font-medium">Brand</th>
            <th className="px-2 py-2 font-medium">Price</th>
            <th className="px-2 py-2 font-medium">Status</th>
            <th className="px-2 py-2 font-medium text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-white/10">
          {items.map((_, idx) => (
            <tr key={idx} className="hover:bg-white/5">
              <td className="px-2 py-2 align-middle">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-9 w-9 overflow-hidden rounded-lg border border-white/10 bg-black/40 shrink-0">
                    <div className="h-full w-full animate-pulse bg-white/10" />
                  </div>
                  <div className="min-w-0 w-full">
                    <SkeletonLine className="h-4 w-[70%]" />
                    <div className="h-[18px] mt-2">
                      <SkeletonLine className="h-3 w-16" />
                    </div>
                  </div>
                </div>
              </td>

              <td className="px-2 py-2 align-middle">
                <SkeletonLine className="h-4 w-[70%]" />
              </td>

              <td className="px-2 py-2 align-middle">
                <SkeletonLine className="h-4 w-[60%]" />
              </td>

              <td className="px-2 py-2 align-middle">
                <SkeletonLine className="h-4 w-24" />
              </td>

              <td className="px-2 py-2 align-middle">
                <SkeletonLine className="h-5 w-[92px] rounded-full" />
              </td>

              <td className="px-2 py-2 align-middle">
                <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                  <SkeletonLine className="h-9 w-[112px] rounded-xl" />
                  <SkeletonLine className="h-9 w-[112px] rounded-xl" />
                  <SkeletonLine className="h-10 w-10 rounded-xl" />
                  <SkeletonLine className="h-10 w-10 rounded-xl" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MobileCardsSkeleton({ rows = 6 }) {
  const items = Array.from({ length: rows });
  return (
    <div className="md:hidden divide-y divide-white/10">
      {items.map((_, idx) => (
        <div key={idx} className="p-4">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-lg border border-white/10 bg-black/40 shrink-0">
              <div className="h-full w-full animate-pulse bg-white/10" />
            </div>

            <div className="min-w-0 flex-1">
              <SkeletonLine className="h-4 w-[75%]" />
              <div className="h-[18px] mt-2">
                <SkeletonLine className="h-3 w-16" />
              </div>

              <div className="mt-2">
                <SkeletonLine className="h-3 w-[60%]" />
              </div>
              <div className="mt-2">
                <SkeletonLine className="h-3 w-[45%]" />
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <SkeletonLine className="h-4 w-24" />
                <SkeletonLine className="h-5 w-[92px] rounded-full" />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <SkeletonLine className="h-9 w-[112px] rounded-xl" />
                <SkeletonLine className="h-9 w-[112px] rounded-xl" />
                <SkeletonLine className="h-10 w-10 rounded-xl" />
                <SkeletonLine className="h-10 w-10 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="px-4 py-4 border-t border-white/10 bg-black/20">
        <div className="flex items-center justify-between gap-2">
          <SkeletonLine className="h-9 w-20 rounded-xl" />
          <SkeletonLine className="h-4 w-28" />
          <SkeletonLine className="h-9 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
/* -------------------------------------------------------------------- */

export default function AdminProducts() {
  const {
    products = [],
    pagination,
    loading,
    error,
    categories,
    subcategories,
    brands,
    fetchProducts,
    togglePublish,
    toggleFeatured,
    deleteProduct,
    fetchSubcategoriesByCategory,
    createProduct,
    updateProduct,
  } = useAdmin();

  // SERVER-SIDE filters
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editInitial, setEditInitial] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // pagination state (syncs with server)
  const [page, setPage] = useState(pagination?.page || 1);
  const [limit, setLimit] = useState(pagination?.limit || 10);

  // lock current order while toggling so table/cards don't reorder
  const [freezeIds, setFreezeIds] = useState(null);
  const filteredProductsRef = useRef([]);

  // delete confirmation modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const freezeNow = () => {
    const ids = filteredProductsRef.current.map((p) => String(p?._id ?? p?.id ?? ""));
    setFreezeIds(ids);
  };
  const unfreeze = () => setFreezeIds(null);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // keep local page/limit synced to response pagination
  useEffect(() => {
    if (pagination?.page) setPage(pagination.page);
    if (pagination?.limit) setLimit(pagination.limit);
  }, [pagination?.page, pagination?.limit]);

  // initial fetch (server)
  useEffect(() => {
    fetchProducts?.({ page: 1, limit: 10, clear: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // SERVER-SIDE search/apply filters
  const applyFilters = async () => {
    const res = await fetchProducts?.({
      page: 1,
      limit,
      name: search.trim(),
      category: categoryId,
      brand: brandId,
      clear: true,
    });

    if (!res?.ok) toast.error(res?.message || "Search failed ");
  };

  const clearFilters = async () => {
    setSearch("");
    setCategoryId("");
    setBrandId("");

    const res = await fetchProducts?.({ page: 1, limit, clear: true });
    if (res?.ok) toast.success("Cleared ");
  };

  // sorting ONLY (NO client filtering now)
  function computeSorted(prodList) {
    return [...(prodList || [])].sort((a, b) => {
      const aa = a?.isActive ? 1 : 0;
      const bb = b?.isActive ? 1 : 0;
      if (bb !== aa) return bb - aa;

      const ta = getProductTime(a);
      const tb = getProductTime(b);
      if (tb !== ta) return tb - ta;

      const ida = String(a?._id ?? a?.id ?? "");
      const idb = String(b?._id ?? b?.id ?? "");
      return idb.localeCompare(ida);
    });
  }

  const filteredProducts = useMemo(() => {
    const base = computeSorted(products);

    filteredProductsRef.current = base;

    if (!freezeIds || freezeIds.length === 0) return base;

    const byId = new Map(base.map((p) => [String(p?._id ?? p?.id ?? ""), p]));
    const inOrder = [];

    for (const id of freezeIds) {
      const item = byId.get(id);
      if (item) inOrder.push(item);
      byId.delete(id);
    }
    for (const item of byId.values()) inOrder.push(item);

    return inOrder;
  }, [products, freezeIds]);

  const openEdit = async (p) => {
    const pid = p._id ?? p.id;
    setEditingId(pid);

    const categoryId0 = p?.category?._id ?? p?.category?.id ?? p?.categoryId ?? p?.category ?? "";
    const subCategoryId =
      p?.subCategory?._id ?? p?.subCategory?.id ?? p?.subCategoryId ?? p?.subCategory ?? "";
    const brandId0 = p?.brand?._id ?? p?.brand?.id ?? p?.brandId ?? p?.brand ?? "";

    if (categoryId0) await fetchSubcategoriesByCategory(categoryId0);

    const existingImageUrl = getImgSrc(p);

    setEditInitial({
      name: p?.name ?? "",
      categoryId: categoryId0,
      subCategoryId,
      brandId: brandId0,
      abv: p?.abv ?? "",
      volumeMl: p?.volumeMl ?? "",
      description: p?.description ?? "",
      price: p?.price ?? "",
      isFeatured: !!p?.isFeatured,
      isActive: p?.isActive ?? true,
      imageUrl: existingImageUrl,
      image: p?.image,
    });

    setIsEditOpen(true);
  };

  const onTogglePublish = async (p) => {
    const pid = p._id ?? p.id;

    freezeNow();
    const res = await togglePublish(pid);

    if (res?.ok) {
      const nowActive = !!res?.product?.isActive;
      toast.success(nowActive ? "Published " : "Unpublished ");
    } else {
      toast.error(res?.message || "Publish update failed ");
    }

    setTimeout(unfreeze, 0);
  };

  const onToggleFeatured = async (p) => {
    const pid = p._id ?? p.id;

    if (typeof toggleFeatured !== "function") {
      toast.error("toggleFeatured is not implemented in AdminContext ");
      return;
    }

    freezeNow();
    const res = await toggleFeatured(pid);

    if (res?.ok) {
      const nowFeatured = !!res?.product?.isFeatured;
      toast.success(nowFeatured ? "Marked Featured " : "Removed Featured ");
    } else {
      toast.error(res?.message || "Featured update failed ");
    }

    setTimeout(unfreeze, 0);
  };

  // open delete modal instead of window.confirm
  const onDelete = async (p) => {
    if (typeof deleteProduct !== "function") {
      toast.error("deleteProduct is not implemented in AdminContext ");
      return;
    }
    setDeleteTarget(p);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    const p = deleteTarget;
    const pid = p?._id ?? p?.id;
    if (!pid) return;

    freezeNow();
    const res = await deleteProduct(pid);

    if (res?.ok) toast.success(res?.message || "Deleted ");
    else toast.error(res?.message || "Delete failed ");

    setIsDeleteOpen(false);
    setDeleteTarget(null);

    setTimeout(unfreeze, 0);
  };

  // Pagination handlers (SERVER-SIDE with same filters)
  const goToPage = async (nextPage) => {
    const res = await fetchProducts?.({
      page: nextPage,
      limit,
      name: search.trim(),
      category: categoryId,
      brand: brandId,
    });
    if (!res?.ok) toast.error(res?.message || "Failed to change page ");
  };

  const onChangeLimit = async (e) => {
    const newLimit = parseInt(e.target.value, 10) || 10;
    setLimit(newLimit);

    const res = await fetchProducts?.({
      page: 1,
      limit: newLimit,
      name: search.trim(),
      category: categoryId,
      brand: brandId,
      clear: true,
    });

    if (!res?.ok) toast.error(res?.message || "Failed to change limit ");
  };

  // FIXED WIDTH buttons so UI never jumps (responsive width)
  const actionBtnClass =
    "rounded-xl border border-white/10 bg-white/5 px-3 text-[12px] text-gray-200 " +
    "hover:bg-white/10 disabled:opacity-60 h-9 leading-none text-center w-24 lg:w-[112px]";

  const iconBtnClass =
    "grid place-items-center rounded-xl border border-white/10 bg-white/5 " +
    "text-gray-200 hover:bg-white/10 disabled:opacity-60 h-10 w-10";

  const deleteIconBtnClass =
    "grid place-items-center rounded-xl border border-red-400/20 bg-red-500/10 " +
    "text-red-200 hover:bg-red-500/20 disabled:opacity-60 h-10 w-10";

  const statusBadgeClass =
    "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[11px] border whitespace-nowrap w-[92px]";

  const featuredPillClass =
    "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-[10px] whitespace-nowrap";

  const featuredSlotClass = "h-[18px] mt-1";

  const twoLineClampStyle = {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  };

  const showSkeleton = loading;
  const skeletonRows = Math.min(Math.max(limit || 10, 6), 20);

  return (
    // NOTE: prevent any page-level horizontal overflow
    <div className="min-h-screen bg-black text-white p-6 overflow-x-hidden">
      <ToastContainer position="top-right" autoClose={2200} newestOnTop theme="dark" />

      <div className="mx-auto max-w-7xl flex flex-col gap-6 md:flex-row">
        <AdminSidebar />

        {/* NOTE: min-w-0 is KEY in flex layouts to prevent overflow */}
        <main className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Products</h1>
              <p className="mt-1 text-gray-400">
                Create, edit, publish/unpublish products. (Showing both active + inactive)
              </p>
            </div>

            <button
              onClick={() => {
                setEditInitial(null);
                setEditingId(null);
                fetchSubcategoriesByCategory("");
                setIsAddOpen(true);
              }}
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-gray-200"
            >
              + Add Product
            </button>
          </div>

          {/* SERVER-SIDE FILTER BAR */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1 min-w-0">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") applyFilters();
                }}
                placeholder="Search products by name..."
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="h-10 rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-gray-200 outline-none"
              disabled={loading}
            >
              <option value="">All Categories</option>
              {(categories || []).map((c) => (
                <option key={c?._id ?? c?.id} value={c?._id ?? c?.id}>
                  {c?.name}
                </option>
              ))}
            </select>

            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="h-10 rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-gray-200 outline-none"
              disabled={loading}
            >
              <option value="">All Brands</option>
              {(brands || []).map((b) => (
                <option key={b?._id ?? b?.id} value={b?._id ?? b?.id}>
                  {b?.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={applyFilters}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200 hover:bg-white/10 disabled:opacity-60"
              disabled={loading}
            >
              Search
            </button>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200 hover:bg-white/10 disabled:opacity-60"
              disabled={loading}
            >
              Clear
            </button>

            <button
              type="button"
              onClick={async () => {
                const res = await fetchProducts?.({
                  page: 1,
                  limit,
                  name: search.trim(),
                  category: categoryId,
                  brand: brandId,
                  clear: true,
                });
                if (res?.ok) toast.success("Refreshed ");
              }}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200 hover:bg-white/10 disabled:opacity-60"
              disabled={loading}
            >
              Refresh
            </button>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
            <div className="bg-black/30 px-4 py-3 text-sm text-gray-300">
              {showSkeleton ? "Loading..." : `${filteredProducts.length} products (active + inactive)`}
            </div>

            {/* Skeletons while fetching */}
            {showSkeleton ? (
              <>
                <DesktopTableSkeleton rows={skeletonRows} />
                <MobileCardsSkeleton rows={Math.max(6, Math.min(10, skeletonRows))} />
              </>
            ) : (
              <>
                {/* Desktop table (FIXED OVERFLOW) */}
                <div className="hidden md:block w-full max-w-full overflow-x-auto">
                  {/* NOTE: removed min-w-[1080px] and table-fixed */}
                  <table className="w-full table-auto text-left text-sm">
                    <thead className="bg-black/30 text-gray-300">
                      <tr>
                        <th className="px-2 py-2 font-medium">Product</th>
                        <th className="px-2 py-2 font-medium">Category</th>
                        <th className="px-2 py-2 font-medium">Brand</th>
                        <th className="px-2 py-2 font-medium">Price</th>
                        <th className="px-2 py-2 font-medium">Status</th>
                        <th className="px-2 py-2 font-medium text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/10">
                      {filteredProducts.map((p) => {
                        const pid = p._id ?? p.id;
                        const imgSrc = getImgSrc(p);

                        return (
                          <tr key={pid} className="hover:bg-white/5">
                            <td className="px-2 py-2 align-middle">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="h-9 w-9 overflow-hidden rounded-lg border border-white/10 bg-black/40 shrink-0">
                                  {imgSrc ? (
                                    <img
                                      src={imgSrc}
                                      alt={p?.name ?? "product"}
                                      className="h-full w-full object-cover"
                                      onError={(e) => (e.currentTarget.style.display = "none")}
                                    />
                                  ) : (
                                    <div className="h-full w-full grid place-items-center text-[10px] text-gray-500">
                                      No img
                                    </div>
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <div className="font-semibold text-white leading-snug" style={twoLineClampStyle}>
                                    {p.name}
                                  </div>

                                  <div className={featuredSlotClass}>
                                    {p.isFeatured ? (
                                      <span
                                        className={`${featuredPillClass} border-yellow-400/30 bg-yellow-400/10 text-yellow-200`}
                                      >
                                        Featured
                                      </span>
                                    ) : (
                                      <span className="inline-block opacity-0 select-none">Featured</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="px-2 py-2 align-middle text-gray-200 truncate whitespace-nowrap">
                              {p.category?.name ?? "-"}
                            </td>

                            <td className="px-2 py-2 align-middle text-gray-200 truncate whitespace-nowrap">
                              {p.brand?.name ?? "-"}
                            </td>

                            <td className="px-2 py-2 align-middle text-gray-200 whitespace-nowrap">
                              Rs.{Number(p.price ?? 0).toFixed(2)}
                            </td>

                            <td className="px-2 py-2 align-middle whitespace-nowrap">
                              <span
                                className={`${statusBadgeClass} ${
                                  p.isActive
                                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                                    : "border-red-400/30 bg-red-400/10 text-red-200"
                                }`}
                              >
                                {p.isActive ? "Published" : "Unpublished"}
                              </span>
                            </td>

                            <td className="px-2 py-2 align-middle">
                              <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                                <button
                                  onClick={() => onTogglePublish(p)}
                                  disabled={loading}
                                  className={actionBtnClass}
                                >
                                  {p.isActive ? "Unpublish" : "Publish"}
                                </button>

                                <button
                                  onClick={() => onToggleFeatured(p)}
                                  disabled={loading}
                                  className={actionBtnClass}
                                >
                                  {p.isFeatured ? "Unfeature" : "Feature"}
                                </button>

                                <button
                                  type="button"
                                  title="Edit"
                                  onClick={() => openEdit(p)}
                                  disabled={loading}
                                  className={iconBtnClass}
                                >
                                  <FiEdit2 size={20} />
                                </button>

                                <button
                                  type="button"
                                  title="Delete"
                                  onClick={() => onDelete(p)}
                                  disabled={loading}
                                  className={deleteIconBtnClass}
                                >
                                  <FiTrash2 size={20} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      {!loading && filteredProducts.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-2 py-8 text-center text-gray-400">
                            No products found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination footer */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 py-3 border-t border-white/10 bg-black/20">
                  <div className="text-xs text-gray-300">
                    Total: <span className="text-white">{pagination?.total ?? 0}</span> • Page{" "}
                    <span className="text-white">{pagination?.page ?? page}</span> /{" "}
                    <span className="text-white">{pagination?.totalPages ?? 1}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={limit}
                      onChange={onChangeLimit}
                      className="h-9 rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-gray-200 outline-none"
                      disabled={loading}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => goToPage((pagination?.page ?? page) - 1)}
                      disabled={loading || !pagination?.hasPrevPage}
                      className="h-9 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-gray-200 hover:bg-white/10 disabled:opacity-60"
                    >
                      Prev
                    </button>

                    <button
                      type="button"
                      onClick={() => goToPage((pagination?.page ?? page) + 1)}
                      disabled={loading || !pagination?.hasNextPage}
                      className="h-9 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-gray-200 hover:bg-white/10 disabled:opacity-60"
                    >
                      Next
                    </button>
                  </div>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden divide-y divide-white/10">
                  {filteredProducts.map((p) => {
                    const pid = p._id ?? p.id;
                    const imgSrc = getImgSrc(p);

                    return (
                      <div key={pid} className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="h-12 w-12 overflow-hidden rounded-lg border border-white/10 bg-black/40 shrink-0">
                            {imgSrc ? (
                              <img
                                src={imgSrc}
                                alt={p?.name ?? "product"}
                                className="h-full w-full object-cover"
                                onError={(e) => (e.currentTarget.style.display = "none")}
                              />
                            ) : (
                              <div className="h-full w-full grid place-items-center text-[10px] text-gray-500">
                                No img
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="min-w-0">
                              <div className="font-semibold text-white leading-snug" style={twoLineClampStyle}>
                                {p.name}
                              </div>

                              <div className={featuredSlotClass}>
                                {p.isFeatured ? (
                                  <span
                                    className={`${featuredPillClass} border-yellow-400/30 bg-yellow-400/10 text-yellow-200`}
                                  >
                                    Featured
                                  </span>
                                ) : (
                                  <span className="inline-block opacity-0 select-none">Featured</span>
                                )}
                              </div>
                            </div>

                            <div className="mt-2 text-xs text-gray-400 truncate">
                              Category: {p.category?.name ?? "-"}
                            </div>
                            <div className="text-xs text-gray-400 truncate">Brand: {p.brand?.name ?? "-"}</div>

                            <div className="mt-2 flex items-center justify-between gap-3">
                              <div className="text-sm text-gray-200 whitespace-nowrap">
                                Rs.{Number(p.price ?? 0).toFixed(2)}
                              </div>

                              <span
                                className={`${statusBadgeClass} ${
                                  p.isActive
                                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                                    : "border-red-400/30 bg-red-400/10 text-red-200"
                                }`}
                              >
                                {p.isActive ? "Published" : "Unpublished"}
                              </span>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <button onClick={() => onTogglePublish(p)} disabled={loading} className={actionBtnClass}>
                                {p.isActive ? "Unpublish" : "Publish"}
                              </button>

                              <button onClick={() => onToggleFeatured(p)} disabled={loading} className={actionBtnClass}>
                                {p.isFeatured ? "Unfeature" : "Feature"}
                              </button>

                              <button
                                type="button"
                                title="Edit"
                                onClick={() => openEdit(p)}
                                disabled={loading}
                                className={iconBtnClass}
                              >
                                <FiEdit2 size={20} />
                              </button>

                              <button
                                type="button"
                                title="Delete"
                                onClick={() => onDelete(p)}
                                disabled={loading}
                                className={deleteIconBtnClass}
                              >
                                <FiTrash2 size={20} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {!loading && filteredProducts.length === 0 && (
                    <div className="px-4 py-10 text-center text-gray-400">No products found.</div>
                  )}

                  <div className="px-4 py-4 border-t border-white/10 bg-black/20">
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => goToPage((pagination?.page ?? page) - 1)}
                        disabled={loading || !pagination?.hasPrevPage}
                        className="h-9 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-gray-200 hover:bg-white/10 disabled:opacity-60"
                      >
                        Prev
                      </button>

                      <div className="text-xs text-gray-300">
                        Page <span className="text-white">{pagination?.page ?? page}</span> /{" "}
                        <span className="text-white">{pagination?.totalPages ?? 1}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => goToPage((pagination?.page ?? page) + 1)}
                        disabled={loading || !pagination?.hasNextPage}
                        className="h-9 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-gray-200 hover:bg-white/10 disabled:opacity-60"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Delete confirm modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => {
              if (loading) return;
              setIsDeleteOpen(false);
              setDeleteTarget(null);
            }}
          />

          {/* modal */}
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0b0b0b] p-5 shadow-xl">
            <div className="text-lg font-semibold text-white">Delete product?</div>
            <p className="mt-2 text-sm text-gray-300">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-white">“{deleteTarget?.name ?? "this product"}”</span>? This action
              cannot be undone.
            </p>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setIsDeleteOpen(false);
                  setDeleteTarget(null);
                }}
                className="h-10 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-gray-200 hover:bg-white/10 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={confirmDelete}
                className="h-10 rounded-xl border border-red-400/20 bg-red-500/10 px-4 text-sm font-semibold text-red-100 hover:bg-red-500/20 disabled:opacity-60"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product */}
      <ProductModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Product"
        loading={loading}
        categories={categories}
        subcategories={subcategories}
        brands={brands}
        onCategoryChange={fetchSubcategoriesByCategory}
        onSubmit={async (payload) => {
          const res = await createProduct(payload);
          if (res?.ok) {
            await fetchProducts?.({ page: 1, limit, name: search.trim(), category: categoryId, brand: brandId });
            setIsAddOpen(false);
            toast.success("Product added ");
          } else {
            toast.error(res?.message || "Create failed ");
          }
        }}
      />

      {/* Edit Product */}
      <ProductModal
        open={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingId(null);
        }}
        title="Edit Product"
        loading={loading}
        initialValues={editInitial}
        categories={categories}
        subcategories={subcategories}
        brands={brands}
        onCategoryChange={fetchSubcategoriesByCategory}
        onSubmit={async (payload) => {
          const res = await updateProduct(editingId, payload);
          if (res?.ok) {
            await fetchProducts?.({
              page: pagination?.page ?? page,
              limit,
              name: search.trim(),
              category: categoryId,
              brand: brandId,
            });
            setIsEditOpen(false);
            setEditingId(null);
            toast.success("Product updated ");
          } else {
            toast.error(res?.message || "Update failed ");
          }
        }}
      />
    </div>
  );
}
