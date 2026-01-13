import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getFeaturedProducts } from "../data/products";
import { useEffect, useState } from "react";

/* ---------- Skeleton Card ---------- */
function ProductSkeleton() {
  return (
    <div className="flex flex-col p-6 rounded-2xl bg-white border border-gray-200 shadow-sm animate-pulse">
      <div className="w-full h-44 mb-4 bg-gray-200 rounded-xl" />

      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4" />

      <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto mb-6" />

      <div className="mt-auto h-10 bg-gray-200 rounded-full" />
    </div>
  );
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const tempProducts = await getFeaturedProducts();
      setProducts(tempProducts?.item ?? tempProducts ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <section className="py-20 bg-white" style={{ color: "#222222" }}>
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-wide text-center text-[#D4A056] mb-16">
          Featured Products
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))
            : products.map((product) => {
                const pid = product._id ?? product.id;

                return (
                  <div
                    key={pid}
                    className="flex flex-col p-6 rounded-2xl bg-white border border-gray-200 shadow-sm transition-all duration-300 hover:border-[#D4A056] hover:-translate-y-1 hover:shadow-md"
                  >
                    <Link to={`/product/${pid}`}>
                      <div className="w-full h-44 flex items-center justify-center mb-4 bg-white rounded-xl border border-gray-200">
                        <img
                          src={product?.image?.url}
                          alt={product?.name}
                          className="h-full object-contain transition-transform duration-300"
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                        />
                      </div>

                      <h3 className="text-center text-lg font-semibold transition line-clamp-2 min-h-[3rem] hover:text-[#D4A056]">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="mt-2 text-center text-xl font-semibold text-[#B8852E]">
                      Rs. {Number(product.price || 0).toLocaleString()}
                    </p>

                    <button
                      onClick={() => addToCart(product, 1)}
                      className="mt-auto w-full py-2 bg-gradient-to-r from-[#D4A056] to-[#f1d39f] text-black rounded-full font-semibold transition active:scale-95 hover:shadow-md"
                    >
                      Add to Cart
                    </button>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
}
