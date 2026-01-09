// import { Link } from "react-router-dom";

// export default function TrendingLiquors() {
//   const products = [
//     { id: 101, name: "Jack Daniel's Old No.7", price: 5800, image: "/rum.jpg" },
//     { id: 102, name: "Chivas Regal 12YO", price: 6500, image: "/whisky.jpg" },
//     { id: 103, name: "Absolut Vodka", price: 3000, image: "/vodka.jpg" },
//     { id: 104, name: "Gorkha Beer", price: 350, image: "/brandy.jpg" },
//   ];

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-16">
//       <h2 className="text-4xl font-extrabold tracking-wide text-[#D4A056] mb-16 text-center">
//         Trending Liquors
//       </h2>

//       <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//         {products.map((item) => (
//           <Link key={item.id} to={`/trending/${item.id}`}>
//             <div
//               className="bg-[#151515] rounded-xl p-4 cursor-pointer
//                          border border-transparent transition-all duration-300
//                          hover:border-[#D4A056]/70 hover:bg-[#1c1c1c] hover:-translate-y-1"
//             >
//               <img
//                 src={item.image}
//                 className="w-full h-52 object-cover rounded-lg"
//                 alt={item.name}
//                 loading="lazy"
//               />

//               <h3 className="text-xl font-semibold text-white mt-4">
//                 {item.name}
//               </h3>

//               <p className="text-[#D4A056] font-bold mt-2">
//                 Rs. {item.price.toLocaleString()}
//               </p>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";

// safe image resolver
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

  // ✅ Trending = Featured products (limit 4)
  const trendingProducts = useMemo(() => {
    return products
      .filter((p) => p?.isFeatured)
      .slice(0, 4);
  }, [products]);

  if (trendingProducts.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
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
                  bg-[#151515] rounded-xl p-4 cursor-pointer
                  border border-transparent transition-all duration-300
                  hover:border-[#D4A056]/70 hover:bg-[#1c1c1c]
                  hover:-translate-y-1
                "
              >
                {img ? (
                  <img
                    src={img}
                    className="w-full h-52 object-cover rounded-lg"
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                ) : (
                  <div className="w-full h-52 bg-black/30 rounded-lg grid place-items-center text-gray-500">
                    No image
                  </div>
                )}

                <h3 className="text-xl font-semibold text-white mt-4 leading-snug">
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
