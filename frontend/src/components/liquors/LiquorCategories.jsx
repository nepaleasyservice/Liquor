// LiquorCategories.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import { useCart } from "../../context/CartContext";

function getImgSrc(p) {
  if (!p) return "";
  if (typeof p?.image === "string" && p.image) return p.image;
  if (p?.image?.url) return p.image.url;
  if (p?.image?.secure_url) return p.image.secure_url;
  if (typeof p?.imageUrl === "string" && p.imageUrl) return p.imageUrl;
  if (typeof p?.imageURL === "string" && p.imageURL) return p.imageURL;
  return "";
}

function getCategoryNameFromProduct(p, categories) {
  const cid =
    p?.category?._id ??
    p?.category?.id ??
    p?.categoryId ??
    (typeof p?.category === "string" ? p.category : "");

  const directName = p?.category?.name ?? p?.category?.title;
  if (directName) return directName;

  const match = (categories || []).find(
    (c) => String(c?._id ?? c?.id) === String(cid)
  );

  return match?.name ?? match?.title ?? "";
}

function getPageItems(current, total, siblings = 1) {
  if (total <= 1) return [1];

  const items = [];
  const left = Math.max(2, current - siblings);
  const right = Math.min(total - 1, current + siblings);

  items.push(1);
  if (left > 2) items.push("...");
  for (let p = left; p <= right; p++) items.push(p);
  if (right < total - 1) items.push("...");
  if (total > 1) items.push(total);

  return items;
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="h-40 rounded-xl bg-gray-200 animate-pulse" />
      <div className="mt-5 space-y-3">
        <div className="h-4 w-3/4 mx-auto bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-1/2 mx-auto bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-full bg-gray-200 rounded-full animate-pulse" />
      </div>
    </div>
  );
}

export default function LiquorCategories() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const {
    shopProducts: products = [],
    shopPagination: pagination,
    fetchShopProducts,
    loading,
    categories,
    fetchCategories,
  } = useAdmin();

  const LIMIT = 8;

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCategories?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchShopProducts?.({
      page,
      category: selectedCategoryId || undefined,
      clear: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedCategoryId]);

  const categoryOptions = useMemo(() => {
    return (categories || [])
      .map((c) => ({
        id: c?._id ?? c?.id ?? "",
        name: c?.name ?? c?.title ?? "Unnamed",
      }))
      .filter((c) => c.id);
  }, [categories]);

  const selectedCategoryName = useMemo(() => {
    if (!selectedCategoryId) return "";
    return (
      categoryOptions.find((c) => String(c.id) === String(selectedCategoryId))
        ?.name ?? ""
    );
  }, [categoryOptions, selectedCategoryId]);

  const currentPage = pagination?.page ?? page;
  const totalPages = pagination?.totalPages ?? 1;

  const pageItems = useMemo(() => getPageItems(currentPage, totalPages, 1), [
    currentPage,
    totalPages,
  ]);

  const showSkeleton = loading && products.length === 0;

  const refresh = async () => {
    await fetchShopProducts?.({
      page: currentPage,
      category: selectedCategoryId || undefined,
      clear: true,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 mb-16 bg-white" style={{ color: "#222222" }}>
      {/* Header row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
        <div>
          <h2 className="text-4xl font-extrabold tracking-wide text-[#D4A056]">
            Browse Products
          </h2>
          <p className="mt-2" style={{ color: "#222222" }}>
            Filter by category and explore the catalog.
          </p>

          {selectedCategoryName ? (
            <p className="mt-2 text-sm" style={{ color: "#222222" }}>
              Category:{" "}
              <span className="font-semibold text-[#D4A056]">
                {selectedCategoryName}
              </span>
            </p>
          ) : null}
        </div>

        <div className="w-full sm:w-[280px]">
          <label className="block text-xs mb-2" style={{ color: "#222222" }}>
            Filter by Category
          </label>

          <select
            value={selectedCategoryId}
            onChange={(e) => {
              const id = e.target.value;
              setSelectedCategoryId(id);
              setPage(1);

              if (!id) navigate("/products");
              else navigate(`/products?category=${id}`);
            }}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#D4A056]"
            style={{ color: "#222222" }}
          >
            <option value="">All Categories</option>
            {categoryOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={refresh}
            className={`mt-3 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm transition hover:border-[#D4A056] ${
              loading ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""
            }`}
            style={{ color: "#222222" }}
            disabled={loading}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Grid */}
      {showSkeleton ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16" style={{ color: "#222222" }}>
          No products found.
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((p) => {
              const pid = p?._id ?? p?.id;
              const img = getImgSrc(p);
              const categoryName = getCategoryNameFromProduct(p, categories);

              return (
                <div
                  key={pid}
                  onClick={() => navigate(`/product/${pid}`)}
                  className="cursor-pointer rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 p-6"
                >
                  <div className="relative w-full h-40 rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                    {categoryName ? (
                      <div className="absolute top-3 left-3 z-10 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#D4A056] border border-[#D4A056]">
                        {categoryName}
                      </div>
                    ) : null}

                    {img ? (
                      <img
                        src={img}
                        alt={p?.name ?? "product"}
                        className="max-h-full w-full object-contain"
                        loading="lazy"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    ) : (
                      <div className="text-sm" style={{ color: "#222222" }}>
                        No image
                      </div>
                    )}
                  </div>

                  <div className="mt-5">
                    <h3 className="text-center text-base font-semibold break-words" style={{ color: "#222222" }}>
                      {p?.name}
                    </h3>

                    <div className="mt-3 text-center text-[#D4A056] font-semibold">
                      Rs. {Number(p?.price ?? 0).toFixed(0)}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({ ...p, id: pid, image: img || p?.image });
                      }}
                      className="mt-4 w-full rounded-full bg-gradient-to-r from-[#D4A056] to-[#f1d39f] text-black font-semibold py-2 hover:shadow-md transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
            <button
              disabled={!pagination?.hasPrevPage || currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={`px-4 py-2 rounded-xl border border-gray-300 bg-white transition ${
                !pagination?.hasPrevPage || currentPage <= 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "hover:border-[#D4A056]"
              }`}
              style={{ color: "#222222" }}
            >
              Prev
            </button>

            {pageItems.map((it, idx) => {
              if (it === "...") {
                return (
                  <span key={`dots-${idx}`} className="px-2" style={{ color: "#222222" }}>
                    ...
                  </span>
                );
              }

              const pnum = it;
              const active = currentPage === pnum;

              return (
                <button
                  key={pnum}
                  onClick={() => setPage(pnum)}
                  className={`w-10 h-10 rounded-xl border transition ${
                    active
                      ? "border-[#D4A056] bg-white text-[#B8852E] font-bold"
                      : "border-gray-300 bg-white hover:border-[#D4A056]"
                  }`}
                  style={{ color: active ? undefined : "#222222" }}
                >
                  {pnum}
                </button>
              );
            })}

            <button
              disabled={!pagination?.hasNextPage}
              onClick={() => setPage((p) => p + 1)}
              className={`px-4 py-2 rounded-xl border border-gray-300 bg-white transition ${
                !pagination?.hasNextPage
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "hover:border-[#D4A056]"
              }`}
              style={{ color: "#222222" }}
            >
              Next
            </button>
          </div>

          <p className="mt-4 text-center text-xs" style={{ color: "#222222" }}>
            Page {currentPage} of {totalPages} • Total{" "}
            {pagination?.total ?? products.length} products
          </p>
        </>
      )}
    </div>
  );
}
