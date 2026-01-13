// SingleProduct.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  GlassWater,
  Droplets,
  Star,
  Layers,
} from "lucide-react";
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

function getCategoryName(p, categories) {
  const direct =
    p?.category?.name ?? p?.category?.title ?? p?.categoryName ?? "";
  if (direct) return direct;

  const cid =
    p?.category?._id ??
    p?.category?.id ??
    p?.categoryId ??
    (typeof p?.category === "string" ? p.category : "");

  const match = (categories || []).find(
    (c) => String(c?._id ?? c?.id) === String(cid)
  );

  return match?.name ?? match?.title ?? "";
}

function getSubCategoryName(p) {
  return (
    p?.subCategory?.name ??
    p?.subCategory?.title ??
    p?.subCategoryName ??
    ""
  );
}

function getBrandName(p) {
  return (
    p?.brand?.name ??
    p?.brand?.title ??
    p?.brandName ??
    (typeof p?.brand === "string" ? p.brand : "") ??
    ""
  );
}

export default function SingleProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { categories = [], fetchCategories, fetchProductById } = useAdmin();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories?.();

    (async () => {
      setLoading(true);
      const res = await fetchProductById?.(id);
      setProduct(res?.product ?? null);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const img = useMemo(() => getImgSrc(product), [product]);
  const categoryName = useMemo(
    () => getCategoryName(product, categories),
    [product, categories]
  );
  const subCategoryName = useMemo(() => getSubCategoryName(product), [product]);
  const brandName = useMemo(() => getBrandName(product), [product]);

  const description =
    product?.description ||
    product?.details ||
    product?.desc ||
    "No description available.";

  const abv =
    product?.abv ??
    product?.alcoholPercentage ??
    product?.alcohol ??
    null;

  const volumeMl = product?.volumeMl ?? product?.volume ?? product?.ml ?? null;

  const isActive = product?.isActive !== false;

  if (!loading && !product) {
    return (
      <div
        className="min-h-screen bg-white px-6 md:px-20 py-24"
        style={{ color: "#222222" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-3xl font-bold">Product Not Found 😢</div>
          <button
            onClick={() => navigate(-1)}
            className="mt-8 rounded-full bg-white px-6 py-3 transition border border-gray-200 hover:border-[#D4A056]"
            style={{ color: "#222222" }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white mt-20" style={{ color: "#222222" }}>
      {/* solid background only */}
      <div className="fixed inset-0 -z-10 bg-white" />

      <div className="px-4 sm:px-6 md:px-10 lg:px-16 py-6">
        {/* top actions */}
        <div className="max-w-6xl mx-auto mb-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-4 py-2 text-sm hover:border-[#D4A056] transition"
            style={{ color: "#222222" }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex items-center gap-2">
            {!isActive ? (
              <span className="rounded-full px-3 py-1.5 text-xs border border-red-400 bg-white text-red-700">
                Unavailable
              </span>
            ) : null}

            {product?.isFeatured ? (
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs border border-[#D4A056] bg-white text-[#B8852E]">
                <Star className="h-3.5 w-3.5" />
                Featured
              </span>
            ) : null}
          </div>
        </div>

        {/* ✅ key change: items-start so left doesn't stretch */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 items-start">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32 }}
            // ✅ removed h-full so it won't grow too tall
            className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            {/* ✅ Responsive, fits screen, shows full image smaller */}
            <div
              className="
                relative w-full rounded-2xl bg-white border border-gray-200 overflow-hidden
                flex items-center justify-center
                h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px]
              "
            >
              {categoryName ? (
                <div className="absolute top-3 left-3 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#B8852E] border border-[#D4A056]">
                  {categoryName}
                </div>
              ) : null}

              {brandName ? (
                <div className="absolute top-3 right-3 rounded-full bg-white px-3 py-1 text-[11px] font-semibold border border-gray-200">
                  {brandName}
                </div>
              ) : null}

              {img ? (
                <img
                  src={img}
                  alt={product?.name ?? "product"}
                  // ✅ show full image (no crop) but smaller + responsive
                  className="max-h-full max-w-full object-contain p-4"
                  loading="lazy"
                />
              ) : (
                <div style={{ color: "#222222" }}>No image</div>
              )}
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32 }}
            className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-[#B8852E]">
              {loading ? "Loading..." : product?.name}
            </h1>

            <div className="mt-2 text-sm">
              {categoryName ? (
                <span>
                  <span style={{ color: "#222222" }}>Category:</span>{" "}
                  <span className="font-semibold" style={{ color: "#222222" }}>
                    {categoryName}
                  </span>
                </span>
              ) : null}

              {brandName ? (
                <span className="ml-3">
                  <span style={{ color: "#222222" }}>•</span>{" "}
                  <span style={{ color: "#222222" }}>Brand:</span>{" "}
                  <span className="font-semibold" style={{ color: "#222222" }}>
                    {brandName}
                  </span>
                </span>
              ) : null}
            </div>

            {/* specs */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white border border-gray-200 p-3 flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#D4A056]" />
                <div className="min-w-0">
                  <div className="text-[11px]" style={{ color: "#222222" }}>
                    Sub
                  </div>
                  <div
                    className="mt-0.5 text-sm truncate"
                    style={{ color: "#222222" }}
                  >
                    {subCategoryName || "—"}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-gray-200 p-3 flex items-center gap-2">
                <GlassWater className="h-4 w-4 text-[#D4A056]" />
                <div className="min-w-0">
                  <div className="text-[11px]" style={{ color: "#222222" }}>
                    Volume
                  </div>
                  <div
                    className="mt-0.5 text-sm truncate"
                    style={{ color: "#222222" }}
                  >
                    {volumeMl != null ? `${volumeMl} ml` : "—"}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-gray-200 p-3 flex items-center gap-2">
                <Droplets className="h-4 w-4 text-[#D4A056]" />
                <div className="min-w-0">
                  <div className="text-[11px]" style={{ color: "#222222" }}>
                    ABV
                  </div>
                  <div
                    className="mt-0.5 text-sm truncate"
                    style={{ color: "#222222" }}
                  >
                    {abv != null ? `${abv}%` : "—"}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 leading-relaxed" style={{ color: "#222222" }}>
              <p className="line-clamp-4 sm:line-clamp-5">{description}</p>
            </div>

            <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-4">
              <div className="text-[11px]" style={{ color: "#222222" }}>
                Price
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#B8852E]">
                Rs. {Number(product?.price ?? 0).toLocaleString()}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: isActive && !loading && product ? 1.02 : 1 }}
              whileTap={{ scale: isActive && !loading && product ? 0.98 : 1 }}
              disabled={!isActive || loading || !product}
              onClick={() =>
                addToCart({
                  ...product,
                  id: product?._id ?? product?.id,
                  image: img || product?.image,
                })
              }
              className={`mt-10 w-full inline-flex items-center justify-center gap-2
                rounded-full bg-gradient-to-r from-[#D4A056] to-[#f1d39f]
                text-black font-semibold py-3 transition hover:shadow-md
                ${
                  !isActive || loading || !product
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : ""
                }`}
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
