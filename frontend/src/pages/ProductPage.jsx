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

// ✅ safe image resolver (supports Cloudinary: image.url)
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
  const direct = p?.category?.name ?? p?.category?.title ?? p?.categoryName ?? "";
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

  // ✅ use the single-product API instead of fetching all products
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
    product?.abv ?? product?.alcoholPercentage ?? product?.alcohol ?? null;
  const volumeMl = product?.volumeMl ?? product?.volume ?? product?.ml ?? null;

  const isActive = product?.isActive !== false;

  if (!loading && !product) {
    return (
      <div className="min-h-screen bg-[#080808] text-white px-6 md:px-20 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-3xl font-bold">Product Not Found 😢</div>
          <button
            onClick={() => navigate(-1)}
            className="mt-8 rounded-full bg-white/10 px-6 py-3 hover:bg-white/15 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-[#080808] text-white mt-20">
      {/* background glow */}
      <div className="fixed inset-0 -z-10 bg-[#080808]" />
      <div className="fixed inset-0 -z-10 opacity-60 bg-[radial-gradient(ellipse_at_top,_rgba(212,160,86,0.18),_transparent_55%)]" />

      <div className="px-4 sm:px-6 md:px-10 lg:px-16 py-6">
        {/* top actions */}
        <div className="max-w-6xl mx-auto mb-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="
              inline-flex items-center gap-2 rounded-full
              bg-white/5 border border-white/10
              px-4 py-2 text-sm
              hover:bg-white/10 hover:border-white/15
              transition
            "
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex items-center gap-2">
            {!isActive ? (
              <span className="rounded-full px-3 py-1.5 text-xs border border-red-500/30 bg-red-500/10 text-red-200">
                Unavailable
              </span>
            ) : null}

            {product?.isFeatured ? (
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs border border-[#D4A056]/30 bg-[#D4A056]/10 text-[#D4A056]">
                <Star className="h-3.5 w-3.5" />
                Featured
              </span>
            ) : null}
          </div>
        </div>

        {/* ✅ items-stretch + both cards h-full makes equal height on md+ */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 items-stretch">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32 }}
            className="
              h-full
              rounded-3xl border border-white/10
              bg-gradient-to-b from-white/[0.05] to-white/[0.02]
              p-4 shadow-[0_12px_50px_rgba(0,0,0,0.55)]
            "
          >
            {/* ✅ Fill height of left card so it matches right card */}
            <div
              className="
                relative w-full h-full min-h-[260px] md:min-h-0
                rounded-2xl
                bg-gradient-to-b from-black/35 to-black/20
                border border-white/10
                overflow-hidden
                flex items-center justify-center
              "
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(212,160,86,0.18),_transparent_45%)]" />

              {categoryName ? (
                <div className="absolute top-3 left-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold text-[#D4A056] border border-[#D4A056]/40 backdrop-blur">
                  {categoryName}
                </div>
              ) : null}

              {brandName ? (
                <div className="absolute top-3 right-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold text-gray-100 border border-white/10 backdrop-blur">
                  {brandName}
                </div>
              ) : null}

              {img ? (
                <img
                  src={img}
                  alt={product?.name ?? "product"}
                  className="w-full h-full object-contain p-4 drop-shadow-[0_25px_50px_rgba(0,0,0,0.55)]"
                  loading="lazy"
                />
              ) : (
                <div className="text-gray-500">No image</div>
              )}
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32 }}
            className="
              h-full
              rounded-3xl border border-white/10
              bg-gradient-to-b from-white/[0.05] to-white/[0.02]
              p-5 shadow-[0_12px_50px_rgba(0,0,0,0.55)]
            "
          >
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-[#D4A056]">
              {loading ? "Loading..." : product?.name}
            </h1>

            <div className="mt-2 text-sm text-gray-300">
              {categoryName ? (
                <span>
                  <span className="text-gray-400">Category:</span>{" "}
                  <span className="text-white font-semibold">
                    {categoryName}
                  </span>
                </span>
              ) : null}

              {brandName ? (
                <span className="ml-3">
                  <span className="text-gray-500">•</span>{" "}
                  <span className="text-gray-400">Brand:</span>{" "}
                  <span className="text-white font-semibold">{brandName}</span>
                </span>
              ) : null}
            </div>

            {/* specs */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl bg-black/20 border border-white/10 p-3 flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#D4A056]" />
                <div className="min-w-0">
                  <div className="text-[11px] text-gray-400">Sub</div>
                  <div className="mt-0.5 text-sm text-white truncate">
                    {subCategoryName || "—"}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-black/20 border border-white/10 p-3 flex items-center gap-2">
                <GlassWater className="h-4 w-4 text-[#D4A056]" />
                <div className="min-w-0">
                  <div className="text-[11px] text-gray-400">Volume</div>
                  <div className="mt-0.5 text-sm text-white truncate">
                    {volumeMl != null ? `${volumeMl} ml` : "—"}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-black/20 border border-white/10 p-3 flex items-center gap-2">
                <Droplets className="h-4 w-4 text-[#D4A056]" />
                <div className="min-w-0">
                  <div className="text-[11px] text-gray-400">ABV</div>
                  <div className="mt-0.5 text-sm text-white truncate">
                    {abv != null ? `${abv}%` : "—"}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-gray-300 leading-relaxed">
              <p className="line-clamp-4 sm:line-clamp-5">{description}</p>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[11px] text-gray-400">Price</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#D4A056]">
                Rs. {Number(product?.price ?? 0).toLocaleString()}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!isActive || loading || !product}
              onClick={() =>
                addToCart({
                  ...product,
                  id: product?._id ?? product?.id,
                  image: img || product?.image,
                })
              }
              className="
                mt-10 w-full inline-flex items-center justify-center gap-2
                rounded-full bg-[#D4A056] text-black font-semibold py-2.5
                hover:brightness-110 transition
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-[0_10px_30px_rgba(212,160,86,0.18)]
              "
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
