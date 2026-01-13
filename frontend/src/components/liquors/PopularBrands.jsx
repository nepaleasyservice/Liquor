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

function getBrandImg(b) {
  if (!b) return "";
  if (typeof b?.image === "string" && b.image) return b.image;
  if (b?.image?.url) return b.image.url;
  if (b?.image?.secure_url) return b.image.secure_url;
  if (typeof b?.imageUrl === "string" && b.imageUrl) return b.imageUrl;
  if (typeof b?.imageURL === "string" && b.imageURL) return b.imageURL;
  if (typeof b?.logo === "string" && b.logo) return b.logo;
  if (b?.logo?.url) return b.logo.url;
  if (b?.logo?.secure_url) return b.logo.secure_url;
  return "";
}

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
    <section className="max-w-7xl mx-auto px-6 py-16 bg-white" style={{ color: "#222222" }}>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12">
        <h2 className="text-4xl font-extrabold tracking-wide text-[#D4A056]">
          Popular Brands
        </h2>

        <div className="w-full sm:w-[260px]">
          <label className="block text-xs mb-2" style={{ color: "#222222" }}>
            Filter Brand
          </label>
          <select
            value={selectedBrandId}
            onChange={(e) => setSelectedBrandId(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#D4A056]"
            style={{ color: "#222222" }}
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

      {/* One row */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {filtered.map((brand) => {
          const Icon = pickIconByName(brand.name);
          const img = getBrandImg(brand.raw);

          return (
            <div
              key={brand.id}
              onClick={() => navigate(`/shop?brand=${brand.id}`)}
              className="group relative flex-shrink-0 w-[220px] rounded-2xl overflow-hidden cursor-pointer bg-white border border-gray-200 hover:border-[#D4A056] transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="w-full h-48 bg-white border-b border-gray-200">
                {img ? (
                  <img
                    src={img}
                    alt={brand.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                ) : (
                  <div className="w-full h-48 grid place-items-center" style={{ color: "#222222" }}>
                    No image
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-r from-[#D4A056] to-[#f1d39f] shadow-sm">
                  <Icon className="text-black w-7 h-7" />
                </div>

                <p className="text-center text-sm font-semibold px-2" style={{ color: "#222222" }}>
                  {brand.name}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center mt-10" style={{ color: "#222222" }}>
          No brands found.
        </div>
      )}
    </section>
  );
}
