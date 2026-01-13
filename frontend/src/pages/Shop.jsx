import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAdmin } from "../context/AdminContext";

function getImgSrc(p) {
  if (!p) return "";
  if (typeof p?.image === "string" && p.image) return p.image;
  if (p?.image?.url) return p.image.url;
  if (p?.image?.secure_url) return p.image.secure_url;
  if (typeof p?.imageUrl === "string" && p.imageUrl) return p.imageUrl;
  if (typeof p?.imageURL === "string" && p.imageURL) return p.imageURL;
  return "";
}

function getCategoryId(p) {
  return (
    p?.category?._id ??
    p?.category?.id ??
    p?.categoryId ??
    (typeof p?.category === "string" ? p.category : "")
  );
}

function getCategoryName(p, categories) {
  const direct = p?.category?.name ?? p?.category?.title ?? p?.categoryName ?? "";
  if (direct) return direct;

  const cid = getCategoryId(p);
  const match = (categories || []).find(
    (c) => String(c?._id ?? c?.id) === String(cid)
  );

  return match?.name ?? match?.title ?? "Premium";
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
  items.push(total);

  return items;
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlCategory = searchParams.get("category") || "";
  const urlBrand = searchParams.get("brand") || "";
  const urlName = searchParams.get("name") || "";
  const urlPageRaw = searchParams.get("page") || "1";
  const urlPage = Math.max(1, parseInt(urlPageRaw, 10) || 1);

  const { addToCart } = useCart();

  const {
    shopProducts: products = [],
    shopPagination: pagination,
    fetchShopProducts,
    categories = [],
    brands = [],
    fetchCategories,
    fetchBrands,
    loading,
    SHOP_LIMIT = 8,
  } = useAdmin();

  const LIMIT = SHOP_LIMIT;

  const [searchInput, setSearchInput] = useState(urlName);
  const [categoryId, setCategoryId] = useState(urlCategory);
  const [brandId, setBrandId] = useState(urlBrand);

  useEffect(() => {
    fetchCategories?.();
    fetchBrands?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => setCategoryId(urlCategory), [urlCategory]);
  useEffect(() => setBrandId(urlBrand), [urlBrand]);
  useEffect(() => setSearchInput(urlName), [urlName]);

  const updateUrlParams = (nextCategoryId, nextBrandId, nextPage = 1, nextName = "") => {
    const nextParams = {};
    if (nextCategoryId) nextParams.category = nextCategoryId;
    if (nextBrandId) nextParams.brand = nextBrandId;
    if (nextName) nextParams.name = nextName;
    if (nextPage && nextPage !== 1) nextParams.page = String(nextPage);
    setSearchParams(nextParams, { replace: true });
  };

  useEffect(() => {
    fetchShopProducts?.({
      page: urlPage,
      category: urlCategory || undefined,
      brand: urlBrand || undefined,
      name: urlName || undefined,
      clear: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlPage, urlCategory, urlBrand, urlName]);

  const categoryOptions = useMemo(() => {
    return (categories || [])
      .map((c) => ({
        id: c?._id ?? c?.id ?? "",
        name: c?.name ?? c?.title ?? "Unnamed",
      }))
      .filter((c) => c.id);
  }, [categories]);

  const brandOptions = useMemo(() => {
    return (brands || [])
      .map((b) => ({
        id: b?._id ?? b?.id ?? "",
        name: b?.name ?? b?.title ?? "Unnamed",
      }))
      .filter((b) => b.id);
  }, [brands]);

  const currentPage = pagination?.page ?? urlPage;
  const totalPages = pagination?.totalPages ?? 1;

  const pageItems = useMemo(() => getPageItems(currentPage, totalPages, 1), [currentPage, totalPages]);

  const goToPage = (p) => {
    const next = Math.min(Math.max(1, p), totalPages);
    updateUrlParams(urlCategory, urlBrand, next, urlName);
  };

  const showLoadingEmpty = loading && products.length === 0;

  return (
    <div className="bg-white min-h-screen px-6 md:px-20 pt-32 pb-14" style={{ color: "#222222" }}>
      <div className="text-center space-y-4 mb-14 transition-all duration-700">
        <h1 className="text-5xl font-extrabold tracking-wide">
          Luxury <span className="text-[#D4A056]">Liquor</span> House
        </h1>
        <p style={{ color: "#222222" }}>World-class spirits delivered to your door.</p>
      </div>

      {/* SEARCH + BUTTON */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="flex items-center gap-3">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 py-4 px-6 rounded-full bg-white border border-gray-200 focus:ring-2 focus:ring-[#D4A056] outline-none"
            placeholder="Search premium bottles…"
            style={{ color: "#222222" }}
          />

          {(searchInput.trim() || urlCategory || urlBrand) && (
            <button
              onClick={() => updateUrlParams(urlCategory, urlBrand, 1, searchInput.trim())}
              className="shrink-0 py-4 px-6 rounded-full bg-gradient-to-r from-[#D4A056] to-[#f1d39f] text-black font-semibold text-sm transition active:scale-95 shadow-sm hover:shadow-md"
            >
              Search
            </button>
          )}
        </div>
      </div>

      {/* FILTERS */}
      <div className="max-w-5xl mx-auto mb-14 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs mb-2" style={{ color: "#222222" }}>
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => {
              const next = e.target.value;
              setCategoryId(next);
              updateUrlParams(next, brandId, 1, urlName);
            }}
            className="w-full rounded-full bg-white border border-gray-200 px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-[#D4A056]"
            style={{ color: "#222222" }}
          >
            <option value="">All Categories</option>
            {categoryOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs mb-2" style={{ color: "#222222" }}>
            Brand
          </label>
          <select
            value={brandId}
            onChange={(e) => {
              const next = e.target.value;
              setBrandId(next);
              updateUrlParams(categoryId, next, 1, urlName);
            }}
            className="w-full rounded-full bg-white border border-gray-200 px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-[#D4A056]"
            style={{ color: "#222222" }}
          >
            <option value="">All Brands</option>
            {brandOptions.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showLoadingEmpty ? (
        <p className="text-center mt-16" style={{ color: "#222222" }}>
          Loading products…
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {products.map((item) => {
              const pid = item?._id ?? item?.id;
              const img = getImgSrc(item);
              const categoryName = getCategoryName(item, categories);

              return (
                <div
                  key={pid}
                  className="relative rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-sm group transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <Link to={`/product/${pid}`}>
                    <div className="absolute top-4 left-4 bg-white text-[#B8852E] px-3 py-1 rounded-full text-xs border border-[#D4A056]">
                      {categoryName}
                    </div>

                    <div className="absolute top-4 right-4 bg-white text-[#B8852E] px-3 py-1 rounded-full text-sm border border-gray-200">
                      Rs. {Number(item?.price ?? 0).toLocaleString()}
                    </div>

                    <div className="h-[220px] flex items-center justify-center bg-white">
                      {img ? (
                        <img src={img} alt={item?.name ?? "product"} className="object-contain h-full" loading="lazy" />
                      ) : (
                        <div className="h-full w-full grid place-items-center" style={{ color: "#222222" }}>
                          No image
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4 text-center">
                    <h3 className="text-lg font-semibold break-words" style={{ color: "#222222" }}>
                      {item?.name}
                    </h3>

                    <button
                      onClick={() =>
                        addToCart({
                          ...item,
                          id: pid,
                          image: img || item?.image,
                        })
                      }
                      className="mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-[#D4A056] to-[#f1d39f] text-black font-semibold text-sm transition active:scale-95 shadow-sm hover:shadow-md"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {!loading && products.length === 0 && (
            <p className="text-center mt-16" style={{ color: "#222222" }}>
              No premium products found.
            </p>
          )}

          {/* PAGINATION */}
          <div className="mt-14 flex flex-col items-center gap-3">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <button
                disabled={!pagination?.hasPrevPage || currentPage <= 1}
                onClick={() => goToPage(currentPage - 1)}
                className={`px-4 py-2 rounded-xl border border-gray-200 bg-white transition ${
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
                    onClick={() => goToPage(pnum)}
                    className={`w-10 h-10 rounded-xl border transition ${
                      active
                        ? "border-[#D4A056] bg-white text-[#B8852E] font-bold"
                        : "border-gray-200 bg-white hover:border-[#D4A056]"
                    }`}
                    style={{ color: active ? undefined : "#222222" }}
                  >
                    {pnum}
                  </button>
                );
              })}

              <button
                disabled={!pagination?.hasNextPage}
                onClick={() => goToPage(currentPage + 1)}
                className={`px-4 py-2 rounded-xl border border-gray-200 bg-white transition ${
                  !pagination?.hasNextPage ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "hover:border-[#D4A056]"
                }`}
                style={{ color: "#222222" }}
              >
                Next
              </button>
            </div>

            <p className="text-center text-xs" style={{ color: "#222222" }}>
              Page <span className="font-semibold">{currentPage}</span> of{" "}
              <span className="font-semibold">{totalPages}</span> • Total{" "}
              <span className="font-semibold">{pagination?.total ?? 0}</span> products • Limit{" "}
              <span className="font-semibold">{pagination?.limit ?? LIMIT}</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
