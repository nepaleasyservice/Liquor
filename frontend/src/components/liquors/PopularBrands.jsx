import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Crown,
  Wine,
  Beer,
  Martini,
  GlassWater,
  CupSoda,
  BadgeCheck,
} from "lucide-react";
import { useAdmin } from "../../context/AdminContext";

// safe image resolver for brand
function getBrandImg(b) {
  if (!b) return "";
  if (typeof b?.image === "string" && b.image) return b.image;
  if (b?.image?.url) return b.image.url;
  if (b?.image?.secure_url) return b.image.secure_url;
  if (typeof b?.imageUrl === "string" && b.imageUrl) return b.imageUrl;
  if (typeof b?.imageURL === "string" && b.imageURL) return b.imageURL;
  if (typeof b?.logo === "string" && b.logo) return b.logo;
  if (b?.logo?.url) return b.logo.url;
  if   (b?.logo?.secure_url) return b.logo.secure_url;
  return "";
}

// pick an icon deterministically
const ICONS = [Crown, Beer, Wine, GlassWater, CupSoda, Martini, BadgeCheck];
function pickIconByName(name = "") {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return ICONS[sum % ICONS.length];
}

export default function PopularBrands() {
  const navigate = useNavigate();
  const { brands = [], fetchBrands } = useAdmin();
  const [selectedBrandId, setSelectedBrandId] = useState("");

  useEffect(() => {
    fetchBrands?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalizedBrands = useMemo(
    () =>
      brands
        .map((b) => ({
          id: b?._id ?? b?.id,
          name: b?.name ?? "Unnamed Brand",
          raw: b,
        }))
        .filter((b) => b.id),
    [brands]
  );

  const filtered = useMemo(() => {
    if (!selectedBrandId) return normalizedBrands;
    return normalizedBrands.filter(
      (b) => String(b.id) === String(selectedBrandId)
    );
  }, [normalizedBrands, selectedBrandId]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12">
        <h2 className="text-4xl font-extrabold tracking-wide text-[#D4A056]">
          Popular Brands
        </h2>

        <div className="w-full sm:w-[260px]">
          <label className="block text-xs text-gray-400 mb-2">
            Filter Brand
          </label>
          <select
            value={selectedBrandId}
            onChange={(e) => setSelectedBrandId(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="">All Brands</option>
            {normalizedBrands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ✅ ONE ROW with visible styled scrollbar */}
      <div className="flex gap-6 overflow-x-auto pb-4 brand-scrollbar">
        {filtered.map((brand) => {
          const Icon = pickIconByName(brand.name);
          const img = getBrandImg(brand.raw);

          return (
            <div
              key={brand.id}
              onClick={() => navigate(`/shop?brand=${brand.id}`)}
              className="
                group relative flex-shrink-0 w-[220px]
                rounded-2xl overflow-hidden cursor-pointer
                bg-black/30 border border-[#d4a056]/20
                hover:border-[#d4a056]/60 transition-all duration-300
              "
            >
              {/* Placeholder */}
              <div className="w-full h-48 bg-black/20" />

              {/* Image */}
              {img && (
                <img
                  src={img}
                  alt={brand.name}
                  className="
                    absolute inset-0 w-full h-full object-cover
                    opacity-0 group-hover:brightness-75
                    transition-all duration-300
                  "
                  onLoad={(e) => (e.currentTarget.style.opacity = 1)}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center space-y-3 bg-gradient-to-b from-black/30 via-black/20 to-black/40">
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#d4a056]/80">
                  <Icon className="text-white w-7 h-7" />
                </div>
                <p className="text-center text-sm font-semibold text-white px-2">
                  {brand.name}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-gray-400 mt-10">
          No brands found.
        </div>
      )}
    </section>
  );
}
