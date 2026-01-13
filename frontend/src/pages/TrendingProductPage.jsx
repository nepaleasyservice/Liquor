import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";

export default function TrendingProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const products = [
    { id: 101, name: "Jack Daniel's Old No.7", price: 5800, image: "/rum.jpg", description: "Smooth Tennessee whiskey with a rich smokey taste." },
    { id: 102, name: "Chivas Regal 12YO", price: 6500, image: "/whisky.jpg", description: "Premium Scotch whisky with a balanced aroma." },
    { id: 103, name: "Absolut Vodka", price: 3000, image: "/vodka.jpg", description: "Clean, crisp vodka perfect for cocktails." },
    { id: 104, name: "Gorkha Beer", price: 350, image: "/brandy.jpg", description: "Refreshing Nepali beer with a bold character." },
  ];

  const product = products.find((p) => p.id === Number(id));

  if (!product)
    return (
      <h1 className="text-center text-3xl mt-32" style={{ color: "#222222" }}>
        Product Not Found
      </h1>
    );

  return (
    <div className="bg-white min-h-screen pt-32 px-8 pb-24" style={{ color: "#222222" }}>
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          src={product.image}
          alt={product.name}
          className="rounded-3xl w-full max-h-[500px] object-contain shadow-lg border border-gray-200 bg-white"
        />

        <div>
          <h1 className="text-5xl font-bold mb-3" style={{ color: "#222222" }}>
            {product.name}
          </h1>

          <h2 className="text-3xl font-semibold text-[#B8852E] mb-6">
            Rs. {product.price.toLocaleString()}
          </h2>

          <p className="leading-relaxed text-lg mb-10" style={{ color: "#222222" }}>
            {product.description}
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addToCart(product)}
            className="px-10 py-3 rounded-full bg-gradient-to-r from-[#D4A056] to-[#f1d39f] text-black font-medium text-lg shadow-sm hover:shadow-md"
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </div>
  );
}
