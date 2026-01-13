import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";

function getImgSrc(p) {
  if (!p) return "";
  if (typeof p?.image === "string" && p.image) return p.image;
  if (p?.image?.url) return p.image.url;
  if (p?.image?.secure_url) return p.image.secure_url;
  if (typeof p?.imageUrl === "string" && p.imageUrl) return p.imageUrl;
  if (typeof p?.imageURL === "string" && p.imageURL) return p.imageURL;
  return "";
}

export default function TrendingLiquors() {
  const { products = [], fetchProducts } = useAdmin();

  useEffect(() => {
    fetchProducts?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const trendingProducts = useMemo(() => {
    return products.filter((p) => p?.isFeatured).slice(0, 4);
  }, [products]);

  if (trendingProducts.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 bg-white" style={{ color: "#222222" }}>
      <h2 className="text-4xl font-extrabold tracking-wide text-[#D4A056] mb-16 text-center">
        Trending Liquors
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {trendingProducts.map((item) => {
          const pid = item?._id ?? item?.id;
          const img = getImgSrc(item);

          return (
            <Link key={pid} to={`/product/${pid}`}>
              <div
                className="
                  bg-white rounded-xl p-4 cursor-pointer
                  border border-gray-200 transition-all duration-300
                  hover:border-[#D4A056] hover:-translate-y-1 hover:shadow-md
                "
              >
                {img ? (
                  <img
                    src={img}
                    className="w-full h-52 object-cover rounded-lg border border-gray-200 bg-white"
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                ) : (
                  <div className="w-full h-52 bg-white border border-gray-200 rounded-lg grid place-items-center" style={{ color: "#222222" }}>
                    No image
                  </div>
                )}

                <h3 className="text-xl font-semibold mt-4 leading-snug" style={{ color: "#222222" }}>
                  {item.name}
                </h3>

                <p className="text-[#D4A056] font-bold mt-2">
                  Rs. {Number(item.price ?? 0).toLocaleString()}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
