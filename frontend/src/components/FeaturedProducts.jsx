import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getFeaturedProducts } from "../data/products";
import { useEffect, useState } from "react";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    (async () => {
      const tempProducts = await getFeaturedProducts();
      setProducts(tempProducts?.item ?? tempProducts ?? []);
    })();
  }, []);

  return (
    <section className="py-20 bg-[#080808] text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-wide text-center text-[#D4A056] mb-16">
          Featured Products
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {products.map((product) => {
            const pid = product._id ?? product.id;

            return (
              <div
                key={pid}
                className="
                  flex flex-col
                  p-6 rounded-2xl
                  bg-white/5 border border-white/10
                  backdrop-blur-xl shadow-lg
                  transition-all duration-300
                  hover:border-[#D4A056] hover:-translate-y-2
                "
              >
                {/* IMAGE */}
                <Link to={`/product/${pid}`}>
                  <div className="w-full h-44 flex items-center justify-center mb-4">
                    <img
                      src={product?.image?.url}
                      alt={product?.name}
                      className="h-full object-contain drop-shadow-xl transition-transform duration-300 hover:scale-110"
                      onError={(e) =>
                        (e.currentTarget.style.display = "none")
                      }
                    />
                  </div>

                  {/* NAME */}
                  <h3
                    className="
                      text-center text-lg font-semibold
                      hover:text-[#D4A056] transition
                      line-clamp-2 min-h-[3rem]
                    "
                  >
                    {product.name}
                  </h3>
                </Link>

                {/* PRICE */}
                <p className="mt-2 text-center text-xl font-semibold text-[#D4A056]">
                  Rs. {Number(product.price || 0).toLocaleString()}
                </p>

                {/* BUTTON */}
                <button
                  onClick={() => addToCart(product, 1)}
                  className="
                    mt-auto
                    w-full py-2
                    bg-[#D4A056] text-black
                    rounded-full font-semibold
                    transition
                    hover:bg-[#b98c45]
                    active:scale-95
                  "
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
